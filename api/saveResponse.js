import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxhmwoqsjofxffvvegmv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4aG13b3Fzam9meGZmdnZlZ212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMzczNzgsImV4cCI6MjA4OTgxMzM3OH0.WQiJllzye3e32la9H_6Y2KkOAC0SUwtf8vxaH4rcWbw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userName, question1, question2, question3, question4 } = req.body;

    // Validate input
    if (!userName) {
      return res.status(400).json({ error: 'userName is required' });
    }

    // Insert to Supabase
    const { data, error } = await supabase
      .from('responses')
      .insert([
        {
          user_name: userName,
          question_1: question1 || null,
          question_2: question2 || null,
          question_3: question3 || null,
          question_4: question4 || null,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ 
      success: true, 
      message: 'Jawaban tersimpan!',
      data 
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
