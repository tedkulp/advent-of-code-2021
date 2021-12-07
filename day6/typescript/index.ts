import { promises } from 'fs';
import { clone, countBy, sum } from 'lodash';

const DATA_FILE = './day6/data.txt';
const NUM_DAYS_1 = 80;
const NUM_DAYS_2 = 256;

type fishCounts = {
  [daysUntilSplit: string]: number;
};

const calculateFish = (dataList: fishCounts, days: number) => {
  for (let dayNum = 0; dayNum < days; dayNum++) {
    // Move zeros to 7 and new offspring to 9
    const zeroCount = dataList['0'] || 0;
    dataList['7'] = (dataList['7'] || 0) + zeroCount;
    dataList['9'] = zeroCount;

    // Do the subtraction
    for (let i = 0; i < 10; i++) {
      dataList[i.toString()] = dataList[(i + 1).toString()] || 0;
    }
  }

  return sum(Object.values(dataList));
};

(async () => {
  const initialData: number[] = (await promises.readFile(DATA_FILE))
    .toString()
    .split(',')
    .filter((n) => !!n)
    .map((n) => parseInt(n, 10));

  const dataList: fishCounts = countBy(initialData);

  console.log(`Answer #1: ${calculateFish(clone(dataList), NUM_DAYS_1)}`);
  console.log(`Answer #2: ${calculateFish(clone(dataList), NUM_DAYS_2)}`);
})();
