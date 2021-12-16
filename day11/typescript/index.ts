import { promises } from 'fs';
import { every, flatten, get } from 'lodash';

const DATA_FILE = './day11/data.txt';

type Grid = number[][];
type Pos = { x: number; y: number };

const increaseAll = (data: Grid) => {
  return data.map((line) => {
    return line.map((char) => {
      return (char += 1);
    });
  });
};

const findFlashes = (data: Grid) => {
  const flashPos: Pos[] = [];
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] > 9) {
        flashPos.push({ x, y });
      }
    }
  }
  return flashPos;
};

const allFlashed = (data: Grid) => {
  return every(flatten(data), (num) => num === 0);
};

const increaseOne = (data: Grid, x: number, y: number) => {
  if (get(data, `${y}.${x}`, -1) > 0) {
    data[y][x] += 1;
  }
  return data;
};

const pop = (data: Grid, flashes: Pos[]) => {
  for (let i = 0; i < flashes.length; i++) {
    const [x, y] = [flashes[i].x, flashes[i].y];

    // Reet the flasher
    data[y][x] = 0;

    // Increase the surrounding ones (but not the flasher)
    for (let newx = x - 1; newx <= x + 1; newx++) {
      for (let newy = y - 1; newy <= y + 1; newy++) {
        if (!(newx === x && newy === y)) {
          data = increaseOne(data, newx, newy);
        }
      }
    }
  }

  return data;
};

(async () => {
  let dataList: Grid = (await promises.readFile(DATA_FILE))
    .toString()
    .split('\n')
    .filter((n) => !!n)
    .map((line) => line.split('').map((char) => parseInt(char)));

  let flashCount = 0;
  let allFlashStep = -1;
  let stepNum = 0;

  while (allFlashStep === -1 || stepNum < 100) {
    dataList = increaseAll(dataList);

    let flashes: Pos[] = [];
    do {
      flashes = findFlashes(dataList);
      if (stepNum < 100) {
        flashCount = flashCount + flashes.length;
      }
      dataList = pop(dataList, flashes);
    } while (flashes.length > 0);

    if (allFlashed(dataList) && allFlashStep === -1) {
      allFlashStep = stepNum;
    }

    stepNum++;
  }

  console.log(`Answer #1: ${flashCount}`);
  console.log(`Answer #2: ${allFlashStep + 1}`);
})();
