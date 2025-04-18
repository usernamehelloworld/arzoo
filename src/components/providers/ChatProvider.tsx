import React, { createContext, useContext, useState, ReactNode } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export type ApiProvider = "puter.js" | "openrouter" | "google-ai-studio" | string;

export type Conversation = {
  id: string;
  messages: Message[];
  createdAt: string;
};

const CHAT_HISTORY_KEY = 'chat-sidekick-history-v1';

function loadHistory(): Conversation[] {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveHistory(history: Conversation[]) {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
}

type ChatContextType = {
  messages: Message[];
  isProcessing: boolean;
  sendMessage: (content: string) => Promise<void>;
  apiProvider: ApiProvider;
  model: string;
  availableModels: string[];
  customProviders: string[];
  customProviderInput: string;
  customModelInput: string;
  setCustomProviderInput: (input: string) => void;
  setCustomModelInput: (input: string) => void;
  saveCustomProvider: () => void;
  saveCustomModel: () => void;
  setApiProvider: (provider: ApiProvider) => void;
  setModel: (model: string) => void;
  startNewChat: () => void;
  history: Conversation[];
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const MODELS = {
  "puter.js": [
    "gpt-4o-mini",
    "gpt-4o",
    "o1",
    "o1-mini",
    "o1-pro",
    "o3",
    "o3-mini",
    "o4-mini",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "gpt-4.5-preview",
    "claude-3-7-sonnet",
    "claude-3-5-sonnet",
    "deepseek-chat",
    "deepseek-reasoner",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
    "mistral-large-latest",
    "pixtral-large-latest",
    "codestral-latest",
    "google/gemma-2-27b-it",
    "grok-beta",
    "google/gemini-2.5-pro-exp-03-25:free",
    "google/gemini-2.0-flash-lite-001",
    "google/gemini-2.0-flash-001",
    "google/gemini-2.0-pro-exp-02-05:free",
    "google/gemini-2.0-flash-thinking-exp:free",
    "google/gemini-2.0-flash-thinking-exp-1219:free",
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-flash-1.5-8b",
    "google/gemini-flash-1.5-8b-exp",
    "google/gemini-flash-1.5",
    "google/gemini-pro-1.5",
    "google/gemini-pro"
  ],
  "openrouter": ["openai/gpt-4", "anthropic/claude-3-opus", "mistral/mistral-large"],
  "google-ai-studio": ["gemini-pro", "gemini-ultra", "palm-2"],
};

// Simple ID generator to replace uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiProvider, setApiProvider] = useState<ApiProvider>("puter.js");
  const [model, setModel] = useState("gpt-4o-mini");
  const [customProviders, setCustomProviders] = useState<string[]>([]);
  const [customProviderModels, setCustomProviderModels] = useState<Record<string, string[]>>({});
  const [customProviderInput, setCustomProviderInput] = useState("");
  const [customModelInput, setCustomModelInput] = useState("");
  const [history, setHistory] = useState<Conversation[]>(() => loadHistory());

  // Determine available models based on selected API provider
  const availableModels = React.useMemo(() => {
    const defaultModels = MODELS[apiProvider as keyof typeof MODELS] || [];
    const customModels = customProviderModels[apiProvider] || [];
    // Merge and dedupe
    return Array.from(new Set([...defaultModels, ...customModels]));
  }, [apiProvider, customProviderModels]);

  // Save custom provider
  const saveCustomProvider = () => {
    if (customProviderInput.trim() && !customProviders.includes(customProviderInput)) {
      setCustomProviders([...customProviders, customProviderInput]);
      setCustomProviderModels({
        ...customProviderModels,
        [customProviderInput]: [],
      });
      setCustomProviderInput("");
    }
  };

  // Save custom model
  const saveCustomModel = () => {
    if (customModelInput.trim() && !availableModels.includes(customModelInput)) {
      const updatedModels = {
        ...customProviderModels,
        [apiProvider]: [...(customProviderModels[apiProvider] || []), customModelInput],
      };
      setCustomProviderModels(updatedModels);
      setModel(customModelInput);
      setCustomModelInput("");
    }
  };

  // Send a message
  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
    };
    setMessages([...messages, userMessage]);
    setIsProcessing(true);

    function waitForPuter(retries = 10, interval = 300): Promise<void> {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        function check() {
          if (typeof window.puter !== "undefined" && window.puter.ai) {
            resolve();
          } else if (attempts < retries) {
            attempts++;
            setTimeout(check, interval);
          } else {
            reject(new Error("Puter.js is not available. Please ensure the script is loaded in index.html."));
          }
        }
        check();
      });
    }

    try {
      if (apiProvider === "puter.js") {
        await waitForPuter();
        // @ts-ignore
        const response = await window.puter.ai.chat(content, false, { model });
        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: response.message?.content || String(response),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Fallback for other providers (simulate or handle as needed)
        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: `API provider '${apiProvider}' is not implemented for real requests.`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: error?.message || "An error occurred while sending the message.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Save current conversation to history and start new chat
  const startNewChat = () => {
    if (messages.length > 0) {
      const newConv: Conversation = {
        id: generateId(),
        messages,
        createdAt: new Date().toISOString(),
      };
      const updated = [newConv, ...history].slice(0, 30); // keep last 30
      setHistory(updated);
      saveHistory(updated);
    }
    setMessages([]);
  };

  // On mount, load history from localStorage
  React.useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Optionally, update history in localStorage if it changes
  React.useEffect(() => {
    saveHistory(history);
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isProcessing,
        sendMessage,
        apiProvider,
        model,
        availableModels,
        customProviders,
        customProviderInput,
        customModelInput,
        setCustomProviderInput,
        setCustomModelInput,
        saveCustomProvider,
        saveCustomModel,
        setApiProvider,
        setModel,
        startNewChat,
        history, // expose history
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
