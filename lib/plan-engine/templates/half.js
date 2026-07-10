const { getDateRange, sortSessions, buildLongRunProgression } = require('../pace-zones');

const TOTAL_WEEKS = 12;

// Long-run week meta for progression (hardcoded LONG_KM removed — computed per user volume)
const LONG_RUN_META = [
  {},                                    // W1
  {},                                    // W2
  {},                                    // W3
  { cutback: true },                     // W4 deload
  {},                                    // W5
  {},                                    // W6
  {},                                    // W7 (HMP finish added in buildHalfWeek)
  { cutback: true },                     // W8 deload
  {},                                    // W9 (HMP finish, peak)
  {},                                    // W10
  { taper: true, taperFactor: 0.62 },   // W11
  { raceWeek: true },                    // W12
];

const COACH_NOTES = {
  1:  `Your first week. I want everything to feel manageable — not easy, manageable. If the threshold sessions feel genuinely hard, your pace is too high. Drop it, trust the effort.`,
  2:  `Twenty minutes continuous threshold is a real session. I want you to warm up properly and settle into the pace early — don't negative split, don't surge. Just hold it.`,
  3:  `First time at half marathon pace reps. This is the pace you'll race at — I want you to start learning what it feels like, not just hit a number on a watch.`,
  4:  `Cutback week. I've shortened the long run on purpose — this is where your body absorbs the training you've put in. Don't add extra. The adaptation is happening.`,
  5:  `Volume picks up this week. The long run is starting to get serious — I want you to fuel it properly, not run it off yesterday's breakfast.`,
  6:  `Mixed VO2 session this week — race pace efforts inside sets. I want you to trust the structure, even when the rest feels short.`,
  7:  `First long run with a race-pace finish. The last 3 km at half marathon pace will tell you a lot about where your fitness is. I want honest effort, not heroics.`,
  8:  `Another cutback. Your body needs it after the past three weeks. I want you to resist the urge to do more — the adaptation happens when you rest.`,
  9:  `Peak week. The long run with a 5km race-pace finish is the key session of this plan. Nail that and I'm confident you're ready.`,
  10: `Second peak week. After this, we taper. I want you to make it count — but not blow yourself up doing it.`,
  11: `Volume drops but I want sharpness to stay. One more quality session, then it's race week. Legs should feel good by Saturday.`,
  12: `Race week. The fitness is done. I want you to stay calm, execute your warm-up, and trust what you've built.`,
};

// Fortnightly Wednesday threshold sessions for sub-40km runners on even weeks
const FORTNIGHTLY_THRESHOLD_HALF = {
  2:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 8 min at threshold pace (${z.tempo}), 2 min easy jog between. I want 7/10 effort across all three — short sentences only. Cool-down 12 min easy.`,
  4:  (z) => `Warm-up 10 min easy (${z.easy}). Main set: 2 x 8 min at threshold pace (${z.tempo}), 90 sec easy jog between. Cutback week — volume is down but quality stays on each rep. Cool-down 10 min easy.`,
  6:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 12 min at threshold pace (${z.tempo}), 2 min easy jog between. I want both reps at the same pace — consistent and controlled start to finish. Cool-down 12 min easy.`,
  8:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 8 min at threshold pace (${z.tempo}), 90 sec easy jog between. Cutback week — I want quality on every rep. Sustainable but genuinely hard. Cool-down 12 min easy.`,
  10: (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 10 min at threshold pace (${z.tempo}), 2 min easy jog between. I want all three reps at the same effort — controlled and consistent. Cool-down 12 min easy.`,
};

function buildHalf(answers, zones, raceDate) {
  const days = answers.days_per_week || 3;
  const longRuns = buildLongRunProgression(answers.weekly_volume, LONG_RUN_META);
  const isHighVolume = ['40_60km', '60_80km'].includes(answers.weekly_volume);

  const weeks = Array.from({ length: 12 }, (_, i) => {
    const wk = i + 1;
    const dateRange = getDateRange(wk, TOTAL_WEEKS, raceDate);

    if (wk === 12) {
      return {
        weekNumber: 12,
        label: 'RACE WEEK',
        dateRange,
        sessions: buildRaceWeekSessions(zones, days),
        coachNote: COACH_NOTES[12],
      };
    }

    return buildHalfWeek(wk, days, zones, dateRange, longRuns[wk - 1], isHighVolume);
  });

  return [
    {
      name: 'FOUNDATION',
      weekRange: 'Weeks 1 to 4',
      purpose: `Building your aerobic base and introducing quality work. Week 4 is a planned cutback. Don't skip it.`,
      weeks: weeks.filter((w) => w.weekNumber <= 4),
    },
    {
      name: 'BUILD',
      weekRange: 'Weeks 5 to 8',
      purpose: `Volume and half marathon pace work both increase. The long run gets serious. Week 8 is another planned cutback before the peak.`,
      weeks: weeks.filter((w) => w.weekNumber >= 5 && w.weekNumber <= 8),
    },
    {
      name: 'PEAK',
      weekRange: 'Weeks 9 to 10',
      purpose: `Highest training load of the plan. Week 9 is the key week: a 16km long run with the final 5km at race pace. This session confirms your goal time.`,
      weeks: weeks.filter((w) => w.weekNumber === 9 || w.weekNumber === 10),
    },
    {
      name: 'TAPER & RACE',
      weekRange: 'Weeks 11 to 12',
      purpose: `Volume drops significantly. One sharpening session per week keeps you race-ready. Trust the taper.`,
      weeks: weeks.filter((w) => w.weekNumber >= 11),
    },
  ];
}

function buildHalfWeek(wk, days, zones, dateRange, longKm, isHighVolume) {
  const cutback = wk === 4 || wk === 8;
  const taper = wk === 11;
  const block = getBlock(wk);

  const sessions = [];

  // Wednesday: VO2 in foundation/build (weekly for ≥40km, fortnightly for sub-40), easy in taper
  // PEAK weeks (W9-W10) always get VO2 regardless of volume
  if (taper) {
    sessions.push({
      day: 'Wednesday',
      type: 'EASY',
      title: 'Easy Taper Run',
      detail: `35 min easy (${zones.easy}). Taper week. No hard effort today.`,
    });
  } else {
    const useVO2 = block === 'PEAK' || isHighVolume || wk % 2 !== 0;
    if (useVO2) {
      const vo2 = VO2_SESSIONS[wk] || VO2_SESSIONS[10];
      sessions.push({
        day: 'Wednesday',
        type: 'VO2 MAX',
        title: `VO2 Max — ${vo2.set}`,
        detail: `Warm-up 12 min easy (${zones.easy}). Main set: ${vo2.set} at VO2 pace (${zones.vo2}). ${vo2.rest}. ${vo2.note} Cool-down 10 min easy.`,
      });
    } else {
      sessions.push({
        day: 'Wednesday',
        type: 'TEMPO',
        title: 'Threshold Session',
        detail: FORTNIGHTLY_THRESHOLD_HALF[wk](zones),
      });
    }
  }

  // Friday: threshold / HMP / taper reps
  sessions.push({
    day: 'Friday',
    type: 'TEMPO',
    title: taper ? 'Sharpening Reps' : 'Threshold / Race Pace Session',
    detail: getTempoDetail(wk, zones),
  });

  // Sunday: long run
  if (wk === 7 || wk === 9) {
    const mpKm = wk === 7 ? 3 : 5;
    const easyKm = longKm - mpKm;
    sessions.push({
      day: 'Sunday',
      type: 'LONG RUN',
      title: `Long Run ${longKm}km with Race Pace Finish`,
      detail: `${longKm} km total. First ${easyKm} km easy (${zones.easy}). Final ${mpKm} km at half marathon pace (${zones.hmp}). This is the session that confirms your goal. Don't blow up in the first half.`,
    });
  } else {
    sessions.push({
      day: 'Sunday',
      type: 'LONG RUN',
      title: `Long Run ${longKm}km${cutback ? ' (Cutback)' : ''}`,
      detail: cutback
        ? `${longKm} km easy (${zones.easy}). Cutback week. Comfortable and controlled the whole way.`
        : `${longKm} km at easy pace (${zones.easy}). Conversational effort throughout.`,
    });
  }

  if (days >= 4) {
    sessions.push({
      day: 'Tuesday',
      type: 'EASY',
      title: 'Easy Run 40 to 50 min',
      detail: `40 to 50 min easy (${zones.easy}). Active recovery. Conversational pace.`,
    });
  }
  if (days >= 5) {
    sessions.push({
      day: 'Thursday',
      type: 'EASY',
      title: 'Easy Run 30 to 40 min with Strides',
      detail: `30 to 40 min easy (${zones.easy}) with 4 x 20 sec strides toward the end. Fast but relaxed, 60 sec walk between each.`,
    });
  }

  const easyKm = (days >= 4 ? 8 : 0) + (days >= 5 ? 7 : 0);
  const weekKm = taper ? Math.round(longKm + 9 + easyKm) : Math.round(longKm + 10 + 9 + easyKm);

  return {
    weekNumber: wk,
    label: taper ? 'TAPER' : cutback ? `${getBlock(wk)} (Cutback)` : getBlock(wk),
    weekKm,
    dateRange,
    sessions: sortSessions(sessions),
    coachNote: COACH_NOTES[wk],
  };
}

function getBlock(wk) {
  if (wk <= 4) return 'FOUNDATION';
  if (wk <= 8) return 'BUILD';
  if (wk <= 10) return 'PEAK';
  return 'TAPER';
}

const VO2_SESSIONS = {
  1:  { set: '6 x 400m', rest: '90 sec standing rest between each rep', note: 'I want you to find the VO2 effort here — hard, uncomfortable, but in control. The last 2 reps should be your fastest.' },
  2:  { set: '5 x 800m', rest: '90 sec easy jog rest between each rep', note: 'I want a pace you can hold across all 5 reps. If you blow up on rep 3, you went out too hard. Aim for consistency.' },
  3:  { set: 'Ascending ladder: 400m, 600m, 800m, 1km', rest: '90 sec rest between each rep', note: 'I want the pace to drop slightly as the distance climbs — but stay at VO2 effort throughout. The 1km should feel like a real fight.' },
  4:  { set: '8 x 300m', rest: '60 sec standing rest between each rep', note: 'Cutback week on volume but I want intensity up. 300m is short enough to push hard — treat each one like a mini sprint at VO2 effort.' },
  5:  { set: '4 x 1km', rest: '2 min easy jog rest between each rep', note: 'I want a pace that feels hard from 300m in and stays that way. Find it on rep 1, hold it across all 4.' },
  6:  { set: '3 sets of: 600m then 400m — 60 sec rest between reps, 2 min rest between sets', rest: 'See above', note: 'Mixed within-set session. I want the 400m at the end of each set to be faster than the 600m — use the rest to recover, then go.' },
  7:  { set: '10 x 400m', rest: '75 sec standing rest between each rep', note: 'High rep count this week. I want consistent pacing across all 10 — if rep 7 is 5 sec slower than rep 1, you started too hard. Lock in a pace and hold it.' },
  8:  { set: '5 x 600m', rest: '90 sec standing rest between each rep', note: 'Cutback week — volume is down but I want quality effort on every rep. These should feel genuinely hard, not cruise control.' },
  9:  { set: '4 x 1km then 5 x 200m', rest: '2 min rest after each km / 45 sec after each 200m', note: 'Peak VO2 session. I want the 1km reps controlled and strong, then the 200s fast — genuinely fast. Standing rest between 200s is fine. Dig in.' },
  10: { set: 'Descending ladder: 1km, 800m, 600m, 400m', rest: '90 sec easy jog rest between each rep', note: 'As the distance drops, I want the pace to lift. The 400m at the end should be close to your fastest rep of the whole session. Earn it.' },
};

function getTempoDetail(wk, zones) {
  const details = {
    1:  `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 8 min at threshold pace (${zones.tempo}), 2 min easy jog between reps. First threshold session — I want 7/10 effort. Short sentences only, you shouldn't be holding full conversations. Cool-down 12 min easy.`,
    2:  `Warm-up 12 min easy (${zones.easy}). Main set: 20 min continuous at threshold pace (${zones.tempo}). I want no walking, no surging — 20 minutes of controlled quality. Settle in early and hold it. Cool-down 12 min easy.`,
    3:  `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 8 min at half marathon pace (${zones.hmp}), 2 min easy jog between reps. First look at your race pace — I want you to get comfortable with what this effort feels like. Cool-down 12 min easy.`,
    4:  `Warm-up 10 min easy (${zones.easy}). Main set: 3 x 6 min at threshold pace (${zones.tempo}), 90 sec easy jog between reps. Cutback week — volume is down but I still want quality effort on each rep. Cool-down 10 min easy.`,
    5:  `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 10 min at half marathon pace (${zones.hmp}), 3 min easy jog between. I want both reps at the same pace and the same effort — controlled and deliberate. Cool-down 12 min easy.`,
    6:  `Warm-up 12 min easy (${zones.easy}). Main set: 15 min at threshold pace (${zones.tempo}), 5 min easy, then 15 min at threshold pace again. I want the second 15 minutes to feel as clean as the first — that's where the mental toughness is built. Cool-down 12 min easy.`,
    7:  `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 15 min at half marathon pace (${zones.hmp}), 3 min easy jog between. I want controlled execution on both reps — same pace, same effort, same form across all 30 minutes. Cool-down 12 min easy.`,
    8:  `Warm-up 12 min easy (${zones.easy}). Main set: 25 min continuous at threshold pace (${zones.tempo}). Cutback week on volume but this isn't an easy session — I want you to hold the pace start to finish. Cool-down 12 min easy.`,
    9:  `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 10 min at half marathon pace (${zones.hmp}), 2 min easy jog between. Peak race pace volume. I want you to treat each rep as a race segment — same focus, same form, same pace. Cool-down 12 min easy.`,
    10: `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 2km at half marathon pace (${zones.hmp}), 90 sec easy jog between. I want you to run these by feel — your body knows the pace now. Don't watch the watch, watch the effort. Cool-down 12 min easy.`,
    11: `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 1.6km at race pace (${zones.hmp}), 90 sec easy jog between. Taper week — volume drops, sharpness stays. I want these to feel fast and controlled. Cool-down 10 min easy.`,
  };
  return details[wk] || '';
}

function buildRaceWeekSessions(zones, days) {
  return [
    {
      day: 'Wednesday',
      type: 'TEMPO',
      title: 'Race Week Tune-Up',
      detail: `Warm-up 10 min easy. Main set: 3 x 1 km at race pace (${zones.hmp}), 90 sec easy jog rest. Cool-down 10 min easy. Legs should feel sharp, not tired.`,
    },
    {
      day: days >= 4 ? 'Saturday' : 'Friday',
      type: 'EASY',
      title: 'Activation Run',
      detail: `20 to 25 min easy with 4 x 30 sec strides. Short and sharp. Wake the legs up.`,
    },
    {
      day: 'Sunday',
      type: 'RACE DAY',
      title: 'Race Day',
      detail: `Warm-up: 10 to 15 min easy jog + 2 x 30 sec strides. Pacing: First 3 km at goal pace + 5 sec/km. Settle to goal pace from km 3. At 15 km, assess: if you feel strong, push. Final 5 km: race it. The first 3 km always feel too slow. Trust it.`,
    },
  ];
}

module.exports = { buildHalf };
