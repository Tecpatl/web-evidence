import Model from "./model";
import {
  Card,
  TagField,
  NextCardRatioField,
  NextCardMode,
  FsrsField,
  InfoCardField,
  NextCardField,
} from "../types";

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

  setNextCardRatio = (id: NextCardMode, value: number) => {
    this.next_card_ratio = this.next_card_ratio.map(item => {
      if (item.id == id) {
        item.value = value
      }
      return item
    })
  };

  test = async () => {
    return await this.model.test();
  };

  addMarkId = async (card_id: number, mark_id: number, content: string) => {
    await this.model.addMarkId(card_id, mark_id);
    await this.model.editCardContent(card_id, content);
  };

  getInfoCard = async (card_id: number): Promise<InfoCardField> => {
    const fsrs_items = await this.model.findAllFsrsByCard(card_id);
    const tags = await this.model.findsTagByCardId(card_id);
    return { fsrs_items, tags };
  };

  scoreCard = async (card_id, mark_id, rating): Promise<void> => {
    return await this.model.scoreCard(card_id, mark_id, rating);
  };

  jumpMinDueFsrs = async (card_id: number): Promise<FsrsField | undefined> => {
    const fsrs_items = await this.model.jumpMinDueFsrs(card_id);
    if (fsrs_items && fsrs_items.length > 0) {
      return fsrs_items[0];
    }
  };

  findCardById = async (card_id: number): Promise<Card | undefined> => {
    return await this.model.findCardById(card_id);
  };

  findNextCard = async (): Promise<NextCardField> => {
    //todo user select tag
    let now_select_tags = [];
    if (true) {
      let son_items = await this.model.findSonTags(-1);
      now_select_tags = this.model.getIdsFromItem(son_items);
    }

    const now_select_tag = await this.model.findTagByWeight(now_select_tags);

    //auto
    //todo mode
    const res = await this.model.calcNextList(
      [now_select_tag],
      false,
      this.next_card_ratio,
    );
    return res;
  };

  searchCard = async (content: string, lim?: number): Promise<Card[]> => {
    const cards = await this.model.fuzzyFindCard(content, lim);
    return cards ? cards : [];
  };

  private next_card_ratio: NextCardRatioField[];
  private model = new Model();
}
