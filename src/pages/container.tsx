import { useState, memo, useEffect, useRef } from "react";
import { findCardById, findNextCard, scoreCard } from "../api";
import { Card, FsrsField, NextCardMode } from "../types";
import {
  InputNumber,
  Space,
  Modal,
  Button,
  Dropdown,
  FloatButton,
  Radio,
  Form,
  message,
} from "antd";
import LeftMenuView from "./left_menu/index";
import RightMenuView from "./right_menu/index";
import ArticalView from "./artical";

export default memo(function ContainerView() {
  const [formatContent, setFormatContent] = useState<string>();
  const [nowCard, setNowCard] = useState<Card>();
  const [nowFsrs, setNowFsrs] = useState<FsrsField>();
  const fontSizeList = [20, 30, 40];
  const [fontSizeIndex, setfontSizeIndex] = useState<number>(1);
  const [forceFlushIdx, setForceFlushIdx] = useState<number>(0);
  const [messageApi, contextHolder] = message.useMessage();

  const flushNextCardFoo = () => {
    findNextCard().then((res: any) => {
      const card = res.next_card.card as Card;
      const next_card_mode = res.next_card.next_card_mode as NextCardMode;
      let next_card_mode_msg = "auto";
      switch (next_card_mode) {
        case NextCardMode.new: {
          next_card_mode_msg = "NewCard";
          break;
        }
        case NextCardMode.rand: {
          next_card_mode_msg = "RandCard";
          break;
        }
        case NextCardMode.review: {
          next_card_mode_msg = "ReviewCard";
          break;
        }
      }
      const fsrs_item = res.fsrs_item as FsrsField;
      messageApi.info(next_card_mode_msg + " mark_id:" + fsrs_item.mark_id);
      replaceCardFoo(card);
      setNowFsrs(fsrs_item);
    });
  };

  const flushNowCardFoo = () => {
    setFormatContent(nowCard.content);
    if (!nowCard || !nowCard.id || nowCard.id < 0) {
      return;
    }
    findCardById(nowCard.id).then((res: any) => {
      const card = res.card as Card;
      const fsrs_item = res.fsrs_item as FsrsField;
      replaceCardFoo(card);
      setNowFsrs(fsrs_item);
      setForceFlushIdx((forceFlushIdx) => forceFlushIdx + 1);
    });
  };

  useEffect(() => {
    flushNextCardFoo();
  }, []);

  const replaceCardFoo = (card: Card) => {
    if (!card || !card.content) {
      setFormatContent("");
      setNowCard(null);
      setNowFsrs(null);
      return;
    }
    let nowFormatContent = card.content;
    setNowCard(card);
    nowFormatContent = nowFormatContent.replace(/\\n/g, "\n");
    setFormatContent(nowFormatContent);
  };

  const updateFormatContent = (content: string) => {
    setFormatContent(content);
  };

  return (
    <div>
      {contextHolder}
      <LeftMenuView
        force_flush_idx={forceFlushIdx}
        card={nowCard}
        fresh_next_card_foo={flushNextCardFoo}
        replace_card_foo={replaceCardFoo}
        update_format_content_foo={updateFormatContent}
      />
      <RightMenuView
        card_id={nowCard ? nowCard.id : -1}
        set_font_size_index_foo={() => {
          setfontSizeIndex((fontSizeIndex + 1) % 3);
        }}
        flush_now_card_foo={flushNowCardFoo}
      />
      <FloatButton.BackTop visibilityHeight={1000} />
      <ArticalView
        force_flush_idx={forceFlushIdx}
        content={formatContent}
        mark_id={nowFsrs?.mark_id}
        font_size={fontSizeList[fontSizeIndex]}
      />
    </div>
  );
});
