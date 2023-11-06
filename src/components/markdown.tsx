import { useState, memo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  Button,
} from "antd";

interface MarkdownProps {
  content: string;
  font_size: number
}

export default memo(function MarkdownView(props: MarkdownProps) {
  const [codeStyle, setCodeStyle] = useState({});
  const markdownViewRef = useRef(null);

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
        <div
          ref={markdownViewRef}
        >
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
        </div>
      ) : (
        <div>Empty...</div>
      )}
    </div>
  );
});
