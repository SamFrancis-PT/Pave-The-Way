// Lower body focused sessions (default) — short, targeted, runner-first
const SESSION_A_LOWER = [
  { exercise: 'Goblet Squat', sets: '3 x 8 to 10', notes: 'I want heels flat, chest up, and two reps left in the tank at the end of each set.' },
  { exercise: 'Romanian Deadlift', sets: '3 x 8 to 10', notes: 'Hinge at the hips, soft knees. Feel the hamstring stretch — that\'s where the stimulus is.' },
  { exercise: 'Bulgarian Split Squat (rear foot elevated)', sets: '3 x 8 to 10 each side', notes: 'Control the descent, strong drive through the front foot. Expect this to be humbling the first few weeks.' },
  { exercise: 'Single Leg Calf Raise', sets: '3 x 12 to 15 each side', notes: 'Slow on the way down. Full range — don\'t bounce at the bottom.' },
  { exercise: 'Plank', sets: '3 x 30 to 45 sec', notes: 'Tight core, neutral spine. Don\'t hold your breath.' },
];

const SESSION_B_LOWER = [
  { exercise: 'Hip Thrust', sets: '3 x 10 to 12', notes: 'Drive through the heels, full extension at the top. I want you to feel this in your glutes, not your lower back.' },
  { exercise: 'Step-Up with knee drive', sets: '3 x 8 to 10 each side', notes: 'Controlled step up, drive the knee high at the top. This builds exactly the strength you need for hills.' },
  { exercise: 'Single-Leg Romanian Deadlift', sets: '3 x 8 each side', notes: 'Control the hinge. Use a wall for balance if you need to — no ego here.' },
  { exercise: 'Side Plank', sets: '3 x 20 to 30 sec each side', notes: 'Hip off the ground, body in a straight line. This keeps your hips stable when you\'re deep in a race.' },
  { exercise: 'Dead Bug', sets: '3 x 8 each side', notes: 'Lower back pressed to the floor. Slow and deliberate. This is an anti-rotation exercise — don\'t rush it.' },
];

// Full body sessions — quad dominant / posterior chain split
const SESSION_A_FULLBODY = [
  { exercise: 'Barbell Back Squat / Goblet Squat / Leg Press', sets: '4 x 6 to 8', notes: 'I want you to lead with a quad dominant compound. Rest 90 sec. Aim to progress the weight each week.' },
  { exercise: 'Romanian Deadlift', sets: '3 x 8 to 10', notes: 'Hinge at the hips, soft knees, feel the hamstring stretch. Rest 90 sec.' },
  { exercise: 'DB Bench Press / Push-Up Variation', sets: '3 x 8 to 10', notes: 'Horizontal push. Control the descent, full range. Rest 75 sec.' },
  { exercise: 'Cable Row / Seated DB Row', sets: '3 x 8 to 10', notes: 'Drive the elbow back, retract the shoulder blade. Rest 75 sec.' },
  { exercise: 'Lateral Raise', sets: '3 x 12 to 15', notes: 'Lead with the elbow, slight bend. Rest 60 sec.' },
  { exercise: 'Bicep Curl (DB or Cable)', sets: '3 x 10 to 12', notes: 'Full range of motion. Controlled on the way down. Rest 60 sec.' },
  { exercise: 'Core — Plank / Dead Bug / Pallof Press', sets: '3 x 30 to 45 sec', notes: 'Choose one and stay consistent across weeks.' },
];

const SESSION_B_FULLBODY = [
  { exercise: 'Bulgarian Split Squat / Split Squat', sets: '3 x 8 to 10 each side', notes: 'Sam wants you to take this seriously — single leg strength is what separates injury-resistant runners. Rest 90 sec.' },
  { exercise: 'Single Leg Calf Raise', sets: '3 x 12 to 15 each side', notes: 'Slow on the way down. Pause at the bottom. Don\'t bounce.' },
  { exercise: 'Hamstring Curl / Nordic Curl / RDL', sets: '3 x 8 to 10', notes: 'Hamstring focus. If doing Nordics: eccentric-only to start. Rest 90 sec.' },
  { exercise: 'Overhead Press / DB Shoulder Press', sets: '3 x 8 to 10', notes: 'Keep ribs down and core braced. Don\'t over-arch. Rest 75 sec.' },
  { exercise: 'Lat Pulldown / Pull-Up / Chin-Up', sets: '3 x 8 to 10', notes: 'Lead with the elbows, full range. Rest 75 sec.' },
  { exercise: 'DB Chest Fly / Cable Fly', sets: '3 x 10 to 12', notes: 'Slight bend in the elbows, feel the stretch at the bottom. Rest 60 sec.' },
  { exercise: 'Tricep Pushdown / Skull Crusher', sets: '3 x 10 to 12', notes: 'Full extension at the bottom. Controlled. Rest 60 sec.' },
  { exercise: 'Core — Side Plank / Hanging Knee Raise / Ab Rollout', sets: '3 x 30 to 45 sec', notes: 'Rotate across weeks. Keep it honest.' },
];

function getStrengthSection(answers) {
  const injuries = answers.injuries || [];
  const strengthTraining = answers.strength_training;
  const strengthStyle = answers.strength_style;
  const isFullBody = strengthStyle === 'full_body';

  let intro = '';

  if (strengthTraining === 'no') {
    intro = `I want you doing two strength sessions a week alongside this plan — it's the single highest-leverage change you can make. Runners who strength train get injured less, hold better form late in a race, and go faster. Start with bodyweight or light load and build from there.`;
  } else if (strengthTraining === 'sometimes') {
    intro = `You're doing some strength work, which is a good start. Making it consistent is where the real gains come from. Two sessions a week, on non-quality run days, slotted into your schedule — that's all I need from you.`;
  } else {
    intro = `You're already strength training consistently. I want these sessions slotted in on your non-quality run days so your legs aren't flat for the key sessions. ${isFullBody ? 'Day 1 is quad dominant; Day 2 focuses on single leg and posterior chain.' : 'These are runner-specific sessions — short, targeted, and designed to protect the areas that break down under load.'}`;
  }

  const injuryAreas = [];
  if (injuries.includes('knees')) injuryAreas.push('knees');
  if (injuries.includes('hips_itb')) injuryAreas.push('hips and ITB');
  if (injuries.includes('shins')) injuryAreas.push('shins');

  if (injuryAreas.length > 0) {
    const areaText = injuryAreas.join(' and ');
    intro += ` You mentioned ${areaText}. Hip and posterior chain strength is what protects those areas — and that's exactly what I've built these sessions around. If you're in active pain, see a physio before adding load.`;
  }

  const strengthStyleNote = isFullBody
    ? `I've given you full body sessions that build your physique while supporting your running — Sam can build these around your schedule and goals specifically if you want something more targeted.`
    : `These sessions are lower body focused and runner-specific — short and effective. If you want something that simultaneously builds your physique, Sam can build out a full body program tailored specifically to you.`;

  intro += ` ${strengthStyleNote}`;

  const bridgeCopy = `Want Sam to build your strength program specifically around your running plan, your schedule, and your goals? That's what the online coaching program is for — Sam coaches you week to week, keeps you accountable, and adjusts the plan as you progress. No guesswork. Just a system built around you.`;

  const sessionA = isFullBody ? SESSION_A_FULLBODY : SESSION_A_LOWER;
  const sessionB = isFullBody ? SESSION_B_FULLBODY : SESSION_B_LOWER;

  return {
    intro,
    sessions: [
      {
        name: isFullBody ? 'Day 1 — Full Body (Quad Dominant)' : 'Session A — Lower Body Focus',
        slot: 'Monday or Tuesday, non-quality run day',
        duration: isFullBody ? '45 to 55 minutes' : '30 to 40 minutes',
        exercises: sessionA,
      },
      {
        name: isFullBody ? 'Day 2 — Full Body (Posterior Chain & Single Leg)' : 'Session B — Lower Body Focus',
        slot: 'Thursday or Friday, non-quality run day',
        duration: isFullBody ? '45 to 55 minutes' : '30 to 40 minutes',
        exercises: sessionB,
      },
    ],
    bridgeCopy,
    ctaUrl: 'https://calendly.com/pavethewayfit/30min',
  };
}

module.exports = { getStrengthSection };
