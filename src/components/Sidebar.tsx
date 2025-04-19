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
      models: Array.from(new Set([
        "gpt-4o","gpt-4o-mini","o1","o1-mini","o1-pro","o3","o3-mini","o4-mini","gpt-4.1","gpt-4.1-mini","gpt-4.1-nano","gpt-4.5-preview","claude-3-7-sonnet-20250219","claude-3-7-sonnet-latest","claude-3-5-sonnet-20241022","claude-3-5-sonnet-latest","claude-3-5-sonnet-20240620","claude-3-haiku-20240307","WhereIsAI/UAE-Large-V1","meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8","togethercomputer/m2-bert-80M-32k-retrieval","google/gemma-2-9b-it","cartesia/sonic","BAAI/bge-large-en-v1.5","NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO","meta-llama/Llama-2-13b-chat-hf","black-forest-labs/FLUX.1-schnell-Free","black-forest-labs/FLUX.1.1-pro","meta-llama/Meta-Llama-3-8B-Instruct-Turbo","Qwen/Qwen2.5-7B-Instruct-Turbo","deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free","meta-llama-llama-2-70b-hf","BAAI/bge-base-en-v1.5","Gryphe/MythoMax-L2-13b","meta-llama/LlamaGuard-2-8b","cartesia/sonic-2","togethercomputer/m2-bert-80M-8k-retrieval","meta-llama/Llama-3.3-70B-Instruct-Turbo-Free","upstage/SOLAR-10.7B-Instruct-v1.0","togethercomputer/MoA-1","meta-llama/Meta-Llama-3-70B-Instruct-Turbo","mistralai/Mistral-7B-Instruct-v0.2","togethercomputer/m2-bert-80M-2k-retrieval","google/gemma-2b-it","black-forest-labs/FLUX.1-pro","Gryphe/MythoMax-L2-13b-Lite","black-forest-labs/FLUX.1-redux","meta-llama/Meta-Llama-Guard-3-8B","arcee-ai/virtuoso-medium-v2","black-forest-labs/FLUX.1-depth","black-forest-labs/FLUX.1-canny","meta-llama/Llama-3-8b-chat-hf","arcee-ai/caller","arcee-ai/virtuoso-large","arcee-ai/maestro-reasoning","arcee-ai/coder-large","togethercomputer/MoA-1-Turbo","mistralai/Mistral-7B-Instruct-v0.1","scb10x/scb10x-llama3-1-typhoon2-8b-instruct","scb10x/scb10x-llama3-1-typhoon2-70b-instruct","mistralai/Mistral-Small-24B-Instruct-2501","mistralai/Mixtral-8x7B-v0.1","black-forest-labs/FLUX.1-dev-lora","deepseek-ai/DeepSeek-R1","arcee_ai/arcee-spotlight","arcee-ai/arcee-blitz","meta-llama/Llama-2-70b-hf","google/gemma-2-27b-it","deepseek-ai/DeepSeek-V3-p-dp","deepseek-ai/DeepSeek-R1-Distill-Qwen-14B","deepseek-ai/DeepSeek-V3","Qwen/Qwen2.5-VL-72B-Instruct","Qwen/Qwen2.5-Coder-32B-Instruct","Qwen/Qwen2-72B-Instruct","microsoft/WizardLM-2-8x22B","meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo","deepseek-ai/DeepSeek-R1-Distill-Llama-70B","meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo","deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B","meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo","meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo","meta-llama/Meta-Llama-3-8B-Instruct-Lite","Qwen/QwQ-32B","black-forest-labs/FLUX.1-schnell","mistralai/Mixtral-8x7B-Instruct-v0.1","Qwen/Qwen2-VL-72B-Instruct","meta-llama/Llama-3-70b-chat-hf","mistralai/Mistral-7B-Instruct-v0.3","Salesforce/Llama-Rank-V1","nvidia/Llama-3.1-Nemotron-70B-Instruct-HF","meta-llama/Llama-Vision-Free","meta-llama/Llama-Guard-3-11B-Vision-Turbo","meta-llama/Llama-3.2-3B-Instruct-Turbo","black-forest-labs/FLUX.1-dev","Qwen/Qwen2.5-72B-Instruct-Turbo","meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo","meta-llama/Llama-3.3-70B-Instruct-Turbo","meta-llama/Llama-4-Scout-17B-16E-Instruct","model-fallback-test-1","ministral-3b-2410","ministral-3b-latest","ministral-8b-2410","ministral-8b-latest","open-mistral-7b","mistral-tiny","mistral-tiny-2312","open-mixtral-8x7b","mistral-small","mistral-small-2312","open-mixtral-8x22b","open-mixtral-8x22b-2404","mistral-large-2411","mistral-large-latest","pixtral-large-2411","pixtral-large-latest","mistral-large-pixtral-2411","codestral-2501","codestral-latest","codestral-2412","codestral-2411-rc5","pixtral-12b-2409","pixtral-12b","pixtral-12b-latest","mistral-small-2503","mistral-small-latest","grok-beta","grok-vision-beta","deepseek-chat","deepseek-reasoner","gemini-1.5-flash","gemini-2.0-flash","openrouter:google/gemini-2.5-pro-preview-03-25","openrouter:thudm/glm-z1-32b:free","openrouter:thudm/glm-4-32b:free","openrouter:google/gemini-2.5-flash-preview","openrouter:google/gemini-2.5-flash-preview:thinking","openrouter:openai/o4-mini-high","openrouter:openai/o3","openrouter:openai/o4-mini","openrouter:shisa-ai/shisa-v2-llama3.3-70b:free","openrouter:qwen/qwen2.5-coder-7b-instruct","openrouter:openai/gpt-4.1","openrouter:openai/gpt-4.1-mini","openrouter:openai/gpt-4.1-nano","openrouter:eleutherai/llemma_7b","openrouter:alfredpros/codellama-7b-instruct-solidity","openrouter:arliai/qwq-32b-arliai-rpr-v1:free","openrouter:agentica-org/deepcoder-14b-preview:free","openrouter:moonshotai/kimi-vl-a3b-thinking:free","openrouter:x-ai/grok-3-mini-beta","openrouter:x-ai/grok-3-beta","openrouter:nvidia/llama-3.1-nemotron-nano-8b-v1:free","openrouter:nvidia/llama-3.3-nemotron-super-49b-v1:free","openrouter:nvidia/llama-3.1-nemotron-ultra-253b-v1:free","openrouter:meta-llama/llama-4-maverick:free","openrouter:meta-llama/llama-4-maverick","openrouter:meta-llama/llama-4-scout:free","openrouter:meta-llama/llama-4-scout","openrouter:all-hands/openhands-lm-32b-v0.1","openrouter:mistral/ministral-8b","openrouter:deepseek/deepseek-v3-base:free","openrouter:scb10x/llama3.1-typhoon2-8b-instruct","openrouter:scb10x/llama3.1-typhoon2-70b-instruct","openrouter:allenai/molmo-7b-d:free","openrouter:bytedance-research/ui-tars-72b:free","openrouter:qwen/qwen2.5-vl-3b-instruct:free","openrouter:google/gemini-3-1b-it:free","openrouter:google/gemini-3-4b-it:free","openrouter:google/gemini-3-4b-it","openrouter:ai21/jamba-1.6-large","openrouter:ai21/jamba-1.6-mini","openrouter:google/gemma-3-12b-it:free","openrouter:google/gemma-3-12b-it","openrouter:cohere/command-a","openrouter:openai/gpt-4o-mini-search-preview","openrouter:openai/gpt-4o-search-preview","openrouter:rekaai/reka-flash-3:free","openrouter:google/gemma-3-27b-it:free","openrouter:google/gemma-3-27b-it","openrouter:thedrummer/anubis-pro-105b-v1","openrouter:latitudegames/wayfarer-large-70b-llama-3.3","openrouter:thedrummer/skyfall-36b-v2","openrouter:microsoft/phi-4-multimodal-instruct","openrouter:perplexity/sonar-reasoning-pro","openrouter:perplexity/sonar-pro","openrouter:perplexity/sonar-deep-research","openrouter:deepseek/deepseek-r1-zero:free","openrouter:qwen/qwq-32b:free","openrouter:qwen/qwq-32b","openrouter:moonshotai/moonlight-16b-a3b-instruct:free","openrouter:nousresearch/deephermes-3-llama-3-8b-preview:free","openrouter:openai/gpt-4.5-preview","openrouter:google/gemini-2.0-flash-lite-001","openrouter:anthropic/claude-3.7-sonnet","openrouter:anthropic/claude-3.7-sonnet:thinking","openrouter:anthropic/claude-3.7-sonnet:beta","openrouter:perplexity/r1-1776","openrouter:mistralai/mistral-saba","openrouter:cognitivecomputations/dolphin3.0-r1-mistral-24b:free","openrouter:cognitivecomputations/dolphin3.0-mistral-24b:free","openrouter:meta-llama/llama-guard-3-8b","openrouter:openai/o3-mini-high","openrouter:deepseek/deepseek-r1-distill-llama-8b","openrouter:google/gemini-2.0-flash-001","openrouter:qwen/qwen-vl-plus","openrouter:aion-labs/aion-1.0","openrouter:aion-labs/aion-1.0-mini","openrouter:aion-labs/aion-rp-llama-3.1-8b","openrouter:qwen/qwen-vl-max","openrouter:qwen/qwen-turbo","openrouter:qwen/qwen2.5-vl-72b-instruct:free","openrouter:qwen/qwen2.5-vl-72b-instruct","openrouter:qwen/qwen-plus","openrouter:qwen/qwen-max","openrouter:openai/o3-mini","openrouter:deepseek/deepseek-r1-distill-qwen-1.5b","openrouter:mistralai/mistral-small-24b-instruct-2501:free","openrouter:mistralai/mistral-small-24b-instruct-2501","openrouter:deepseek/deepseek-r1-distill-qwen-32b:free","openrouter:deepseek/deepseek-r1-distill-qwen-32b","openrouter:deepseek/deepseek-r1-distill-qwen-14b:free","openrouter:deepseek/deepseek-r1-distill-qwen-14b","openrouter:perplexity/sonar-reasoning","openrouter:perplexity/sonar","openrouter:liquid/lfm-7b","openrouter:liquid/lfm-3b","openrouter:deepseek/deepseek-r1-distill-llama-70b:free","openrouter:deepseek/deepseek-r1-distill-llama-70b","openrouter:google/gemini-2.0-flash-thinking-exp:free","openrouter:deepseek/deepseek-r1:free","openrouter:deepseek/deepseek-r1","openrouter:sophosympatheia/rogue-rose-103b-v0.2:free","openrouter:minimax/minimax-01","openrouter:mistralai/codestral-2501","openrouter:microsoft/phi-4","openrouter:deepseek/deepseek-chat:free","openrouter:deepseek/deepseek-chat","openrouter:google/gemini-2.0-flash-thinking-exp-1219:free","openrouter:sao10k/l3.3-euryale-70b","openrouter:openai/o1","openrouter:eva-unit-01/eva-llama-3.33-70b","openrouter:x-ai/grok-2-vision-1212","openrouter:x-ai/grok-2-1212","openrouter:cohere/command-r7b-12-2024","openrouter:google/gemini-2.0-flash-exp:free","openrouter:meta-llama/llama-3.3-70b-instruct:free","openrouter:meta-llama/llama-3.3-70b-instruct","openrouter:amazon/nova-lite-v1","openrouter:amazon/nova-micro-v1","openrouter:amazon/nova-pro-v1","openrouter:qwen/qwq-32b-preview:free","openrouter:qwen/qwq-32b-preview","openrouter:google/learnlm-1.5-pro-experimental:free","openrouter:eva-unit-01/eva-qwen-2.5-72b","openrouter:openai/gpt-4o-2024-11-20","openrouter:mistralai/mistral-large-2411","openrouter:mistralai/mistral-large-2407","openrouter:mistralai/pixtral-large-2411","openrouter:x-ai/grok-vision-beta","openrouter:infermatic/mn-inferor-12b","openrouter:qwen/qwen-2.5-coder-32b-instruct:free","openrouter:qwen/qwen-2.5-coder-32b-instruct","openrouter:raifle/sorcererlm-8x22b","openrouter:eva-unit-01/eva-qwen-2.5-32b","openrouter:thedrummer/unslopnemo-12b","openrouter:anthropic/claude-3.5-haiku:beta","openrouter:anthropic/claude-3.5-haiku","openrouter:anthropic/claude-3.5-haiku-20241022:beta","openrouter:anthropic/claude-3.5-haiku-20241022","openrouter:neversleep/llama-3.1-lumimaid-70b","openrouter:anthracite-org/magnum-v4-72b","openrouter:anthropic/claude-3.5-sonnet:beta","openrouter:anthropic/claude-3.5-sonnet","openrouter:x-ai/grok-beta","openrouter:mistralai/ministral-8b","openrouter:mistralai/ministral-3b","openrouter:qwen/qwen-2.5-7b-instruct:free","openrouter:qwen/qwen-2.5-7b-instruct","openrouter:nvidia/llama-3.1-nemotron-70b-instruct:free","openrouter:nvidia/llama-3.1-nemotron-70b-instruct","openrouter:inflection/inflection-3-productivity","openrouter:inflection/inflection-3-pi","openrouter:google/gemini-flash-1.5-8b","openrouter:thedrummer/rocinante-12b","openrouter:anthracite-org/magnum-v2-72b","openrouter:liquid/lfm-40b","openrouter:meta-llama/llama-3.2-3b-instruct:free","openrouter:meta-llama/llama-3.2-3b-instruct","openrouter:meta-llama/llama-3.2-1b-instruct:free","openrouter:meta-llama/llama-3.2-1b-instruct","openrouter:meta-llama/llama-3.2-90b-vision-instruct","openrouter:meta-llama/llama-3.2-11b-vision-instruct:free","openrouter:meta-llama/llama-3.2-11b-vision-instruct","openrouter:qwen/qwen-2.5-72b-instruct:free","openrouter:qwen/qwen-2.5-72b-instruct","openrouter:qwen/qwen-2.5-vl-72b-instruct","openrouter:neversleep/llama-3.1-lumimaid-8b","openrouter:openai/o1-preview","openrouter:openai/o1-preview-2024-09-12","openrouter:openai/o1-mini","openrouter:openai/o1-mini-2024-09-12","openrouter:mistralai/pixtral-12b","openrouter:cohere/command-r-plus-08-2024","openrouter:cohere/command-r-08-2024","openrouter:qwen/qwen-2.5-vl-7b-instruct:free","openrouter:qwen/qwen-2.5-vl-7b-instruct","openrouter:sao10k/l3.1-euryale-70b","openrouter:google/gemini-flash-1.5-8b-exp","openrouter:ai21/jamba-1-5-mini","openrouter:ai21/jamba-1-5-large","openrouter:microsoft/phi-3.5-mini-128k-instruct","openrouter:nousresearch/hermes-3-llama-3.1-70b","openrouter:nousresearch/hermes-3-llama-3.1-405b","openrouter:openai/chatgpt-4o-latest","openrouter:sao10k/l3-lunaris-8b","openrouter:aetherwiing/mn-starcannon-12b","openrouter:openai/gpt-4o-2024-08-06","openrouter:meta-llama/llama-3.1-405b","openrouter:nothingiisreal/mn-celeste-12b","openrouter:perplexity/llama-3.1-sonar-small-128k-online","openrouter:perplexity/llama-3.1-sonar-large-128k-online","openrouter:meta-llama/llama-3.1-8b-instruct:free","openrouter:meta-llama/llama-3.1-8b-instruct","openrouter:meta-llama/llama-3.1-405b-instruct","openrouter:meta-llama/llama-3.1-70b-instruct","openrouter:mistralai/codestral-mamba","openrouter:mistralai/mistral-nemo:free","openrouter:mistralai/mistral-nemo","openrouter:openai/gpt-4o-mini","openrouter:openai/gpt-4o-mini-2024-07-18","openrouter:google/gemma-2-27b-it","openrouter:alpindale/magnum-72b","openrouter:google/gemma-2-9b-it:free","openrouter:google/gemma-2-9b-it","openrouter:01-ai/yi-large","openrouter:ai21/jamba-instruct","openrouter:anthropic/claude-3.5-sonnet-20240620:beta","openrouter:anthropic/claude-3.5-sonnet-20240620","openrouter:sao10k/l3-euryale-70b","openrouter:cognitivecomputations/dolphin-mixtral-8x22b","openrouter:qwen/qwen-2-72b-instruct","openrouter:mistralai/mistral-7b-instruct:free","openrouter:mistralai/mistral-7b-instruct","openrouter:mistralai/mistral-7b-instruct-v0.3","openrouter:nousresearch/hermes-2-pro-llama-3-8b","openrouter:microsoft/phi-3-mini-128k-instruct","openrouter:microsoft/phi-3-medium-128k-instruct","openrouter:neversleep/llama-3-lumimaid-70b","openrouter:google/gemini-flash-1.5","openrouter:openai/gpt-4o","openrouter:openai/gpt-4o:extended","openrouter:openai/gpt-4o-2024-05-13","openrouter:meta-llama/llama-guard-2-8b","openrouter:neversleep/llama-3-lumimaid-8b:extended","openrouter:neversleep/llama-3-lumimaid-8b","openrouter:sao10k/fimbulvetr-11b-v2","openrouter:meta-llama/llama-3-8b-instruct","openrouter:meta-llama/llama-3-70b-instruct","openrouter:mistralai/mixtral-8x22b-instruct","openrouter:microsoft/wizardlm-2-8x22b","openrouter:microsoft/wizardlm-2-7b","openrouter:google/gemini-pro-1.5","openrouter:openai/gpt-4-turbo","openrouter:cohere/command-r-plus","openrouter:cohere/command-r-plus-04-2024","openrouter:sophosympatheia/midnight-rose-70b","openrouter:cohere/command","openrouter:cohere/command-r","openrouter:anthropic/claude-3-haiku:beta","openrouter:anthropic/claude-3-haiku","openrouter:anthropic/claude-3-opus:beta","openrouter:anthropic/claude-3-opus","openrouter:anthropic/claude-3-sonnet:beta","openrouter:anthropic/claude-3-sonnet","openrouter:cohere/command-r-03-2024","openrouter:mistralai/mistral-large","openrouter:openai/gpt-3.5-turbo-0613","openrouter:openai/gpt-4-turbo-preview","openrouter:nousresearch/nous-hermes-2-mixtral-8x7b-dpo","openrouter:mistralai/mistral-medium","openrouter:mistralai/mistral-small","openrouter:mistralai/mistral-tiny","openrouter:mistralai/mistral-7b-instruct-v0.2","openrouter:cognitivecomputations/dolphin-mixtral-8x7b","openrouter:google/gemini-pro-vision","openrouter:google/gemini-pro","openrouter:mistralai/mixtral-8x7b-instruct","openrouter:openchat/openchat-7b","openrouter:neversleep/noromaid-20b","openrouter:anthropic/claude-2.1:beta","openrouter:anthropic/claude-2.1","openrouter:anthropic/claude-2:beta","openrouter:anthropic/claude-2","openrouter:undi95/toppy-m-7b","openrouter:alpindale/goliath-120b","openrouter:openrouter/auto","openrouter:openai/gpt-3.5-turbo-1106","openrouter:openai/gpt-4-1106-preview","openrouter:google/palm-2-chat-bison-32k","openrouter:google/palm-2-codechat-bison-32k","openrouter:jondurbin/airoboros-l2-70b","openrouter:xwin-lm/xwin-lm-70b","openrouter:openai/gpt-3.5-turbo-instruct","openrouter:mistralai/mistral-7b-instruct-v0.1","openrouter:pygmalionai/mythalion-13b","openrouter:openai/gpt-3.5-turbo-16k","openrouter:openai/gpt-4-32k","openrouter:openai/gpt-4-32k-0314","openrouter:nousresearch/nous-hermes-llama2-13b","openrouter:mancer/weaver","openrouter:huggingfaceh4/zephyr-7b-beta:free","openrouter:anthropic/claude-2.0:beta","openrouter:anthropic/claude-2.0","openrouter:undi95/remm-slerp-l2-13b","openrouter:google/palm-2-chat-bison","openrouter:google/palm-2-codechat-bison","openrouter:gryphe/mythomax-l2-13b","openrouter:meta-llama/llama-2-13b-chat","openrouter:meta-llama/llama-2-70b-chat","openrouter:openai/gpt-3.5-turbo","openrouter:openai/gpt-3.5-turbo-0125","openrouter:openai/gpt-4","openrouter:openai/gpt-4-0314","fake","costly","abuse"
      ]))
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
                                  className={`text-left px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors font-mono text-base tracking-tight 
                                    ${model === m ? 'bg-primary/30 font-bold ring-2 ring-primary' : ''}
                                    ${m.includes(':free') ? 'text-green-400 font-bold' : 'text-white'}
                                  `}
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
