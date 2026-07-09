const { getT5k, calculatePaceZones, getZoneStrings, sanityCheck, goalLabel, formatTime, getDateRange, DISTANCE_KM, riegelBackcalcT5k } = require('./pace-zones');
const { getNutrition } = require('./nutrition');
const { getStrengthSection } = require('./strength');
const { buildC25k } = require('./templates/c25k');
const { buildTenK } = require('./templates/10k');
const { buildHalf } = require('./templates/half');
const { buildMarathon } = require('./templates/marathon');

const DISTANCE_LABELS = {
  c25k: 'Couch to 5km',
  '10k': '10km',
  half: 'Half Marathon 21.1km',
  marathon: 'Marathon 42.2km',
};

function getPlanWeeks(answers) {
  switch (answers.distance) {
    case 'c25k': return 6;
    case '10k': return 8;
    case 'half': return 12;
    case 'marathon': return answers.marathon_weeks === 12 ? 12 : 16;
    default: return 8;
  }
}

function getDefaultIntro(answers, meta, estimated) {
  const { firstName, distanceLabel, goalLabel: goal, daysPerWeek, weeks } = meta;
  const daysText = `${daysPerWeek} day${daysPerWeek === 1 ? '' : 's'} a week`;
  const weeksText = `${weeks} week${weeks === 1 ? '' : 's'}`;

  let intro = `${firstName}, here's your ${distanceLabel} plan. It's built around ${daysText} of running over ${weeksText}, with the goal: ${goal}.`;

  if (estimated) {
    intro += ` The paces below are estimated from your fitness profile. Run the Week 1 tempo session and adjust: if the talk test doesn't match the pace, trust the talk test.`;
  }

  if (meta.ambitiousGoalNote) {
    intro += ` ${meta.ambitiousGoalNote}`;
  }

  if (meta.raceDateNote) {
    intro += ` Note: ${meta.raceDateNote}`;
  }

  return intro;
}

function generatePlan(answers) {
  const { t5k, estimated } = getT5k(answers);
  const raceDate = answers.race_date || null;

  let adjustedGoalSeconds = answers.goal_time_seconds;
  let sanityNote = null;

  if (answers.goal_type === 'time' && answers.goal_time_seconds && answers.distance !== 'c25k') {
    const check = sanityCheck(t5k, answers.goal_time_seconds, answers.distance);
    if (check.adjustedGoal !== null) {
      adjustedGoalSeconds = check.adjustedGoal;
      sanityNote = check.note;
    }
  }

  // When goal_type is 'time', derive zones from a 5k-equivalent back-calculated from
  // the (possibly sanity-adjusted) goal. This makes race pace = goal_time / distance_km
  // and all other zones anchor correctly to the goal rather than the user's 5k fitness.
  let t5kForZones = t5k;
  let goalRacePaceSeconds = null;
  if (answers.goal_type === 'time' && adjustedGoalSeconds && answers.distance !== 'c25k') {
    const distKm = DISTANCE_KM[answers.distance];
    t5kForZones = riegelBackcalcT5k(adjustedGoalSeconds, distKm);
    goalRacePaceSeconds = adjustedGoalSeconds / distKm;
  }

  const paceZones = answers.distance !== 'c25k' ? calculatePaceZones(t5kForZones, answers.distance, goalRacePaceSeconds) : [];
  const zones = getZoneStrings(t5kForZones, answers.distance, goalRacePaceSeconds);
  const planWeeks = getPlanWeeks(answers);
  const daysPerWeek = answers.distance === 'c25k' ? 3 : (answers.days_per_week || 3);

  const effectiveAnswers = { ...answers, goal_time_seconds: adjustedGoalSeconds };

  const meta = {
    firstName: answers.first_name,
    distanceLabel: DISTANCE_LABELS[answers.distance],
    weeks: planWeeks,
    daysPerWeek,
    goalLabel: goalLabel(effectiveAnswers, adjustedGoalSeconds),
    currentBenchmark: estimated
      ? 'Estimated fitness (no 5km time provided)'
      : `5km: ${formatTime(t5k)}`,
    raceDate: raceDate || undefined,
    ambitiousGoalNote: sanityNote || undefined,
    estimatedPaces: estimated,
  };

  // Race date proximity edge case
  if (raceDate) {
    const today = new Date();
    const race = new Date(raceDate);
    const weeksUntilRace = Math.floor((race - today) / (7 * 24 * 60 * 60 * 1000));
    if (weeksUntilRace > 0 && weeksUntilRace < planWeeks) {
      meta.raceDateNote = `Your race is ${weeksUntilRace} week${weeksUntilRace === 1 ? '' : 's'} away. This plan needs ${planWeeks}. I've shown you the full plan starting from Week ${planWeeks - weeksUntilRace + 1}.`;
    }
  }

  let blocks;
  switch (answers.distance) {
    case 'c25k':
      blocks = buildC25k(effectiveAnswers, zones, raceDate);
      break;
    case '10k':
      blocks = buildTenK(effectiveAnswers, zones, raceDate);
      break;
    case 'half':
      blocks = buildHalf(effectiveAnswers, zones, raceDate);
      break;
    case 'marathon':
      blocks = buildMarathon(effectiveAnswers, zones, raceDate);
      break;
    default:
      throw new Error(`Unknown distance: ${answers.distance}`);
  }

  return {
    meta,
    paceZones,
    intro: getDefaultIntro(effectiveAnswers, meta, estimated),
    blocks,
    nutrition: getNutrition(answers.distance),
    strengthSection: getStrengthSection(answers),
  };
}

module.exports = { generatePlan };
