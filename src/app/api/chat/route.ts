import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not configured in environment variables");
}

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // For chat-like interactions, we'll use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate response with the provided context
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from AI");
    }

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}