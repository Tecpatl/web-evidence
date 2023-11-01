import type { NextApiRequest, NextApiResponse } from "next";
import { Card, CardMethod } from "../../types";
import Evidence from "../../evidence";

const Evi = new Evidence();

//const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const card = await Evi.nextCard();
    res.json({ card, is_ok: card ? true : false });
  } else if (req.method === "POST") {
    const data = JSON.parse(req.body)
    switch (data.type as CardMethod) {
      case CardMethod.score: {

    // res.json({ status: 234 });
        break
      }
    }
  }
  //} else if (req.method === "PUT") {
  //  // update todo
  //  const id = req.query.todoId as string;
  //  const data = JSON.parse(req.body);
  //  const todo = await prisma.todo.update({
  //    where: { id },
  //    data,
  //  });

  //  res.json(todo);
  //} else if (req.method === "DELETE") {
  //  // delete todo
  //  const id = req.query.todoId as string;
  //  await prisma.todo.delete({ where: { id } });

  //  res.json({ status: "ok" });
  //}
};
