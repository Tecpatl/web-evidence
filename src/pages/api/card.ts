import type { NextApiRequest, NextApiResponse } from "next";
import {
  Card,
  CardMethod,
  NextCardMode,
  NextCardRatioParam,
  ScoreCardParam,
  NextCardField,
} from "../../types";
import Evidence from "../../evidence";

const Evi = new Evidence();

//const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const next_card = await Evi.findNextCard();
    // const card = await Evi.test();
    let fsrs_item;
    if (next_card && next_card.card && next_card.card.id) {
      fsrs_item = await Evi.jumpMinDueFsrs(next_card.card.id);
    }
    // res.json({ card, fsrs_item: { mark_id: 1 }, is_ok: card ? true : false });
    res.json({
      next_card,
      fsrs_item,
      is_ok: next_card && next_card.card ? true : false,
    });
  } else if (req.method === "POST") {
    const data = JSON.parse(req.body);
    switch (data.type as CardMethod) {
      case CardMethod.setNextCardRatio: {
        if (!data.ratioParam) {
          res.json({ is_ok: false });
          return;
        }
        data.ratioParam.forEach((param: NextCardRatioParam) => {
          Evi.setNextCardRatio(param.id, param.value);
        });
        res.json({ is_ok: true });
        return;
      }
      case CardMethod.addMarkId: {
        if (!data.card_id || !data.mark_id || !data.content) {
          res.json({ is_ok: false });
          return;
        }
        await Evi.addMarkId(data.card_id, data.mark_id, data.content);
        res.json({ is_ok: true });
        return;
      }
      case CardMethod.infoCard: {
        if (!data.card_id) {
          res.json({ is_ok: false });
          return;
        }
        const info = await Evi.getInfoCard(data.card_id);
        res.json({ info, is_ok: true });
        return;
      }
      case CardMethod.findCardById: {
        // const card = await Evi.test();
        const card = await Evi.findCardById(data.card_id);
        let fsrs_item;
        if (card && card.id) {
          fsrs_item = await Evi.jumpMinDueFsrs(card.id);
        }
        res.json({ card, fsrs_item, is_ok: true });
        // res.json({
        //   card,
        //   fsrs_item: { mark_id: 1 },
        //   is_ok: card ? true : false,
        // });
        return;
      }
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
