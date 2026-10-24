import { NextRequest, NextResponse } from "next/server";

// Server-side only env var for the actual RAG backend
const RAG_API_URL = process.env.RAG_API_URL || "http://localhost:8001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const res = await fetch(`${RAG_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "RAG API error", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Assistant chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}