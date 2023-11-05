import {
  Card,
  TagField,
  NextCardRatioField,
  NextCardMode,
  FsrsField,
  NextCardField,
} from "../types";
import Table from "./table";
import { getValArrayFromItem, randomNum } from "../tool";
import { FSRS as _FSRS_, Params as _Params_, Card as _Card_ } from "./fsrs";

export default class Model {
  constructor(param?: _Params_) {
    this.parameter_ = param ? param : new _Params_();
  }

  test = async () => {
    return await this.tbl.test();
  };

  findSonTags = async (tag_id: number): Promise<TagField[]> => {
    return await this.tbl.findTag(-1, "father_id=" + tag_id.toString());
  };

  getIdsFromItem = (items): number[] => {
    return getValArrayFromItem(items, "id");
  };

  findAllFsrsByCard = async (card_id: number): Promise<FsrsField[]> => {
    return await this.tbl.findAllFsrsByCard(card_id);
  };

  findsTagByCardId = async (card_id: number): Promise<TagField[]> => {
    return await this.tbl.findsTagByCardId(card_id);
  };

  findTagByIds = async (tag_ids: number[]): Promise<TagField[]> => {
    let tag_str = "";
    let cnt = tag_ids.length;
    tag_ids.forEach((val, key) => {
      if (tag_str != "") {
        tag_str = tag_str + ",";
      }
      tag_str = tag_str + val;
    });
    return await this.tbl.findTag(-1, "id in (" + tag_str + ")");
  };

  findTagByWeight = async (select_tags: number[]): Promise<number> => {
    let now_tag = -1;
    let now_select_tags = select_tags;
    let num = select_tags.length;
    if (num == 0) {
      throw "findTagByWeight empty";
    } else if (num == 1) {
      now_tag = now_select_tags[0];
    } else {
      let tag_items = await this.findTagByIds(now_select_tags);
      let sum = 0;
      let w_map = new Map();
      if (!tag_items || tag_items.length == 0) {
        throw "findTagByWeight findTagByIds nil";
      }
      tag_items.map((v) => {
        w_map.set(v.id, [sum + 1, sum + v.weight]);
        sum = sum + v.weight;
      });

      let rand = randomNum(1, sum);

      for (let i = 0; i < tag_items.length; i++) {
        const v = tag_items[i];
        if (w_map.get(v.id)[0] <= rand && w_map.get(v.id)[1] >= rand) {
          now_tag = v.id;
          console.log(v.name);
          break;
        }
      }
    }
    if (now_tag == -1) {
      throw "findTagByWeight now_tag = -1";
    }
    let son_items = await this.findSonTags(now_tag);
    if (!son_items || son_items.length == 0) {
      return now_tag;
    } else {
      return await this.findTagByWeight(this.getIdsFromItem(son_items));
    }
  };

  calcNextList = async (
    select_tags: number[],
    is_select_tag_and: boolean,
    next_card_ratio: NextCardRatioField[],
  ): Promise<NextCardField> => {
    let items;

    let now_mode = NextCardMode.rand;
    let sum = 0;
    let w_map = new Map();

    next_card_ratio.map((v) => {
      w_map.set(v.id, [sum + 1, sum + v.value]);
      sum = sum + v.value;
    });

    let rand = randomNum(1, sum);

    for (let i = 0; i < next_card_ratio.length; i++) {
      const v = next_card_ratio[i];
      if (w_map.get(v.id)[0] <= rand && w_map.get(v.id)[1] >= rand) {
        now_mode = v.id;
        console.log(v.name);
        break;
      }
    }

    if (now_mode == NextCardMode.review) {
      items = await this.getMinDueItem(select_tags, is_select_tag_and, true, 1);
      console.log("next review");
    } else if (now_mode == NextCardMode.new) {
      items = await this.getNewItem(select_tags, is_select_tag_and, true, 1);
      console.log("next new");
    }
    if (!items) {
      items = await this.getRandomItem(select_tags, is_select_tag_and, true, 1);
      console.log("next random");
    }
    let card;
    if (items && items.length > 0) {
      card = items[0];
    }
    return { card, next_card_mode: now_mode };
  };

  getRandomItem = async (
    tag_ids: number[],
    is_and: boolean,
    contain_son: boolean,
    limit_num: number,
  ): Promise<Card[]> => {
    if (contain_son == true && is_and == false) {
      tag_ids = await this.findAllSonTags(tag_ids);
    }
    const item = this.tbl.findCardWithTags(
      tag_ids,
      is_and,
      limit_num,
      "",
      true,
    );
    return item;
  };

  getNewItem = async (
    tag_ids: number[],
    is_and: boolean,
    contain_son: boolean,
    limit_num?: number,
  ): Promise<Card[]> => {
    if (contain_son == true && is_and == false) {
      tag_ids = await this.findAllSonTags(tag_ids);
    }
    const item = await this.tbl.findCardWithTags(
      tag_ids,
      is_and,
      limit_num,
      "c.id in (select c2.id from card as c2 join fsrs on fsrs.card_id=c2.id where fsrs.info like '%reps=0%')",
      true,
    );
    return item;
  };

  getMinDueItem = async (
    tag_ids: number[],
    is_and: boolean,
    contain_son: boolean,
    limit_num?: number,
  ): Promise<Card[]> => {
    if (contain_son == true && is_and == false) {
      tag_ids = await this.findAllSonTags(tag_ids);
    }
    if (!limit_num) {
      limit_num = -1;
    }
    return this.tbl.minDueCardWithTags(tag_ids, is_and, limit_num);
  };

  findAllSonTags = async (
    tag_ids: number[],
    is_exclude?: boolean,
  ): Promise<number[]> => {
    if (!is_exclude) {
      is_exclude = false;
    }
    let tag_set = new Set(tag_ids);
    let res = new Set<number>();
    let q = [];
    let now_tag_id = -1;
    q.push(now_tag_id);
    while (q.length != 0) {
      now_tag_id = q[0];
      q.shift();
      let son_tags = await this.findSonTags(now_tag_id);
      son_tags.forEach((son_tag) => {
        q.push(son_tag.id);
        let is_need = tag_set.has(son_tag.id) || tag_set.has(son_tag.father_id);
        if (is_need) {
          tag_set.add(son_tag.id);
        }
        if (is_exclude) {
          is_need = !is_need;
        }
        if (is_need) {
          res.add(son_tag.id);
        }
      });
    }
    return Array.from(res);
  };

  getFsrs = () => {
    return new _FSRS_(this.parameter_);
  };

  findCardById = async (card_id: number): Promise<Card | undefined> => {
    const item = await this.tbl.findCard(1, "id=" + card_id);
    if (item && item.length > 0) {
      return item[0];
    }
  };

  jumpMinDueFsrs = async (card_id: number): Promise<FsrsField[]> => {
    return await this.tbl.jumpMinDueFsrs(card_id);
  };

  scoreCard = async (card_id, mark_id, rating): Promise<void> => {
    const fsrs_items = await this.tbl.findFsrsByCardMark(card_id, mark_id);
    if (!fsrs_items || fsrs_items.length == 0) {
      throw "ratingCard mark not exist";
    }
    const fsrs_item = fsrs_items[0];

    const fsrs = this.getFsrs();

    const now_time = new Date().getTime();

    const data = JSON.parse(fsrs_item.info);
    data.due *= 1000; // adapt lua timestamp

    const new_card = fsrs.repeats(
      new _Card_(data as _Card_),
      new Date(now_time),
    )[rating].card;

    const due = new_card.due;
    const info = new_card.getFullInfoStr();

    await this.tbl.editFsrs(card_id, mark_id, {
      due: Math.round(due.getTime() / 1000), // adapt lua timestamp
      info,
    });
    //todo:
    // this.tbl.insertRecordCard(id, tblInfo.AccessWay.score);
  };

  fuzzyFindCard = async (content: string, lim?: number): Promise<Card[]> => {
    const limit = lim ? lim : 10;
    let item;
    if (content != "") {
      item = await this.tbl.findCard(limit, "content like '%" + content + "%'");
    } else {
      item = await this.tbl.findCard(limit);
    }
    return item;
  };

  addMarkId = async (card_id: number, mark_id: number): Promise<void> => {
    const card = new _Card_();
    const info = card.getFullInfoStr();
    await this.tbl.addMarkId(
      card_id,
      mark_id,
      Math.round(card.due.getTime() / 1000),
      info,
    );
  };

  editCardContent = async (card_id: number, content: string): Promise<void> => {
    this.tbl.editCard(card_id, { content });
  };

  private tbl = new Table();
  private parameter_: _Params_;
}
