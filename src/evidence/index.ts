import Model from "./model";
import { Card, TagField, NextCardRatioField, NextCardMode } from "../types";

export default class Evidence {
  constructor() {
    this.next_card_ratio = [
      {
        id: NextCardMode.review,
        name: "Review",
        value: 50,
      },
      {
        id: NextCardMode.new,
        name: "New",
        value: 40,
      },
      {
        id: NextCardMode.rand,
        name: "Rand",
        value: 10,
      },
    ];
  }

  test = async () => {
    return await this.model.test()
  }

  nextCard = async (): Promise<Card | undefined> => {
    //todo user select tag
    let now_select_tags = [];
    let items;
    if (true) {
      let son_items = await this.model.findSonTags(-1);
      now_select_tags = this.model.getIdsFromItem(son_items);
    }

    const now_select_tag = await this.model.findTagByWeight(now_select_tags);

    //auto
    //todo mode
    items = await this.model.calcNextList(
      [now_select_tag],
      false,
      this.next_card_ratio,
    );

    if (items && items.length > 0) {
      return items[0];
    }
  };

  private next_card_ratio: NextCardRatioField[];
  private model = new Model();
}
