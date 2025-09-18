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
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
    
        {/* Dynamic Content Area - Shows Upload OR Chat Messages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-4 px-2"
        >
          <Card>
            <CardContent className="p-6">
              {messages.length === 0 ? (
                // Show Upload Component when no messages
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">Upload Legal Documents</h3>
                  <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-lg">
                    <FileUpload onChange={handleFileUpload} />
                  </div>
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Uploaded Files:</h4>
                      <div className="space-y-2">
                        {files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {file.name.split('.').pop()?.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{file.name}</p>
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
              ) : (
                // Show Chat Messages when conversation started
                <div>
                  <h3 className="text-lg font-semibold mb-4">Conversation</h3>
                  <div className="min-h-[300px] max-h-[500px] overflow-y-auto space-y-3 border rounded-lg p-4 bg-muted/5">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${message.isAi ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${
                            message.isAi ? "flex-row" : "flex-row-reverse space-x-reverse"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.isAi
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {message.isAi ? (
                              <Bot className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 text-sm ${
                              message.isAi
                                ? "bg-muted text-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isAiLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Bot className="w-3 h-3 text-primary-foreground" />
                          </div>
                          <div className="bg-muted rounded-lg p-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Analyzing...</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Fixed Text Input Area at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-4xl w-full mx-auto px-2 pt-2 pb-4 bg-background"
        >
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={messages.length === 0 ? "Ask about your uploaded documents or legal questions..." : "Continue the conversation..."}
                      className="min-h-[60px] max-h-[120px] resize-none pr-10"
                      disabled={isAiLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      disabled={isAiLoading}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!inputValue.trim() || isAiLoading}
                    className="h-[60px] w-12 p-0"
                  >
                    {isAiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Press Enter to send • {messages.length === 0 ? "Start by uploading documents or asking questions" : "Continue your conversation"}
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}