"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingChatButton() {
  const pathname = usePathname();
  
  // Don't show the button on the chat page itself
  if (pathname === "/chat") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline">Open Legal Chat</span>
      </Link>
    </div>
  );
}