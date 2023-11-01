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
