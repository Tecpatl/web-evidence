import useSWR, { mutate } from "swr";
import { Todo } from "./types";
import { Card, CardMethod, ScoreCardParam } from "./types";

const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

const todoPath = "/api/todos";
const cardPath = "/api/card";
const testPath = "/api/test";

export const useTodos = () => useSWR<Todo[]>(todoPath, fetcher);

export const useCard = () => useSWR<Card>(cardPath, fetcher);

export const useTests = () => useSWR<any[]>(testPath, fetcher);

export const addMarkId = async (card_id: number, mark_id: number, content: string) => {
  return await fetch(cardPath, {
    method: "POST",
    body: JSON.stringify({ type: CardMethod.addMarkId, card_id, mark_id, content }),
  }).then((res) => res.json());
}

export const searchCard = async (keyword: string) => {
  return await fetch(cardPath, {
    method: "POST",
    body: JSON.stringify({ type: CardMethod.search, keyword }),
  }).then((res) => res.json());
}

export const InfoCard = async (card_id: number)=> {
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

export const createTodo = async (text: string) => {
  mutate(
    todoPath,
    (todos) => [{ text, completed: false, id: "new-todo" }, ...todos],
    false,
  );
  await fetch(todoPath, {
    method: "POST",
    body: JSON.stringify({ text }),
  });

  mutate(todoPath);
};

export const toggleTodo = async (todo: Todo) => {
  mutate(
    todoPath,
    (todos) =>
      todos.map((t) =>
        t.id === todo.id ? { ...todo, completed: !t.completed } : t,
      ),
    false,
  );
  await fetch(`${todoPath}?todoId=${todo.id}`, {
    method: "PUT",
    body: JSON.stringify({ completed: !todo.completed }),
  });
  mutate(todoPath);
};

export const deleteTodo = async (id: string) => {
  mutate(todoPath, (todos) => todos.filter((t) => t.id !== id), false);
  await fetch(`${todoPath}?todoId=${id}`, { method: "DELETE" });
  mutate(todoPath);
};
