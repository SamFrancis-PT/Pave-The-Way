const { getDateRange, sortSessions } = require('../pace-zones');

const TOTAL_WEEKS = 12;

const LONG_KM = [8, 9, 10, 8, 12, 13, 14, 11, 16, 18, 12, null];

const COACH_NOTES = {
  1: `First week. Everything should feel manageable. If the threshold sessions feel genuinely hard, your pace is too high.`,
  2: `Twenty minutes continuous threshold is a proper session. Warm up thoroughly and settle in.`,
  3: `Half marathon pace reps for the first time. This is the pace you'll race at. Get comfortable with how it feels.`,
  4: `Cutback week. The long run is intentionally shorter. This is where your body catches up with the training.`,
  5: `Volume picks up this week. Long run starts getting serious. Fuel it properly.`,
  6: `Pyramid VO2 session is long but the intervals are short. Trust the structure.`,
  7: `First long run with a race-pace finish. The last 3 km at half marathon pace will tell you a lot about where your fitness is.`,
  8: `Another cutback. Your body needs it after the past three weeks.`,
  9: `Peak week. The 16km long run with a 5km race-pace finish is the key session of this plan. Nail it and you're ready.`,
  10: `Second peak week. After this, you taper. Make it count.`,
  11: `Volume drops but quality stays sharp. One more sharpening session then it's race week.`,
  12: `Race week. Trust the training.`,
};

function buildHalf(answers, zones, raceDate) {
  const days = answers.days_per_week || 3;

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

    return buildHalfWeek(wk, days, zones, dateRange);
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

function buildHalfWeek(wk, days, zones, dateRange) {
  const longKm = LONG_KM[wk - 1];
  const cutback = wk === 4 || wk === 8;
  const taper = wk === 11;

  const sessions = [];

  // Wednesday: VO2 in foundation/build, easy in taper
  if (taper) {
    sessions.push({
      day: 'Wednesday',
      type: 'EASY',
      title: 'Easy Taper Run',
      detail: `35 min easy (${zones.easy}). Taper week. No hard effort today.`,
    });
  } else {
    const vo2Str = getVo2Str(wk);
    sessions.push({
      day: 'Wednesday',
      type: 'VO2 MAX',
      title: `VO2 Max Intervals`,
      detail: `Warm-up 12 min easy (${zones.easy}). Main set: ${vo2Str} at VO2 pace (${zones.vo2}). All rest is easy jog, never standing. Cool-down 10 min easy.`,
      hiMinutes: parseHiMins(vo2Str),
    });
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

  return {
    weekNumber: wk,
    label: taper ? 'TAPER' : cutback ? `${getBlock(wk)} (Cutback)` : getBlock(wk),
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

function getVo2Str(wk) {
  const map = {
    1: 'ladder 1-2-3-2-1 min (10 min hard)',
    2: '2-3-4-3-2 min (14 min hard)',
    3: '2-3-4-3-2 min (14 min hard)',
    4: '4 x 3 min (12 min hard)',
    5: '3-4-4-3 min (14 min hard)',
    6: 'pyramid 1-2-3-4-3-2-1 min (16 min hard)',
    7: '5 x 3 min (15 min hard)',
    8: '4 x 3 min (12 min hard)',
    9: 'pyramid 1-2-3-4-3-2-1 min (16 min hard)',
    10: '6 x 2 min (12 min hard)',
  };
  return map[wk] || '5 x 3 min (15 min hard)';
}

function getTempoDetail(wk, zones) {
  const details = {
    1: `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 8 min at threshold (${zones.tempo}), 3 min easy jog between. Cool-down 12 min easy.`,
    2: `Warm-up 12 min easy (${zones.easy}). Main set: 20 min continuous at threshold (${zones.tempo}). Effort: 7/10, short sentences only. Cool-down 12 min easy.`,
    3: `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 8 min at half marathon pace (${zones.hmp}), 2 min easy jog between. Cool-down 12 min easy.`,
    4: `Warm-up 12 min easy (${zones.easy}). Main set: 20 min at threshold (${zones.tempo}). Shorter cutback week session. Cool-down 10 min easy.`,
    5: `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 10 min at half marathon pace (${zones.hmp}), 3 min easy jog between. Cool-down 12 min easy.`,
    6: `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 12 min at half marathon pace (${zones.hmp}), 3 min easy jog between. Cool-down 12 min easy.`,
    7: `Warm-up 12 min easy (${zones.easy}). Main set: 2 x 15 min at half marathon pace (${zones.hmp}), 3 min easy jog between. Cool-down 12 min easy.`,
    8: `Warm-up 12 min easy (${zones.easy}). Main set: 25 min continuous at half marathon pace (${zones.hmp}). Effort: 7/10. Cool-down 12 min easy.`,
    9: `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 10 min at half marathon pace (${zones.hmp}), 2 min easy jog between. Cool-down 12 min easy.`,
    10: `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 2 km at half marathon pace (${zones.hmp}), 2 min easy jog between. Cool-down 12 min easy.`,
    11: `Warm-up 12 min easy (${zones.easy}). Main set: 3 x 1.6 km at race pace (${zones.hmp}), 90 sec easy jog rest. Volume drops, sharpness stays. Cool-down 10 min easy.`,
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

function parseHiMins(str) {
  const match = str.match(/\((\d+) min/);
  return match ? parseInt(match[1]) : 0;
}

module.exports = { buildHalf };
