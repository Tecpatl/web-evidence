import type { NextApiRequest, NextApiResponse } from "next";
import Evidence from "../../evidence";

const Evi = new Evidence();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const test = await Evi.test();
    res.json([test]);
  }
};
