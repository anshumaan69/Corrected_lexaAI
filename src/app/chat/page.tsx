"use client";




import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

interface Props {
  searchParams: { documentId?: string };
}
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial welcome message
    setMessages([{
      id: 'system-init',
      content: 'Greetings. I am your professional legal assistant, specializing in legal document analysis and interpretation. I can help you understand legal concepts, analyze documents, and answer legal queries in clear, accessible language. Please feel free to ask any legal or document-related questions.',
      role: 'assistant',
      timestamp: new Date()
    }]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Format the conversation history for context
      const conversationHistory = messages.map(msg => 
        `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      // Prepare the prompt with context
      const fullPrompt = `${conversationHistory}\nHuman: ${inputMessage}\nAssistant:`;

      // Prepare the prompt with professional legal context
      const prompt = `You are a professional legal assistant with expertise in legal document analysis and interpretation. 
Your role is to:
1. Provide clear, professional explanations of legal concepts in plain language
2. Only answer questions related to legal matters and document analysis
3. Maintain a formal yet accessible tone
4. If asked about non-legal or inappropriate topics, politely redirect the conversation to legal matters
5. When explaining legal terms, provide both the technical definition and a simple explanation

Please respond to this query in a professional legal manner while ensuring the explanation is clear and understandable:

${inputMessage}

Remember to:
- Use professional legal language while maintaining clarity
- Cite relevant legal principles when applicable
- Explain any legal terms used
- Stay focused on legal and document-related matters
- If the query is inappropriate or non-legal, politely redirect to legal topics`;
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: prompt
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error('API Error:', data.error);
        throw new Error(data.error || 'Failed to get response');
      }

      // Add assistant's response
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response || 'I apologize, but I could not generate a response. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="border-b bg-white p-4">
        <h1 className="text-xl font-semibold text-gray-800">Professional Legal Assistant</h1>
        <p className="text-sm text-gray-600">Expert guidance on legal matters and document analysis</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot size={40} className="mx-auto mb-2 text-gray-400" />
            <p>No messages yet. Start a conversation!</p>
          </div>
        )}
        
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
            )}
            
            <Card className={`p-4 max-w-[80%] ${
              message.role === 'assistant' 
                ? 'bg-white' 
                : 'bg-blue-100'
            }`}>
              <p className="whitespace-pre-wrap text-gray-900">{message.content}</p>
              <time className="text-xs opacity-50 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </time>
            </Card>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <Card className="p-4 bg-white">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms]" />
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 text-gray-900 placeholder:text-gray-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
}
