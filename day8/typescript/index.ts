import { promises } from 'fs';
import { flatten, sum } from 'lodash';

const DATA_FILE = './day8/data.txt';

// const MAPPING: string[] = [
//   'abcefg',
//   'cf',
//   'acdeg',
//   'acdfg',
//   'bcdf',
//   'abdfg',
//   'abdefg',
//   'acf',
//   'abcdefg',
//   'abcdfg',
// ];

type entry = {
  signalPatterns: string[];
  outputValues: string[];
  mapping: string[];
};

const sortString = (str: string) => {
  return str.split('').sort().join('');
};

(async () => {
  const dataList: entry[] = (await promises.readFile(DATA_FILE))
    .toString()
    .split('\n')
    .filter((n) => !!n)
    .map((n) => {
      const [signalPatterns, outputValues] = n.split(' | ');
      return {
        signalPatterns: signalPatterns.split(' '),
        outputValues: outputValues.split(' '),
        mapping: [],
      };
    });

  const part1 = flatten(
    dataList.map((thisEntry) => {
      return thisEntry.outputValues.filter(
        (v) =>
          v.length === 2 || v.length === 3 || v.length === 4 || v.length === 7,
      );
    }),
  );

  console.log(`Answer #1: ${part1.length}`);

  const knownMappings = { 2: 1, 4: 4, 3: 7, 7: 8 };

  const part2 = dataList.map((thisEntry) => {
    for (let i = 0; i < thisEntry.signalPatterns.length; i++) {
      const patt = sortString(thisEntry.signalPatterns[i]);
      if (
        patt.length === 2 ||
        patt.length === 3 ||
        patt.length === 4 ||
        patt.length === 7
      ) {
        thisEntry.mapping[knownMappings[patt.length]] = patt;
      }
    }

    for (let i = 0; i < thisEntry.signalPatterns.length; i++) {
      const patt = sortString(thisEntry.signalPatterns[i]);
      if (patt.length === 6) {
        // 6, 9, 0
        if (
          patt
            .split('')
            .filter((e) => thisEntry.mapping[1].split('').includes(e))
            .length === 1
        ) {
          thisEntry.mapping[6] = patt;
        } else if (
          patt
            .split('')
            .filter((e) => thisEntry.mapping[4].split('').includes(e))
            .length === 4
        ) {
          thisEntry.mapping[9] = patt;
        } else {
          thisEntry.mapping[0] = patt;
        }
      }
    }

    for (let i = 0; i < thisEntry.signalPatterns.length; i++) {
      const patt = sortString(thisEntry.signalPatterns[i]);
      if (patt.length === 5) {
        //3, 2, 5
        if (
          patt
            .split('')
            .filter((e) => thisEntry.mapping[1].split('').includes(e))
            .length === 2
        ) {
          thisEntry.mapping[3] = patt;
        } else if (
          patt.split('').filter((e) =>
            thisEntry.mapping[8]
              .split('')
              .filter((f) => !thisEntry.mapping[9].split('').includes(f))
              .includes(e),
          ).length === 1
        ) {
          thisEntry.mapping[2] = patt;
        } else {
          thisEntry.mapping[5] = patt;
        }
      }
    }

    return parseInt(
      thisEntry.outputValues
        .map((val) => {
          return thisEntry.mapping.indexOf(val.split('').sort().join(''));
        })
        .join(''),
    );
  });

  console.log(`Answer #2: ${sum(flatten(part2))}`);
})();
