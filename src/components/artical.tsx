import { useState, memo, useEffect, useRef, ReactDOM, ReactNode } from "react";
import { Button, Divider } from "antd";
import MarkdownView from "./markdown";

interface ArticalProps {
  content: string;
  font_size: number;
  force_flush_idx: number;
  mark_id?: number;
}

export default memo(function ArticalView(props: ArticalProps) {
  const markIdRef = useRef(null);
  const [markId, setMarkId] = useState<number>();
  const [contentArrayView, setContentArrayView] = useState<ReactNode[]>();

  const divider = /======{\[(\d+)\]}======/g;

  const tmp_str = "{[[<&&&>]]}";

  const tmp_divider = tmp_str + "======{[$1]}======" + tmp_str;

  const jumpToMarkId = () => {
    if (markIdRef && markIdRef.current) {
      markIdRef.current.scrollIntoView({
        behavior: "smooth",
      });
      setMarkId(props.mark_id);
    } else {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    jumpToMarkId();
  }, [
    markId?.toString() +
    props.mark_id?.toString() +
    props.force_flush_idx?.toString(),
  ]);

  useEffect(() => {
    if (!props.content) {
      window.scrollTo(0, 0);
      return;
    }
    const formatContent = props.content.replace(divider, tmp_divider);
    const splittedContent = formatContent.split(tmp_str);
    const res: ReactNode[] = [];
    const len = splittedContent.length;
    let mark_str = "";
    if (props.mark_id != undefined) {
      mark_str = "======{[" + props.mark_id?.toString() + "]}======";
    }
    for (let i = 0; i < len; i++) {
      const str = splittedContent[i];
      if (mark_str == str) {
        res.push(
          <div ref={markIdRef} style={{ color: "red" }} key={i}>
            {str}
          </div>,
        );
      } else {
        res.push(
          <MarkdownView key={i} content={str} font_size={props.font_size} />,
        );
      }
      res.push(
        <Divider key={"divider" + i} style={{ border: "3px solid red" }} />,
      );
    }
    setContentArrayView(res);
  }, [props.content + props.font_size]);

  return (
    <div
      style={{
        maxHeight: "100%",
        overflowY: "auto",
        padding: "10px",
        wordWrap: "break-word",
        fontSize: props.font_size,
      }}
    >
      {contentArrayView}
    </div>
  );
});
