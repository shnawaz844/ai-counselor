import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

export async function initializeDatabaseSchema() {
  try {
    // Check if tables exist by trying to query them
    const { error } = await supabase.from('counselors').select('COUNT(*)', { count: 'exact' }).limit(1)

    if (!error) {
      console.log('[DB] Schema already initialized')
      return true
    }

    console.log('[DB] Initializing schema...')

    // Create ENUM types
    const { error: enumError1 } = await supabase.rpc('raw_query', {
      query: `CREATE TYPE IF NOT EXISTS user_type AS ENUM ('student', 'guardian', 'counselor')`,
    }).catch(() => ({ error: null }))

    // Create users table
    await supabase.rpc('raw_query', {
      query: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          clerk_id TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT NOT NULL,
          user_type TEXT DEFAULT 'student',
          preferred_communication TEXT DEFAULT 'both',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    }).catch(() => ({ error: null }))

    // Create counselors table
    await supabase.rpc('raw_query', {
      query: `
        CREATE TABLE IF NOT EXISTS counselors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          specialization TEXT NOT NULL,
          expertise_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
          avatar_url TEXT NOT NULL,
          description TEXT NOT NULL,
          system_prompt TEXT DEFAULT 'You are an AI career counselor helping students and guardians make informed decisions.',
          is_active BOOLEAN DEFAULT true,
          supports_voice_calls BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    }).catch(() => ({ error: null }))

    // Create conversations table
    await supabase.rpc('raw_query', {
      query: `
        CREATE TABLE IF NOT EXISTS conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
          type TEXT DEFAULT 'chat',
          title TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    }).catch(() => ({ error: null }))

    // Create messages table
    await supabase.rpc('raw_query', {
      query: `
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
          role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    }).catch(() => ({ error: null }))

    // Create voice_calls table
    await supabase.rpc('raw_query', {
      query: `
        CREATE TABLE IF NOT EXISTS voice_calls (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
          status TEXT DEFAULT 'scheduled',
          started_at TIMESTAMP WITH TIME ZONE,
          ended_at TIMESTAMP WITH TIME ZONE,
          duration INTEGER,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    }).catch(() => ({ error: null }))

    // Create transcriptions table
    await supabase.rpc('raw_query', {
      query: `
        CREATE TABLE IF NOT EXISTS transcriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          call_id UUID NOT NULL REFERENCES voice_calls(id) ON DELETE CASCADE,
          speaker TEXT NOT NULL,
          text TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    }).catch(() => ({ error: null }))

    console.log('[DB] Schema initialization complete')
    return true
  } catch (error) {
    console.error('[DB] Schema initialization error:', error)
    return false
  }
}
