import React, { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send } from "lucide-react";
import { useChat } from "./providers/ChatProvider";
import { toast } from "sonner";

const ChatInput = ({ onFocus }: { onFocus?: () => void }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isProcessing } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      await sendMessage(input);
      setInput("");
    }
  };

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // File/image upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload (replace with real upload logic as needed)
      const upload = async (file: File) => {
        // Simulate network delay
        await new Promise((res) => setTimeout(res, 1200));
        // Return a mock URL (in real use, return the uploaded file URL)
        return URL.createObjectURL(file);
      };
      toast.loading("Uploading file...");
      try {
        const url = await upload(file);
        toast.success("File uploaded!");
        // Optionally, display the uploaded file/image in the chat area or input
        // For images, show a preview; for other files, show the name
        if (file.type.startsWith("image/")) {
          setInput((prev) => prev + `\n![${file.name}](${url})`);
        } else {
          setInput((prev) => prev + `\n[${file.name}](${url})`);
        }
      } catch (err) {
        toast.error("Upload failed");
      }
      // Reset input so the same file can be selected again
      e.target.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex justify-center items-end pb-4 bg-transparent z-20">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-2xl w-full mx-auto p-4 flex items-end gap-2 rounded-xl bg-black border border-white/10 shadow"
      >
        {/* Plus icon for file/image upload */}
        <button
          type="button"
          className="flex items-center justify-center rounded-full bg-black hover:bg-white/10 text-white w-10 h-10 mr-2 focus:outline-none focus:ring-0 border border-white/10 shadow-none"
          onClick={openFilePicker}
          tabIndex={0}
          aria-label="Upload file or image"
        >
          <Plus className="w-6 h-6" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.txt,.doc,.docx,.json,.csv,.md"
          className="hidden"
          onChange={handleFileChange}
        />
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder="Message ChatGPT..."
          disabled={isProcessing}
          className="flex-1 min-h-[48px] max-h-[200px] rounded-xl resize-none py-3 px-4 bg-black text-white border border-white/10 focus:border-primary/40 focus:outline-none focus:ring-0 shadow-none transition-colors duration-200"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={isProcessing || !input.trim()}
          className="ml-2 rounded-full bg-black hover:bg-white/10 text-white w-10 h-10 focus:outline-none focus:ring-0 border border-white/10 shadow-none"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
