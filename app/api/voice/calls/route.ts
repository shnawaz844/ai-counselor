import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { counselorId, userId } = await req.json()

    // Create new voice call record
    const { data: call, error } = await supabase
      .from('voice_calls')
      .insert([
        {
          user_id: userId,
          counselor_id: counselorId,
          status: 'ongoing',
          started_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single()

    if (error) {
      console.error('Error creating voice call:', error)
      return new Response(JSON.stringify({ error: 'Failed to create call' }), {
        status: 500,
      })
    }

    return Response.json(call)
  } catch (error) {
    console.error('Voice call POST error:', error)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
      })
    }

    // Fetch user's voice calls
    const { data: calls, error } = await supabase
      .from('voice_calls')
      .select('*, counselors(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching voice calls:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch calls' }), {
        status: 500,
      })
    }

    return Response.json(calls)
  } catch (error) {
    console.error('Voice call GET error:', error)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    })
  }
}
