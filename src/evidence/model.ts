import { Card, TagField, NextCardRatioField, NextCardMode } from "../types";
import Table from "./table";
import { getValArrayFromItem, randomNum } from "../tool";

export default class Model {
  constructor() { }

  test = async()=>{
    return await this.tbl.test()
  }

  findSonTags = async (tag_id: number): Promise<TagField[]> => {
    return await this.tbl.findTag(-1, "father_id=" + tag_id.toString());
  };

  getIdsFromItem = (items): number[] => {
    return getValArrayFromItem(items, "id");
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
  ): Promise<Card> => {
    let item;

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

    //    if (now_mode == NextCardMode.review) {
    item = await this.getMinDueItem(select_tags, is_select_tag_and, true, 1);
    console.log("next review");
    //   } else if (now_mode == NextCardMode.new) {
    //     item = await this.getNewItem(select_tags, is_select_tag_and, true, 1);
    //     console.log("next new");
    //   }
    //   if (!item) {
    //     item = await this.getRandomItem(select_tags, is_select_tag_and, true, 1);
    //     console.log("next random");
    //   }
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

  private tbl = new Table();
}
