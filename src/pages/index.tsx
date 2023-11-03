import { NextPage } from "next";
import Head from "next/head";
import { useState, memo, useEffect, useCallback } from "react";
import { createTodo, deleteTodo, toggleTodo, useTodos } from "../api";
import styles from "../styles/Home.module.css";
import { Todo } from "../types";
import { useCard, useTests } from "../api";
import ContainerView from "./container";


const TestPage = () => {
  const { data: tests, error } = useTests();
  console.log(tests)
  return (
    <div>
      sdf
    </div>
  )
}

export const TodoList: React.FC = () => {
  const { data: todos, error } = useTodos();
  console.log("1")

  if (error != null) return <div>Error loading todos...</div>;
  if (todos == null) return <div>Loading...</div>;

  if (todos.length === 0) {
    return <div className={styles.emptyState}>Try adding a todo ☝️️</div>;
  }
  return (
    <ul className={styles.todoList}>
      {todos.map((todo, key) => (
        <TodoItem key={key} todo={todo} />
      ))}
    </ul>
  );
};

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => (
  <li className={styles.todo}>
    <label
      className={`${styles.label} ${todo.completed ? styles.checked : ""}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        className={`${styles.checkbox}`}
        onChange={() => toggleTodo(todo)}
      />
      {todo.text}
    </label>

    <button className={styles.deleteButton} onClick={() => deleteTodo(todo.id)}>
      ✕
    </button>
  </li>
);

const AddTodoInput = () => {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        createTodo(text);
        setText("");
      }}
      className={styles.addTodo}
    >
      <input
        className={styles.input}
        placeholder="Buy some milk"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.addButton}>Add</button>
    </form>
  );
};

const Home: NextPage = () => {
  useEffect(() => {
    console.log("init")
    return () => {
      console.log("destroy")
    }
  }, [])
  return (
    <div>
        <ContainerView/>
        {/* <MarkdownPage /> */}
        {/* <TestPage/> */}
        {/* <AddTodoInput /> */}
        {/* <TodoList /> */}
    </div>
  );
};

export default Home;