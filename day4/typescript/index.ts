import { promises } from 'fs';
import { chunk, cloneDeep, zip } from 'lodash';

class Board {
  boardPos: boolean[][];

  numbers: number[][];

  constructor(numbers: number[][]) {
    this.numbers = numbers;
    this.boardPos = [
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ];
  }

  markNumber(num: number) {
    this.numbers.forEach((row, idx) => {
      row.forEach((col, idx2) => {
        if (col === num) {
          this.boardPos[idx][idx2] = true;
        }
      });
    });
  }

  checkForWinner(): boolean {
    return (
      zip(...this.boardPos).some((row) => row.every((col) => col)) ||
      this.boardPos.some((row) => row.every((col) => col))
    );
  }

  getUncountedSum(): number {
    let sum = 0;
    this.boardPos.forEach((row, idx) => {
      row.forEach((col, idx2) => {
        if (!col) {
          sum += this.numbers[idx][idx2];
        }
      });
    });

    return sum;
  }
}

(async () => {
  let boards: Board[] = [];

  const dataList = (await promises.readFile('./day4/data.txt'))
    .toString()
    .split('\n')
    .filter((n) => !!n);

  const numbersToPick = dataList[0].split(',').map((n) => parseInt(n, 10));
  const bingoCards = chunk(dataList.slice(1), 5).map((e) =>
    e.map((f) =>
      f
        .trim()
        .split(/ +/)
        .map((i) => parseInt(i, 10)),
    ),
  );

  boards = bingoCards.map((b) => new Board(b));

  const firstBoard = {
    board: new Board([]),
    idx: 0,
    num: -1,
  };

  const lastBoard = {
    board: new Board([]),
    idx: 0,
    num: -1,
  };

  for (let otherIdx = 0; otherIdx < numbersToPick.length; otherIdx++) {
    const num = numbersToPick[otherIdx];
    for (let boardIdx = 0; boardIdx < boards.length; boardIdx++) {
      const board = boards[boardIdx];
      board.markNumber(num);
      if (board.checkForWinner()) {
        if (firstBoard.num === -1) {
          firstBoard.board = cloneDeep(board);
          firstBoard.idx = otherIdx;
          firstBoard.num = num;
        } else {
          lastBoard.board = cloneDeep(board);
          lastBoard.idx = otherIdx;
          lastBoard.num = num;
        }
        boards = boards.filter((_, idx) => idx !== boardIdx);
      }
    }
  }

  if (firstBoard.num > -1) {
    const sum = firstBoard.board.getUncountedSum();
    console.log(`Answer #1: ${sum * firstBoard.num}`);
  }

  if (lastBoard.num > -1) {
    const sum = lastBoard.board.getUncountedSum();
    console.log(`Answer #2: ${sum * lastBoard.num}`);
  }
})();
