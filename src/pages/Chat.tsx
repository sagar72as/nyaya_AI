import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Copy, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "suggestion";
}

interface RagDebugInfo {
  clause: string;
  summary: string;
}

// Utility to strip markdown and unwanted characters from Gemini output
function stripMarkdown(text: string): string {
  return text.replace(/[*_`]+/g, "").replace(/\n{2,}/g, "\n\n");
}

const SYSTEM_PROMPT = `
You are a caring, confident legal assistant. Always reassure the user and explain things in plain language.
Never say "I can't give legal advice" or similar disclaimers. Instead, explain clearly what the law says, how similar cases were handled, and what practical steps someone in this situation can take.
Refer to specific past legal cases from the database/context when possible, and use a positive, helpful, and understanding tone.
If a case is very serious or urgent, advise the user to consult a lawyer, but always explain what actions they can take right now.
Never use formatting like *, _, bullet points, or markdown.

IMPORTANT: For every answer, do your best to infer and explicitly mention the most relevant Indian Penal Code (IPC) section or law that applies to the user's situation and the cited cases—even if this information is not directly present in the database. Clearly state the section (for example, "This situation would likely fall under IPC Section 420 for cheating") and explain why, in a way understandable to a layperson.

If the case or context does not clearly specify an IPC section, analyze the facts, and based on your legal knowledge, state the most likely IPC section or other law that would be relevant, and give a one-line explanation for your reasoning.

Remember details and follow-up questions from earlier in the conversation. Keep your answers under 250 words and speak directly and encouragingly.
`.trim();

const suggestions = [
  "Help me review a contract",
  "I need to understand my tenant rights",
  "How do I start a small business?",
  "What are my employment rights?",
  "I need help with a legal dispute",
  "Connect me with a lawyer",
];

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "👋 Hello! I'm your AI legal assistant. Ask me anything about legal matters, contracts, or finding a lawyer.",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [ragDebug, setRagDebug] = useState<RagDebugInfo[]>([]);
  const [debugOpen, setDebugOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setRagDebug([]);
    try {
      // 1. Query Flask for top matches
      const response = await fetch("http://localhost:5000/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputValue }),
      });
      const data = await response.json();
      const topClauses = data.results.slice(0, 2).map((r: any) => r.content);

      // 2. Summarize each clause with Gemini and ask it to infer IPC/Section
      const summaries: string[] = [];
      const debugInfo: RagDebugInfo[] = [];
      for (const clause of topClauses) {
        const summaryPrompt = `
Extract, in your own words, any important legal outcome, principle, or user-friendly advice in this clause that could help answer the user's situation: "${inputValue}".
If the clause describes a similar case, summarize how it was resolved and what helped the accused or parties.
Always state which Indian Penal Code (IPC) section or law is most likely relevant for this case, and explain briefly why, in simple language, even if it is not stated in the clause.
Write in simple, reassuring language as if explaining to a friend.
If the clause is not relevant, reply: "Not relevant."
Clause:
${clause}
        `.trim();

        const summaryRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: summaryPrompt }],
                },
              ],
              generationConfig: { maxOutputTokens: 350, temperature: 0.3 },
            }),
          }
        );
        const summaryData = await summaryRes.json();
        let summaryText =
          summaryData.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No summary found.";
        summaryText = stripMarkdown(summaryText);
        summaries.push(summaryText);
        debugInfo.push({ clause, summary: summaryText });
      }
      setRagDebug(debugInfo);

      const effectiveSummary = (summary: string, clause: string) =>
        summary && summary.toLowerCase().includes("not relevant")
          ? clause
          : summary;

      const relevantSummaries = summaries.map((s, i) =>
        effectiveSummary(s, topClauses[i])
      );

      // 3. Prepare message history for Gemini (enables memory!)
      const chatHistory = [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        ...messages
          .filter((m) => m.type === "text")
          .map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        {
          role: "user",
          parts: [{ text: inputValue }],
        },
      ];

      // Compose the context block
      const finalContextBlock = relevantSummaries
        .map((s, i) => `Case ${i + 1}: ${s}`)
        .join("\n\n");

      // Combine context and question
      const contextWithHistory = `
Below are relevant legal case summaries from the database:

${finalContextBlock}

User's latest situation:
${inputValue}

Remember: Always use clear and friendly explanations, refer to these cases, and remember any important details the user shared earlier. Never say you cannot give legal advice—instead, explain what the law and similar cases suggest and guide the user helpfully.
      `.trim();

      // Overwrite the latest user message with one that contains all context
      chatHistory[chatHistory.length - 1] = {
        role: "user",
        parts: [{ text: contextWithHistory }],
      };

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: chatHistory,
            generationConfig: { maxOutputTokens: 1000, temperature: 0.3 },
          }),
        }
      );

      const geminiData = await geminiRes.json();
      let llmAnswer =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
        geminiData.error?.message ||
        "Sorry, I couldn't process your request.";

      llmAnswer = stripMarkdown(llmAnswer);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: llmAnswer,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I couldn't process your request.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard.",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#f0f6fc] to-[#f6fafe]">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header and subtitle */}
        <div className="pt-10 pb-5 text-center">
          <h1 className="text-3xl font-bold text-teal-800 mb-1">
            AI Legal Assistant
          </h1>
          <p className="text-base text-gray-600 mb-2">
            Get instant legal guidance or connect with a lawyer.
          </p>
        </div>

        {/* Chat card */}
        <div className="flex flex-col items-center">
          <Card className="w-full shadow-chat rounded-2xl bg-white border border-gray-100">
            <CardHeader className="border-b border-gray-100 bg-white rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Bot className="h-5 w-5 text-teal-500" />
                <span>Nyaya Legal Assistant</span>
                <Badge variant="secondary" className="ml-1">Online</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-white min-h-[320px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-[80%] px-5 py-3 rounded-2xl shadow-chat ${
                      msg.sender === "user"
                        ? "bg-blue-50 text-gray-900"
                        : "bg-white text-gray-800 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.sender === "bot" && (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-teal-400" />
                      )}
                      {msg.sender === "user" && (
                        <User className="h-4 w-4 mt-1 flex-shrink-0 text-blue-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-base whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-60">
                            {formatTime(msg.timestamp)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                            onClick={() => copyMessage(msg.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 text-gray-500 rounded-2xl px-5 py-3 shadow-chat max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-base">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Chat Input & Suggestions */}
            <div className="border-t border-gray-100 bg-white p-4 rounded-b-2xl">
              <div className="mb-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs rounded-full border-gray-200 bg-blue-50 hover:bg-blue-100"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  placeholder="Type your legal question here..."
                  value={inputValue}
                  autoFocus
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  className="flex-1 rounded-full bg-gray-50 border-gray-200 focus:ring-blue-100"
                  aria-label="Type your message"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Collapsible Debug Window */}
          <div className="w-full mt-4">
            <Button
              variant="outline"
              size="sm"
              className="mb-2 rounded-full bg-white border-gray-200"
              onClick={() => setDebugOpen((o) => !o)}
              aria-expanded={debugOpen}
              aria-controls="rag-debug-content"
            >
              {debugOpen ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Hide RAG Debug Info
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show RAG Debug Info
                </>
              )}
            </Button>
            {debugOpen && ragDebug.length > 0 && (
              <div
                id="rag-debug-content"
                className="p-4 border rounded-xl bg-blue-50 shadow"
              >
                <h2 className="text-lg font-semibold mb-2">RAG Debug: Top Clauses and Summaries</h2>
                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                  {ragDebug.map((info, idx) => (
                    <li key={idx}>
                      <div>
                        <div className="font-semibold mb-1">Clause:</div>
                        <div className="font-mono text-gray-800 whitespace-pre-wrap bg-gray-100 rounded p-2">{info.clause}</div>
                        <div className="font-semibold mt-2 mb-1">Summary:</div>
                        <div className="text-blue-900 whitespace-pre-wrap bg-gray-100 rounded p-2">{info.summary}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 mb-4 p-4 bg-white rounded-xl border text-center shadow-sm">
          <p className="text-sm text-gray-500">
            <strong>Disclaimer:</strong> This AI assistant provides general legal information and is not a substitute for professional legal advice. For specific legal matters, please consult with a qualified attorney.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
