import { useState, memo, useEffect, useCallback, ReactNode } from "react";
import { InfoCard, addMarkId } from "../../api";
import { Card, InfoCardField } from '../../types'
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
import { findMinMissingNumber } from '../../tool'

interface AddMarkProps {
  card: Card;
  update_format_content_foo: (content: string) => void
}

export default memo(function AddMarkView(props: AddMarkProps) {
  const [isAddMarkModalOpen, setIsAddMarkModalOpen] = useState(false);
  const [lineNumberMode, setLineNumberMode] = useState<boolean>(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <div>
      <Modal
        title="AddMark"
        open={isAddMarkModalOpen}
        onCancel={() => {
          setIsAddMarkModalOpen(false);
        }}
        footer={[]}
      >
        <Form
          name="validate_other"
          {...formItemLayout}
          onFinish={async (values: { line_id: number; }) => {
            if (!props.card || !props.card.id) {
              return
            }
            setIsAddMarkModalOpen(false);
            console.log("mark_id:", values.line_id)

            const cardInfo = (await InfoCard(props.card.id))?.info as InfoCardField
            if (!cardInfo || !cardInfo.fsrs_items) {
              return
            }
            const mark_ids = []
            const fsrs_items = cardInfo.fsrs_items
            fsrs_items.forEach((v) => {
              mark_ids.push(v.mark_id)
            })
            const new_mark_id = findMinMissingNumber(mark_ids)
            const nowFormatContent = props.card.content
            const arr = nowFormatContent.split("\n")
            let res = ""
            const len = arr.length
            for (let i = 0; i < len; i++) {
              if (i + 1 == values.line_id) {
                res += `\n======{[${new_mark_id}]}======\n`
              } else {
                res += `${arr[i]}\n`
              }
            }
            await addMarkId(props.card.id, new_mark_id, res)
          }}
          initialValues={{
            mark_id: 0,
          }}
          style={{ maxWidth: 600 }}
        >
          <Button
            onClick={() => {
              if (!lineNumberMode) {
                const nowFormatContent = props.card.content
                const arr = nowFormatContent.split("\n")
                let res = ""
                const len = arr.length
                for (let i = 0; i < len; i++) {
                  res += arr[i] + " [" + i.toString() + "]   \n"
                }
                res = res.replace(/\\n/g, "\n");
                props.update_format_content_foo(res)
              } else {
                props.update_format_content_foo(props.card.content)
              }
              setLineNumberMode(res => !res)
            }}>linenumber</Button>
          <Form.Item label="line_id">
            <Form.Item name="line_id">
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
        type="primary"
        onClick={async () => {
          if (props.card.id != -1) {
            setIsAddMarkModalOpen(true);
          }
        }}
      >
        AddMarkId
      </Button>
    </div>
  );
});
