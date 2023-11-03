import { useState, memo, useEffect, useCallback } from "react";
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

interface RightMenuProps {
  set_font_size_index_foo: () => void;
}

export default memo(function RightMenuView(props: RightMenuProps) {
  const rightItems: MenuProps["items"] = [
    {
      key: "1",
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
