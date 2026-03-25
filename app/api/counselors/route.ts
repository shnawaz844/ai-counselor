import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // First, check if counselors table exists and has data
    const { data, error } = await supabase
      .from('counselors')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      // If table doesn't exist, return seed data
      console.log('Counselors table error:', error)
      return Response.json(getSeedCounselors())
    }

    // If no counselors in DB, seed them
    if (!data || data.length === 0) {
      const seedData = getSeedCounselors()
      
      // Try to insert seed data
      await supabase.from('counselors').insert(seedData)
      
      return Response.json(seedData)
    }

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching counselors:', error)
    // Return seed data as fallback
    return Response.json(getSeedCounselors())
  }
}

function getSeedCounselors() {
  return [
    {
      id: '1',
      name: 'Engineering Career Advisor',
      specialization: 'Engineering & Technology',
      expertise_areas: ['IIT Preparation', 'NIT Selection', 'Tech Startups', 'Internships'],
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      description: 'Expert guidance for engineering aspirants with 10+ years of experience helping students achieve their tech dreams.',
      system_prompt: 'You are an AI career counselor specializing in engineering education. Help students understand different engineering branches, prepare for entrance exams like JEE, and explore career opportunities in technology.',
      is_active: true,
      supports_voice_calls: true,
    },
    {
      id: '2',
      name: 'Medical & Healthcare Counselor',
      specialization: 'Medical & Healthcare',
      expertise_areas: ['NEET Preparation', 'Medical Colleges', 'Healthcare Careers', 'Abroad Programs'],
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
      description: 'Dedicated to helping aspiring doctors and healthcare professionals navigate their academic and career paths.',
      system_prompt: 'You are an AI career counselor specializing in medical and healthcare careers. Guide students through NEET preparation, medical college selection, and various healthcare career options.',
      is_active: true,
      supports_voice_calls: true,
    },
    {
      id: '3',
      name: 'Commerce & Business Specialist',
      specialization: 'Commerce & Business',
      expertise_areas: ['Accounting', 'Finance', 'Entrepreneurship', 'MBA Preparation'],
      avatar_url: 'https://images.unsplash.com/photo-1507252834519-18a8c6d1f0ba?w=500&h=500&fit=crop',
      description: 'Guidance for commerce students exploring accounting, finance, business management, and entrepreneurship pathways.',
      system_prompt: 'You are an AI career counselor specializing in commerce and business education. Help students explore career options in accounting, finance, management, and entrepreneurship.',
      is_active: true,
      supports_voice_calls: true,
    },
    {
      id: '4',
      name: 'Arts & Humanities Guide',
      specialization: 'Arts & Humanities',
      expertise_areas: ['Liberal Arts', 'Government Jobs', 'Media & Journalism', 'Civil Services'],
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
      description: 'Comprehensive guidance for arts students exploring diverse career opportunities beyond traditional paths.',
      system_prompt: 'You are an AI career counselor specializing in arts and humanities. Guide students on career options in literature, history, languages, social sciences, and related fields.',
      is_active: true,
      supports_voice_calls: true,
    },
    {
      id: '5',
      name: 'Computer Science Expert',
      specialization: 'Computer Science & IT',
      expertise_areas: ['Software Development', 'Data Science', 'Cybersecurity', 'Cloud Computing'],
      avatar_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
      description: 'Expert advisor for aspiring software engineers and IT professionals navigating the rapidly evolving tech industry.',
      system_prompt: 'You are an AI career counselor specializing in computer science and IT. Help students understand programming, data science, cybersecurity, and emerging technologies in the industry.',
      is_active: true,
      supports_voice_calls: true,
    },
    {
      id: '6',
      name: 'Entrepreneurship Coach',
      specialization: 'Entrepreneurship & Startups',
      expertise_areas: ['Startup Ideas', 'Funding', 'Innovation', 'Business Planning'],
      avatar_url: 'https://images.unsplash.com/photo-1516321318423-f06f70fc504e?w=500&h=500&fit=crop',
      description: 'Mentor for students interested in building their own ventures and understanding the entrepreneurial journey.',
      system_prompt: 'You are an AI entrepreneurship coach. Guide aspiring entrepreneurs on ideation, business planning, funding strategies, and overcoming challenges in their startup journey.',
      is_active: true,
      supports_voice_calls: true,
    },
  ]
}
