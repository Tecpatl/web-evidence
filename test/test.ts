import { Card, FSRS, Rating, State } from "../src/evidence/fsrs";

const f = new FSRS();
let card = new Card();

let now = new Date("2023-11-05 12:30:00 UTC");
  console.log(now.getTime())
let scheduling_cards = f.repeats(card, now);

card = scheduling_cards[Rating.Good].card;
now = card.due;
scheduling_cards = f.repeats(card, now);

card = scheduling_cards[Rating.Good].card;
now = card.due;
scheduling_cards = f.repeats(card, now);
//
card = scheduling_cards[Rating.Again].card;
now = card.due;
scheduling_cards = f.repeats(card, now);

card = scheduling_cards[Rating.Good].card;
now = card.due;
scheduling_cards = f.repeats(card, now);

card = scheduling_cards[Rating.Again].card;
now = card.due;
scheduling_cards = f.repeats(card, now);

card = scheduling_cards[Rating.Easy].card;
now = card.due;
scheduling_cards = f.repeats(card, now);

card = scheduling_cards[Rating.Hard].card;
now = card.due;
scheduling_cards = f.repeats(card, now);

card = scheduling_cards[Rating.Good].card;
now = card.due;
scheduling_cards = f.repeats(card, now);

//console.log(scheduling_cards);
