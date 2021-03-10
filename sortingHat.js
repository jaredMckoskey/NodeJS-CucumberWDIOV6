const glob = require("glob");
const fs = require("fs");

let index = 0;

runSortingHat();

function runSortingHat() {
  glob.sync("./test/Features/**/*.feature").map((file) => {
    index = 0;

    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/@[0-9][0-9][0-9]/g, "@000").replace(/ @test/g, "");

    let count = content.match(/@000/g);
    if (count !== null && count.length > 0) count.forEach(i => content = content.replace(i, getIndex()));

    fs.writeFileSync(file, content);
  });
}

function getIndex() {
  index++;
  if (index < 10) return `@00${index}`;
  else if (index < 100) return `@0${index}`;
  else return `@${index}`;
}
