import { promises } from 'fs';
import { countBy, invert, max, min } from 'lodash';

const DATA_FILE = './day14/data.txt';

(async () => {
  const dataList = (await promises.readFile(DATA_FILE))
    .toString()
    .split('\n')
    .filter((n) => !!n);

  let polymer = dataList[0];
  const rules = dataList
    .filter((line) => line.includes('->'))
    .map((line) => line.split(' -> '));

  for (let x = 0; x < 40; x++) {
    const newString: string[] = [];
    for (let pairNum = 0; pairNum < polymer.length - 1; pairNum++) {
      const pair = polymer[pairNum] + polymer[pairNum + 1];
      const rule = rules.find((rule) => rule[0] === pair);
      if (rule) {
        newString.push([polymer[pairNum], rule[1]].join(''));
      } else {
        newString.push(pair[0]);
      }
    }
    newString.push(polymer[polymer.length - 1]);
    polymer = newString.join('');
    console.log(x + 1, polymer.length);
  }

  const counts =
    Object.keys(invert(countBy(polymer))).map((k) => parseInt(k)) || [];
  const part1 = (max(counts) || 0) - (min(counts) || 0);

  console.log(`Answer #1: ${part1}`);

  // console.log(dataList);
})();
