import { promises } from 'fs';
import { cloneDeep, invert, max, min } from 'lodash';

const DATA_FILE = './day14/data.txt';

(async () => {
  const dataList = (await promises.readFile(DATA_FILE))
    .toString()
    .split('\n')
    .filter((n) => !!n);

  const polymer = dataList[0];
  const rules = dataList
    .filter((line) => line.includes('->'))
    .map((line) => line.split(' -> '));
  const initialPairs: Record<string, number> = {};

  for (let pairNum = 0; pairNum < polymer.length - 1; pairNum++) {
    const pair = polymer[pairNum] + polymer[pairNum + 1];
    initialPairs[pair] ? (initialPairs[pair] += 1) : (initialPairs[pair] = 1);
  }

  const increaseCount = (
    pairs: Record<string, number>,
    pair: string,
    amount = 1,
  ) => {
    pairs[pair] ? (pairs[pair] += amount) : (pairs[pair] = amount);
    return pairs;
  };

  const calculatePairs = (pairs: Record<string, number>, times = 10) => {
    for (let x = 0; x < times; x++) {
      let newPairs = cloneDeep(pairs);
      Object.keys(pairs).forEach((pair) => {
        const curCount = pairs[pair];
        if (curCount > 0) {
          const rule = rules.find((rule) => rule[0] === pair);
          if (rule) {
            const [pair1, pair2] = [
              [pair[0], rule[1]].join(''),
              [rule[1], pair[1]].join(''),
            ];
            newPairs = increaseCount(newPairs, pair1, curCount);
            newPairs = increaseCount(newPairs, pair2, curCount);
            newPairs = increaseCount(newPairs, pair, -curCount);
          }
        }
      });
      pairs = newPairs;
    }

    return pairs;
  };

  const getTotals = (pairs: Record<string, number>) => {
    let totals: Record<string, number> = {};
    Object.keys(pairs).forEach((pair) => {
      const curCount = pairs[pair];
      totals = increaseCount(totals, pair[0], curCount);
    });
    totals = increaseCount(totals, polymer[polymer.length - 1]);
    return totals;
  };

  const getAnswer = (pairs: Record<string, number>) => {
    const counts = Object.keys(invert(pairs)).map((k) => parseInt(k)) || [];
    return (max(counts) || 0) - (min(counts) || 0);
  };

  const totals1 = getTotals(calculatePairs(initialPairs, 10));
  const totals2 = getTotals(calculatePairs(initialPairs, 40));

  console.log(`Answer #1: ${getAnswer(totals1)}`);
  console.log(`Answer #2: ${getAnswer(totals2)}`);
})();
