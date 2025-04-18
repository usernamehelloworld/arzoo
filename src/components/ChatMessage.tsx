import React, { useEffect, useRef, useState } from "react";
import { Message } from "./providers/ChatProvider";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ChatMessageProps {
  message: Message;
  isThinking?: boolean;
  curved?: boolean;
  isStreaming?: boolean;
}

// Define a local CodeProps interface
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ChatMessage = ({ message, curved, isStreaming, isThinking }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const [displayedContent, setDisplayedContent] = useState(message.content);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isStreaming && message.content) {
      setDisplayedContent("");
      let i = 0;
      intervalRef.current = setInterval(() => {
        setDisplayedContent((prev) => {
          if (i < message.content.length) {
            i++;
            return message.content.slice(0, i);
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
        });
      }, 40); // Slower speed for visible streaming
      return () => intervalRef.current && clearInterval(intervalRef.current);
    } else {
      setDisplayedContent(message.content);
    }
  }, [isStreaming, message.content]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  return (
    <div
      className={cn(
        curved
          ? `w-full flex ${isUser ? 'justify-end' : 'justify-start'} px-2`
          : '',
      )}
    >
      <div
        className={cn(
          curved
            ? `relative px-4 py-2 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm min-w-[64px] max-w-[80%] break-words ${isUser ? 'bg-[#232326] text-white ml-2' : 'bg-[#18181a] text-white mr-2'} `
            : '',
          'w-fit',
          'focus:outline-none',
          'transition-all',
          'duration-200',
          'ease-in-out',
          'hover:shadow-lg',
          'select-text'
        )}
        tabIndex={0}
        style={{
          transitionProperty: 'background, box-shadow, border, color',
        }}
      >
        {isThinking ? (
          <div className="flex items-center min-h-[28px]">
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-light mr-1" />
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-light mr-1 delay-150" />
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-light delay-300" />
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-visible max-w-full prose prose-purple dark:prose-invert prose-img:rounded-lg prose-img:mx-auto prose-img:max-h-[60vh] prose-img:object-contain prose-table:w-full prose-table:border prose-table:border-secondary prose-th:border prose-th:border-secondary prose-td:border prose-td:border-secondary prose-a:break-all prose-a:text-primary prose-a:underline prose-a:hover:text-primary/80 prose-a:focus:outline-none prose-a:focus:ring-2 prose-a:focus:ring-primary prose-pre:bg-black/80 prose-pre:text-white prose-pre:rounded-md prose-pre:p-4 prose-code:bg-black/30 prose-code:text-white prose-code:px-1 prose-code:py-0.5 prose-code:rounded" style={{ wordBreak: 'break-word' }}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: CodeProps) {
                  const match = /language-(\w+)/.exec(className || "");
                  const code = String(children).replace(/\n$/, "");

                  if (!inline && match) {
                    return (
                      <div className="relative group">
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(code)}
                            className="p-1 rounded hover:bg-white/10"
                            aria-label="Copy code"
                          >
                            <Copy className="h-4 w-4 text-white/70" />
                          </button>
                        </div>
                        <SyntaxHighlighter
                          language={match[1]}
                          style={vscDarkPlus}
                          PreTag="div"
                          className="rounded-md !mt-0"
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  } else if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  } else {
                    return (
                      <div className="relative group">
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(code)}
                            className="p-1 rounded hover:bg-white/10"
                            aria-label="Copy code"
                          >
                            <Copy className="h-4 w-4 text-white/70" />
                          </button>
                        </div>
                        <SyntaxHighlighter
                          language="text"
                          style={vscDarkPlus}
                          PreTag="div"
                          className="rounded-md !mt-0"
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                },
                table({ node, ...props }) {
                  return (
                    <div className="overflow-x-auto my-4 rounded-lg border border-secondary bg-background">
                      <table className="w-full border-collapse text-sm" {...props} />
                    </div>
                  );
                },
                a({ node, ...props }) {
                  return (
                    <a
                      {...props}
                      className="text-primary underline break-all hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  );
                },
                img({ node, ...props }) {
                  return (
                    <img
                      {...props}
                      className="rounded-lg mx-auto max-h-[60vh] object-contain border border-secondary bg-background"
                      style={{ display: 'block', margin: '1.5rem auto' }}
                      alt={props.alt || 'image'}
                    />
                  );
                },
              }}
            >
              {displayedContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
