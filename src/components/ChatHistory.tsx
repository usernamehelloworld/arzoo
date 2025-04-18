import React from "react";
import { useChat, Conversation } from "./providers/ChatProvider";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

const ChatHistory = () => {
  const { history, startNewChat } = useChat();

  const conversations = React.useMemo(() => {
    return history;
  }, [history]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <button
          onClick={startNewChat}
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-md py-2 px-4 flex items-center justify-center transition-colors"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground text-sm">
            No chat history found
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => {
              const firstUserMsg = conv.messages.find((m) => m.role === 'user');
              const title = firstUserMsg ? firstUserMsg.content.substring(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '') : 'Untitled';
              const preview = firstUserMsg ? firstUserMsg.content.substring(0, 60) + (firstUserMsg.content.length > 60 ? '...' : '') : '';
              return (
                <div key={conv.id} className="flex items-center group hover:bg-sidebar-accent transition-colors px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-sidebar-foreground">{title}</div>
                    <div className="truncate text-xs text-sidebar-foreground/70">{preview}</div>
                    <div className="text-xs text-sidebar-foreground/50 mt-1">{new Date(conv.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
