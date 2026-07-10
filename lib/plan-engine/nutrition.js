const NUTRITION = {
  c25k: [
    {
      heading: 'Fuel the effort',
      body: `Don't run fasted. A banana or a piece of toast 60 to 90 minutes before is plenty. Post-run, get some protein in within a couple of hours. It doesn't need to be complicated.`,
    },
    {
      heading: 'Protein anchor',
      body: `Aim for a palm-sized serve of protein at each meal. You don't need supplements or tracking apps to start. Just make sure protein is on the plate every time you eat.`,
    },
    {
      heading: 'Hydration basics',
      body: `Drink to thirst during the day. Your urine should be pale yellow. Carry water if it's warm. You don't need sports drinks for sessions under 45 minutes.`,
    },
    {
      heading: 'Sleep is the free supplement',
      body: `Seven to nine hours is where adaptation actually happens. Your fitness will improve faster if your sleep is dialled in than if your nutrition is perfect.`,
    },
  ],
  '10k': [
    {
      heading: 'Fuel the effort',
      body: `Don't run fasted on quality days (VO2 and tempo). A banana or toast 60 to 90 minutes out works for most people. Easy runs are fine fasted if that's your preference.`,
    },
    {
      heading: 'Protein anchor',
      body: `Aim for a palm-sized serve of protein at each meal. If you want a number, 1.6 to 2 g per kg of bodyweight per day covers recovery. You don't need protein shakes if you're eating whole food.`,
    },
    {
      heading: 'Post-run recovery',
      body: `Get protein in within a couple of hours after long runs and quality sessions. Carbs alongside it are fine and help replenish muscle glycogen.`,
    },
    {
      heading: 'Hydration',
      body: `Drink to thirst during the day. Carry water on runs over 45 minutes if it's warm. You don't need gels or sports drinks for 10km training.`,
    },
    {
      heading: 'Sleep is the free supplement',
      body: `Seven to nine hours is where adaptation actually happens. No supplement replaces it.`,
    },
  ],
  half: [
    {
      heading: 'Fuel the effort',
      body: `Don't run quality sessions fasted. From Week 5, practise your pre-race breakfast on long runs: carb-focused, low fibre, 2 to 3 hours before. Find what your stomach handles and stick with it. Nothing new on race day.`,
    },
    {
      heading: 'Fuelling on long runs',
      body: `Take a gel or some carbs on any long run over 90 minutes. Aim for 30 to 45 g of carbs per hour. Your gut is trainable, so practise early rather than learning a hard lesson on race day.`,
    },
    {
      heading: 'Protein anchor',
      body: `Palm-sized protein at each meal, or 1.6 to 2 g per kg per day. Prioritise real food. Your post-long-run recovery meal matters more than any other.`,
    },
    {
      heading: 'Hydration',
      body: `Drink to thirst. On long runs over an hour, carry fluid or plan a water source. In warm conditions, add a pinch of salt and electrolytes.`,
    },
    {
      heading: 'Sleep is the free supplement',
      body: `Seven to nine hours. Adaptation happens in recovery, not during the session.`,
    },
  ],
  marathon: [
    {
      heading: 'Daily fuelling',
      body: `Carbs fuel long-distance running. Don't fear them. Fuel the day around the run, not the run around the day. Protein at each meal (palm-sized). Sleep seven to nine hours. These three things are your foundation.`,
    },
    {
      heading: 'In-race fuelling: practise from BUILD onwards',
      body: `Aim for 60 to 90 g of carbs per hour during long runs and the race itself. Your gut is trainable: start practising on every long run now. Use gels, chews, or real food you've already tested. Nothing new on race day.`,
    },
    {
      heading: 'Pre-long-run breakfast',
      body: `Find your tried-and-tested breakfast: carb-focused, low fibre, 2 to 3 hours before the run. Most people do well with oats, toast with honey, or a bagel. Test it every week until it's automatic.`,
    },
    {
      heading: 'Carb loading: 48 hours before race day',
      body: `Target 8 to 10 g of carbs per kg of bodyweight per day for 48 hours pre-race. Drop fibre, eat familiar foods, and don't stuff yourself the night before. Add a little extra salt in the final 24 hours to help fluid retention.`,
    },
    {
      heading: 'Race morning',
      body: `Your tried-and-tested breakfast, 3 hours before the gun. Take a gel 15 minutes before the start. Stick to the plan you've rehearsed.`,
    },
    {
      heading: 'Hydration',
      body: `Drink to thirst on long runs. In the race: drink at every station, don't wait until you're thirsty. In warm conditions, electrolytes matter more than extra water volume.`,
    },
  ],
};

function getNutrition(distance) {
  return NUTRITION[distance] || NUTRITION['10k'];
}

module.exports = { getNutrition };
