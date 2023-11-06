import useSWR, { mutate } from "swr";
import { Card, NextCardRatioParam, CardMethod, ScoreCardParam } from "./types";

const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

const cardPath = "/api/card";

export const useCard = () => useSWR<Card>(cardPath, fetcher);

export const addMarkId = async (
  card_id: number,
  mark_id: number,
  content: string,
) => {
  return await fetch(cardPath, {
    method: "POST",
    body: JSON.stringify({
      type: CardMethod.addMarkId,
      card_id,
      mark_id,
      content,
    }),
  }).then((res) => res.json());
};

export const setNextCardRatio = async (ratioParam: NextCardRatioParam[]) => {
  return await fetch(cardPath, {
    method: "POST",
    body: JSON.stringify({ type: CardMethod.setNextCardRatio, ratioParam }),
  }).then((res) => res.json());
};

export const searchCard = async (keyword: string) => {
  return await fetch(cardPath, {
    method: "POST",
    body: JSON.stringify({ type: CardMethod.search, keyword }),
  }).then((res) => res.json());
};

export const InfoCard = async (card_id: number) => {
  return await fetch(cardPath, {
    method: "POST",
    body: JSON.stringify({ type: CardMethod.infoCard, card_id }),
  }).then((res) => res.json());
};

export const findCardById = async (card_id: number) => {
  return await fetch(cardPath, {
    method: "POST",
    body: JSON.stringify({ type: CardMethod.findCardById, card_id }),
  }).then((res) => res.json());
};

export const scoreCard = async (param: ScoreCardParam) => {
  return await fetch(cardPath, {
    method: "POST",
    body: JSON.stringify({ type: CardMethod.score, param }),
  }).then((res) => res.json());
};

export const findNextCard = async () => {
  return await fetch(cardPath, {
    method: "GET",
  }).then((res) => res.json());
};