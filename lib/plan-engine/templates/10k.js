const { getDateRange, sortSessions, buildLongRunProgression } = require('../pace-zones');

const TOTAL_WEEKS = 8;

const WEEK_DATA = [
  { wk: 1, block: 'FOUNDATION', vo2: { set: '6 x 400m', rest: '90 sec standing rest between each rep', note: 'I want you to find the VO2 effort — hard, uncomfortable, but controlled. The last 2 reps should be your fastest.' }, tempo: '2 x 8 min threshold' },
  { wk: 2, block: 'FOUNDATION', vo2: { set: '8 x 300m', rest: '60 sec standing rest between each rep', note: 'Shorter interval, tighter rest. I want you to go harder here than you did on the 400s last week — 300m is short enough to really push.' }, tempo: '20 min continuous threshold' },
  { wk: 3, block: 'FOUNDATION', vo2: { set: '4 x 800m', rest: '90 sec easy jog rest between each rep', note: 'I want you to find a pace you can hold across all 4 reps. If reps 3 and 4 fall apart, you went out too fast.' }, tempo: null, raceReps: true },
  { wk: 4, block: 'BUILD', vo2: { set: '3 sets of: 400m then 200m — 60 sec rest between reps, 2 min rest between sets', rest: 'See above', note: 'Cutback week — less total volume but I want the 200m at the end of each set to be your hardest rep. Don\'t coast through them.' }, tempo: '25 min threshold with 3 x 30 sec surges', cutback: true },
  { wk: 5, block: 'BUILD', vo2: { set: 'Descending ladder: 1km, 800m, 600m, 400m, 200m', rest: '2 min, 90 sec, 75 sec, 60 sec, 45 sec rest', note: 'As the distance drops, the pace lifts. I want you to finish the 200m at close to a sprint. Earn the short rest on each rep.' }, tempo: null, racePaceReps: '2 x 2 km' },
  { wk: 6, block: 'BUILD', vo2: { set: '3 x 1km', rest: '2 min easy jog rest between each rep', note: 'Peak VO2 session. I want a pace that feels genuinely hard from 400m in — not sprint pace, but a pace you have to fight to hold. Aim for all 3 reps within 5 sec of each other.' }, tempo: null, racePaceReps: '4 km continuous' },
  { wk: 7, block: 'SHARPEN', vo2: { set: '5 x 500m', rest: '75 sec easy jog rest between each rep', note: 'Sharpening week — I want these to feel fast and controlled. Hard but not leaving you wrecked. Your legs should feel live heading into race week.' }, tempo: null, racePaceReps: '2 x 1.5 km', taper: true },
  { wk: 8, block: 'RACE', isRaceWeek: true },
];

// Week-meta mirrors WEEK_DATA for long-run progression calculation
const LONG_RUN_META = [
  {},                              // W1
  {},                              // W2
  {},                              // W3
  { cutback: true },               // W4 deload
  {},                              // W5
  {},                              // W6
  { taper: true, taperFactor: 0.65 }, // W7
  { raceWeek: true },              // W8
];

const COACH_NOTES = {
  1: `Your first week. I want everything to feel manageable — not easy, but manageable. You're building a base, not proving anything yet.`,
  2: `The 20 min continuous threshold is a real session. I want you to warm up properly, find the pace early, and hold it. Short sentences only during the main set — if you can talk freely, you're not working hard enough.`,
  3: `First time at race pace reps. I want these to feel controlled-hard, not desperate. If you need an extra 30 sec of rest between, take it.`,
  4: `Cutback week. I've reduced the long run on purpose — this is where your body absorbs what you've been doing. Don't add extra sessions. The adaptation is happening even when you can't feel it.`,
  5: `Two-kilometre race pace reps this week. I want you to finish each one feeling like you had more in you — if you're blowing up at the end of rep 1, the pace is too high.`,
  6: `Biggest week of the plan. The long run and VO2 session are the key sessions — complete them both and you're ready to race. Don't skip the easy days.`,
  7: `Sharpening week. I want you to feel fast and sharp, not tired. Volume drops significantly. Trust the process.`,
  8: `Race week. The fitness is done. I want you to stay calm, stay loose, and execute the plan on race day.`,
};

// Fortnightly Wednesday threshold sessions for sub-40km runners on even weeks
const FORTNIGHTLY_THRESHOLD_10K = {
  2: (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 6 min at threshold pace (${z.tempo}), 90 sec easy jog between reps. I want 7/10 effort across all three — controlled and consistent. Cool-down 12 min easy.`,
  4: (z) => `Warm-up 10 min easy (${z.easy}). Main set: 15 min at threshold pace (${z.tempo}). Cutback week — I want quality execution, not extra volume. Cool-down 10 min easy.`,
  6: (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 10 min at threshold pace (${z.tempo}), 2 min easy jog between. I want both reps at exactly the same pace — if rep 2 is slower, you went out too hard. Cool-down 12 min easy.`,
};

function buildTenK(answers, zones, raceDate) {
  const days = answers.days_per_week || 3;
  const longRuns = buildLongRunProgression(answers.weekly_volume, LONG_RUN_META);
  const isHighVolume = ['40_60km', '60_80km'].includes(answers.weekly_volume);

  const weeks = WEEK_DATA.map((data) => {
    const dateRange = getDateRange(data.wk, TOTAL_WEEKS, raceDate);

    if (data.isRaceWeek) {
      return {
        weekNumber: data.wk,
        label: 'RACE WEEK',
        dateRange,
        sessions: buildRaceWeekSessions(zones, days),
        coachNote: COACH_NOTES[8],
      };
    }

    const sessions = [];

    const useVO2 = isHighVolume || data.wk % 2 !== 0;
    if (useVO2) {
      sessions.push({
        day: 'Wednesday',
        type: 'VO2 MAX',
        title: `VO2 Max — ${data.vo2.set}`,
        detail: buildVo2Detail(data.vo2, zones),
      });
    } else {
      sessions.push({
        day: 'Wednesday',
        type: 'TEMPO',
        title: 'Threshold Session',
        detail: FORTNIGHTLY_THRESHOLD_10K[data.wk](zones),
      });
    }

    if (data.raceReps) {
      sessions.push({
        day: 'Friday',
        type: 'TEMPO',
        title: 'Race Pace Reps',
        detail: `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 1.6 km at 10km race pace (${zones.race10k}), 90 sec easy jog rest. All rest is easy jog, never standing. Cool-down 12 min easy.`,
      });
    } else if (data.racePaceReps) {
      sessions.push({
        day: 'Friday',
        type: 'TEMPO',
        title: 'Race Pace Session',
        detail: buildRacePaceDetail(data.racePaceReps, zones),
      });
    } else {
      sessions.push({
        day: 'Friday',
        type: 'TEMPO',
        title: 'Threshold Run',
        detail: buildTempoDetail(data.tempo, zones),
      });
    }

    const longKm = longRuns[data.wk - 1];
    sessions.push({
      day: 'Sunday',
      type: 'LONG RUN',
      title: `Long Run ${longKm}km${data.cutback ? ' (Deload)' : ''}`,
      detail: data.cutback
        ? `${longKm} km easy (${zones.easy}). Deload week — long run is intentionally shorter by ~40%. Comfortable and controlled the whole way.`
        : `${longKm} km at easy pace (${zones.easy}). Conversational effort. The final 2 to 3 km can include 4 x 20 sec strides if your legs feel good.`,
    });

    if (days >= 4) {
      sessions.push({
        day: 'Tuesday',
        type: 'EASY',
        title: 'Easy Run 30 to 40 min',
        detail: `30 to 40 min easy (${zones.easy}). Active recovery. Nothing heroic.`,
      });
    }
    if (days >= 5) {
      sessions.push({
        day: 'Thursday',
        type: 'EASY',
        title: 'Easy Run 30 min with Strides',
        detail: `30 min easy (${zones.easy}) with 4 x 20 sec strides toward the end. Strides: fast but relaxed, focus on form and quick feet. 60 sec walk between each.`,
      });
    }

    const easyKm = (days >= 4 ? 7 : 0) + (days >= 5 ? 6 : 0);
    const weekKm = Math.round(longKm + 9 + 9 + easyKm);

    return {
      weekNumber: data.wk,
      label: data.taper ? 'SHARPEN' : data.block,
      weekKm,
      dateRange,
      sessions: sortSessions(sessions),
      coachNote: COACH_NOTES[data.wk],
    };
  });

  return [
    {
      name: 'FOUNDATION',
      weekRange: 'Weeks 1 to 3',
      purpose: `Building your aerobic engine and getting comfortable with quality work. VO2 sessions establish top-end fitness; tempo work builds the threshold you'll race from.`,
      weeks: weeks.filter((w) => w.weekNumber <= 3),
    },
    {
      name: 'BUILD',
      weekRange: 'Weeks 4 to 6',
      purpose: `Volume and intensity both climb. Week 4 is a planned cutback before the push weeks. Race pace becomes the focus as you approach the sharp end.`,
      weeks: weeks.filter((w) => w.weekNumber >= 4 && w.weekNumber <= 6),
    },
    {
      name: 'SHARPEN & RACE',
      weekRange: 'Weeks 7 to 8',
      purpose: `Freshen the legs, sharpen the speed. Less volume, sharper quality. Race week is about activation, not training.`,
      weeks: weeks.filter((w) => w.weekNumber >= 7),
    },
  ];
}

function buildRaceWeekSessions(zones, days) {
  const sessions = [
    {
      day: 'Wednesday',
      type: 'TEMPO',
      title: 'Race Week Tune-Up',
      detail: `Warm-up 10 min easy. Main set: 3 x 1 km at race pace (${zones.race10k}), 90 sec easy jog rest. Cool-down 10 min easy. Legs should feel sharp, not tired.`,
    },
    {
      day: days >= 4 ? 'Saturday' : 'Friday',
      type: 'EASY',
      title: 'Activation Run',
      detail: `20 min easy with 4 x 30 sec strides. Short and sharp. Wake the legs up, don't train them.`,
    },
    {
      day: 'Sunday',
      type: 'RACE DAY',
      title: 'Race Day',
      detail: `Warm-up: 10 to 15 min easy jog + 2 x 30 sec strides. Pacing: First 2 km at goal pace + 5 sec/km. Settle to goal pace from km 2. Last 2 km: empty the tank. The first 2 km always feel too slow. Trust it.`,
    },
  ];
  return sessions;
}

function buildVo2Detail(vo2, zones) {
  return `Warm-up 12 min easy (${zones.easy}). Main set: ${vo2.set} at VO2 pace (${zones.vo2}). ${vo2.rest}. ${vo2.note} Cool-down 10 min easy.`;
}

function buildTempoDetail(tempoStr, zones) {
  if (!tempoStr) return '';
  if (tempoStr === '2 x 8 min threshold') {
    return `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 8 min at threshold pace (${zones.tempo}), 2 min easy jog between reps. I want 7/10 effort — short sentences only, you shouldn't be able to talk in full sentences. Cool-down 12 min easy.`;
  }
  if (tempoStr === '20 min continuous threshold') {
    return `Warm-up 12 min easy (${zones.easy}). Main set: 20 min continuous at threshold pace (${zones.tempo}). I want no walking, no surging — just 20 minutes of controlled quality. Effort: 7/10. Cool-down 12 min easy.`;
  }
  if (tempoStr.includes('surges')) {
    return `Warm-up 12 min easy (${zones.easy}). Main set: 20 min at threshold pace (${zones.tempo}), then without stopping, 3 x 30 sec at 10km race pace (${zones.race10k}), 30 sec easy jog between each surge. Cutback week — I want quality over quantity. Cool-down 12 min easy.`;
  }
  return `Warm-up 12 min easy (${zones.easy}). Main set: ${tempoStr} at threshold pace (${zones.tempo}), 3 min easy jog between reps. Cool-down 12 min easy.`;
}

function buildRacePaceDetail(racePaceStr, zones) {
  if (racePaceStr.includes('continuous')) {
    return `Warm-up 12 min easy (${zones.easy}). Main set: ${racePaceStr} at 10km race pace (${zones.race10k}). I want you to treat this as a dress rehearsal for race day — same pace, same focus. Cool-down 12 min easy.`;
  }
  return `Warm-up 12 min easy (${zones.easy}). Main set: ${racePaceStr} at 10km race pace (${zones.race10k}), 2 to 3 min easy jog rest between reps. I want you to finish each rep feeling like you had more in you — controlled aggression, not panic. Cool-down 12 min easy.`;
}

module.exports = { buildTenK };
