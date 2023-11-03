import type { NextApiRequest, NextApiResponse } from "next";
import { Card, CardMethod, ScoreCardParam } from "../../types";
import Evidence from "../../evidence";

const Evi = new Evidence();

//const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const card = await Evi.nextCard();
    // const card = await Evi.test();
    // console.log(card)
    res.json({ card, is_ok: card ? true : false });
  } else if (req.method === "POST") {
    const data = JSON.parse(req.body);
    switch (data.type as CardMethod) {
      case CardMethod.search: {
        const cards = await Evi.searchCard(data.keyword);
        res.json({ cards, is_ok: true });
        return;
      }
      case CardMethod.score: {
        const param = data.param as ScoreCardParam;
        const card_id = param.card_id;
        const mark_id = param.mark_id;
        const rating = param.rating;
        // console.log("oyjy")
        // console.log(param)
        await Evi.scoreCard(card_id, mark_id, rating);
        res.json({ is_ok: true });
        return;
      }
    }
    res.json({ is_ok: false });
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
