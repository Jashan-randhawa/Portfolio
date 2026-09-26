import forge from "node-forge"
import { PUNJABI_GENRES } from "@/data/punjabi-genres"

export interface JioSaavnSong {
  id: string
  title: string
  artist: string
  album: string
  year?: string
  duration: number
  image: string
  streamUrl: string
}

export interface MoodCategory {
  id: string
  name: string
  description: string
  badge: string
  tracks: JioSaavnSong[]
}

export { PUNJABI_GENRES }

export function decodeHtmlEntities(str: string): string {
  if (!str) return ""
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

/**
 * Decrypts JioSaavn's DES-ECB encrypted media URL using key '38346591'
 * (Reference: cyberboysumanjay/JioSaavnAPI & sumitkolhe/jiosaavn-api)
 */
export function decryptMediaUrl(encryptedUrl: string): string {
  if (!encryptedUrl) return ""
  try {
    const key = "38346591"
    const iv = "00000000"
    const encrypted = forge.util.decode64(encryptedUrl)
    const decipher = forge.cipher.createDecipher(
      "DES-ECB",
      forge.util.createBuffer(key)
    )
    decipher.start({ iv: forge.util.createBuffer(iv) })
    decipher.update(forge.util.createBuffer(encrypted))
    decipher.finish()
    const decrypted = decipher.output.getBytes()
    // Prefer 160kbps AAC for instantaneous streaming & CD-like fidelity
    return decrypted.replace("_96.mp4", "_160.mp4")
  } catch (err) {
    console.error("Failed to decrypt JioSaavn media URL:", err)
    return ""
  }
}

/**
 * Searches JioSaavn API for songs and returns mapped JioSaavnSong objects
 */
export async function searchJioSaavn(
  query: string,
  limit = 10
): Promise<JioSaavnSong[]> {
  const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&q=${encodeURIComponent(
    query
  )}&p=1&n=${limit}`

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`JioSaavn API responded with ${res.status}`)
  }

  const data = await res.json()
  const results = data.results || []

  return results
    .map((item: any) => {
      const encryptedUrl =
        item.more_info?.encrypted_media_url || item.encrypted_media_url || ""
      const streamUrl = decryptMediaUrl(encryptedUrl)
      if (!streamUrl) return null

      const image = (item.image || "")
        .replace("150x150", "500x500")
        .replace("http://", "https://")

      return {
        id: item.id,
        title: decodeHtmlEntities(item.title || item.song || "Unknown Title"),
        artist: decodeHtmlEntities(
          item.subtitle ||
            item.more_info?.singers ||
            item.primary_artists ||
            "Unknown Artist"
        ),
        album: decodeHtmlEntities(item.more_info?.album || item.album || ""),
        year: item.year || item.more_info?.year || "",
        duration: Number(item.more_info?.duration || item.duration || 0),
        image,
        streamUrl,
      } as JioSaavnSong
    })
    .filter(Boolean) as JioSaavnSong[]
}

/**
 * Fetches specific song details by ID from JioSaavn
 * (Equivalent to cyberboysumanjay/JioSaavnAPI song.getDetails)
 */
export async function getSongById(id: string): Promise<JioSaavnSong | null> {
  const url = `https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0&_format=json&pids=${encodeURIComponent(
    id
  )}`

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    next: { revalidate: 3600 },
  })

  if (!res.ok) return null

  const data = await res.json()
  const item = data[id] || (Object.values(data)[0] as any)
  if (!item || item.status === "failure") return null

  const encryptedUrl =
    item.encrypted_media_url || item.more_info?.encrypted_media_url || ""
  const streamUrl = decryptMediaUrl(encryptedUrl)
  if (!streamUrl) return null

  const image = (item.image || "")
    .replace("150x150", "500x500")
    .replace("http://", "https://")

  return {
    id: item.id || id,
    title: decodeHtmlEntities(item.song || item.title || "Unknown Title"),
    artist: decodeHtmlEntities(
      item.primary_artists ||
        item.singers ||
        item.subtitle ||
        "Unknown Artist"
    ),
    album: decodeHtmlEntities(item.album || item.more_info?.album || ""),
    year: item.year || item.release_date?.slice(0, 4) || "",
    duration: Number(item.duration || item.more_info?.duration || 0),
    image,
    streamUrl,
  }
}

/**
 * Curated 5 Punjabi Genres (100 songs total from the curated PDF)
 */
export const CURATED_MOODS: MoodCategory[] = PUNJABI_GENRES

/**
 * Initial curated starter playlist featuring top iconic tracks
 */
export const DEFAULT_TRACKS: JioSaavnSong[] = [
  ...PUNJABI_GENRES[0].tracks.slice(0, 4), // Bhangra highlights
  ...PUNJABI_GENRES[2].tracks.slice(0, 4), // Hip-Hop highlights
]
