import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 30

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { messages, conversationId, counselorId, userId }: 
      { messages: UIMessage[], conversationId?: string, counselorId: string, userId: string } = 
      await req.json()

    // Fetch counselor details to get system prompt
    const counselor = await getCounselorData(counselorId)

    const systemPrompt = counselor?.system_prompt || 
      'You are an AI career counselor helping students and guardians make informed decisions about their academic and career paths.'

    const result = streamText({
      model: 'google/gemini-1.5-pro-latest',
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: allMessages, isAborted }) => {
        if (isAborted) return

        // Save the conversation and messages to database
        try {
          if (!conversationId) {
            // Create new conversation
            const { data: conv, error: convError } = await supabase
              .from('conversations')
              .insert([
                {
                  user_id: userId,
                  counselor_id: counselorId,
                  type: 'chat',
                  title: allMessages[0]?.parts?.[0]?.text || 'New Chat',
                }
              ])
              .select('id')
              .single()

            if (convError) {
              console.error('Error creating conversation:', convError)
              return
            }

            // Save all messages for this new conversation
            const messagesToSave = allMessages.map((msg) => {
              const content = msg.parts
                ?.filter((p) => p.type === 'text')
                .map((p) => p.text)
                .join('') || ''

              return {
                conversation_id: conv.id,
                role: msg.role,
                content,
              }
            })

            await supabase.from('messages').insert(messagesToSave)
          } else {
            // Add new messages to existing conversation
            const lastUserMessage = messages[messages.length - 1]
            const assistantMessage = allMessages[allMessages.length - 1]

            const userContent = lastUserMessage.parts
              ?.filter((p) => p.type === 'text')
              .map((p) => p.text)
              .join('') || ''

            const assistantContent = assistantMessage.parts
              ?.filter((p) => p.type === 'text')
              .map((p) => p.text)
              .join('') || ''

            await supabase.from('messages').insert([
              {
                conversation_id: conversationId,
                role: 'user',
                content: userContent,
              },
              {
                conversation_id: conversationId,
                role: 'assistant',
                content: assistantContent,
              },
            ])
          }
        } catch (error) {
          console.error('Error saving conversation:', error)
        }
      },
      consumeSseStream: consumeStream,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Chat failed' }), {
      status: 500,
    })
  }
}

async function getCounselorData(counselorId: string) {
  try {
    const { data } = await supabase
      .from('counselors')
      .select('*')
      .eq('id', counselorId)
      .single()

    return data
  } catch (error) {
    console.error('Error fetching counselor:', error)
    return null
  }
}
