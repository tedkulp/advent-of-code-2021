import { promises } from 'fs';
import { reverse, sum } from 'lodash';

const DATA_FILE = './day10/data.txt';

(async () => {
  const dataList: string[] = (await promises.readFile(DATA_FILE))
    .toString()
    .split('\n')
    .filter((n) => !!n);

  const endMap: Record<string, string> = {
    '[': ']',
    '(': ')',
    '{': '}',
    '<': '>',
  };

  const startChars = Object.keys(endMap);

  const scoreMap: Record<string, number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };

  const scoreMap2: Record<string, number> = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };

  const incompleteScores: number[] = [];

  const part1 = dataList.map((line) => {
    const stack: string[] = [];
    let illegalChar = '';

    line.split('').forEach((char) => {
      if (illegalChar !== '') return;

      if (startChars.includes(char)) {
        stack.push(endMap[char]);
      } else {
        const pulled = stack.pop();
        if (pulled !== char) {
          illegalChar = char;
        }
      }
    });

    if (illegalChar === '') {
      const leftoverScore = reverse(stack).reduce((acc, char) => {
        return acc * 5 + scoreMap2[char];
      }, 0);

      incompleteScores.push(leftoverScore);
    }

    return scoreMap[illegalChar] || 0;
  });

  const median = (scores: number[]) => {
    const pos = (scores.length - 1) / 2;
    return scores.sort((a, b) => b - a)[pos];
  };

  console.log(`Answer #1: ${sum(part1)}`);
  console.log(`Answer #2: ${median(incompleteScores)}`);
})();
