import { getSongById } from "@/lib/jiosaavn"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")?.trim()

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Query parameter 'id' is required" },
      { status: 400 }
    )
  }

  try {
    const song = await getSongById(id)
    if (!song) {
      return NextResponse.json(
        { success: false, error: "Song not found or stream unavailable" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, song })
  } catch (error: any) {
    console.error("Song details API error:", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch song details" },
      { status: 500 }
    )
  }
}
