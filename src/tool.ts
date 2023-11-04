export const getValArrayFromItem = (items: any[], val: string) => {
  const res = [];
  items.map((item) => {
    res.push(item[val]);
  });
  return res;
};

export const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const findMinMissingNumber = (array: number[]) => {
  if (array.length == 0) return 0
  const set = new Set(array)
  const max = Math.max(...set)
  const min = Math.min(...set)

  if (min > 0) return 0
  if (max < 1) return 1

  for (let i = 1; i <= max; i++) {
    if (!set.has(i)) {
      return i
    }
  }

  return max + 1
}