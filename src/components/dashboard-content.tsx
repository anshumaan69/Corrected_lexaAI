"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { Send, Bot, User, Loader2, Paperclip } from "lucide-react";

export function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{id: string, content: string, isAi: boolean, timestamp: Date}>>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAiLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsAiLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about: "${userMessage.content}". As LexBharat AI, I can help you analyze legal documents for constitutional compliance, risk assessment, and provide plain language summaries. Please upload your document and I'll provide detailed insights.`,
        isAi: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsAiLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-80 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Upload Area Skeleton */}
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-10">
                <div className="text-center space-y-4">
                  <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                  <Skeleton className="h-6 w-48 mx-auto" />
                  <Skeleton className="h-4 w-64 mx-auto" />
                  <div className="mt-8">
                    <Skeleton className="h-32 w-32 mx-auto rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Content Skeleton */}
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Dynamic Content Area - Shows Upload OR Chat Messages */}
        {messages.length === 0 ? (
          // Show Upload Component when no messages - Centered
          <div className="flex items-center justify-center h-full p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-md mx-auto"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-base font-semibold mb-3">Upload Legal Documents</h3>
                    <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-lg">
                      <FileUpload onChange={handleFileUpload} />
                    </div>
                    {files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 text-sm">Uploaded Files:</h4>
                        <div className="space-y-2">
                          {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                                  <span className="text-xs font-medium">
                                    {file.name.split('.').pop()?.toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-left">
                                  <p className="font-medium text-xs">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs text-green-600 font-medium">Ready</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          // Show Chat Messages - ChatGPT Style UI with proper scrolling
          <div className="px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isAi
                          ? "bg-primary text-primary-foreground"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {message.isAi ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 space-y-2">
                      {/* Message Text */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground leading-7 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      
                      {/* Action Buttons - Only show on hover/focus and for AI messages */}
                      {message.isAi && (
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2H4.5a2 2 0 00-1.897 1.367L2 9v9c0 .55.45 1 1 1h3.5c.55 0 1-.45 1-1v-8z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Loading State */}
              {isAiLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">LexBharat is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed ChatGPT-style Input Area - Flex-shrink-0 to prevent scrolling */}
      <div className="flex-shrink-0 border-t bg-background p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end space-x-3">
              {/* Attachment Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full flex-shrink-0"
                disabled={isAiLoading}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              {/* Input Field */}
              <div className="flex-1 relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything"
                  className="min-h-[44px] max-h-[200px] resize-none rounded-2xl border-2 px-4 py-3 pr-12 focus:border-primary focus:outline-none focus:ring-0"
                  disabled={isAiLoading}
                />
                
                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isAiLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full p-0"
                >
                  {isAiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Footer Text */}
            <p className="text-xs text-center text-muted-foreground mt-3">
              LexBharat can make mistakes. Check important info.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}