const SESSION_A_LOWER = [
  { exercise: 'Goblet Squat', sets: '3 x 8 to 10', notes: 'I want heels flat, chest up, and two reps left in the tank at the end of each set. Rest 90 sec.' },
  { exercise: 'Romanian Deadlift', sets: '3 x 8 to 10', notes: 'Hinge at the hips, soft knees, feel the hamstring load up. Rest 90 sec.' },
  { exercise: 'Bulgarian Split Squat', sets: '3 x 8 to 10 each side', notes: 'Control the descent, drive hard through the front foot. This one will humble you early — stick with it. Rest 90 sec.' },
  { exercise: 'Single Leg Calf Raise', sets: '3 x 12 to 15 each side', notes: 'Slow and controlled on the way down. Pause at the bottom, don\'t bounce. Rest 60 sec.' },
  { exercise: 'Plank', sets: '3 x 30 to 45 sec', notes: 'Tight core, neutral spine. Breathe normally — don\'t hold your breath.' },
];

const SESSION_B_LOWER = [
  { exercise: 'Hip Thrust', sets: '3 x 10 to 12', notes: 'I want you to drive through the heels and feel this in your glutes, not your lower back. Rest 90 sec.' },
  { exercise: 'Step-Up with Knee Drive', sets: '3 x 8 to 10 each side', notes: 'Controlled step up, drive the knee high at the top. This builds exactly the hip strength you need for hills. Rest 90 sec.' },
  { exercise: 'Single-Leg Romanian Deadlift', sets: '3 x 8 each side', notes: 'Control the hinge, use a wall for balance if you need to. No ego here. Rest 90 sec.' },
  { exercise: 'Side Plank', sets: '3 x 20 to 30 sec each side', notes: 'Hip off the floor, body in a straight line. This keeps your pelvis stable deep into a race. Rest 45 sec.' },
  { exercise: 'Dead Bug', sets: '3 x 8 each side', notes: 'Lower back pressed to the floor, slow and deliberate. Rest 45 sec.' },
];

const SESSION_A_FULLBODY = [
  { exercise: 'Barbell Back Squat', sets: '4 x 6 to 8', notes: 'I want heels flat, depth to at least parallel, and two reps in reserve each set. Add weight week to week. Rest 90 sec.' },
  { exercise: 'Romanian Deadlift', sets: '3 x 8 to 10', notes: 'Hinge at the hips, soft knees, feel the hamstring load. Rest 90 sec.' },
  { exercise: 'Dumbbell Bench Press', sets: '3 x 8 to 10', notes: 'Control the descent, full range, elbows at roughly 45 degrees. Rest 75 sec.' },
  { exercise: 'Cable Seated Row', sets: '3 x 8 to 10', notes: 'Drive your elbow back, retract the shoulder blade at the end of each rep. Rest 75 sec.' },
  { exercise: 'Dumbbell Lateral Raise', sets: '3 x 12 to 15', notes: 'Lead with the elbow, slight bend in the arm. Keep momentum out of it. Rest 60 sec.' },
  { exercise: 'Dumbbell Bicep Curl', sets: '3 x 10 to 12', notes: 'Full range of motion. Controlled on the way down. Rest 60 sec.' },
  { exercise: 'Dead Bug', sets: '3 x 10 each side', notes: 'Lower back pressed to the floor. Slow and deliberate — this is anti-rotation work.' },
];

const SESSION_B_FULLBODY = [
  { exercise: 'Bulgarian Split Squat', sets: '3 x 8 to 10 each side', notes: 'I want you to take this seriously — single leg strength separates resilient runners from injured ones. Rest 90 sec.' },
  { exercise: 'Single Leg Calf Raise', sets: '3 x 12 to 15 each side', notes: 'Slow on the way down, pause at the bottom. Don\'t bounce. Rest 60 sec.' },
  { exercise: 'Lying Hamstring Curl', sets: '3 x 8 to 10', notes: 'Full range of motion, controlled on the way down. Rest 75 sec.' },
  { exercise: 'Dumbbell Shoulder Press', sets: '3 x 8 to 10', notes: 'Keep ribs down and core braced — don\'t over-arch your lower back. Rest 75 sec.' },
  { exercise: 'Lat Pulldown', sets: '3 x 8 to 10', notes: 'Lead with the elbows, full range, feel the lats working at the bottom position. Rest 75 sec.' },
  { exercise: 'Cable Chest Fly', sets: '3 x 10 to 12', notes: 'Slight bend in the elbows, feel the stretch at the bottom. Rest 60 sec.' },
  { exercise: 'Tricep Pushdown', sets: '3 x 10 to 12', notes: 'Full extension at the bottom, controlled on the way back. Rest 60 sec.' },
  { exercise: 'Plank', sets: '3 x 30 to 45 sec', notes: 'Tight core, neutral spine. Breathe normally.' },
];

function getStrengthSection(answers) {
  const injuries = answers.injuries || [];
  const strengthTraining = answers.strength_training;
  const isFullBody = answers.strength_style === 'full_body';

  let intro = '';

  if (strengthTraining === 'no') {
    intro = `I want you doing two strength sessions a week alongside this plan — it's the single highest-leverage change you can make. Runners who strength train get injured less, hold better form late in a race, and go faster. Start light and build the habit first.`;
  } else if (strengthTraining === 'sometimes') {
    intro = `You're doing some strength work, which is a good start. I want you to make it consistent — two sessions on non-quality run days, every week. That's where the real gains come from.`;
  } else {
    intro = `You're already strength training consistently. I want these sessions slotted into your non-quality run days so your legs aren't flat for the key sessions. ${isFullBody ? 'Day 1 is quad dominant; Day 2 focuses on single leg work and posterior chain.' : 'These are runner-specific sessions — short, targeted, and designed to protect the areas that break down under load.'}`;
  }

  const injuryAreas = [];
  if (injuries.includes('knees')) injuryAreas.push('knees');
  if (injuries.includes('hips_itb')) injuryAreas.push('hips and ITB');
  if (injuries.includes('shins')) injuryAreas.push('shins');

  if (injuryAreas.length > 0) {
    const areaText = injuryAreas.join(' and ');
    intro += ` You mentioned ${areaText}. Hip and posterior chain strength is what I'd prioritise here — that's what protects those areas. If you're in active pain, see a physio before adding load.`;
  }

  if (isFullBody) {
    intro += ` I've given you full body sessions that build your physique alongside your running performance.`;
  } else {
    intro += ` I've kept these short and runner-specific. If you want sessions that also build your physique, let me know and I'll build that out for you specifically.`;
  }

  const bridgeCopy = `Want Sam to build your strength program specifically around your running plan, your schedule, and your goals? That's what the online coaching program is for — Sam coaches you week to week, keeps you accountable, and adjusts the plan as you progress.`;

  return {
    intro,
    sessions: [
      {
        name: isFullBody ? 'Day 1 — Full Body (Quad Dominant)' : 'Session A — Lower Body',
        slot: 'Monday or Tuesday, non-quality run day',
        duration: isFullBody ? '45 to 55 minutes' : '30 to 40 minutes',
        exercises: isFullBody ? SESSION_A_FULLBODY : SESSION_A_LOWER,
      },
      {
        name: isFullBody ? 'Day 2 — Full Body (Posterior Chain & Single Leg)' : 'Session B — Lower Body',
        slot: 'Thursday or Friday, non-quality run day',
        duration: isFullBody ? '45 to 55 minutes' : '30 to 40 minutes',
        exercises: isFullBody ? SESSION_B_FULLBODY : SESSION_B_LOWER,
      },
    ],
    bridgeCopy,
    ctaUrl: 'https://calendly.com/pavethewayfit/30min',
  };
}

module.exports = { getStrengthSection };
