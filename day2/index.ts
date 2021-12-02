import { promises } from "fs";

(async () => {
  const dataList: [string, number][] = (await promises.readFile("./data.txt"))
    .toString()
    .split("\n")
    .map((line) => {
      const [dir, dist] = line.split(' ');
      return [dir, parseInt(dist)];
    });

  let hpos = 0;
  let dpos = 0;

  dataList.forEach(([dir, dist], idx) => {
    switch(dir) {
      case "forward":
        hpos += dist;
        break;
      case "up":
        dpos -= dist;
        break;
      case "down":
        dpos += dist;
        break;
    }
  });

  console.log("Answer #1:", hpos * dpos);

  let aim = 0;
  hpos = 0;
  dpos = 0;

  dataList.forEach(([dir, dist], idx) => {
    switch(dir) {
      case "forward":
        hpos += dist;
        dpos += aim * dist;
        break;
      case "up":
        aim -= dist;
        break;
      case "down":
        aim += dist;
        break;
    }
  });

  console.log("Answer #2:", hpos * dpos);

})();
