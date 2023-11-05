import { useState, memo, useEffect, useCallback, ReactNode } from "react";
import { findNextCard, scoreCard } from "../../api";
import {
  InputNumber,
  Space,
  Modal,
  Button,
  Dropdown,
  FloatButton,
  Radio,
  Form,
} from "antd";
import type { MenuProps } from "antd";
import ScoreCardlView from "./scoreCard";
import SearchCardlView from "./searchCard";
import { Card } from "../../types";
import AddMarkIdView from './addMark'

interface LeftMenuProps {
  card: Card;
  fresh_next_card_foo: () => void;
  replace_card_foo: (card: Card) => void;
  force_flush_idx: number
  line_number_view: ReactNode
}

export default memo(function LeftMenuView(props: LeftMenuProps) {
  const leftItems: MenuProps["items"] = [
    {
      key: "scoreCard",
      label: (
        <ScoreCardlView
          card={props.card}
          fresh_next_card_foo={props.fresh_next_card_foo}
        />
      ),
    },
    {
      key: "findNextCard",
      label: (
        <Button
          type="primary"
          onClick={() => {
            props.fresh_next_card_foo();
          }}
        >
          findNextCard
        </Button>
      ),
    },
    {
      key: "addMarkId",
      label: <AddMarkIdView card={props.card} line_number_view={props.line_number_view} />
    },
    {
      key: "searchCard",
      label: <SearchCardlView
        force_flush_idx={props.force_flush_idx}
        replace_card_foo={props.replace_card_foo} />,
    },
  ];

  return (
    <div>
      <div
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
      >
        <Dropdown menu={{ items: leftItems }} placement="bottom">
          <Button>Left</Button>
        </Dropdown>
      </div>
    </div>
  );
});
