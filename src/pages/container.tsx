import { useState, memo, useEffect, useCallback } from "react";
import { nextCard, scoreCard } from "../api";
import { Card } from "../types";
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
import LeftMenuView from "./left_menu/index";
import RightMenuView from "./right_menu/index";
import MarkdownView from "./markdown";

export default memo(function ContainerView() {
  const [content, setContent] = useState<string>();
  const [cardId, setCardId] = useState<number>(-1);
  const fontSizeList = [20, 30, 40];
  const [fontSizeIndex, setfontSizeIndex] = useState<number>(1);

  const freshNextCardFoo = () => {
    nextCard().then((res: any) => {
      const card = res.card;
      replaceCardFoo(card);
    });
  };

  useEffect(() => {
    freshNextCardFoo();
  }, []);

  const replaceCardFoo = (card: Card) => {
    if (!card || !card.content) {
      setContent("");
      setCardId(-1);
      return;
    }
    let formatContent = card.content;
    setCardId(card.id);
    formatContent = formatContent.replace(/\\n/g, "\n");
    setContent(formatContent);
  };

  return (
    <div>
      <LeftMenuView
        card_id={cardId}
        fresh_next_card_foo={freshNextCardFoo}
        replace_card_foo={replaceCardFoo}
      />
      <RightMenuView
        set_font_size_index_foo={() => {
          setfontSizeIndex((fontSizeIndex + 1) % 3);
        }}
      />
      <FloatButton.BackTop visibilityHeight={1000} />
      <MarkdownView content={content} font_size={fontSizeList[fontSizeIndex]} />
    </div>
  );
});
