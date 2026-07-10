const { getDateRange, sortSessions, buildLongRunProgression } = require('../pace-zones');

// All BASE and BUILD weeks have weekly VO2 — PEAK and TAPER use threshold only
const SIXTEEN_WEEK = [
  { wk: 1,  block: 'BASE',   vo2: true,  mpKm: 0 },
  { wk: 2,  block: 'BASE',   vo2: true,  mpKm: 0 },
  { wk: 3,  block: 'BASE',   vo2: true,  mpKm: 0 },
  { wk: 4,  block: 'BASE',   vo2: true,  mpKm: 0,  cutback: true },
  { wk: 5,  block: 'BUILD 1', vo2: true, mpKm: 0 },
  { wk: 6,  block: 'BUILD 1', vo2: true, mpKm: 4 },
  { wk: 7,  block: 'BUILD 1', vo2: true, mpKm: 0 },
  { wk: 8,  block: 'BUILD 1', vo2: true, mpKm: 5,  cutback: true },
  { wk: 9,  block: 'BUILD 2', vo2: true, mpKm: 0 },
  { wk: 10, block: 'BUILD 2', vo2: true, mpKm: 7 },
  { wk: 11, block: 'BUILD 2', vo2: true, mpKm: 0,  cutback: true },
  { wk: 12, block: 'PEAK',   vo2: false, mpKm: 8 },
  { wk: 13, block: 'PEAK',   vo2: false, mpKm: 10 },
  { wk: 14, block: 'TAPER',  vo2: false, mpKm: 5,  taperPct: 75 },
  { wk: 15, block: 'TAPER',  vo2: false, mpKm: 0,  taperPct: 55 },
  { wk: 16, block: 'RACE',   isRaceWeek: true },
];

const MARATHON_VO2_16 = {
  1:  { set: '4 x 800m', rest: '90 sec easy jog rest between each rep', note: 'I want a pace you can hold across all 4 reps. Find it on rep 1 and commit to it.' },
  2:  { set: '8 x 400m', rest: '90 sec standing rest between each rep', note: 'Shorter intervals — I want you to go harder here than you would on 800s. Consistent pace across all 8.' },
  3:  { set: '3 x 1km', rest: '2 min easy jog rest between each rep', note: 'I want a pace that feels genuinely hard from 300m in and stays that way. All 3 reps within 5 sec of each other.' },
  4:  { set: '6 x 400m', rest: '90 sec standing rest between each rep', note: 'Cutback week — volume is down but I want intensity up. Each 400m should feel hard from the gun.' },
  5:  { set: '5 x 800m', rest: '90 sec easy jog rest between each rep', note: 'I want you to notice how much stronger this effort feels compared to Week 1. Consistent pacing across all 5.' },
  6:  { set: 'Ascending ladder: 400m, 600m, 800m, 1km', rest: '90 sec rest between each rep', note: 'I want the pace to adjust slightly as the distance climbs — stay at VO2 effort throughout. The 1km is the key rep.' },
  7:  { set: '4 x 1km', rest: '2 min easy jog rest between each rep', note: 'I want these controlled and strong — find a pace you can hold all 4 and stick to it. No heroics on rep 1.' },
  8:  { set: '8 x 300m', rest: '60 sec standing rest between each rep', note: 'Cutback week. Short intervals, high intensity. I want you to push hard on every rep — 300m is short enough to really go for it.' },
  9:  { set: '5 x 1km', rest: '90 sec easy jog rest between each rep', note: 'Peak VO2 load. I want the pace consistent across all 5 reps — aim for less than 5 sec variation rep to rep.' },
  10: { set: '6 x 800m', rest: '75 sec easy jog rest between each rep', note: 'High rep, tighter rest. I want consistency — don\'t blow up in the first 2 reps. Lock in a sustainable VO2 pace.' },
  11: { set: '5 x 600m', rest: '90 sec standing rest between each rep', note: 'Cutback week. I want quality on every rep — these should feel properly hard, not cruise control.' },
};

const SIXTEEN_WEEK_META = [
  {},                              // W1
  {},                              // W2
  {},                              // W3
  { cutback: true },               // W4
  {},                              // W5
  {},                              // W6
  {},                              // W7
  { cutback: true },               // W8
  {},                              // W9
  {},                              // W10
  { cutback: true },               // W11
  {},                              // W12
  {},                              // W13
  { taper: true, taperFactor: 0.75 }, // W14
  { taper: true, taperFactor: 0.50 }, // W15
  { raceWeek: true },              // W16
];

const TWELVE_WEEK = [
  { wk: 1, block: 'BASE',  vo2: true,  mpKm: 0 },
  { wk: 2, block: 'BASE',  vo2: true,  mpKm: 0 },
  { wk: 3, block: 'BASE',  vo2: true,  mpKm: 0 },
  { wk: 4, block: 'BUILD', vo2: true,  mpKm: 0,  cutback: true },
  { wk: 5, block: 'BUILD', vo2: true,  mpKm: 4 },
  { wk: 6, block: 'BUILD', vo2: true,  mpKm: 6 },
  { wk: 7, block: 'BUILD', vo2: true,  mpKm: 0,  cutback: true },
  { wk: 8, block: 'BUILD', vo2: true,  mpKm: 8 },
  { wk: 9, block: 'PEAK',  vo2: false, mpKm: 10 },
  { wk: 10, block: 'TAPER', vo2: false, mpKm: 5, taperPct: 75 },
  { wk: 11, block: 'TAPER', vo2: false, mpKm: 0, taperPct: 55 },
  { wk: 12, block: 'RACE',  isRaceWeek: true },
];

const MARATHON_VO2_12 = {
  1: { set: '4 x 800m', rest: '90 sec easy jog rest between each rep', note: 'I want a pace you can hold across all 4 reps. Find it on rep 1 and commit.' },
  2: { set: '8 x 400m', rest: '90 sec standing rest between each rep', note: 'Shorter intervals — I want you to go harder here than you would on 800s. Consistent pace.' },
  3: { set: '3 x 1km', rest: '2 min easy jog rest between each rep', note: 'I want a pace that feels genuinely hard from 300m in. All 3 reps within 5 sec of each other.' },
  4: { set: '6 x 400m', rest: '90 sec standing rest between each rep', note: 'Cutback week — volume down, intensity up. I want every rep to feel hard from the start.' },
  5: { set: '5 x 800m', rest: '90 sec easy jog rest between each rep', note: 'I want you to notice how much stronger this effort feels than Week 1. Consistent pacing across all 5.' },
  6: { set: 'Ascending ladder: 400m, 600m, 800m, 1km', rest: '90 sec rest between each rep', note: 'As the distance climbs, stay at VO2 effort — don\'t let the pace drop off. The 1km is the key rep.' },
  7: { set: '8 x 300m', rest: '60 sec standing rest between each rep', note: 'Cutback week. Short and intense. I want you to push hard on every rep — 300m is short enough to really go.' },
  8: { set: '4 x 1km', rest: '2 min easy jog rest between each rep', note: 'Peak VO2 load. I want controlled, strong pacing across all 4 reps. Less than 5 sec variation rep to rep.' },
};

const TWELVE_WEEK_META = [
  {},                              // W1
  {},                              // W2
  {},                              // W3
  { cutback: true },               // W4
  {},                              // W5
  {},                              // W6
  { cutback: true },               // W7
  {},                              // W8
  {},                              // W9
  { taper: true, taperFactor: 0.75 }, // W10
  { taper: true, taperFactor: 0.50 }, // W11
  { raceWeek: true },              // W12
];

// Friday threshold sessions for sub-40km runners on fortnightly non-VO2 BASE/BUILD weeks
const FORTNIGHTLY_FRIDAY_MARATHON = {
  2:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 8 min at threshold pace (${z.tempo}), 90 sec easy jog between. Second threshold this week — I want the same quality as Wednesday, shorter block. Cool-down 12 min easy.`,
  4:  (z) => `Warm-up 10 min easy (${z.easy}). Main set: 15 min continuous at threshold pace (${z.tempo}). Cutback week second quality session — I want controlled effort, not a grind. Cool-down 10 min easy.`,
  6:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 10 min at threshold pace (${z.tempo}), 2 min easy jog between. I want all three reps at the same effort — if rep 1 is faster than rep 3, you went out too hard. Cool-down 12 min easy.`,
  7:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 12 min at threshold pace (${z.tempo}), 2 min easy jog between. I want controlled, consistent effort across both reps. Cool-down 12 min easy.`,
  8:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 8 min at threshold pace (${z.tempo}), 90 sec easy jog between. Cutback week — I want quality on every rep. Sustainably hard, not desperate. Cool-down 12 min easy.`,
  10: (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 15 min at threshold pace (${z.tempo}), 2 min easy jog between. I want both reps at the same effort — treat this as a confidence builder heading into peak week. Cool-down 12 min easy.`,
};

function buildMarathon(answers, zones, raceDate) {
  const durationWeeks = answers.marathon_weeks === 12 ? 12 : 16;
  const plan = durationWeeks === 12 ? TWELVE_WEEK : SIXTEEN_WEEK;
  const weekMeta = durationWeeks === 12 ? TWELVE_WEEK_META : SIXTEEN_WEEK_META;
  const vo2Map = durationWeeks === 12 ? MARATHON_VO2_12 : MARATHON_VO2_16;
  const days = answers.days_per_week || 3;
  const totalWeeks = plan.length;
  const longRuns = buildLongRunProgression(answers.weekly_volume, weekMeta);
  const isHighVolume = ['40_60km', '60_80km'].includes(answers.weekly_volume);

  const weeks = plan.map((data) => {
    const dateRange = getDateRange(data.wk, totalWeeks, raceDate);
    if (data.isRaceWeek) {
      return {
        weekNumber: data.wk,
        label: 'RACE WEEK',
        dateRange,
        sessions: buildRaceWeekSessions(zones, days),
        coachNote: `Race week. The fitness is done. I want you to stay calm, stay loose, and execute your race plan.`,
      };
    }
    return buildMarathonWeek(data, days, zones, dateRange, longRuns[data.wk - 1], vo2Map[data.wk], isHighVolume);
  });

  if (durationWeeks === 16) {
    return [
      { name: 'BASE', weekRange: 'Weeks 1 to 4', purpose: `Building your aerobic foundation. Volume is modest, consistency is the goal. Week 4 is a planned cutback.`, weeks: weeks.filter((w) => w.weekNumber <= 4) },
      { name: 'BUILD 1', weekRange: 'Weeks 5 to 8', purpose: `Volume climbs and marathon pace enters the long run for the first time. Every second long run ends with a controlled MP block.`, weeks: weeks.filter((w) => w.weekNumber >= 5 && w.weekNumber <= 8) },
      { name: 'BUILD 2', weekRange: 'Weeks 9 to 11', purpose: `The long runs get serious. MP blocks grow. Week 11 is a cutback before the peak.`, weeks: weeks.filter((w) => w.weekNumber >= 9 && w.weekNumber <= 11) },
      { name: 'PEAK', weekRange: 'Weeks 12 to 13', purpose: `Highest load of the plan. The 32km run with a 10km MP block is the signature session. After this, you taper.`, weeks: weeks.filter((w) => w.weekNumber === 12 || w.weekNumber === 13) },
      { name: 'TAPER', weekRange: 'Weeks 14 to 16', purpose: `Volume drops to ~75% then ~55%. Two short MP touch-ups keep the legs live. Trust the process.`, weeks: weeks.filter((w) => w.weekNumber >= 14) },
    ];
  }

  return [
    { name: 'BASE', weekRange: 'Weeks 1 to 3', purpose: `Building your aerobic foundation. Requires an existing base. Week 4 is a planned cutback.`, weeks: weeks.filter((w) => w.weekNumber <= 3) },
    { name: 'BUILD', weekRange: 'Weeks 4 to 8', purpose: `Volume and marathon pace work both climb. Cutback at week 4 and week 7. MP blocks grow every second long run.`, weeks: weeks.filter((w) => w.weekNumber >= 4 && w.weekNumber <= 8) },
    { name: 'PEAK', weekRange: 'Week 9', purpose: `32km with 10km at marathon pace. The hardest week of the plan. After this, you taper.`, weeks: weeks.filter((w) => w.weekNumber === 9) },
    { name: 'TAPER', weekRange: 'Weeks 10 to 12', purpose: `Volume drops to ~75% then ~55%. Two short MP touch-ups keep the legs live.`, weeks: weeks.filter((w) => w.weekNumber >= 10) },
  ];
}

function buildMarathonWeek(data, days, zones, dateRange, longKm, vo2Session, isHighVolume) {
  const sessions = [];
  const { vo2, block, cutback, taperPct, mpKm, wk } = data;

  const isBaseOrBuild = vo2 && !taperPct;
  // Sub-40km runners get VO2 on odd weeks only; ≥40km runners get VO2 every BASE/BUILD week
  const useVO2 = isBaseOrBuild && !!vo2Session && (isHighVolume || wk % 2 !== 0);
  const isFortnightlyThreshold = isBaseOrBuild && !isHighVolume && wk % 2 === 0;

  // Quality day 1: VO2 (BASE/BUILD VO2 week) or threshold (all other weeks)
  if (useVO2) {
    sessions.push({
      day: 'Wednesday',
      type: 'VO2 MAX',
      title: `VO2 Max — ${vo2Session.set}`,
      detail: `Warm-up 12 min easy (${zones.easy}). Main set: ${vo2Session.set} at VO2 pace (${zones.vo2}). ${vo2Session.rest}. ${vo2Session.note} Cool-down 10 min easy.`,
    });
  } else {
    sessions.push({
      day: 'Wednesday',
      type: 'TEMPO',
      title: 'Marathon Threshold',
      detail: getThresholdDetail(wk, block, taperPct, zones),
    });
  }

  // Quality day 2: different threshold (VO2 week), second threshold (fortnightly non-VO2), or easy+strides (PEAK/TAPER)
  if (isFortnightlyThreshold && FORTNIGHTLY_FRIDAY_MARATHON[wk]) {
    sessions.push({
      day: 'Friday',
      type: 'TEMPO',
      title: 'Marathon Threshold',
      detail: FORTNIGHTLY_FRIDAY_MARATHON[wk](zones),
    });
  } else if (isBaseOrBuild) {
    sessions.push({
      day: 'Friday',
      type: 'TEMPO',
      title: 'Marathon Threshold',
      detail: getThresholdDetail(wk, block, taperPct, zones),
    });
  } else {
    sessions.push({
      day: 'Friday',
      type: 'EASY',
      title: 'Easy Run with Strides',
      detail: `${taperPct ? '30' : '40'} min easy (${zones.easy}) with 4 x 20 sec strides. Active recovery — I want legs feeling fresh heading into the long run.`,
    });
  }

  // Long run
  const longDetail = buildLongRunDetail(longKm, mpKm, cutback, zones);
  sessions.push({
    day: 'Sunday',
    type: 'LONG RUN',
    title: `Long Run ${longKm}km${mpKm > 0 ? ` (${mpKm}km at MP)` : ''}${cutback ? ' (Cutback)' : ''}`,
    detail: longDetail,
  });

  if (days >= 4) {
    sessions.push({
      day: 'Tuesday',
      type: 'EASY',
      title: `Easy Run ${taperPct ? '30 to 40' : '40 to 50'} min`,
      detail: `${taperPct ? '30 to 40' : '40 to 50'} min easy (${zones.easy}). Active recovery. Conversational pace.`,
    });
  }
  if (days >= 5) {
    sessions.push({
      day: 'Thursday',
      type: 'EASY',
      title: 'Easy Run 30 to 40 min',
      detail: `30 to 40 min easy (${zones.easy}). Second easy day. Keep it easy.`,
    });
  }

  let label = block;
  if (cutback) label = `${block} (Cutback)`;
  if (taperPct) label = `TAPER (~${taperPct}% volume)`;

  const easyKm = (days >= 4 ? 10 : 0) + (days >= 5 ? 8 : 0);
  const rawWeekKm = longKm + 10 + 10 + easyKm;
  const weekKm = Math.round(taperPct ? rawWeekKm * taperPct / 100 : rawWeekKm);

  return {
    weekNumber: wk,
    label,
    weekKm,
    dateRange,
    sessions: sortSessions(sessions),
    coachNote: getMarathonCoachNote(wk, data, longKm),
  };
}

const THRESHOLD_DETAILS = {
  // 16-week plan thresholds by week (also used by 12-week where week numbers align)
  1:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 12 min at threshold pace (${z.tempo}), 3 min easy jog between. I want 7/10 effort — short sentences only. Cool-down 12 min easy.`,
  2:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 20 min continuous at threshold pace (${z.tempo}). I want no walking, no surging — just steady quality. Effort: 7/10. Cool-down 12 min easy.`,
  3:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 15 min at threshold pace (${z.tempo}), 3 min easy jog between. I want both reps at the same effort — settle in early and hold it. Cool-down 12 min easy.`,
  4:  (z) => `Warm-up 10 min easy (${z.easy}). Main set: 3 x 8 min at threshold pace (${z.tempo}), 2 min easy jog between. Cutback week — volume is down but I want quality effort on every rep. Cool-down 10 min easy.`,
  5:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 10 min at threshold pace (${z.tempo}), 2 min easy jog between. I want each rep at the same pace — consistent effort across all three. Cool-down 12 min easy.`,
  6:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 15 min at threshold pace (${z.tempo}), 2 min easy jog between. I want you to notice how much more controlled this feels at this stage — trust the base you've built. Cool-down 12 min easy.`,
  7:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 12 min at threshold pace (${z.tempo}), 90 sec easy jog between. Same load as last week, less rest — I want you to hold the same pace with tighter recovery. Cool-down 12 min easy.`,
  8:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 25 min continuous at threshold pace (${z.tempo}). Cutback week — I want you to hold the pace from start to finish. No surging, no fading. Cool-down 12 min easy.`,
  9:  (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 20 min at threshold pace (${z.tempo}), 3 min easy jog between. Peak threshold load. I want the second rep to feel as controlled as the first — that's the benchmark. Cool-down 12 min easy.`,
  10: (z) => `Warm-up 12 min easy (${z.easy}). Main set: 15 min at threshold pace (${z.tempo}), then 3 x 1km at marathon pace (${z.mp}), 90 sec easy jog between. Mixed session — I want the MP reps to feel smooth, not fought. Cool-down 12 min easy.`,
  11: (z) => `Warm-up 12 min easy (${z.easy}). Main set: 25 min continuous at threshold pace (${z.tempo}). Cutback week — I want controlled quality. Settle in early and hold it to the end. Cool-down 12 min easy.`,
  12: (z) => `Warm-up 12 min easy (${z.easy}). Main set: 2 x 20 min at threshold pace (${z.tempo}), 3 min easy jog between. Peak week — I want both reps as strong as each other. Cool-down 12 min easy.`,
  13: (z) => `Warm-up 12 min easy (${z.easy}). Main set: 3 x 2km at marathon pace (${z.mp}), 90 sec easy jog between. I want these to feel controlled — not easy, but sustainable. Your body knows this pace now. Cool-down 12 min easy.`,
};

function getThresholdDetail(wk, block, taperPct, zones) {
  if (taperPct === 55) {
    return `Warm-up 10 min easy. Main set: 3 x 5 min at threshold pace (${zones.tempo}), 2 min easy between reps. Then 2 x 1km at marathon pace (${zones.mp}), 90 sec rest. I want legs staying live — volume is low but intensity stays. Cool-down 10 min easy.`;
  }
  if (taperPct === 75) {
    return `Warm-up 12 min easy. Main set: 2 x 10 min at threshold pace (${zones.tempo}), 2 min easy between. Then 3 x 1km at marathon pace (${zones.mp}), 90 sec rest. I want this to feel like a reminder, not a workout. Cool-down 10 min easy.`;
  }
  const fn = THRESHOLD_DETAILS[wk];
  if (fn) return fn(zones);
  if (block === 'PEAK' || block === 'BUILD 2' || block === 'BUILD') {
    return `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 15 min at threshold pace (${zones.tempo}), 3 min easy jog between. I want consistent effort across both reps. Cool-down 12 min easy.`;
  }
  return `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 12 min at threshold pace (${zones.tempo}), 3 min easy jog between. I want 7/10 effort — short sentences only. Cool-down 12 min easy.`;
}

function buildLongRunDetail(longKm, mpKm, cutback, zones) {
  if (cutback) {
    return `${longKm} km easy (${zones.easy}). Cutback week. Comfortable and controlled the whole way. No heroics.`;
  }
  if (mpKm > 0) {
    const easyKm = longKm - mpKm;
    return `${longKm} km total. First ${easyKm} km at easy pace (${zones.easy}). Final ${mpKm} km at marathon pace (${zones.mp}). The MP block is the key stimulus. Run the easy portion genuinely easy so you can execute the MP finish.`;
  }
  return `${longKm} km at easy pace (${zones.easy}). Conversational effort the whole way. These runs build your aerobic engine. They're supposed to feel manageable.`;
}

function buildRaceWeekSessions(zones, days) {
  return [
    {
      day: 'Wednesday',
      type: 'TEMPO',
      title: 'Race Week Tune-Up',
      detail: `Warm-up 10 min easy. Main set: 4 x 1 km at marathon pace (${zones.mp}), 90 sec easy jog rest. Cool-down 10 min easy. Legs should feel controlled, not taxed.`,
    },
    {
      day: days >= 4 ? 'Saturday' : 'Friday',
      type: 'EASY',
      title: 'Activation Run',
      detail: `20 min easy with 4 x 30 sec strides. Wake the legs up. Nothing more.`,
    },
    {
      day: 'Sunday',
      type: 'RACE DAY',
      title: 'Race Day',
      detail: `Race morning: tried-and-tested breakfast 3 hours before the gun. Gel 15 min before start. Pacing: first 5 km at goal pace + 8 to 10 sec/km. Cruise and settle to 32 km. Race the final 10 km. Fuelling: gel or carbs every 30 to 45 min from km 10. Drink at every aid station. Stick to the plan you've rehearsed.`,
    },
  ];
}

function getMarathonCoachNote(wk, data, longKm) {
  if (data.isRaceWeek) return `Race week. The fitness is done. I want you to stay calm, stay loose, and execute your race plan.`;
  if (data.taperPct === 55) return `Volume is low, intensity stays. Two more sessions and you race. I don't want you adding extra work to feel prepared — trust what you've built.`;
  if (data.taperPct === 75) return `First taper week. You may feel sluggish or anxious. Both are completely normal. The fitness is already there — I want you to protect it, not build more of it.`;
  if (longKm >= 30) return `One of the longest runs of your life this weekend. I want you to fuel and hydrate as if it's race day, and execute the marathon pace block at the end, not the start.`;
  if (data.mpKm > 0) return `The marathon pace finish on the long run is the most important stimulus of this plan. I want you to run the first part genuinely easy so you have something left for the pace block.`;
  if (data.cutback) return `Cutback week. I've reduced the volume on purpose — this is where your body absorbs what you've been doing. Don't sneak in extra sessions.`;
  if (wk <= 3) return `Foundation week. I want you to keep volume modest and consistency high — any single session matters less than showing up every week.`;
  return `I want you to stay consistent and patient. The harder weeks are coming and they require this base under your feet.`;
}

module.exports = { buildMarathon };
