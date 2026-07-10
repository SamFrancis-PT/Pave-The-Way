const { getDateRange } = require('../pace-zones');

const TOTAL_WEEKS = 6;

function makeSession(day, weekNumber, sessionNumber, mainSet) {
  return {
    day,
    type: 'EASY',
    title: `Week ${weekNumber}, Session ${sessionNumber}`,
    detail: `Warm-up walk 5 min. Main set: ${mainSet}. Conversational effort throughout. If you can't hold a full conversation, slow down. Cool-down walk 5 min.`,
  };
}

function makeChallengeSession(day, weekNumber, mainSet, challengeNote) {
  return {
    day,
    type: 'CHALLENGE',
    title: `Week ${weekNumber}, Session 3 — Challenge`,
    detail: `Warm-up walk 5 min. Main set: ${mainSet}. ${challengeNote} Cool-down walk 5 min.`,
  };
}

function buildC25k(answers, _zones, raceDate) {
  const weeks = [
    {
      weekNumber: 1,
      label: 'FOUNDATION',
      dateRange: getDateRange(1, TOTAL_WEEKS, raceDate),
      sessions: [
        makeSession('Monday', 1, 1, '10 x (1 min run / 1.5 min walk)'),
        makeSession('Wednesday', 1, 2, '10 x (1 min run / 1.5 min walk)'),
        makeChallengeSession(
          'Saturday', 1,
          '5 x (2 min run / 1.5 min walk)',
          'Push for 2 minutes each block instead of 1. If a block feels too easy, that\'s the point — you\'re building the habit, not the limit.'
        ),
      ],
      coachNote: `The goal this week is simply to start. Session 3 steps up to 2-minute blocks — a small challenge to see what\'s possible. The walk intervals are part of the training, not a failure.`,
    },
    {
      weekNumber: 2,
      label: 'FOUNDATION',
      dateRange: getDateRange(2, TOTAL_WEEKS, raceDate),
      sessions: [
        makeSession('Monday', 2, 1, '8 x (2 min run / 1.5 min walk)'),
        makeSession('Wednesday', 2, 2, '8 x (2 min run / 1.5 min walk)'),
        makeChallengeSession(
          'Saturday', 2,
          '3 x (4 min run / 2 min walk)',
          'Four minutes continuous — double what you started with. Keep it conversational. If you need to take an extra 30 sec walk between, do it.'
        ),
      ],
      coachNote: `Longer run blocks this week. Session 3 pushes to 4-minute continuous runs. Same rule applies: if you can\'t talk, slow down. There\'s no pace requirement here.`,
    },
    {
      weekNumber: 3,
      label: 'BUILD',
      dateRange: getDateRange(3, TOTAL_WEEKS, raceDate),
      sessions: [
        makeSession('Monday', 3, 1, '6 x (3 min run / 1.5 min walk)'),
        makeSession('Wednesday', 3, 2, '6 x (3 min run / 1.5 min walk)'),
        makeChallengeSession(
          'Saturday', 3,
          '2 x (8 min run / 2 min walk)',
          'Eight minutes continuous. Your longest run yet. Slow down if you need to — the goal is to keep moving, not to stop.'
        ),
      ],
      coachNote: `Three minutes in S1 and S2, eight minutes in S3. That\'s the challenge. Your body is adapting faster than you think.`,
    },
    {
      weekNumber: 4,
      label: 'BUILD',
      dateRange: getDateRange(4, TOTAL_WEEKS, raceDate),
      sessions: [
        makeSession('Monday', 4, 1, '4 x (5 min run / 2 min walk)'),
        makeSession('Wednesday', 4, 2, '4 x (5 min run / 2 min walk)'),
        makeChallengeSession(
          'Saturday', 4,
          '2 x (10 min run / 2 min walk)',
          'Ten minutes continuous — twice. You\'re running more than you\'re walking now. Steady pace, relaxed arms, and just keep moving.'
        ),
      ],
      coachNote: `Five-minute blocks in S1 and S2, ten-minute blocks in S3. The walk breaks in S3 are deliberate recovery, not a sign of weakness.`,
    },
    {
      weekNumber: 5,
      label: 'PUSH',
      dateRange: getDateRange(5, TOTAL_WEEKS, raceDate),
      sessions: [
        {
          day: 'Monday',
          type: 'EASY',
          title: 'Week 5, Session 1',
          detail: `Warm-up walk 5 min. Main set: 3 x (8 min run / 2 min walk). Conversational effort. Cool-down walk 5 min.`,
        },
        {
          day: 'Wednesday',
          type: 'EASY',
          title: 'Week 5, Session 2',
          detail: `Warm-up walk 5 min. Main set: 3 x (8 min run / 2 min walk). Same as Monday. Focus on relaxed shoulders and easy breathing. Cool-down walk 5 min.`,
        },
        makeChallengeSession(
          'Saturday', 5,
          '20 min continuous run',
          'No walk breaks this time. Find a slow, comfortable pace and hold it for 20 minutes. This is the breakthrough session. You\'ve earned it.'
        ),
      ],
      coachNote: `S1 and S2 are 8-minute blocks. S3 is 20 minutes continuous — your first time running without stopping. Go slow, breathe easy, keep moving.`,
    },
    {
      weekNumber: 6,
      label: 'GRADUATE',
      dateRange: getDateRange(6, TOTAL_WEEKS, raceDate),
      sessions: [
        {
          day: 'Monday',
          type: 'EASY',
          title: 'Graduate Session 1',
          detail: `Warm-up walk 5 min. Main set: 15 min continuous run, 3 min walk, 10 min run. Conversational effort throughout. Cool-down walk 5 min.`,
        },
        {
          day: 'Wednesday',
          type: 'EASY',
          title: 'Graduate Session 2',
          detail: `Warm-up walk 5 min. Main set: 20 min continuous run. Easy, conversational effort the whole way. Cool-down walk 5 min.`,
        },
        {
          day: 'Saturday',
          type: 'RACE DAY',
          title: 'Graduation Run — Challenge',
          detail: `Warm-up walk 5 min. Main set: 30 min continuous run, or turn up to a Parkrun or 5km event and finish it. This is your graduation. There is no pace requirement. There is only finish. Cool-down walk 5 min.`,
        },
      ],
      coachNote: `Saturday is your graduation run. Six weeks ago you started a programme. This Saturday you finish one. Cross the line.`,
    },
  ];

  return [
    {
      name: 'FOUNDATION',
      weekRange: 'Weeks 1 to 2',
      purpose: `Building the habit and the first aerobic base. Sessions 1 and 2 are short run/walk intervals. Session 3 each week is a challenge — pushing for longer continuous running to test what\'s possible.`,
      weeks: weeks.filter((w) => w.weekNumber <= 2),
    },
    {
      name: 'BUILD',
      weekRange: 'Weeks 3 to 4',
      purpose: `Longer running intervals. Sessions 1 and 2 keep building the baseline. Session 3 pushes further — 8-minute and 10-minute continuous blocks.`,
      weeks: weeks.filter((w) => w.weekNumber === 3 || w.weekNumber === 4),
    },
    {
      name: 'PUSH',
      weekRange: 'Week 5',
      purpose: `Extended running blocks in S1 and S2. Session 3 is the breakthrough: 20 minutes continuous with no walk breaks.`,
      weeks: weeks.filter((w) => w.weekNumber === 5),
    },
    {
      name: 'GRADUATE',
      weekRange: 'Week 6',
      purpose: `You finish this week as a runner. Session 3 is your graduation run — 30 minutes or a Parkrun.`,
      weeks: weeks.filter((w) => w.weekNumber === 6),
    },
  ];
}

module.exports = { buildC25k };
