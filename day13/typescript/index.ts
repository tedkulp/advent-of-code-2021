import { promises } from 'fs';
import { max } from 'lodash';

const DATA_FILE = './day13/data.txt';

type DotList = [number, number][];

const foldOver = (pos: number, fold: number) => {
  return fold - (pos - fold);
};

(async () => {
  const dataList = (await promises.readFile(DATA_FILE))
    .toString()
    .split('\n')
    .filter((n) => !!n);

  let dotList: DotList = dataList
    .filter((l) => l.includes(','))
    .map((l) => l.split(','))
    .map((pair) => {
      const x = parseInt(pair[0]);
      const y = parseInt(pair[1]);
      return [x, y];
    });

  const foldList = dataList
    .filter((l) => l.includes('fold along'))
    .map((l) => l.replace('fold along ', '').split('='));

  foldList.forEach(([axis, pos], idx) => {
    const itemsToAdd: DotList = [];
    const itemsToDelete: DotList = [];

    dotList.forEach(([x, y]) => {
      if (axis === 'y' && y > parseInt(pos)) {
        const newPos = foldOver(y, parseInt(pos));
        if (!dotList.find((ndot) => ndot[0] === x && ndot[1] === newPos)) {
          itemsToAdd.push([x, newPos]);
        }
        itemsToDelete.push([x, y]);
      } else if (axis === 'x' && x > parseInt(pos)) {
        const newPos = foldOver(x, parseInt(pos));
        if (!dotList.find((ndot) => ndot[0] === newPos && ndot[1] === y)) {
          itemsToAdd.push([newPos, y]);
        }
        itemsToDelete.push([x, y]);
      }
    });

    dotList = dotList.filter(
      (dot) =>
        !itemsToDelete.find((ndot) => ndot[0] === dot[0] && ndot[1] === dot[1]),
    );
    dotList = [...dotList, ...itemsToAdd];

    if (idx === 0) {
      console.log(`Answer #1: ${dotList.length}`);
    }
  });

  const [maxX, maxY] = [
    max(dotList.map((pos) => pos[0])) || 0,
    max(dotList.map((pos) => pos[1])) || 0,
  ];

  console.log('Answer #2:');
  for (let y = 0; y <= maxY; y++) {
    let line = '';
    for (let x = 0; x <= maxX; x++) {
      line =
        line +
        (dotList.find((dot) => dot[0] === x && dot[1] === y) ? '#' : ' ');
    }
    console.log(line);
  }
})();
