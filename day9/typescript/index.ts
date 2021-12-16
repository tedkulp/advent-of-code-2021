import { promises } from 'fs';
import { sum } from 'lodash';

const DATA_FILE = './day9/data.txt';

(async () => {
  const dataList: number[][] = (await promises.readFile(DATA_FILE))
    .toString()
    .split('\n')
    .filter((n) => !!n)
    .map((n) => n.split(''))
    .map((n) => n.map((n2) => parseInt(n2)));

  const lowSpots: number[] = [];

  const getPos = (x: number, y: number) => {
    if (x > -1 && y > -1 && y < dataList.length && x < dataList[y].length) {
      return dataList[y][x];
    }

    return 10;
  };

  for (let y = 0; y < dataList.length; y++) {
    for (let x = 0; x < dataList[y].length; x++) {
      const cur = getPos(x, y);
      const up = getPos(x, y - 1);
      const down = getPos(x, y + 1);
      const left = getPos(x - 1, y);
      const right = getPos(x + 1, y);

      if (cur < up && cur < down && cur < left && cur < right) {
        lowSpots.push(cur + 1);
      }
    }
  }

  console.log(`Answer #1: ${sum(lowSpots)}`);
})();
