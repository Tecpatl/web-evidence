import { useState, memo, useEffect, useCallback } from "react";
import { InfoCard } from "../../api";
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
import dynamic from 'next/dynamic'
const ReactJson = dynamic(import('@microlink/react-json-view'), { ssr: false });

import { InfoCardField } from '../../types'

interface InfoCardProps {
  card_id: number;
}

export default memo(function InfoCardView(props: InfoCardProps) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState<InfoCardField>();

  const getInfo = async (card_id: number) => {
    if (props.card_id != -1) {
      setIsInfoModalOpen(true);
      const res = await InfoCard(card_id)
      if (res && res.info) {
        setCardInfo(res.info)
      }
      // console.log(info)
    }
  }

  return (
    <div>
      <Modal
        title="InfoCard"
        open={isInfoModalOpen}
        onCancel={() => {
          setIsInfoModalOpen(false);
        }}
        footer={[]}
        width={'100%'}
      >
        {
          cardInfo ?
            <ReactJson src={cardInfo} theme="monokai" />
            : <div>empty</div>
        }
      </Modal >
      <Button
        onClick={() => {
          getInfo(props.card_id)
        }}
      >
        InfoCard
      </Button>
    </div>
  );
});
