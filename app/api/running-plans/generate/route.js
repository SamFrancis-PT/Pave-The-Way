import { NextResponse } from 'next/server';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';
import { generatePlan } from '@/lib/plan-engine/index';

const schema = z.object({
  distance: z.enum(['c25k', '10k', 'half', 'marathon']),
  goal_type: z.enum(['finish', 'time']).optional(),
  goal_time_seconds: z.number().int().positive().optional(),
  marathon_weeks: z.number().int().optional(),
  race_date: z.string().optional(),
  motivation: z.string().optional(),
  motivation_other: z.string().optional(),
  run_frequency: z.string().optional(),
  weekly_volume: z.string().optional(),
  current_5k_seconds: z.number().int().positive().optional(),
  injuries: z.array(z.string()).optional(),
  injury_other: z.string().optional(),
  days_per_week: z.number().int().min(3).max(5).optional(),
  strength_training: z.enum(['regularly', 'sometimes', 'no']).optional(),
  strength_style: z.enum(['lower_body', 'full_body']).optional(),
  first_name: z.string().min(1),
  email: z.string().email(),
  discovery_source: z.string().optional(),
  what_resonated: z.string().optional(),
});

// Basic in-memory rate limiter (5 per hour per IP)
const rateLimitStore = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const limit = 5;
  const timestamps = (rateLimitStore.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) return true;
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return false;
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const answers = parsed.data;

  let plan;
  try {
    plan = generatePlan(answers);
  } catch (err) {
    console.error('Plan generation error:', err);
    return NextResponse.json({ error: 'Failed to generate plan.' }, { status: 500 });
  }

  // Save to database (non-blocking — plan still returns if DB is unavailable)
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      await sql`
        INSERT INTO plan_submissions (
          first_name, email, distance, goal_type, goal_time_seconds,
          marathon_weeks, race_date, motivation, motivation_other,
          run_frequency, weekly_volume, current_5k_seconds,
          injuries, injury_other, days_per_week, strength_training,
          discovery_source, what_resonated, generated_plan
        ) VALUES (
          ${answers.first_name},
          ${answers.email},
          ${answers.distance},
          ${answers.goal_type ?? null},
          ${answers.goal_time_seconds ?? null},
          ${answers.marathon_weeks ?? null},
          ${answers.race_date ?? null},
          ${answers.motivation ?? null},
          ${answers.motivation_other ?? null},
          ${answers.run_frequency ?? null},
          ${answers.weekly_volume ?? null},
          ${answers.current_5k_seconds ?? null},
          ${answers.injuries ?? null},
          ${answers.injury_other ?? null},
          ${answers.days_per_week ?? null},
          ${answers.strength_training ?? null},
          ${answers.discovery_source ?? null},
          ${answers.what_resonated ?? null},
          ${JSON.stringify(plan)}
        )
      `;
    } catch (err) {
      console.error('DB save error (non-fatal):', err);
    }
  }

  return NextResponse.json({ plan });
}
