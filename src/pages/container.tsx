import { useState, memo, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { nextCard, scoreCard } from "../api";
import type { MenuProps } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Button, Dropdown, FloatButton } from 'antd';


export default memo(function ContainerView() {
    const [content, setContent] = useState<string>();
    const [cardId, setCardId] = useState<number>(-1);
    const [codeStyle, setCodeStyle] = useState({})
    const fontSizeList = [20, 30, 40]
    const [fontSizeIndex, setfontSizeIndex] = useState<number>(1)

    useEffect(() => {
        import('react-syntax-highlighter/dist/esm/styles/prism/material-dark')
            .then(mod => setCodeStyle(mod.default));
    })

    const freshNextCard = () => {
        nextCard().then((res: any) => {
            console.log(res)
            const card = res.card
            if (!card || !card.content) {
                setContent("")
                setCardId(-1)
                return
            }
            let formatContent = card.content
            setCardId(card.id)
            formatContent = formatContent.replace(/\\n/g, "\n");
            setContent(formatContent)
        })
    }

    useEffect(() => {
        freshNextCard()
    }, []);

    const rightItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Button onClick={() => {
                    setfontSizeIndex((fontSizeIndex + 1) % 3)
                }}>fontSize</Button>
            ),
        },
    ];

    const leftItems: MenuProps['items'] = [
        {
            key: 'scoreCard',
            label: (
                <Button type="primary" onClick={async () => {
                    await scoreCard(cardId);
                    freshNextCard()
                }}>
                    scoreCard
                </Button>
            ),
        },
        {
            key: 'nextCard',
            label: (
                <Button type="primary" onClick={() => { freshNextCard() }}>
                    nextCard
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
                <Dropdown menu={{ items: leftItems }} placement="bottom">
                    <Button>Left</Button>
                </Dropdown>
            </div>
            <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 1000 }}>
                <Dropdown menu={{ items: rightItems }} placement="bottom">
                    <Button>Right</Button>
                </Dropdown>
            </div>
            <FloatButton.BackTop visibilityHeight={1000}/>
            <div style={{ maxHeight: '100%', overflowY: 'auto', padding: '10px', wordWrap: 'break-word', fontSize: fontSizeList[fontSizeIndex] }}>
                {
                    content ?
                        <ReactMarkdown children={content} remarkPlugins={[remarkGfm]}
                            components={{
                                img(props) {
                                    return <img {...props} style={{ maxWidth: '100%' }} />
                                },
                                code(props) {
                                    const { children, className, node, ...rest } = props
                                    const match = /language-(\w+)/.exec(className || '')
                                    return match ? (
                                        <SyntaxHighlighter
                                            {...rest}
                                            children={String(children).replace(/\n$/, '')}
                                            style={codeStyle}
                                            language={match[1]}
                                            PreTag="div"
                                        />
                                    ) : (
                                        <code {...rest} className={className}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        />
                        : <div>Empty...</div>
                }
            </div>
        </div >
    );
});
