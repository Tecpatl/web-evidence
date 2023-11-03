import { useState, memo, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
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

interface MarkdownProps {
  content: string;
  font_size: number 
}

export default memo(function MarkdownView(props: MarkdownProps) {
  const [codeStyle, setCodeStyle] = useState({});

  useEffect(() => {
    import("react-syntax-highlighter/dist/esm/styles/prism/material-dark").then(
      (mod) => setCodeStyle(mod.default),
    );
  });

  return (
    <div
      style={{
        maxHeight: "100%",
        overflowY: "auto",
        padding: "10px",
        wordWrap: "break-word",
        fontSize: props.font_size
      }}
    >
      {props.content ? (
        <ReactMarkdown
          children={props.content}
          remarkPlugins={[remarkGfm]}
          components={{
            img(props) {
              return <img {...props} style={{ maxWidth: "100%" }} />;
            },
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  children={String(children).replace(/\n$/, "")}
                  style={codeStyle}
                  language={match[1]}
                  PreTag="div"
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        />
      ) : (
        <div>Empty...</div>
      )}
    </div>
  );
});
