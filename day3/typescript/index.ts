import { promises } from "fs";

const BIT_LENGTH = 12;

class BitStats {
  public oneCount = 0;
  public zeroCount = 0;

  getMostUsed() {
    return this.oneCount >= this.zeroCount ? 1 : 0;
  }

  getLeastUsed() {
    return this.oneCount < this.zeroCount ? 1 : 0;
  }
}

function getRating<T extends number>(list: T[], mostUsed = true) {
  for (let i = BIT_LENGTH - 1; i >= 0; i--) {
    if (list.length === 1) continue;

    const stats = new BitStats();

    list.forEach((line) => {
      (line & (1 << i)) > 0 ? stats.oneCount++ : stats.zeroCount++;
    });

    const mask = 1 << i;
    const compareBit = mostUsed ? stats.getMostUsed() : stats.getLeastUsed();

    list = list.filter((line) => {
      return compareBit === 1 ? (line & mask) > 0 : (line & mask) === 0;
    });
  }

  return list[0];
}

(async () => {
  let bitStats: BitStats[] = [];

  const dataList = (await promises.readFile("./day3/data.txt"))
    .toString()
    .split("\n")
    .map((line) => parseInt(line, 2));

  for (let i = 0; i < BIT_LENGTH; i++) {
    if (!bitStats[i]) bitStats[i] = new BitStats();

    dataList.forEach((line) => {
      (line & (1 << i)) > 0 ? bitStats[i].oneCount++ : bitStats[i].zeroCount++;
    });
  }

  const [gamma, epsilon] = bitStats.reduce(
    (prev, cur, idx) => [
      prev[0] | (cur.getMostUsed() << idx),
      prev[1] | (cur.getLeastUsed() << idx),
    ],
    [0, 0],
  );

  console.log(`Answer #1: ${gamma * epsilon}`);

  let oxyRating = getRating(dataList, true);
  let co2Rating = getRating(dataList, false);

  console.log(`Answer #2: ${oxyRating * co2Rating}`);
})();
