import React, { useState, useEffect, useRef } from "react";
import { ChatProvider } from "@/components/providers/ChatProvider";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import Sidebar from "@/components/Sidebar";
import SidebarToggle from "@/components/SidebarToggle";
import { useChat } from "@/components/providers/ChatProvider";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsModal from "@/components/SettingsModal";

// ChatContainer component to separate chat UI from providers
const ChatContainer = () => {
  const { messages, isProcessing } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Auto-hide sidebar when chat input is focused
  const handleInputFocus = () => {
    setIsSidebarOpen(false);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Check if should show scroll down button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} className="bg-black" onOpenSettings={() => setShowSettingsModal(true)} />
      
      <main
        className={`flex-1 flex flex-col relative transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}
        style={{ zoom: 1.25, WebkitZoom: 1.25, scrollBehavior: 'smooth' }} // Increase scale for main chat area, smooth scroll
      >
        {/* Only one SidebarToggle at the top of the main area */}
        <SidebarToggle isOpen={isSidebarOpen} toggle={toggleSidebar} />
        
        {messages.length === 0 ? (
          // Minimal, centered empty state (like image 1)
          <div className="flex-1 flex items-center justify-center bg-black">
            {/* You can add a logo or minimal welcome here if desired */}
          </div>
        ) : (
          // Main chat area (like image 2)
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto bg-black transition-all duration-300 ease-in-out"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex flex-col gap-4 py-8 px-2 md:px-8 lg:px-24">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} curved />
              ))}
              {isProcessing && (
                <ChatMessage
                  message={{ id: 'thinking', role: 'assistant', content: '' }}
                  curved
                  isThinking
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
        
        {showScrollButton && messages.length > 0 && (
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-20 right-4 rounded-full shadow-lg z-10 bg-primary/90 hover:bg-primary"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4 text-primary-foreground" />
          </Button>
        )}
        
        <ChatInput onFocus={handleInputFocus} />
        <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <ChatContainer />
    </ChatProvider>
  );
};

export default Index;
