import { promises } from "fs";

(async () => {
  const dataList = (await promises.readFile("../data.txt"))
    .toString()
    .split("\n")
    .map((line) => parseInt(line));

  const answerAList = dataList
    .map((i, idx) => {
      if (idx > 0) {
        if (dataList[idx] > dataList[idx - 1]) {
          return i;
        }
      }
      return -1;
    })
    .filter((i) => i > -1);

  console.log("#1 Answer", answerAList.length);

  const rollingSumList = dataList
    .map((_, idx) => {
      if (idx < dataList.length - 2) {
        return dataList[idx] + dataList[idx + 1] + dataList[idx + 2];
      }
      return -1;
    })
    .filter((i) => i > -1);

  const answerBList = rollingSumList
    .map((i, idx) => {
      if (idx > 0) {
        if (rollingSumList[idx] > rollingSumList[idx - 1]) {
          return i;
        }
      }
    })
    .filter((i) => i);

  console.log("#2 Answer", answerBList.length);
})();
