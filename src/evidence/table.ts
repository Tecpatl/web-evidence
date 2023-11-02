import { PrismaClient } from "@prisma/client";
import {
  Card,
  TagField,
  NextCardRatioField,
  NextCardMode,
  FsrsField,
} from "../types";

export default class Table {
  constructor() { }
  test = async () => {
    const cards = await this.prisma
      .$queryRaw`SELECT * FROM card where id=4273`;
    const fsrs = await this.prisma
      .$queryRaw`SELECT * FROM fsrs where card_id=4273`;
    console.log(fsrs)
    return cards ? cards[0] : undefined
  };

  findFsrsByCardMark = async (
    card_id: number,
    mark_id: number,
  ): Promise<FsrsField[]> => {
    const query =
      "SELECT * FROM fsrs where card_id=" + card_id + " and mark_id=" + mark_id;
    return await this.prisma.$queryRawUnsafe(query);
  };

  findTag = async (
    limit_num?: number,
    statement?: string,
  ): Promise<TagField[]> => {
    let query = "SELECT * FROM tag";
    if (statement) {
      query = query + " where " + statement;
    }
    query = query + " ORDER BY timestamp DESC ";
    if (limit_num && limit_num != -1) {
      query = query + " LIMIT " + limit_num;
    }
    return await this.prisma.$queryRawUnsafe(query);
  };

  minDueCardWithTags = async (
    tag_ids: number[],
    is_and: boolean,
    limit_num: number,
  ): Promise<Card[]> => {
    let query = "";
    if (tag_ids.length == 0) {
      query =
        `
    select card.* from card
    join fsrs on fsrs.card_id=card.id
    where
    fsrs.info NOT LIKE '%reps=0%'
    ORDER BY fsrs.due ASC LIMIT ` + limit_num.toString();
    } else {
      let tag_str = "";
      let cnt = tag_ids.length;

      tag_ids.map((val, key) => {
        if (tag_str != "") {
          tag_str = tag_str + ",";
        }
        tag_str = tag_str + val;
      });

      let is_and_str = "";
      if (is_and) {
        is_and_str = " HAVING COUNT(DISTINCT t.id) = " + cnt.toString();
      }
      query =
        `
    select card.* from card
    join fsrs on fsrs.card_id=card.id
    where
    fsrs.card_id in
      (
      SELECT c.id FROM card AS c JOIN card_tag AS ct ON c.id = ct.card_id JOIN tag AS t ON ct.tag_id = t.id
      WHERE t.id IN (` +
        tag_str +
        `)  GROUP BY c.id  ` +
        is_and_str +
        `
      )
    and
    fsrs.info NOT LIKE '%reps=0%'
    ORDER BY fsrs.due ASC LIMIT ` +
        limit_num.toString();
    }
    return await this.prisma.$queryRawUnsafe(query);
  };

  editFsrs = async (
    card_id: number,
    mark_id: number,
    row: Partial<FsrsField>,
  ) => {
    return await this.prisma.fsrs.updateMany({
      where: { card_id, mark_id },
      data: row,
    });
  };

  editCard = async (card_id: number, row: Partial<Card>) => {
    //todo insertRecordCard
    row["id"] = undefined;
    return await this.prisma.card.update({
      where: { id: card_id },
      data: row,
    });
  };

  private prisma = new PrismaClient();
}
