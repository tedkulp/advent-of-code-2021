import { promises } from 'fs';
import _ from 'lodash';

const getXY = (str: string): coord | false => {
  const parts = str.split(',').map((n) => parseInt(n, 10));
  return parts.length === 2 && [parts[0], parts[1]];
};

const getAllPoints = (from: coord, to: coord) => {
  if (from[0] === to[0]) {
    const end = from[1] < to[1] ? to[1] + 1 : to[1] - 1;
    return _.range(from[1], end).map((newNum) => [from[0], newNum]);
  } else if (from[1] === to[1]) {
    const end = from[0] < to[0] ? to[0] + 1 : to[0] - 1;
    return _.range(from[0], end).map((newNum) => [newNum, from[1]]);
  } else {
    const xEnd = from[0] < to[0] ? to[0] + 1 : to[0] - 1;
    const yEnd = from[1] < to[1] ? to[1] + 1 : to[1] - 1;
    return _.zip(_.range(from[0], xEnd), _.range(from[1], yEnd)) as number[][];
  }
};

type coord = [number, number];
type line = [coord, coord];

(async () => {
  const dataList = (await promises.readFile('./day5/data.txt'))
    .toString()
    .split('\n')
    .filter((n) => !!n)
    .map((line) => line.split(' '))
    .map((line) => [getXY(line[0]), getXY(line[2])] as line);

  let usedPoints = _.flatten(
    dataList
      .filter(
        (thisLine) =>
          thisLine[0][0] === thisLine[1][0] ||
          thisLine[0][1] === thisLine[1][1],
      )
      .map((thisLine) => getAllPoints(thisLine[0], thisLine[1])),
  );

  let pointCounts = _.countBy(usedPoints);
  console.log(
    `Answer #1: ${Object.values(pointCounts).filter((i) => i > 1).length}`,
  );

  usedPoints = _.flatten(
    dataList
      .map((thisLine) => getAllPoints(thisLine[0], thisLine[1]))
      .filter((x) => !!x),
  );

  pointCounts = _.countBy(usedPoints);
  console.log(
    `Answer #2: ${Object.values(pointCounts).filter((i) => i > 1).length}`,
  );
})();
