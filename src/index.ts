import type { AOCModule } from "./types";
import { promises } from "fs";

const main = async () => {
  const dirs = await promises.readdir("./dist", { withFileTypes: true });

  const dayNum = process.argv[2];

  if (dayNum && isNaN(parseInt(dayNum)))
    throw new Error("Argument is not a number");

  const days: AOCModule[] = await Promise.all(
    dirs
      .filter((d) =>
        d.isDirectory() && dayNum
          ? d.name === `day${dayNum}`
          : d.name.startsWith("day")
      )
      .map((d) => import(`./${d.name}/index.js`))
  );

  const responses = await Promise.all(days.map((d) => d.default()));

  for (const res of responses) {
    console.log(`Day #${res.level} part1: ${res.part1}, part2: ${res.part2}`);
  }
};

main();
