import { useState, memo, useEffect, useCallback, ReactNode } from "react";
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
import InfoCardView from './info'
import NextRatioView from './nextRatio'
import { signOut } from "next-auth/react";

interface RightMenuProps {
  set_font_size_index_foo: () => void;
  flush_now_card_foo: () => void
  card_id: number
}

export default memo(function RightMenuView(props: RightMenuProps) {
  const rightItems: MenuProps["items"] = [
    {
      key: "flushCard",
      label: (
        <Button
          onClick={() => {
            props.flush_now_card_foo();
          }}
        >
          flushCard
        </Button>
      ),
    },
    {
      key: "infoCard",
      label: (
        <InfoCardView card_id={props.card_id} />
      ),
    },
    {
      key: "nextCardRatio",
      label: (
        <NextRatioView card_id={props.card_id} />
      ),
    },
    {
      key: "fontSize",
      label: (
        <Button
          onClick={() => {
            props.set_font_size_index_foo();
          }}
        >
          fontSize
        </Button>
      ),
    },
    {
      key: "logout",
      label: (
        <Button
          onClick={() => {
            signOut()
          }}
        >
          logout
        </Button>
      ),
    },
  ];
  return (
    <div>
      <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1000 }}>
        <Dropdown menu={{ items: rightItems }} placement="bottom">
          <Button>Right</Button>
        </Dropdown>
      </div>
    </div>
  );
});
