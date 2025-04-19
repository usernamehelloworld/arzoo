import React, { useState, useEffect } from "react";
import { useChat, ApiProvider } from "./providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X, Save, Settings, History, Trash2, Menu } from "lucide-react";
import ChatHistory from "./ChatHistory";
import CodeBlockRenderer from "@/components/CodeBlockRenderer";

// In the Sidebar or wherever you display model responses:
// Example usage (replace `modelResponse` with your actual response variable):
// <CodeBlockRenderer response={modelResponse} />

interface SidebarProps {
  isOpen: boolean;
  className?: string;
}

// Puter.js handles authentication automatically.
// The user is always authenticated before accessing any cloud or AI services.
// No API keys or manual authentication required (see: https://docs.puter.com/prompt.md).

const Sidebar = ({ isOpen, onOpenSettings, className }: SidebarProps & { onOpenSettings?: () => void }) => {
  const {
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
    isProcessing,
  } = useChat();

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  // Auto-hide sidebar when prompting
  useEffect(() => {
    if (isProcessing && isOpen) {
      // You may want to call a prop or context to close the sidebar
      // For this example, we'll emit a custom event
      const event = new CustomEvent('sidebar:close');
      window.dispatchEvent(event);
    }
  }, [isProcessing, isOpen]);

  // Combined list of providers (default + custom)
  const allProviders = [
    ...Object.keys({"puter.js": [], "openrouter": [], "google-ai-studio": []}),
    ...customProviders
  ];

  // Model categories for puter.js
  const puterModelCategories = [
    {
      label: 'OpenAI',
      models: [
        'gpt-3.5-turbo',
        'gpt-4',
        'gpt-4-turbo-preview',
        'gpt-3.5-turbo-16k',
        'gpt-4-32k'
      ]
    },
    {
      label: 'OpenRouter',
      models: [
        'openrouter:01-ai/yi-large',
        'openrouter:aetherwiing/mn-starcannon-12b',
        'openrouter:ai21/jamba-1-5-large',
        'openrouter:ai21/jamba-1-5-mini',
        'openrouter:ai21/jamba-1.6-large',
        'openrouter:ai21/jamba-1.6-mini',
        'openrouter:ai21/jamba-instruct',
        'openrouter:aion-labs/aion-1.0',
        'openrouter:aion-labs/aion-1.0-mini',
        'openrouter:aion-labs/aion-rp-llama-3.1-8b',
        'openrouter:all-hands/openhands-lm-32b-v0.1',
        'openrouter:allenai/molmo-7b-d:free',
        'openrouter:allenai/olmo-2-0325-32b-instruct',
        'openrouter:alpindale/goliath-120b',
        'openrouter:alpindale/magnum-72b',
        'openrouter:amazon/nova-lite-v1',
        'openrouter:amazon/nova-micro-v1',
        'openrouter:amazon/nova-pro-v1',
        'openrouter:anthracite-org/magnum-v2-72b',
        'openrouter:anthracite-org/magnum-v4-72b',
        'openrouter:anthropic/claude-2',
        'openrouter:anthropic/claude-2.0',
        'openrouter:anthropic/claude-2.0:beta',
        'openrouter:anthropic/claude-2.1',
        'openrouter:anthropic/claude-2.1:beta',
        'openrouter:anthropic/claude-2:beta',
        'openrouter:anthropic/claude-3-haiku',
        'openrouter:anthropic/claude-3-haiku:beta',
        'openrouter:anthropic/claude-3-opus',
        'openrouter:anthropic/claude-3-opus:beta',
        'openrouter:anthropic/claude-3-sonnet',
        'openrouter:anthropic/claude-3-sonnet:beta',
        'openrouter:anthropic/claude-3.5-haiku',
        'openrouter:anthropic/claude-3.5-haiku-20241022',
        'openrouter:anthropic/claude-3.5-haiku-20241022:beta',
        'openrouter:anthropic/claude-3.5-haiku:beta',
        'openrouter:anthropic/claude-3.5-sonnet',
        'openrouter:anthropic/claude-3.5-sonnet-20240620',
        'openrouter:anthropic/claude-3.5-sonnet-20240620:beta',
        'openrouter:anthropic/claude-3.5-sonnet:beta',
        'openrouter:anthropic/claude-3.7-sonnet',
        'openrouter:anthropic/claude-3.7-sonnet:beta',
        'openrouter:anthropic/claude-3.7-sonnet:thinking',
        'openrouter:bytedance-research/ui-tars-72b:free',
        'openrouter:cognitivecomputations/dolphin-mixtral-8x22b',
        'openrouter:cognitivecomputations/dolphin-mixtral-8x7b',
        'openrouter:cognitivecomputations/dolphin3.0-mistral-24b:free',
        'openrouter:cognitivecomputations/dolphin3.0-r1-mistral-24b:free',
        'openrouter:cohere/command',
        'openrouter:cohere/command-a',
        'openrouter:cohere/command-r',
        'openrouter:cohere/command-r-03-2024',
        'openrouter:cohere/command-r-08-2024',
        'openrouter:cohere/command-r-plus',
        'openrouter:cohere/command-r-plus-04-2024',
        'openrouter:cohere/command-r-plus-08-2024',
        'openrouter:cohere/command-r7b-12-2024',
        'openrouter:deepseek/deepseek-chat',
        'openrouter:deepseek/deepseek-chat-v3-0324',
        'openrouter:deepseek/deepseek-chat-v3-0324:free',
        'openrouter:deepseek/deepseek-chat:free',
        'openrouter:deepseek/deepseek-r1',
        'openrouter:deepseek/deepseek-r1-distill-llama-70b',
        'openrouter:deepseek/deepseek-r1-distill-llama-70b:free',
        'openrouter:deepseek/deepseek-r1-distill-llama-8b',
        'openrouter:deepseek/deepseek-r1-distill-qwen-1.5b',
        'openrouter:deepseek/deepseek-r1-distill-qwen-14b',
        'openrouter:deepseek/deepseek-r1-distill-qwen-14b:free',
        'openrouter:deepseek/deepseek-r1-distill-qwen-32b',
        'openrouter:deepseek/deepseek-r1-distill-qwen-32b:free',
        'openrouter:deepseek/deepseek-r1-zero:free',
        'openrouter:deepseek/deepseek-r1:free',
        'openrouter:deepseek/deepseek-v3-base:free',
        'openrouter:eva-unit-01/eva-llama-3.33-70b',
        'openrouter:eva-unit-01/eva-qwen-2.5-32b',
        'openrouter:eva-unit-01/eva-qwen-2.5-72b',
        'openrouter:featherless/qwerky-72b:free',
        'openrouter:google/gemini-2.0-flash-001',
        'openrouter:google/gemini-2.0-flash-exp:free',
        'openrouter:google/gemini-2.0-flash-lite-001',
        'openrouter:google/gemini-2.0-flash-thinking-exp-1219:free',
        'openrouter:google/gemini-2.0-flash-thinking-exp:free',
        'openrouter:google/gemini-2.5-pro-exp-03-25:free',
        'openrouter:google/gemini-2.5-pro-preview-03-25',
        'openrouter:google/gemini-flash-1.5',
        'openrouter:google/gemini-flash-1.5-8b',
        'openrouter:google/gemini-flash-1.5-8b-exp',
        'openrouter:google/gemini-pro',
        'openrouter:google/gemini-pro-1.5',
        'openrouter:google/gemini-pro-vision',
        'openrouter:google/gemma-2-27b-it',
        'openrouter:google/gemma-2-9b-it',
        'openrouter:google/gemma-2-9b-it:free',
        'openrouter:google/gemma-3-12b-it',
        'openrouter:google/gemma-3-12b-it:free',
        'openrouter:google/gemma-3-1b-it:free',
        'openrouter:google/gemma-3-27b-it',
        'openrouter:google/gemma-3-27b-it:free',
        'openrouter:google/gemma-3-4b-it',
        'openrouter:google/gemma-3-4b-it:free',
        'openrouter:google/learnlm-1.5-pro-experimental:free',
        'openrouter:google/palm-2-chat-bison',
        'openrouter:google/palm-2-chat-bison-32k',
        'openrouter:google/palm-2-codechat-bison',
        'openrouter:google/palm-2-codechat-bison-32k',
        'openrouter:gryphe/mythomax-l2-13b',
        'openrouter:huggingfaceh4/zephyr-7b-beta:free',
        'openrouter:infermatic/mn-inferor-12b',
        'openrouter:inflection/inflection-3-pi',
        'openrouter:inflection/inflection-3-productivity',
        'openrouter:jondurbin/airoboros-l2-70b',
        'openrouter:latitudegames/wayfarer-large-70b-llama-3.3',
        'openrouter:liquid/lfm-3b',
        'openrouter:liquid/lfm-40b',
        'openrouter:liquid/lfm-7b',
        'openrouter:mancer/weaver',
        'openrouter:meta-llama/llama-2-13b-chat',
        'openrouter:meta-llama/llama-2-70b-chat',
        'openrouter:meta-llama/llama-3-70b-instruct',
        'openrouter:meta-llama/llama-3-8b-instruct',
        'openrouter:meta-llama/llama-3.1-405b',
        'openrouter:meta-llama/llama-3.1-405b-instruct',
        'openrouter:meta-llama/llama-3.1-70b-instruct',
        'openrouter:meta-llama/llama-3.1-8b-instruct',
        'openrouter:meta-llama/llama-3.1-8b-instruct:free',
        'openrouter:meta-llama/llama-3.2-11b-vision-instruct',
        'openrouter:meta-llama/llama-3.2-11b-vision-instruct:free',
        'openrouter:meta-llama/llama-3.2-1b-instruct',
        'openrouter:meta-llama/llama-3.2-1b-instruct:free',
        'openrouter:meta-llama/llama-3.2-3b-instruct',
        'openrouter:meta-llama/llama-3.2-3b-instruct:free',
        'openrouter:meta-llama/llama-3.2-90b-vision-instruct',
        'openrouter:meta-llama/llama-3.3-70b-instruct',
        'openrouter:meta-llama/llama-3.3-70b-instruct:free',
        'openrouter:meta-llama/llama-4-maverick',
        'openrouter:meta-llama/llama-4-maverick:free',
        'openrouter:meta-llama/llama-4-scout',
        'openrouter:meta-llama/llama-4-scout:free',
        'openrouter:meta-llama/llama-guard-2-8b',
        'openrouter:meta-llama/llama-guard-3-8b',
        'openrouter:microsoft/phi-3-medium-128k-instruct',
        'openrouter:microsoft/phi-3-mini-128k-instruct',
        'openrouter:microsoft/phi-3.5-mini-128k-instruct',
        'openrouter:microsoft/phi-4',
        'openrouter:microsoft/phi-4-multimodal-instruct',
        'openrouter:microsoft/wizardlm-2-7b',
        'openrouter:microsoft/wizardlm-2-8x22b',
        'openrouter:minimax/minimax-01',
        'openrouter:mistral/ministral-8b',
        'openrouter:mistralai/codestral-2501',
        'openrouter:mistralai/codestral-mamba',
        'openrouter:mistralai/ministral-3b',
        'openrouter:mistralai/ministral-8b',
        'openrouter:mistralai/mistral-7b-instruct',
        'openrouter:mistralai/mistral-7b-instruct-v0.1',
        'openrouter:mistralai/mistral-7b-instruct-v0.2',
        'openrouter:mistralai/mistral-7b-instruct-v0.3',
        'openrouter:mistralai/mistral-7b-instruct:free',
        'openrouter:mistralai/mistral-large',
        'openrouter:mistralai/mistral-large-2407',
        'openrouter:mistralai/mistral-large-2411',
        'openrouter:mistralai/mistral-medium',
        'openrouter:mistralai/mistral-nemo',
        'openrouter:mistralai/mistral-nemo:free',
        'openrouter:mistralai/mistral-saba',
        'openrouter:mistralai/mistral-small',
        'openrouter:mistralai/mistral-small-24b-instruct-2501',
        'openrouter:mistralai/mistral-small-24b-instruct-2501:free',
        'openrouter:mistralai/mistral-small-3.1-24b-instruct',
        'openrouter:mistralai/mistral-small-3.1-24b-instruct:free',
        'openrouter:mistralai/mistral-tiny',
        'openrouter:mistralai/mixtral-8x22b-instruct',
        'openrouter:mistralai/mixtral-8x7b',
        'openrouter:mistralai/mixtral-8x7b-instruct',
        'openrouter:mistralai/pixtral-12b',
        'openrouter:mistralai/pixtral-large-2411',
        'openrouter:moonshotai/moonlight-16b-a3b-instruct:free',
        'openrouter:neversleep/llama-3-lumimaid-70b',
        'openrouter:neversleep/llama-3-lumimaid-8b',
        'openrouter:neversleep/llama-3-lumimaid-8b:extended',
        'openrouter:neversleep/llama-3.1-lumimaid-70b',
        'openrouter:neversleep/llama-3.1-lumimaid-8b',
        'openrouter:neversleep/noromaid-20b',
        'openrouter:nothingiisreal/mn-celeste-12b',
        'openrouter:nousresearch/deephermes-3-llama-3-8b-preview:free',
        'openrouter:nousresearch/hermes-2-pro-llama-3-8b',
        'openrouter:nousresearch/hermes-3-llama-3.1-405b',
        'openrouter:nousresearch/hermes-3-llama-3.1-70b',
        'openrouter:nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
        'openrouter:nousresearch/nous-hermes-llama2-13b',
        'openrouter:nvidia/llama-3.1-nemotron-70b-instruct',
        'openrouter:nvidia/llama-3.1-nemotron-70b-instruct:free',
        'openrouter:nvidia/llama-3.1-nemotron-nano-8b-v1:free',
        'openrouter:nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
        'openrouter:nvidia/llama-3.3-nemotron-super-49b-v1:free',
        'openrouter:open-r1/olympiccoder-32b:free',
        'openrouter:open-r1/olympiccoder-7b:free',
        'openrouter:openai/chatgpt-4o-latest',
        'openrouter:openai/gpt-3.5-turbo',
        'openrouter:openai/gpt-3.5-turbo-0125',
        'openrouter:openai/gpt-3.5-turbo-0613',
        'openrouter:openai/gpt-3.5-turbo-1106',
        'openrouter:openai/gpt-3.5-turbo-16k',
        'openrouter:openai/gpt-3.5-turbo-instruct',
        'openrouter:openai/gpt-4',
        'openrouter:openai/gpt-4-0314',
        'openrouter:openai/gpt-4-1106-preview',
        'openrouter:openai/gpt-4-32k',
        'openrouter:openai/gpt-4-32k-0314',
        'openrouter:openai/gpt-4-turbo',
        'openrouter:openai/gpt-4-turbo-preview',
        'openrouter:openai/gpt-4.5-preview',
        'openrouter:openai/gpt-4o',
        'openrouter:openai/gpt-4o-2024-05-13',
        'openrouter:openai/gpt-4o-2024-08-06',
        'openrouter:openai/gpt-4o-2024-11-20',
        'openrouter:openai/gpt-4o-mini',
        'openrouter:openai/gpt-4o-mini-2024-07-18',
        'openrouter:openai/gpt-4o-mini-search-preview',
        'openrouter:openai/gpt-4o-search-preview',
        'openrouter:openai/gpt-4o:extended',
        'openrouter:openai/o1',
        'openrouter:openai/o1-mini',
        'openrouter:openai/o1-mini-2024-09-12',
        'openrouter:openai/o1-preview',
        'openrouter:openai/o1-preview-2024-09-12',
        'openrouter:openai/o1-pro',
        'openrouter:openai/o3-mini',
        'openrouter:openai/o3-mini-high',
        'openrouter:openchat/openchat-7b',
        'openrouter:openrouter/auto',
        'openrouter:openrouter/quasar-alpha',
        'openrouter:perplexity/llama-3.1-sonar-large-128k-online',
        'openrouter:perplexity/llama-3.1-sonar-small-128k-online',
        'openrouter:perplexity/r1-1776',
        'openrouter:perplexity/sonar',
        'openrouter:perplexity/sonar-deep-research',
        'openrouter:perplexity/sonar-pro',
        'openrouter:perplexity/sonar-reasoning',
        'openrouter:perplexity/sonar-reasoning-pro',
        'openrouter:pygmalionai/mythalion-13b',
        'openrouter:qwen/qwen-2-72b-instruct',
        'openrouter:qwen/qwen-2.5-72b-instruct',
        'openrouter:qwen/qwen-2.5-72b-instruct:free',
        'openrouter:qwen/qwen-2.5-7b-instruct',
        'openrouter:qwen/qwen-2.5-7b-instruct:free',
        'openrouter:qwen/qwen-2.5-coder-32b-instruct',
        'openrouter:qwen/qwen-2.5-coder-32b-instruct:free',
        'openrouter:qwen/qwen-2.5-vl-72b-instruct',
        'openrouter:qwen/qwen-2.5-vl-7b-instruct',
        'openrouter:qwen/qwen-2.5-vl-7b-instruct:free',
        'openrouter:qwen/qwen-max',
        'openrouter:qwen/qwen-plus',
        'openrouter:qwen/qwen-turbo',
        'openrouter:qwen/qwen-vl-max',
        'openrouter:qwen/qwen-vl-plus',
        'openrouter:qwen/qwen2.5-32b-instruct',
        'openrouter:qwen/qwen2.5-vl-32b-instruct',
        'openrouter:qwen/qwen2.5-vl-32b-instruct:free',
        'openrouter:qwen/qwen2.5-vl-3b-instruct:free',
        'openrouter:qwen/qwen2.5-vl-72b-instruct',
        'openrouter:qwen/qwen2.5-vl-72b-instruct:free',
        'openrouter:qwen/qwq-32b',
        'openrouter:qwen/qwq-32b-preview',
        'openrouter:qwen/qwq-32b-preview:free',
        'openrouter:qwen/qwq-32b:free',
        'openrouter:raifle/sorcererlm-8x22b',
        'openrouter:rekaai/reka-flash-3:free',
        'openrouter:sao10k/fimbulvetr-11b-v2',
        'openrouter:sao10k/l3-euryale-70b',
        'openrouter:sao10k/l3-lunaris-8b',
        'openrouter:sao10k/l3.1-70b-hanami-x1',
        'openrouter:sao10k/l3.1-euryale-70b',
        'openrouter:sao10k/l3.3-euryale-70b',
        'openrouter:scb10x/llama3.1-typhoon2-70b-instruct',
        'openrouter:scb10x/llama3.1-typhoon2-8b-instruct',
        'openrouter:sophosympatheia/midnight-rose-70b',
        'openrouter:sophosympatheia/rogue-rose-103b-v0.2:free',
        'openrouter:steelskull/l3.3-electra-r1-70b',
        'openrouter:thedrummer/anubis-pro-105b-v1',
        'openrouter:thedrummer/rocinante-12b',
        'openrouter:thedrummer/skyfall-36b-v2',
        'openrouter:thedrummer/unslopnemo-12b',
        'openrouter:tokyotech-llm/llama-3.1-swallow-70b-instruct-v0.3',
        'openrouter:tokyotech-llm/llama-3.1-swallow-8b-instruct-v0.3',
        'openrouter:undi95/remm-slerp-l2-13b',
        'openrouter:undi95/toppy-m-7b',
        'openrouter:x-ai/grok-2-1212',
        'openrouter:x-ai/grok-2-vision-1212',
        'openrouter:x-ai/grok-beta',
        'openrouter:x-ai/grok-vision-beta',
        'openrouter:xwin-lm/xwin-lm-70b',
      ]
    },
    {
      label: 'Anthropic',
      models: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-2.1',
        'claude-2.0',
        'claude-instant-1.2'
      ]
    },
    {
      label: 'Google',
      models: [
        'gemini-pro',
        'gemini-pro-vision',
        'palm-2-chat-bison',
        'palm-2-codechat-bison'
      ]
    }
  ];

  // Handler for settings button
  const handleSettingsClick = () => {
    if (onOpenSettings) onOpenSettings();
    // Optionally, you can add more logic here
  };

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-30 w-64 bg-[#18181a] transition-transform duration-300 ease-in-out border-r border-white/10 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${className || ''}`}
    >
      <div className="flex items-center p-4 border-b border-white/10 bg-[#18181a]">
        {/* Settings icon, perfectly aligned and functional */}
        <button
          className="ml-auto p-2 flex items-center justify-center rounded hover:bg-white/10 focus:outline-none"
          title="Settings"
          style={{ alignSelf: 'center' }}
          onClick={handleSettingsClick}
        >
          <Settings className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Authenticated badge/message */}
      <div className="flex items-center justify-center py-2 bg-green-900/40 border-b border-green-600/30">
        <span className="text-green-400 text-xs font-semibold">
          ✅ User is authenticated with Puter.com (handled automatically)
        </span>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <div className="px-2 pt-2 border-b border-white/10">
          <TabsList className="w-full bg-[#18181a]">
            <TabsTrigger value="api" className="flex-1 text-white data-[state=active]:bg-white/10">
              <Settings className="h-4 w-4 mr-2" />
              API Settings
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 text-white data-[state=active]:bg-white/10">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-132px)] bg-[#18181a]">
          <TabsContent value="api" className="p-4 mt-0 space-y-6 animate-fade-in">
            {/* API Provider Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                API Provider
              </label>
              <Select 
                value={apiProvider} 
                onValueChange={(value) => setApiProvider(value as ApiProvider)}
              >
                <SelectTrigger className="bg-[#18181a] text-white border-white/10">
                  <SelectValue placeholder="Select API Provider" />
                </SelectTrigger>
                <SelectContent className="bg-[#18181a] text-white border-white/10">
                  {allProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Model
              </label>
              {apiProvider === 'puter.js' ? (
                <div>
                  <div
                    className={`fixed top-0 left-64 z-[10000] flex items-start justify-center bg-black/95 transition-all duration-300 ${modelDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    style={{ width: 'calc(100vw - 16rem)', height: '100vh', backdropFilter: 'blur(2px)' }}
                    onClick={() => setModelDropdownOpen(false)}
                  >
                    <div className="bg-gradient-to-br from-[#18181a] via-[#18181a]/90 to-black rounded-3xl p-10 max-h-[92vh] w-full overflow-y-auto shadow-2xl border border-white/10 relative flex flex-col gap-8 animate-fade-in" onClick={e => e.stopPropagation()}>
                      <button className="absolute top-6 right-8 text-white text-4xl hover:text-primary transition-colors focus:outline-none" onClick={() => setModelDropdownOpen(false)} aria-label="Close model selection">&times;</button>
                      <h2 className="text-4xl font-extrabold mb-6 text-white text-center tracking-tight drop-shadow-lg">Select a Model</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {puterModelCategories.map(cat => (
                          <div key={cat.label} className="bg-black/70 rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col gap-3">
                            <h3 className="text-2xl font-bold mb-3 text-primary text-center uppercase tracking-wider drop-shadow">{cat.label}</h3>
                            <div className="flex flex-col gap-1">
                              {[...new Set(cat.models)].map(m => (
                                <button
                                  key={m}
                                  className={`text-left px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-white font-mono text-base tracking-tight ${model === m ? 'bg-primary/30 font-bold ring-2 ring-primary' : ''}`}
                                  onClick={() => { setModel(m); setModelDropdownOpen(false); }}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-[#18181a] text-white border border-white/10 rounded-xl px-4 py-3 text-left mt-2 font-semibold text-lg shadow hover:bg-white/5 transition-colors"
                    onClick={() => setModelDropdownOpen(true)}
                  >
                    {model || 'Select Model'}
                  </button>
                </div>
              ) : (
                <Select 
                  value={model} 
                  onValueChange={setModel}
                  disabled={availableModels.length === 0}
                >
                  <SelectTrigger className="bg-[#18181a] text-white border-white/10">
                    <SelectValue placeholder={availableModels.length === 0 ? "No models available" : "Select Model"} />
                  </SelectTrigger>
                  <SelectContent 
                    className="bg-[#18181a] text-white border border-white z-[9999] overflow-y-auto fixed shadow-2xl"
                    position="popper"
                    style={{
                      top: 0,
                      left: 'calc(16rem + 2vw)', // a bit away from sidebar
                      width: '340px', // narrower width
                      height: '100vh',
                      maxHeight: '100vh',
                      borderRadius: 0,
                      boxShadow: '0 4px 32px 0 #000a',
                    }}
                  >
                    <div className="flex flex-col divide-y divide-white/10">
                      {availableModels.map((modelOption) => (
                        <div key={modelOption} className="hover:bg-white/10 transition-colors cursor-pointer">
                          <SelectItem value={modelOption} className="w-full px-6 py-4 text-lg text-left">
                            {modelOption}
                          </SelectItem>
                        </div>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Custom Provider Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Custom API Provider Name
              </label>
              <div className="flex space-x-2">
                <Input
                  value={customProviderInput}
                  onChange={(e) => setCustomProviderInput(e.target.value)}
                  className="bg-[#18181a] text-white border-white/10"
                  placeholder="Enter provider name"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-[#18181a] border-white/10 hover:bg-white/10"
                  onClick={saveCustomProvider}
                  title="Save Custom Provider"
                >
                  <Save className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>

            {/* Custom Model Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Custom Model Name
              </label>
              <div className="flex space-x-2">
                <Input
                  value={customModelInput}
                  onChange={(e) => setCustomModelInput(e.target.value)}
                  className="bg-[#18181a] text-white border-white/10"
                  placeholder="Enter model name"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-[#18181a] border-white/10 hover:bg-white/10"
                  onClick={saveCustomModel}
                  title="Save Custom Model"
                >
                  <Save className="h-4 w-4 text-white" />
                </Button>
              </div>
              <p className="text-xs text-white/70 mt-1">
                This model will be associated with the selected API provider.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 animate-fade-in h-full">
            <ChatHistory showDelete />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Sidebar;
