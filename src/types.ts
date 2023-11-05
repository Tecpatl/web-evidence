export interface Todo {
  id: string;
  created: string;
  text: string;
  completed: boolean;
}

export interface CardField {
  id: number;
  content: string;
  file_type: string;
}

export interface TagField {
  id: number;
  name: string;
  father_id: number;
  timestamp: number;
  weight: number;
}

export type Card = CardField;
export type Tag = TagField;

export enum NextCardMode {
  auto = 0,
  review = 1,
  new = 2,
  rand = 3,
}

export interface NextCardRatioField {
  id: NextCardMode;
  value: number;
  name: string;
}

export enum CardMethod {
  score = 0,
  next,
  fresh,
  search,
  findCardById,
  infoCard,
  setNextCardRatio,
  addMarkId,
}

export interface ScoreCardParam {
  card_id: number;
  mark_id: number;
  rating: number;
}

export interface FsrsField {
  id: number;
  card_id: number;
  mark_id: number;
  due: number;
  info: string;
}

export interface InfoCardField {
  fsrs_items: FsrsField[];
  tags: TagField[];
}

export interface NextCardRatioParam {
  id: NextCardMode;
  value: number;
}

export interface NextCardField {
  card: Card;
  next_card_mode: NextCardMode;
}
