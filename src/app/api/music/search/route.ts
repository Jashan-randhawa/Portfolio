import { searchJioSaavn } from "@/lib/jiosaavn"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim()

  if (!query) {
    return NextResponse.json(
      { success: false, error: "Query parameter 'q' is required" },
      { status: 400 }
    )
  }

  try {
    const songs = await searchJioSaavn(query, 10)
    return NextResponse.json({ success: true, songs })
  } catch (error: any) {
    console.error("Music search API error:", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to search songs" },
      { status: 500 }
    )
  }
}
