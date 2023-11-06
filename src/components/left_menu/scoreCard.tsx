import { useState, memo, useEffect, useCallback } from "react";
import { scoreCard } from "../../api";
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
import { Card } from "../../types";

interface ScoreCardProps {
  card: Card;
  fresh_next_card_foo: () => void;
}

export default memo(function ScoreCardView(props: ScoreCardProps) {
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const ScoreModelView = () => {
    return (
      <Modal
        title="ScoreCard"
        open={isScoreModalOpen}
        onCancel={() => {
          setIsScoreModalOpen(false);
        }}
        footer={[]}
      >
        <Form
          name="validate_other"
          {...formItemLayout}
          onFinish={async (values: { mark_id: number; rating: number }) => {
            setIsScoreModalOpen(false);
            await scoreCard({
              card_id: props.card.id,
              mark_id: values.mark_id,
              rating: values.rating,
            });
            props.fresh_next_card_foo();
          }}
          initialValues={{
            mark_id: 0,
            rating: 2,
          }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="mark_id">
            <Form.Item name="mark_id">
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="rating"
            label="rating"
            rules={[{ required: true, message: "Please pick an item!" }]}
          >
            <Radio.Group>
              <Radio.Button value={1}>Again</Radio.Button>
              <Radio.Button value={2}>Hard</Radio.Button>
              <Radio.Button value={3}>Good</Radio.Button>
              <Radio.Button value={4}>Easy</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="reset">reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  return (
    <div>
      <ScoreModelView />
      <Button
        type="primary"
        onClick={async () => {
          if (props.card?.id) {
            setIsScoreModalOpen(true);
          }
        }}
      >
        scoreCard
      </Button>
    </div>
  );
});
