import { promises } from 'fs';
import { max, min, range, sum } from 'lodash';

const DATA_FILE = './day7/data.txt';

(async () => {
  const dataList: number[] = (await promises.readFile(DATA_FILE))
    .toString()
    .split(',')
    .filter((n) => !!n)
    .map((n) => parseInt(n, 10));

  const minPos = min(dataList) || 0;
  const maxPos = max(dataList) || 0;

  const fuelUsageOne = range(minPos + 1, maxPos + 1).map((pos) => {
    return sum(
      dataList.map((startPos) => {
        return Math.abs(startPos - pos);
      }),
    );
  });

  const fuelUsageTwo = range(minPos + 1, maxPos + 1).map((pos) => {
    return sum(
      dataList.map((startPos) => {
        const posRange = Math.abs(startPos - pos);
        return (posRange / 2) * (1 + posRange);
      }),
    );
  });

  console.log(`Answer #1: ${min(fuelUsageOne) || -1}`);
  console.log(`Answer #2: ${min(fuelUsageTwo) || -1}`);
})();
