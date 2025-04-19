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
        'openrouter:anthropic/claude-3-opus',
        'openrouter:anthropic/claude-3-sonnet',
        'openrouter:anthropic/claude-3-haiku',
        'openrouter:google/gemini-pro',
        'openrouter:google/gemini-pro-vision',
        'openrouter:meta-llama/llama-3.3-70b-instruct',
        'openrouter:mistralai/mistral-large',
        'openrouter:mistralai/mixtral-8x7b-instruct',
        'openrouter:anthropic/claude-2.1',
        'openrouter:qwen/qwen-max',
        'openrouter:google/gemini-2.5-pro-preview-03-25',
        'openrouter:meta-llama/llama-4-maverick',
        'openrouter:openai/gpt-4-turbo-preview',
        'openrouter:cohere/command-r',
        'openrouter:meta-llama/llama-3.2-90b-vision-instruct',
        'openrouter:anthropic/claude-3.5-sonnet',
        'openrouter:deepseek/deepseek-chat-v3-0324',
        'openrouter:nousresearch/nous-hermes-llama2-13b',
        'openrouter:google/gemma-3-27b-it'
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
