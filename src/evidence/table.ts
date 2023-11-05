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
    const cards = await this.prisma.$queryRaw`SELECT * FROM card where id=5001`;
    return cards ? cards[0] : undefined;
  };

  findAllFsrsByCard = async (card_id: number): Promise<FsrsField[]> => {
    const query =
      "SELECT * FROM fsrs where card_id=" +
      card_id.toString() +
      " order by due asc";
    return await this.prisma.$queryRawUnsafe(query);
  };

  addMarkId = async (
    card_id: number,
    mark_id: number,
    due: number,
    info: string,
  ): Promise<void> => {
    await this.prisma.fsrs.create({
      data: {
        card_id,
        mark_id,
        due,
        info,
      },
    });
  };

  findsTagByCardId = async (card_id: number): Promise<TagField[]> => {
    const query =
      "SELECT * FROM tag " +
      " WHERE id IN ( SELECT tag_id FROM card_tag WHERE card_id = " +
      card_id +
      " )";
    return await this.prisma.$queryRawUnsafe(query);
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

  jumpMinDueFsrs = async (card_id: number): Promise<FsrsField[]> => {
    const query =
      "SELECT * FROM fsrs where card_id=" + card_id + " order by due asc";
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

  findCard = async (
    limit_num?: number,
    statement?: string,
    is_shuffle?: boolean,
  ): Promise<Card[]> => {
    let query = "SELECT * FROM card as c";
    if (statement && statement != "") {
      query += " where " + statement;
    }
    if (is_shuffle == true) {
      query += " order by random()%1000 ";
    }
    if (limit_num && limit_num != -1) {
      query += " LIMIT " + limit_num;
    }
    return await this.prisma.$queryRawUnsafe(query);
  };

  findCardWithTags = async (
    tag_ids: number[],
    is_and: boolean,
    limit_num: number,
    statement: string,
    is_shuffle: boolean,
  ): Promise<Card[]> => {
    if (tag_ids.length == 0) {
      return this.findCard(limit_num, statement, is_shuffle);
    }
    let tag_str = "";
    const cnt = tag_ids.length;
    tag_ids.forEach((val, key) => {
      if (tag_str != "") {
        tag_str += ",";
      }
      tag_str += val;
    });
    let query =
      "SELECT c.* FROM card " +
      " AS c JOIN card_tag " +
      " AS ct ON c.id = ct.card_id JOIN tag " +
      " AS t ON ct.tag_id = t.id WHERE t.id IN (" +
      tag_str +
      ") ";
    if (statement != "") {
      query += " AND " + statement;
    }
    query += " GROUP BY c.id ";
    if (is_and) {
      query += " HAVING COUNT(DISTINCT t.id) = " + cnt;
    }
    if (is_shuffle == true) {
      query += " order by random()%1000 ";
    }
    if (limit_num != -1) {
      query += " LIMIT " + limit_num;
    }
    return await this.prisma.$queryRawUnsafe(query);
  };

  private prisma = new PrismaClient();
}
