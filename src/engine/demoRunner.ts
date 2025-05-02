/**
 * DeepCAL Decision Engine Demonstration - Now With 100% More Science & Dad Jokes!
 * 
 * This utility showcases the Neutrosophic-Grey AHP-TOPSIS decision engine
 * with clear explanations, scientific rigor, and just enough humor to
 * make linear algebra fun (or at least tolerable).
 */

import { decisionCore, evaluateForwarders, generatePairwiseMatrix } from './decisionCore';
import { CriteriaType } from './types';

/**
 * Runs a sample evaluation with enhanced scientific output
 */
export function runSampleEvaluation() {
  console.log('%c🧪 DeepCAL Decision Engine - Scientific Mode Activated', 
    'font-size:16px; color: #4fc3f7; font-weight:bold');
  console.log('%c=====================================================', 
    'color: #4fc3f7');
  console.log('%cWarning: Contains advanced math and questionable humor', 
    'font-style:italic; color: #ff7043');

  // Sample data - now with more science!
  const forwarders = [
    { name: 'DHL', cost: 2800, time: 5, reliability: 0.92, service: 0.88, green: 0.75 },
    { name: 'Kuehne+Nagel', cost: 2650, time: 6, reliability: 0.95, service: 0.90, green: 0.80 },
    { name: 'DB Schenker', cost: 2400, time: 7, reliability: 0.88, service: 0.85, green: 0.78 },
    { name: 'Maersk', cost: 2200, time: 9, reliability: 0.90, service: 0.82, green: 0.85 },
    { name: 'DSV', cost: 2500, time: 6, reliability: 0.91, service: 0.87, green: 0.76 }
  ];

  // Define criteria weights
  const criteriaWeights = {
    cost: 0.25, time: 0.20, reliability: 0.30, service: 0.15, green: 0.10
  };

  // Scientific Explanation Section
  console.log('\n%c🔬 SCIENTIFIC METHODOLOGY', 'color: #4fc3f7; font-weight:bold');
  console.log(`
Our Neutrosophic-Grey AHP-TOPSIS engine works in ${3} phases:
` +
    `1. %cAHP Weighting%c: Determines how much we care about each factor (using math so fancy it has imaginary numbers)
` +
    `2. %cGrey Normalization%c: Handles uncertainty like a weather forecaster with a PhD
` +
    `3. %cTOPSIS Ranking%c: Finds the option that's Goldilocks-approved (not too close, not too far)
`,
    'color: #ba68c8', '', 'color: #4dd0e1', '', 'color: #aed581', '');

  // Humorous aside
  console.log('%c\n📊 Initial Data (Before We Math It Up)', 'font-weight:bold');
  console.table(forwarders.map(f => ({
    'Freight Forwarder': f.name,
    '💰 Cost': `$${f.cost}`,
    '⏱ Time': `${f.time} days`,
    '🎯 Reliability': `${(f.reliability * 100).toFixed(0)}%`,
    '🌟 Service': f.service.toFixed(2),
    '🌿 Green Score': f.green.toFixed(2),
    '😄 Mood': ['Optimistic', 'Confident', 'Meh', 'Hopeful', 'Pragmatic'][Math.floor(Math.random() * 5)]
  })));

  console.log('%c\n⚖️ Criteria Weights (Our Biases, Formalized)', 'font-weight:bold');
  console.table(Object.entries(criteriaWeights).map(([name, weight]) => ({
    'Factor': name.toUpperCase(),
    'Weight': weight.toFixed(2),
    'Science Term': {
      cost: 'Negative Utility Function',
      time: 'Temporal Cost Coefficient',
      reliability: 'Stochastic Confidence Index',
      service: 'Service Quality Metric',
      green: 'Environmental Impact Quotient'
    }[name],
    'How Much We Care': ['Meh', 'Kinda', 'Seriously', 'A Lot', 'Obsessively'][Math.floor(weight * 5)]
  })));

  // Run the analysis with scientific commentary
  console.log('%c\n🔧 ENGINE WORKINGS', 'color: #4fc3f7; font-weight:bold');
  console.log('%cPhase 1: AHP Weight Calculation', 'font-weight:bold');
  console.log('Calculating how much each factor matters... (using eigen-whats-its and vectors)');
  
  const pairwiseMatrix = generatePairwiseMatrix(criteriaWeights);
  console.log('%cPairwise Comparison Matrix:', 'font-weight:bold');
  console.table(pairwiseMatrix.map((row, i) => {
    const obj: any = {};
    Object.keys(criteriaWeights).forEach((key, j) => {
      obj[Object.keys(criteriaWeights)[j]] = row[j].toFixed(2);
    });
    obj['Factor'] = Object.keys(criteriaWeights)[i];
    return obj;
  }));

  console.log('\n%cConsistency Check:', 'font-weight:bold');
  const isConsistent = checkNCR(pairwiseMatrix);
  console.log(isConsistent 
    ? '✅ Matrix is consistent (our preferences make sense)' 
    : '⚠️ Matrix is inconsistent (our preferences are drunk)');

  console.log('%c\nPhase 2: Grey Normalization', 'font-weight:bold');
  console.log('Handling uncertainty like a boss... (50 shades of grey, but for math)');

  console.log('%c\nPhase 3: TOPSIS Ranking', 'font-weight:bold');
  console.log('Finding the Goldilocks zone... (not too close, not too far)');

  const result = decisionCore.logic({
    decisionMatrix: forwarders.map(f => [f.cost, f.time, f.reliability, f.service, f.green]),
    pairwiseMatrix,
    criteriaTypes: ['cost', 'cost', 'benefit', 'benefit', 'benefit'],
    alternativeNames: forwarders.map(f => f.name)
  });

  // Results with scientific flair
  console.log('%c\n🏆 FINAL RESULTS (Drumroll please...)', 'color: #4fc3f7; font-weight:bold');
  console.log(`%c🥇 Winner: ${result.topAlternative.name} ` +
    `(Score: ${(result.topAlternative.score * 100).toFixed(1)}%)`,
    'font-size:14px; font-weight:bold');
  
  console.log('%c\nScore Breakdown:', 'font-weight:bold');
  console.table(forwarders.map((f, i) => ({
    'Rank': result.allScores
      .map((s, idx) => ({ s, idx }))
      .sort((a, b) => b.s - a.s)
      .findIndex(item => item.idx === i) + 1,
    'Forwarder': f.name,
    'Total Score': (result.allScores[i] * 100).toFixed(1) + '%',
    'TOPSIS': (result.rawTopsisScores[i] * 100).toFixed(1) + '%',
    'Grey': (result.greyGrades[i] * 100).toFixed(1) + '%',
    'Verdict': [
      'Basically perfect',
      'Pretty darn good',
      'Not bad, not great',
      'Could be worse',
      'Did they even try?'
    ][i]
  })).sort((a, b) => a.Rank - b.Rank));

  // Voice explanation with humor
  console.log('%c\n🎙️ AI VOICE EXPLANATION', 'color: #4fc3f7; font-weight:bold');
  const voiceLine = decisionCore.voiceLine(result)
    .replace('optimal choice', 'mathematically superior option')
    + ' This conclusion was reached after careful consideration of multiple dimensions of logistics excellence.'
    + ' Or as we say in the biz: it checks out.';
  console.log(`%c"${voiceLine}"`, 'font-style:italic');

  // Fun fact
  console.log('%c\n💡 FUN FACT', 'color: #4fc3f7; font-weight:bold');
  console.log('This analysis used approximately ' + 
    Math.floor(result.executionTime / 10) + 
    ' billion neurons (give or take) and ' + 
    (pairwiseMatrix.length ** 2) + 
    ' complex calculations. That\'s like ' + 
    Math.floor(result.executionTime / 100) + 
    ' cups of coffee worth of thinking!');

  return result;
}

// Bonus: Add some geeky console art when loaded
console.log('%c' +
  ' _____  _____ _____ _____ _____ _____    _____ _____ _____ _____ \n' +
  '|  __ \|  ___|  ___|  ___|  ___|  __ \  |  ___|  ___|  ___|  ___|\n' +
  '| |  \/| |__ | |__ | |__ | |__ | |  \/  | |__ | |__ | |__ | |__ \n' +
  '| | __ |  __||  __||  __||  __|| | __   |  __||  __||  __||  __|\n' +
  '| |_\ \| |___| |___| |___| |___| |_\ \  | |___| |___| |___| |___\n' +
  ' \____/\____/\____/\____/\____/ \____/  \____/\____/\____/\____/\n' +
  '                                                               \n', 
  'color: #4fc3f7');
console.log('%cDeepCAL Scientific Engine v2.71828', 'color: #4dd0e1; font-weight:bold');

export default { runSampleEvaluation };
