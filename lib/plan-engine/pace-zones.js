const DISTANCE_KM = {
  c25k: 5,
  '10k': 10,
  half: 21.0975,
  marathon: 42.195,
};

function estimateT5k(answers) {
  const freq = answers.run_frequency;
  const vol = answers.weekly_volume;
  if (freq === 'none') return 38 * 60;
  if (!freq || !vol) return 30 * 60;
  if (freq === 'occasional') {
    if (vol === '0_10km') return 36 * 60;
    if (vol === '10_20km') return 33 * 60;
    if (vol === '20_30km') return 31 * 60;
    return 29 * 60;
  }
  if (freq === '1_2_per_week') {
    if (vol === '0_10km') return 33 * 60;
    if (vol === '10_20km') return 31 * 60;
    if (vol === '20_30km') return 29 * 60;
    return 27 * 60;
  }
  if (freq === '3_5_per_week' || freq === '3_plus_per_week') {
    if (vol === '0_10km') return 30 * 60;
    if (vol === '10_20km') return 28 * 60;
    if (vol === '20_30km') return 27 * 60;
    if (vol === '30_40km') return 25 * 60;
    if (vol === '40_60km') return 23 * 60;
    return 22 * 60;
  }
  if (freq === '6_plus_per_week') {
    if (vol === '20_30km') return 26 * 60;
    if (vol === '30_40km') return 24 * 60;
    if (vol === '40_60km') return 22 * 60;
    if (vol === '60_80km') return 20 * 60;
    return 23 * 60;
  }
  return 30 * 60;
}

function getT5k(answers) {
  if (answers.current_5k_seconds && answers.current_5k_seconds > 0) {
    return { t5k: answers.current_5k_seconds, estimated: false };
  }
  return { t5k: estimateT5k(answers), estimated: true };
}

function roundToFive(seconds) {
  return Math.round(seconds / 5) * 5;
}

function formatPace(secondsPerKm) {
  const rounded = roundToFive(secondsPerKm);
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatPaceRange(low, high) {
  return `${formatPace(low)} to ${formatPace(high)} /km`;
}

// Exact pace using floor seconds — matches runner expectation (1:22:30 half = 3:54/km not 3:55)
function formatExactPace(secondsPerKm) {
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.floor(secondsPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}/km`;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// When goal_type is 'time', the race-distance zone uses the direct goal pace (± 3 sec)
// and all other zones derive from a 5k-equivalent back-calculated via Riegel.
// Pass distance + goalRacePaceSeconds to activate this; omit for finish/c25k plans.
function calculatePaceZones(t5k, distance, goalRacePaceSeconds) {
  const p5k = t5k / 5;
  const gp = goalRacePaceSeconds || null;
  return [
    {
      name: 'Easy / Long Run',
      pace: formatPaceRange(p5k + 75, p5k + 90),
      description: 'Conversational, 4 to 5/10, full sentences',
    },
    {
      name: 'Marathon Pace',
      pace: (distance === 'marathon' && gp) ? formatExactPace(gp) : formatPaceRange(p5k + 45, p5k + 55),
      description: 'Comfortable, 6/10, can hold a conversation',
    },
    {
      name: 'Half Marathon Pace',
      pace: (distance === 'half' && gp) ? formatExactPace(gp) : formatPaceRange(p5k + 20, p5k + 28),
      description: 'Comfortably hard, 7/10, short sentences only',
    },
    {
      name: 'Tempo / Threshold',
      pace: formatPaceRange(p5k + 12, p5k + 20),
      description: 'Comfortably hard, 7/10, short sentences only',
    },
    {
      name: '10km Race Pace',
      pace: (distance === '10k' && gp) ? formatExactPace(gp) : formatPaceRange(p5k + 8, p5k + 12),
      description: 'Hard, 8/10, a few words only',
    },
    {
      name: 'VO2 Max Intervals',
      pace: formatPaceRange(Math.max(p5k - 5, p5k * 0.9), p5k + 3),
      description: '8.5 to 9/10, single words, controlled hard effort',
    },
    {
      name: 'Strides',
      pace: 'Fast but relaxed, 15 to 20 sec bursts',
      description: 'Not a sprint, focus on form and turnover',
    },
  ];
}

function getZoneStrings(t5k, distance, goalRacePaceSeconds) {
  const p5k = t5k / 5;
  const gp = goalRacePaceSeconds || null;
  return {
    easy: formatPaceRange(p5k + 75, p5k + 90),
    mp: (distance === 'marathon' && gp) ? formatExactPace(gp) : formatPaceRange(p5k + 45, p5k + 55),
    hmp: (distance === 'half' && gp) ? formatExactPace(gp) : formatPaceRange(p5k + 20, p5k + 28),
    tempo: formatPaceRange(p5k + 12, p5k + 20),
    race10k: (distance === '10k' && gp) ? formatExactPace(gp) : formatPaceRange(p5k + 8, p5k + 12),
    vo2: formatPaceRange(Math.max(p5k - 5, p5k * 0.9), p5k + 3),
  };
}

function riegelPredict(t5k, distanceKm) {
  return t5k * Math.pow(distanceKm / 5, 1.06);
}

// Inverse Riegel: back-calculate the 5k-equivalent from a goal time at a given distance.
function riegelBackcalcT5k(goalTimeSeconds, distanceKm) {
  return goalTimeSeconds / Math.pow(distanceKm / 5, 1.06);
}

function sanityCheck(t5k, goalTimeSeconds, distance) {
  if (!goalTimeSeconds || distance === 'c25k') return { adjustedGoal: null, note: null };
  const distKm = DISTANCE_KM[distance];
  const predicted = riegelPredict(t5k, distKm);
  const ratio = goalTimeSeconds / predicted;

  if (ratio < 0.88) {
    return {
      adjustedGoal: Math.round(predicted),
      note: `Based on your current fitness I've built this toward ${formatTime(Math.round(predicted))}. Nail this block and the next one gets faster.`,
    };
  }
  if (ratio < 0.95) {
    return {
      adjustedGoal: goalTimeSeconds,
      note: `Your goal is ambitious based on your current fitness. I've built the plan to it. The mid-plan tempo sessions will confirm whether the pacing is right.`,
    };
  }
  return { adjustedGoal: goalTimeSeconds, note: null };
}

function goalLabel(answers, adjustedGoal) {
  if (answers.distance === 'c25k') return 'Complete the programme';
  if (answers.goal_type === 'finish') return 'Finish strong';
  const secs = adjustedGoal || answers.goal_time_seconds;
  if (!secs) return 'Finish strong';
  return `Sub ${formatTime(secs)}`;
}

// ─── Volume-driven long-run progression ──────────────────────────────────────

const STARTING_LONG_RUN = {
  '0_10km':  4,
  '10_20km': 6,
  '20_30km': 8,
  '30_40km': 10,
  '40_60km': 13,
  '60_80km': 17,
};

function getStartingLongRun(weeklyVolume) {
  return STARTING_LONG_RUN[weeklyVolume] || 6;
}

// weekMeta: array (one entry per week) with optional flags:
//   { cutback?: true }   — deload week: long run −40%
//   { taper?: true, taperFactor?: 0.65 } — taper: fraction of peak
//   { raceWeek?: true }  — race week: returns null
// Returns an array of long-run km values (or null for race week).
function buildLongRunProgression(weeklyVolume, weekMeta) {
  const RATE = 1.11;
  let current = getStartingLongRun(weeklyVolume);
  let peak = current;
  let resumeFromPeak = false;

  return weekMeta.map((meta) => {
    if (meta.raceWeek) return null;
    if (meta.taper) return Math.round(peak * (meta.taperFactor || 0.65));

    if (resumeFromPeak) {
      current = peak * RATE;
      resumeFromPeak = false;
    }

    if (meta.cutback) {
      resumeFromPeak = true;
      return Math.max(Math.round(peak * 0.6), 3);
    }

    const km = Math.round(current);
    peak = km;
    current = km * RATE;
    return km;
  });
}

const DAY_ORDER = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 };

function sortSessions(sessions) {
  return [...sessions].sort((a, b) => (DAY_ORDER[a.day] ?? 7) - (DAY_ORDER[b.day] ?? 7));
}

function getDateRange(weekNumber, totalWeeks, raceDate) {
  if (!raceDate) return undefined;
  const race = new Date(raceDate);
  const weekStart = new Date(race);
  weekStart.setDate(race.getDate() - (totalWeeks - weekNumber) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  return `${fmt(weekStart)} to ${fmt(weekEnd)}`;
}

module.exports = {
  getT5k,
  calculatePaceZones,
  getZoneStrings,
  sanityCheck,
  formatTime,
  formatPace,
  formatPaceRange,
  formatExactPace,
  goalLabel,
  DISTANCE_KM,
  riegelPredict,
  riegelBackcalcT5k,
  getStartingLongRun,
  buildLongRunProgression,
  sortSessions,
  getDateRange,
};
