import { promises } from 'fs';

const DATA_FILE = './day6/test.txt';
const NUM_DAYS_1 = 80;
const NUM_DAYS_2 = 256;

const calculateFish = (dataList: number[], days: number) => {
  for (let day = 0; day < days; day++) {
    dataList = dataList.map((n) => n - 1);
    if (day + 1 >= days) break;

    const zeroCount = dataList.filter((n) => n === 0).length;
    dataList = dataList.filter((n) => n !== 0);
    if (zeroCount > 0) {
      dataList = [
        ...dataList,
        ...new Array<number>(zeroCount).fill(7),
        ...new Array<number>(zeroCount).fill(9),
      ];
    }
  }

  return dataList.length;
};

(async () => {
  const dataList: number[] = (await promises.readFile(DATA_FILE))
    .toString()
    .split(',')
    .filter((n) => !!n)
    .map((n) => parseInt(n, 10));

  console.log(`Answer #1: ${calculateFish(dataList, NUM_DAYS_1)}`);
  console.log(`Answer #2: ${calculateFish(dataList, NUM_DAYS_2)}`);
})();
