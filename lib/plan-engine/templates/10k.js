const { getDateRange, sortSessions } = require('../pace-zones');

const TOTAL_WEEKS = 8;

const WEEK_DATA = [
  { wk: 1, block: 'FOUNDATION', vo2: 'ladder 1-2-3-2-1 min (9 min hard)', tempo: '2 x 8 min threshold', longKm: 6 },
  { wk: 2, block: 'FOUNDATION', vo2: '2-2-3-3-2 min (12 min hard)', tempo: '20 min continuous threshold', longKm: 7 },
  { wk: 3, block: 'FOUNDATION', vo2: '2-3-4-3-2 min (14 min hard)', tempo: null, longKm: 8, raceReps: true },
  { wk: 4, block: 'BUILD', vo2: '5 x 3 min (15 min hard)', tempo: '25 min threshold with 3 x 30 sec surges', longKm: 9, cutback: true },
  { wk: 5, block: 'BUILD', vo2: '3-4-4-3 min (14 min hard)', tempo: null, longKm: 10, racePaceReps: '2 x 2 km' },
  { wk: 6, block: 'BUILD', vo2: 'pyramid 1-2-3-4-3-2-1 min (16 min hard)', tempo: null, longKm: 11, racePaceReps: '4 km continuous' },
  { wk: 7, block: 'SHARPEN', vo2: '6 x 2 min (12 min hard)', tempo: null, longKm: 8, racePaceReps: '2 x 1.5 km', taper: true },
  { wk: 8, block: 'RACE', isRaceWeek: true },
];

const COACH_NOTES = {
  1: `First week. Everything should feel manageable. Good. You're building a base, not proving anything.`,
  2: `The 20 min continuous threshold is a proper challenge. Warm up thoroughly and settle in. Short sentences only during the main set.`,
  3: `Race pace reps for the first time. They should feel controlled-hard, not desperate. If you need more rest, take it.`,
  4: `Cutback week. The long run is intentionally shorter. This is where adaptation happens. Don't add extra sessions.`,
  5: `Two-kilometre race pace reps. You should finish each one feeling like you had more in you. The 3 min rest is deliberate.`,
  6: `Biggest volume week. The 11km long and pyramid VO2 session are the peak of this plan. Complete this week and you're ready.`,
  7: `Sharpening week. Volume drops, quality stays sharp. Legs should feel good by Sunday.`,
  8: `Race week. Trust the training.`,
};

function buildTenK(answers, zones, raceDate) {
  const days = answers.days_per_week || 3;

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

    sessions.push({
      day: 'Wednesday',
      type: 'VO2 MAX',
      title: `VO2 Max Intervals`,
      detail: buildVo2Detail(data.vo2, zones),
      hiMinutes: parseHiMinutes(data.vo2),
    });

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

    sessions.push({
      day: 'Sunday',
      type: 'LONG RUN',
      title: `Long Run ${data.longKm}km${data.cutback ? ' (Cutback)' : ''}`,
      detail: data.cutback
        ? `${data.longKm} km easy (${zones.easy}). Cutback week. Comfortable and controlled the whole way.`
        : `${data.longKm} km at easy pace (${zones.easy}). Conversational effort. The final 2 to 3 km can include 4 x 20 sec strides if your legs feel good.`,
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

    return {
      weekNumber: data.wk,
      label: data.taper ? 'SHARPEN' : data.block,
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

function buildVo2Detail(vo2Str, zones) {
  return `Warm-up 12 min easy (${zones.easy}). Main set: ${vo2Str} at VO2 pace (${zones.vo2}). All rest is easy jog, never standing. Cool-down 10 min easy.`;
}

function buildTempoDetail(tempoStr, zones) {
  if (!tempoStr) return '';
  if (tempoStr.includes('continuous')) {
    return `Warm-up 12 min easy (${zones.easy}). Main set: ${tempoStr} at threshold pace (${zones.tempo}). Effort: 7/10, short sentences only. Cool-down 12 min easy.`;
  }
  return `Warm-up 12 min easy (${zones.easy}). Main set: ${tempoStr} at threshold pace (${zones.tempo}), 3 min easy jog between reps. Cool-down 12 min easy.`;
}

function buildRacePaceDetail(racePaceStr, zones) {
  if (racePaceStr.includes('continuous')) {
    return `Warm-up 12 min easy (${zones.easy}). Main set: ${racePaceStr} at 10km race pace (${zones.race10k}). This is your race dress rehearsal. Cool-down 12 min easy.`;
  }
  return `Warm-up 12 min easy (${zones.easy}). Main set: ${racePaceStr} at 10km race pace (${zones.race10k}), 2 to 3 min easy jog rest between. Finish feeling like you had more in you. Cool-down 12 min easy.`;
}

function parseHiMinutes(vo2Str) {
  const match = vo2Str.match(/\((\d+) min/);
  return match ? parseInt(match[1]) : 0;
}

module.exports = { buildTenK };
