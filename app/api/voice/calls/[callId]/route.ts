import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  req: Request,
  { params }: { params: { callId: string } }
) {
  try {
    const { status, duration, notes } = await req.json()

    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'completed') {
      updates.ended_at = new Date().toISOString()
      if (duration) {
        updates.duration = duration
      }
    }

    if (notes) {
      updates.notes = notes
    }

    const { data, error } = await supabase
      .from('voice_calls')
      .update(updates)
      .eq('id', params.callId)
      .select()
      .single()

    if (error) {
      console.error('Error updating voice call:', error)
      return new Response(JSON.stringify({ error: 'Failed to update call' }), {
        status: 500,
      })
    }

    return Response.json(data)
  } catch (error) {
    console.error('Voice call PATCH error:', error)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { callId: string } }
) {
  try {
    // Fetch call details and transcriptions
    const { data: call, error: callError } = await supabase
      .from('voice_calls')
      .select('*')
      .eq('id', params.callId)
      .single()

    if (callError) {
      return new Response(JSON.stringify({ error: 'Call not found' }), {
        status: 404,
      })
    }

    // Fetch transcriptions for this call
    let transcriptions: any[] = []
    const { data: transData, error: transError } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('call_id', params.callId)
      .order('timestamp', { ascending: true })

    if (transError) {
      console.error('Error fetching transcriptions:', transError)
    } else {
      transcriptions = transData || []
    }

    return Response.json({
      call,
      transcriptions,
    })
  } catch (error) {
    console.error('Voice call GET error:', error)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    })
  }
}
