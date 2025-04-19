import React, { useState, useEffect } from "react";
import { useChat, ApiProvider } from "./providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X, Save, Settings, History, Trash2, Menu } from "lucide-react";
import ChatHistory from "./ChatHistory";
import CodeBlockRenderer from "./CodeBlockRenderer";

// In the Sidebar or wherever you display model responses:
// Example usage (replace `modelResponse` with your actual response variable):
// <CodeBlockRenderer response={modelResponse} />

interface SidebarProps {
  isOpen: boolean;
  className?: string;
}

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
        'gpt-4o', 'gpt-4o-mini', 'o1', 'o1-mini', 'o1-pro', 'o3', 'o3-mini', 'o4-mini', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-4.5-preview'
      ]
    },
    {
      label: 'Gemini',
      models: [
        'google/gemini-2.5-flash-preview', 'google/gemini-2.5-flash-preview:thinking', 'google/gemini-2.5-pro-exp-03-25:free', 'google/gemini-2.0-flash-lite-001', 'google/gemini-2.0-flash-001', 'google/gemini-2.0-pro-exp-02-05:free', 'google/gemini-2.0-flash-thinking-exp:free', 'google/gemini-2.0-flash-thinking-exp-1219:free', 'google/gemini-2.0-flash-exp:free', 'google/gemini-flash-1.5-8b', 'google/gemini-flash-1.5-8b-exp', 'google/gemini-flash-1.5', 'google/gemini-pro-1.5', 'google/gemini-pro'
      ]
    },
    {
      label: 'OpenRouter',
      models: [
        '01-ai/yi-large',
        'aetherwiing/mn-starcannon-12b',
        'agentica-org/deepcoder-14b-preview:free',
        'ai21/jamba-1-5-large',
        'ai21/jamba-1-5-mini',
        'ai21/jamba-1.6-large',
        'ai21/jamba-1.6-mini',
        'ai21/jamba-instruct',
        'aion-labs/aion-1.0',
        'aion-labs/aion-1.0-mini',
        'aion-labs/aion-rp-llama-3.1-8b',
        'alfredpros/codellama-7b-instruct-solidity',
        'all-hands/openhands-lm-32b-v0.1',
        'allenai/molmo-7b-d:free',
        'alpindale/goliath-120b',
        'alpindale/magnum-72b',
        'amazon/nova-lite-v1',
        'amazon/nova-micro-v1',
        'amazon/nova-pro-v1',
        'anthracite-org/magnum-v2-72b',
        'anthracite-org/magnum-v4-72b',
        'anthropic/claude-2',
        'anthropic/claude-2.0',
        'anthropic/claude-2.0:beta',
        'anthropic/claude-2.1',
        'anthropic/claude-2.1:beta',
        'anthropic/claude-2:beta',
        'anthropic/claude-3-haiku',
        'anthropic/claude-3-haiku:beta',
        'anthropic/claude-3-opus',
        'anthropic/claude-3-opus:beta',
        'anthropic/claude-3-sonnet',
        'anthropic/claude-3-sonnet:beta',
        'anthropic/claude-3.5-haiku',
        'anthropic/claude-3.5-haiku-20241022',
        'anthropic/claude-3.5-haiku-20241022:beta',
        'anthropic/claude-3.5-haiku:beta',
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3.5-sonnet-20240620',
        'anthropic/claude-3.5-sonnet-20240620:beta',
        'anthropic/claude-3.5-sonnet:beta',
        'anthropic/claude-3.7-sonnet',
        'anthropic/claude-3.7-sonnet:beta',
        'anthropic/claude-3.7-sonnet:thinking',
        'arliai/qwq-32b-arliai-rpr-v1:free',
        'bytedance-research/ui-tars-72b:free',
        'cognitivecomputations/dolphin-mixtral-8x22b',
        'cognitivecomputations/dolphin-mixtral-8x7b',
        'cognitivecomputations/dolphin3.0-mistral-24b:free',
        'cognitivecomputations/dolphin3.0-r1-mistral-24b:free',
        'cohere/command',
        'cohere/command-a',
        'cohere/command-r',
        'cohere/command-r-03-2024',
        'cohere/command-r-08-2024',
        'cohere/command-r-plus',
        'cohere/command-r-plus-04-2024',
        'cohere/command-r-plus-08-2024',
        'cohere/command-r7b-12-2024',
        'deepseek/deepseek-chat',
        'deepseek/deepseek-chat-v3-0324',
        'deepseek/deepseek-chat-v3-0324:free',
        'deepseek/deepseek-chat:free',
        'deepseek/deepseek-r1',
        'deepseek/deepseek-r1-distill-llama-70b',
        'deepseek/deepseek-r1-distill-llama-70b:free',
        'deepseek/deepseek-r1-distill-llama-8b',
        'deepseek/deepseek-r1-distill-qwen-1.5b',
        'deepseek/deepseek-r1-distill-qwen-14b',
        'deepseek/deepseek-r1-distill-qwen-14b:free',
        'deepseek/deepseek-r1-distill-qwen-32b',
        'deepseek/deepseek-r1-distill-qwen-32b:free',
        'deepseek/deepseek-r1-zero:free',
        'deepseek/deepseek-r1:free',
        'deepseek/deepseek-v3-base:free',
        'eleutherai/llemma_7b',
        'eva-unit-01/eva-llama-3.33-70b',
        'eva-unit-01/eva-qwen-2.5-32b',
        'eva-unit-01/eva-qwen-2.5-72b',
        'featherless/qwerky-72b:free',
        'google/gemini-2.0-flash-001',
        'google/gemini-2.0-flash-exp:free',
        'google/gemini-2.0-flash-lite-001',
        'google/gemini-2.0-flash-thinking-exp-1219:free',
        'google/gemini-2.0-flash-thinking-exp:free',
        'google/gemini-2.0-pro-exp-02-05:free',
        'google/gemini-2.5-flash-preview',
        'google/gemini-2.5-flash-preview:thinking',
        'google/gemini-2.5-pro-exp-03-25:free',
        'google/gemini-2.5-pro-preview-03-25',
        'google/gemini-flash-1.5',
        'google/gemini-flash-1.5-8b',
        'google/gemini-flash-1.5-8b-exp',
        'google/gemini-pro',
        'google/gemini-pro-1.5',
        'google/gemini-pro-vision',
        'google/gemma-2-27b-it',
        'google/gemma-2-9b-it',
        'google/gemma-2-9b-it:free',
        'google/gemma-3-12b-it',
        'google/gemma-3-12b-it:free',
        'google/gemma-3-1b-it:free',
        'google/gemma-3-27b-it',
        'google/gemma-3-27b-it:free',
        'google/gemma-3-4b-it',
        'google/gemma-3-4b-it:free',
        'google/learnlm-1.5-pro-experimental:free',
        'google/palm-2-chat-bison',
        'google/palm-2-chat-bison-32k',
        'google/palm-2-codechat-bison',
        'google/palm-2-codechat-bison-32k',
        'gryphe/mythomax-l2-13b',
        'huggingfaceh4/zephyr-7b-beta:free',
        'infermatic/mn-inferor-12b',
        'inflection/inflection-3-pi',
        'inflection/inflection-3-productivity',
        'jondurbin/airoboros-l2-70b',
        'latitudegames/wayfarer-large-70b-llama-3.3',
        'liquid/lfm-3b',
        'liquid/lfm-40b',
        'liquid/lfm-7b',
        'mancer/weaver',
        'meta-llama/llama-2-13b-chat',
        'meta-llama/llama-2-70b-chat',
        'meta-llama/llama-3-70b-instruct',
        'meta-llama/llama-3-8b-instruct',
        'meta-llama/llama-3.1-405b',
        'meta-llama/llama-3.1-405b-instruct',
        'meta-llama/llama-3.1-70b-instruct',
        'meta-llama/llama-3.1-8b-instruct',
        'meta-llama/llama-3.1-8b-instruct:free',
        'meta-llama/llama-3.2-11b-vision-instruct',
        'meta-llama/llama-3.2-11b-vision-instruct:free',
        'meta-llama/llama-3.2-1b-instruct',
        'meta-llama/llama-3.2-1b-instruct:free',
        'meta-llama/llama-3.2-3b-instruct',
        'meta-llama/llama-3.2-3b-instruct:free',
        'meta-llama/llama-3.2-90b-vision-instruct',
        'meta-llama/llama-3.3-70b-instruct',
        'meta-llama/llama-3.3-70b-instruct:free',
        'meta-llama/llama-4-maverick',
        'meta-llama/llama-4-maverick:free',
        'meta-llama/llama-4-scout',
        'meta-llama/llama-4-scout:free',
        'meta-llama/llama-guard-2-8b',
        'meta-llama/llama-guard-3-8b',
        'microsoft/phi-3-medium-128k-instruct',
        'microsoft/phi-3-mini-128k-instruct',
        'microsoft/phi-3.5-mini-128k-instruct',
        'microsoft/phi-4',
        'microsoft/phi-4-multimodal-instruct',
        'microsoft/wizardlm-2-7b',
        'microsoft/wizardlm-2-8x22b',
        'minimax/minimax-01',
        'mistral/ministral-8b',
        'mistralai/codestral-2501',
        'mistralai/codestral-mamba',
        'mistralai/mistral-7b-instruct',
        'mistralai/mistral-7b-instruct-v0.1',
        'mistralai/mistral-7b-instruct-v0.2',
        'mistralai/mistral-7b-instruct-v0.3',
        'mistralai/mistral-7b-instruct:free',
        'mistralai/mistral-large',
        'mistralai/mistral-large-2407',
        'mistralai/mistral-large-2411',
        'mistralai/mistral-medium',
        'mistralai/mistral-nemo',
        'mistralai/mistral-nemo:free',
        'mistralai/mistral-saba',
        'mistralai/mistral-small',
        'mistralai/mistral-small-24b-instruct-2501',
        'mistralai/mistral-small-24b-instruct-2501:free',
        'mistralai/mistral-small-3.1-24b-instruct',
        'mistralai/mistral-small-3.1-24b-instruct:free',
        'mistralai/mistral-tiny',
        'mistralai/ministral-3b',
        'mistralai/ministral-8b',
        'mistralai/mixtral-8x22b-instruct',
        'mistralai/mixtral-8x7b-instruct',
        'mistralai/pixtral-12b',
        'mistralai/pixtral-large-2411',
        'moonshotai/kimi-vl-a3b-thinking:free',
        'moonshotai/moonlight-16b-a3b-instruct:free',
        'neversleep/llama-3-lumimaid-70b',
        'neversleep/llama-3-lumimaid-8b',
        'neversleep/llama-3-lumimaid-8b:extended',
        'neversleep/llama-3.1-lumimaid-70b',
        'neversleep/llama-3.1-lumimaid-8b',
        'neversleep/noromaid-20b',
        'nothingiisreal/mn-celeste-12b',
        'nousresearch/deephermes-3-llama-3-8b-preview:free',
        'nousresearch/hermes-2-pro-llama-3-8b',
        'nousresearch/hermes-3-llama-3.1-405b',
        'nousresearch/hermes-3-llama-3.1-70b',
        'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
        'nousresearch/nous-hermes-llama2-13b',
        'nvidia/llama-3.1-nemotron-70b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct:free',
        'nvidia/llama-3.1-nemotron-nano-8b-v1:free',
        'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
        'nvidia/llama-3.3-nemotron-super-49b-v1:free',
        'openai/chatgpt-4o-latest',
        'openai/gpt-3.5-turbo',
        'openai/gpt-3.5-turbo-0125',
        'openai/gpt-3.5-turbo-0613',
        'openai/gpt-3.5-turbo-1106',
        'openai/gpt-3.5-turbo-16k',
        'openai/gpt-3.5-turbo-instruct',
        'openai/gpt-4',
        'openai/gpt-4-0314',
        'openai/gpt-4-1106-preview',
        'openai/gpt-4-32k',
        'openai/gpt-4-32k-0314',
        'openai/gpt-4-turbo',
        'openai/gpt-4-turbo-preview',
        'openai/gpt-4.1',
        'openai/gpt-4.1-mini',
        'openai/gpt-4.1-nano',
        'openai/gpt-4.5-preview',
        'openai/gpt-4o',
        'openai/gpt-4o-2024-05-13',
        'openai/gpt-4o-2024-08-06',
        'openai/gpt-4o-2024-11-20',
        'openai/gpt-4o-mini',
        'openai/gpt-4o-mini-2024-07-18',
        'openai/gpt-4o-mini-search-preview',
        'openai/gpt-4o-search-preview',
        'openai/gpt-4o:extended',
        'openai/o1',
        'openai/o1-mini',
        'openai/o1-mini-2024-09-12',
        'openai/o1-preview',
        'openai/o1-preview-2024-09-12',
        'openai/o1-pro',
        'openai/o3',
        'openai/o3-mini',
        'openai/o3-mini-high',
        'openai/o4-mini',
        'openai/o4-mini-high',
        'open-r1/olympiccoder-32b:free',
        'open-r1/olympiccoder-7b:free',
        'openchat/openchat-7b',
        'openrouter/auto',
        'perplexity/llama-3.1-sonar-large-128k-online',
        'perplexity/llama-3.1-sonar-small-128k-online',
        'perplexity/r1-1776',
        'perplexity/sonar',
        'perplexity/sonar-deep-research',
        'perplexity/sonar-pro',
        'perplexity/sonar-reasoning',
        'perplexity/sonar-reasoning-pro',
        'pygmalionai/mythalion-13b',
        'qwen/qwq-32b',
        'qwen/qwq-32b-preview',
        'qwen/qwq-32b-preview:free',
        'qwen/qwq-32b:free',
        'qwen/qwen-2-72b-instruct',
        'qwen/qwen-2.5-72b-instruct',
        'qwen/qwen-2.5-72b-instruct:free',
        'qwen/qwen-2.5-7b-instruct',
        'qwen/qwen-2.5-7b-instruct:free',
        'qwen/qwen-2.5-coder-32b-instruct',
        'qwen/qwen-2.5-coder-32b-instruct:free',
        'qwen/qwen-2.5-coder-7b-instruct',
        'qwen/qwen-2.5-vl-32b-instruct',
        'qwen/qwen-2.5-vl-32b-instruct:free',
        'qwen/qwen-2.5-vl-3b-instruct:free',
        'qwen/qwen-2.5-vl-72b-instruct',
        'qwen/qwen-2.5-vl-72b-instruct:free',
        'qwen/qwen-2.5-vl-7b-instruct',
        'qwen/qwen-2.5-vl-7b-instruct:free',
        'qwen/qwen-max',
        'qwen/qwen-plus',
        'qwen/qwen-turbo',
        'qwen/qwen-vl-max',
        'qwen/qwen-vl-plus',
        'raifle/sorcererlm-8x22b',
        'rekaai/reka-flash-3:free',
        'sao10k/fimbulvetr-11b-v2',
        'sao10k/l3-euryale-70b',
        'sao10k/l3-lunaris-8b',
        'sao10k/l3.1-70b-hanami-x1',
        'sao10k/l3.1-euryale-70b',
        'sao10k/l3.3-euryale-70b',
        'scb10x/llama3.1-typhoon2-70b-instruct',
        'scb10x/llama3.1-typhoon2-8b-instruct',
        'shisa-ai/shisa-v2-llama3.3-70b:free',
        'sophosympatheia/midnight-rose-70b',
        'sophosympatheia/rogue-rose-103b-v0.2:free',
        'steelskull/l3.3-electra-r1-70b',
        'thedrummer/anubis-pro-105b-v1',
        'thedrummer/rocinante-12b',
        'thedrummer/skyfall-36b-v2',
        'thedrummer/unslopnemo-12b',
        'thudm/glm-4-32b:free',
        'thudm/glm-z1-32b:free',
        'undi95/remm-slerp-l2-13b',
        'undi95/toppy-m-7b',
        'x-ai/grok-2-1212',
        'x-ai/grok-2-vision-1212',
        'x-ai/grok-3-beta',
        'x-ai/grok-3-mini-beta',
        'x-ai/grok-beta',
        'x-ai/grok-vision-beta',
        'xwin-lm/xwin-lm-70b'
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
