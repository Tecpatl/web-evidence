import { useState, memo, useEffect, useCallback } from "react";
import { setNextCardRatio } from "../../api";
import { NextCardRatioParam, NextCardMode } from "../../types";
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
import dynamic from "next/dynamic";
const ReactJson = dynamic(import("@microlink/react-json-view"), { ssr: false });

interface NextRatioCardProps {
  card_id: number;
}

export default memo(function NextRatioCardView(props: NextRatioCardProps) {
  const [isNextRatioModalOpen, setIsNextRatioModalOpen] = useState(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <div>
      <Modal
        title="NextRatioCard"
        open={isNextRatioModalOpen}
        onCancel={() => {
          setIsNextRatioModalOpen(false);
        }}
        footer={[]}
        width={"100%"}
      >
        <Form
          name="validate_other"
          {...formItemLayout}
          onFinish={async (values: {
            new_ratio: number;
            review_ratio: number;
            rand_ratio: number;
          }) => {
            await setNextCardRatio([
              { id: NextCardMode.new, value: values.new_ratio },
              { id: NextCardMode.rand, value: values.rand_ratio },
              { id: NextCardMode.review, value: values.review_ratio },
            ]);
            setIsNextRatioModalOpen(false);
          }}
          initialValues={{
            review_ratio: 50,
            new_ratio: 40,
            rand_ratio: 10,
          }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="review_ratio">
            <Form.Item name="review_ratio">
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="new_ratio">
            <Form.Item name="new_ratio">
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="rand_ratio">
            <Form.Item name="rand_ratio">
              <InputNumber min={0} />
            </Form.Item>
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
      <Button
        onClick={() => {
          setIsNextRatioModalOpen(true);
        }}
      >
        NextRatioCard
      </Button>
    </div>
  );
});
