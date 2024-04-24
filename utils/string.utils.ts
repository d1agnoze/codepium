const extractWords = (str: string) => {
  return str
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .filter((x) => x);
};

const makeSearchQuery = (words: string[]) =>
  words.map((x) => `${x}`).join("+");


export {extractWords, makeSearchQuery}
