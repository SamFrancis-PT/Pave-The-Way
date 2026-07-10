const { getDateRange, sortSessions, buildLongRunProgression } = require('../pace-zones');

const SIXTEEN_WEEK = [
  { wk: 1, block: 'BASE', vo2: true, mpKm: 0 },
  { wk: 2, block: 'BASE', vo2: false, mpKm: 0 },
  { wk: 3, block: 'BASE', vo2: true, mpKm: 0 },
  { wk: 4, block: 'BASE', vo2: false, mpKm: 0, cutback: true },
  { wk: 5, block: 'BUILD 1', vo2: true, mpKm: 0 },
  { wk: 6, block: 'BUILD 1', vo2: false, mpKm: 4 },
  { wk: 7, block: 'BUILD 1', vo2: true, mpKm: 0 },
  { wk: 8, block: 'BUILD 1', vo2: false, mpKm: 5, cutback: true },
  { wk: 9, block: 'BUILD 2', vo2: true, mpKm: 0 },
  { wk: 10, block: 'BUILD 2', vo2: false, mpKm: 7 },
  { wk: 11, block: 'BUILD 2', vo2: true, mpKm: 0, cutback: true },
  { wk: 12, block: 'PEAK', vo2: false, mpKm: 8 },
  { wk: 13, block: 'PEAK', vo2: false, mpKm: 10 },
  { wk: 14, block: 'TAPER', vo2: false, mpKm: 5, taperPct: 75 },
  { wk: 15, block: 'TAPER', vo2: false, mpKm: 0, taperPct: 55 },
  { wk: 16, block: 'RACE', isRaceWeek: true },
];

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
  { wk: 1, block: 'BASE', vo2: true, mpKm: 0 },
  { wk: 2, block: 'BASE', vo2: false, mpKm: 0 },
  { wk: 3, block: 'BASE', vo2: true, mpKm: 0 },
  { wk: 4, block: 'BUILD', vo2: false, mpKm: 0, cutback: true },
  { wk: 5, block: 'BUILD', vo2: true, mpKm: 4 },
  { wk: 6, block: 'BUILD', vo2: false, mpKm: 6 },
  { wk: 7, block: 'BUILD', vo2: true, mpKm: 0, cutback: true },
  { wk: 8, block: 'BUILD', vo2: false, mpKm: 8 },
  { wk: 9, block: 'PEAK', vo2: false, mpKm: 10 },
  { wk: 10, block: 'TAPER', vo2: false, mpKm: 5, taperPct: 75 },
  { wk: 11, block: 'TAPER', vo2: false, mpKm: 0, taperPct: 55 },
  { wk: 12, block: 'RACE', isRaceWeek: true },
];

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

function buildMarathon(answers, zones, raceDate) {
  const durationWeeks = answers.marathon_weeks === 12 ? 12 : 16;
  const plan = durationWeeks === 12 ? TWELVE_WEEK : SIXTEEN_WEEK;
  const weekMeta = durationWeeks === 12 ? TWELVE_WEEK_META : SIXTEEN_WEEK_META;
  const days = answers.days_per_week || 3;
  const totalWeeks = plan.length;
  const longRuns = buildLongRunProgression(answers.weekly_volume, weekMeta);

  const weeks = plan.map((data) => {
    const dateRange = getDateRange(data.wk, totalWeeks, raceDate);
    if (data.isRaceWeek) {
      return {
        weekNumber: data.wk,
        label: 'RACE WEEK',
        dateRange,
        sessions: buildRaceWeekSessions(zones, days),
        coachNote: `Race week. Your fitness is done. Stay fresh, trust the training, race smart.`,
      };
    }
    return buildMarathonWeek(data, days, zones, dateRange, longRuns[data.wk - 1]);
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

function buildMarathonWeek(data, days, zones, dateRange, longKm) {
  const sessions = [];
  const { vo2, block, cutback, taperPct, mpKm, wk } = data;

  // Quality day 1: VO2 or threshold
  if (vo2 && !taperPct) {
    sessions.push({
      day: 'Wednesday',
      type: 'VO2 MAX',
      title: 'VO2 Max Intervals',
      detail: `Warm-up 12 min easy (${zones.easy}). Main set: 5 x 3 min at VO2 pace (${zones.vo2}), 90 sec easy jog rest. All rest is easy jog. Cool-down 10 min easy.`,
      hiMinutes: 15,
    });
  } else {
    sessions.push({
      day: 'Wednesday',
      type: 'TEMPO',
      title: 'Marathon Threshold',
      detail: getThresholdDetail(block, taperPct, zones),
    });
  }

  // Quality day 2: threshold (if VO2 week) or easy with strides
  if (vo2 && !taperPct) {
    sessions.push({
      day: 'Friday',
      type: 'TEMPO',
      title: 'Marathon Threshold',
      detail: getThresholdDetail(block, taperPct, zones),
    });
  } else {
    sessions.push({
      day: 'Friday',
      type: 'EASY',
      title: 'Easy Run with Strides',
      detail: `${taperPct ? '30' : '40'} min easy (${zones.easy}) with 4 x 20 sec strides. Active recovery. Legs should feel fresh heading into the long run.`,
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

function getThresholdDetail(block, taperPct, zones) {
  if (taperPct === 55) {
    return `Warm-up 10 min easy. Main set: 3 x 5 min at threshold (${zones.tempo}), 2 min easy between. 2 x 1 km at marathon pace (${zones.mp}). Cool-down 10 min easy. Legs stay live, volume stays low.`;
  }
  if (taperPct === 75) {
    return `Warm-up 12 min easy. Main set: 2 x 10 min at threshold (${zones.tempo}), 2 min easy between. 3 x 1 km at marathon pace (${zones.mp}). Cool-down 10 min easy.`;
  }
  if (block === 'PEAK' || block === 'BUILD 2' || block === 'BUILD') {
    return `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 15 min at threshold (${zones.tempo}), 3 min easy jog between. Cool-down 12 min easy.`;
  }
  return `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 12 min at threshold (${zones.tempo}), 3 min easy jog between. Cool-down 12 min easy.`;
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
  if (data.isRaceWeek) return `Race week. Trust the training.`;
  if (data.taperPct === 55) return `Volume is low, intensity stays. Two more sessions and you race. Don't add extra work to feel prepared.`;
  if (data.taperPct === 75) return `First taper week. You may feel sluggish or anxious. Both are normal. The fitness is already there.`;
  if (longKm >= 30) return `One of the longest runs of your life this weekend. Fuel and hydrate as if it's race day. Execute the marathon pace block at the end, not the start.`;
  if (data.mpKm > 0) return `The MP finish on the long run is the most important stimulus of the plan. Run the first part genuinely easy so you can execute it.`;
  if (data.cutback) return `Cutback week. Your body needs this. Don't try to sneak in extra work.`;
  if (wk <= 3) return `Foundation week. Volume is modest by design. Consistency matters more than any single session right now.`;
  return `Stay consistent, stay patient. The big weeks are coming.`;
}

module.exports = { buildMarathon };
