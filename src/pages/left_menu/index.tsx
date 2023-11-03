import { useState, memo, useEffect, useCallback } from "react";
import { nextCard, scoreCard } from "../../api";
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

interface LeftMenuProps {
  card_id: number;
  fresh_next_card_foo: () => void;
  replace_card_foo: (card: Card) => void;
}

export default memo(function LeftMenuView(props: LeftMenuProps) {
  const [cardId, setCardId] = useState<number>(-1);

  useEffect(() => {
    setCardId(props.card_id);
  }, [props.card_id]);

  const leftItems: MenuProps["items"] = [
    {
      key: "scoreCard",
      label: (
        <ScoreCardlView
          card_id={cardId}
          fresh_next_card_foo={props.fresh_next_card_foo}
        />
      ),
    },
    {
      key: "nextCard",
      label: (
        <Button
          type="primary"
          onClick={() => {
            props.fresh_next_card_foo();
          }}
        >
          nextCard
        </Button>
      ),
    },
    {
      key: "searchCard",
      label: <SearchCardlView replace_card_foo={props.replace_card_foo} />,
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
