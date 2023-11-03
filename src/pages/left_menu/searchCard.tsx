import { useState, memo, useEffect, useCallback } from "react";
import { searchCard, nextCard, scoreCard } from "../../api";
import { Card } from "../../types";
import {
  InputNumber,
  Space,
  Modal,
  Button,
  Dropdown,
  FloatButton,
  Radio,
  Form,
  Input,
  Select,
} from "antd";
import MarkdownView from "../markdown";
import type { SelectProps, MenuProps } from "antd";
const { Search } = Input;
const { Option } = Select;

interface SearchCardProps {
  replace_card_foo: (card: Card) => void;
}

let currentValue = "";

export default memo(function SearchCardView(props: SearchCardProps) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [data, setData] = useState<SelectProps["options"]>([]);
  const [value, setValue] = useState<string>();
  const [content, setContent] = useState<string>();
  const [mainCard, setMainCard] = useState<Card>();

  const LabelView: React.FC<{
    short_content: string;
    card: Card;
    set_content_cb: (content: string) => void;
  }> = (props) => {
    return (
      <div
        onClick={() => {
          props.set_content_cb(props.card.content);
          setMainCard(props.card);
        }}
      >
        {props.short_content}
      </div>
    );
  };

  const splitLineForContent = (keyword: string, full_content: string) => {
    const start_idx = full_content.indexOf(keyword);
    return full_content.slice(start_idx, start_idx + 30) + "...";
  };

  const handleSearch = (value: string) => {
    if (value == "") {
      setData([]);
      return;
    }
    currentValue = value;
    searchCard(value).then((res: any) => {
      if (res.is_ok == false || !res.cards) {
        setData([]);
        return;
      }
      const cards = res.cards;
      if (currentValue === value) {
        const items = [];
        cards.forEach((card: Card) => {
          const shortContent = splitLineForContent(value, card.content);
          items.push({
            value: shortContent,
            label: (
              <LabelView
                short_content={shortContent}
                card={card}
                set_content_cb={setContent}
              />
            ),
          });
        });
        setData(items);
      } else {
        setData([]);
      }
    });
  };

  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <div>
      <Modal
        title="SearchCard"
        open={isSearchModalOpen}
        onCancel={() => {
          setIsSearchModalOpen(false);
        }}
        footer={[]}
      >
        <Select
          showSearch
          value={value}
          defaultActiveFirstOption={false}
          suffixIcon={null}
          style={{ width: "100%", zIndex: 1001 }}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={null}
          options={data}
        />

        <Button
          onClick={() => {
            if (mainCard) {
              props.replace_card_foo(mainCard);
            }
            setData([]);
            setValue("");
            setContent("");
            setIsSearchModalOpen(false);
          }}
        >
          submit
        </Button>
        <MarkdownView content={content} font_size={15} />
      </Modal>
      <Button
        type="primary"
        onClick={async () => {
          setIsSearchModalOpen(true);
        }}
      >
        searchCard
      </Button>
    </div>
  );
});
