// Mostly taken from https://github.com/sk1talets/advent-of-code/blob/main/2021/12/script.js
// I had no idea how to do this.  TIL and all that...

import { promises } from 'fs';

const DATA_FILE = './day12/data.txt';
const VISITED_TWICE = 'VISITED_TWICE';
enum Keys {
  VISITED_TWICE,
  START,
  END,
}

type TreasureMap = Record<string, string[]>;
type FoundPath = Record<string, number>;

const isSmallCave = (str: string) => {
  return str === str.toLowerCase();
};

const findPaths = (
  dataList: TreasureMap,
  part2 = false,
  start = 'start',
  end = 'end',
  paths: FoundPath[] = [],
  curPath: FoundPath = {},
) => {
  curPath[start] = curPath[start] + 1 || 1;

  if (isSmallCave(start) && curPath[start] === 2) {
    curPath[VISITED_TWICE] = 1;
  }

  if (start === end) {
    paths.push(curPath);
    return;
  }

  if (!dataList[start]) {
    return;
  }

  for (const x of dataList[start]) {
    if (isSmallCave(x) && x in curPath) {
      if (!part2 || ['start', 'end'].includes(x) || curPath[VISITED_TWICE]) {
        continue;
      }
    }
    findPaths(dataList, part2, x, end, paths, { ...curPath });
  }

  return paths;
};

(async () => {
  const dataList: TreasureMap = {};

  (await promises.readFile(DATA_FILE))
    .toString()
    .split('\n')
    .filter((n) => !!n)
    .forEach((line) => {
      const [x, y] = line.split('-');
      dataList[x] ? dataList[x].push(y) : (dataList[x] = [y]);
      dataList[y] ? dataList[y].push(x) : (dataList[y] = [x]);
    });

  const part1 = findPaths(dataList) || [];
  console.log(`Answer #1: ${part1.length}`);

  const part2 = findPaths(dataList, true) || [];
  console.log(`Answer #2: ${part2.length}`);
})();
