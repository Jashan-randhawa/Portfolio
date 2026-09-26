import forge from "node-forge"

export interface JioSaavnSong {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  image: string
  streamUrl: string
}

function decodeHtmlEntities(str: string): string {
  if (!str) return ""
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

/**
 * Decrypts JioSaavn's DES-ECB encrypted media URL using key '38346591'
 * (Implementation from sumitkolhe/jiosaavn-api)
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
    // Prefer 160kbps for fast streaming & high fidelity (or fallback to _96)
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
  limit = 8
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
      const encryptedUrl = item.more_info?.encrypted_media_url || ""
      const streamUrl = decryptMediaUrl(encryptedUrl)
      if (!streamUrl) return null

      const image = (item.image || "")
        .replace("150x150", "500x500")
        .replace("http://", "https://")

      return {
        id: item.id,
        title: decodeHtmlEntities(item.title || "Unknown Title"),
        artist: decodeHtmlEntities(
          item.subtitle || item.more_info?.singers || "Unknown Artist"
        ),
        album: decodeHtmlEntities(item.more_info?.album || ""),
        duration: Number(item.more_info?.duration || 0),
        image,
        streamUrl,
      } as JioSaavnSong
    })
    .filter(Boolean) as JioSaavnSong[]
}

/**
 * Curated initial focus playlist with popular tracks
 */
export const DEFAULT_TRACKS: JioSaavnSong[] = [
  {
    id: "YiVML4Zo",
    title: "Gehra Hua",
    artist: "Shashwat Sachdev, Arijit Singh",
    album: "Dhurandhar",
    duration: 245,
    image:
      "https://c.saavncdn.com/450/Gehra-Hua-From-Dhurandhar-Hindi-2025-20251205154217-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/450/f467e05e2825cec2203546333e0d0550_160.mp4",
  },
  {
    id: "3e0QO_xM",
    title: "Brown Munde",
    artist: "AP Dhillon, Gurinder Gill, Shinda Kahlon",
    album: "Brown Munde",
    duration: 268,
    image:
      "https://c.saavncdn.com/978/Brown-Munde-Punjabi-2020-20200915201103-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/978/b00d8d73b22cf53c7c2b64a273e0aef2_160.mp4",
  },
  {
    id: "Xh03qP_a",
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    album: "Starboy",
    duration: 230,
    image:
      "https://c.saavncdn.com/423/Starboy-English-2016-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/423/9c7161b4028ce3a0058ec40da1be1352_160.mp4",
  },
  {
    id: "jM7v8O9P",
    title: "Elevated",
    artist: "Shubh",
    album: "Elevated",
    duration: 200,
    image:
      "https://c.saavncdn.com/393/Elevated-Punjabi-2022-20221019084742-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/393/ec44ba541a547fae5e69efcfda76b4a5_160.mp4",
  },
]
