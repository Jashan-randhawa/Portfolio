import forge from "node-forge"

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
 * Curated initial focus playlist with popular verified tracks
 */
export const DEFAULT_TRACKS: JioSaavnSong[] = [
  {
    id: "YiVML4Zo",
    title: "Gehra Hua",
    artist: "Shashwat Sachdev, Arijit Singh",
    album: "Dhurandhar",
    year: "2025",
    duration: 245,
    image:
      "https://c.saavncdn.com/450/Gehra-Hua-From-Dhurandhar-Hindi-2025-20251205154217-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/450/f467e05e2825cec2203546333e0d0550_160.mp4",
  },
  {
    id: "FoOWz-cQ",
    title: "Cheques",
    artist: "Shubh",
    album: "Still Rollin",
    year: "2023",
    duration: 183,
    image:
      "https://c.saavncdn.com/704/Still-Rollin-Punjabi-2023-20230512121542-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/704/1d43cfc150d1aef7c597c2a9bec1fa48_160.mp4",
  },
  {
    id: "396_starboy",
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    album: "Starboy",
    year: "2016",
    duration: 230,
    image:
      "https://c.saavncdn.com/423/Starboy-English-2016-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/396/b4e570050007b056c662f2a98c9f28ec_160.mp4",
  },
  {
    id: "rjkrTnma",
    title: "Kesariya",
    artist: "Pritam, Arijit Singh",
    album: "Brahmastra",
    year: "2022",
    duration: 268,
    image:
      "https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_160.mp4",
  },
  {
    id: "xzUVX40K",
    title: "Brown Munde",
    artist: "AP Dhillon, Gurinder Gill",
    album: "Brown Munde",
    year: "2020",
    duration: 268,
    image:
      "https://c.saavncdn.com/978/Brown-Munde-Punjabi-2020-20200915201103-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/973/76216adb3df5ef476f948891b40efb7a_160.mp4",
  },
  {
    id: "477_elevated",
    title: "Elevated",
    artist: "Shubh",
    album: "Elevated",
    year: "2022",
    duration: 200,
    image:
      "https://c.saavncdn.com/393/Elevated-Punjabi-2022-20221019084742-500x500.jpg",
    streamUrl:
      "https://aac.saavncdn.com/477/e97849f7ed8c692c4e206bef3e286d45_160.mp4",
  },
]

/**
 * Curated Mood & Genre Playlists
 */
export const CURATED_MOODS: MoodCategory[] = [
  {
    id: "focus",
    name: "Focus & Lo-Fi",
    description: "Mellow vibes & chillhop beats for deep coding sessions",
    badge: "🎧 Study",
    tracks: [
      {
        id: "gSXQLipD",
        title: "Soniye Heriye (LoFi & Chill)",
        artist: "Definite Music, Saransh Peer",
        album: "Soniye Heriye (LoFi)",
        duration: 174,
        image:
          "https://c.saavncdn.com/795/Soniye-Heriye-LoFi-Chill-feat-Saransh-Peer--English-2022-20220228224128-500x500.jpg",
        streamUrl:
          "https://aac.saavncdn.com/795/efb02c8292b4b9a463e06aa3da178d16_160.mp4",
      },
      {
        id: "Le6z_EJe",
        title: "Sun Saathiya (Lofi Mix)",
        artist: "Sachin-Jigar, Priya Saraiya, L3AD",
        album: "Lofi Chill Mix",
        duration: 195,
        image:
          "https://c.saavncdn.com/594/Lofi-Chill-Mix-Hindi-2026-20260619115205-500x500.jpg",
        streamUrl:
          "https://aac.saavncdn.com/594/9eee343529313ea8d155226973132f62_160.mp4",
      },
      {
        id: "Rp2sLt2T",
        title: "Kalank (Lofi Mix)",
        artist: "Pritam, Arijit Singh, Trosk",
        album: "Lofi Chill Mix",
        duration: 279,
        image:
          "https://c.saavncdn.com/594/Lofi-Chill-Mix-Hindi-2026-20260619115205-500x500.jpg",
        streamUrl:
          "https://aac.saavncdn.com/594/d9e2baf50714047427c14b9bc4d4e824_160.mp4",
      },
    ],
  },
  {
    id: "punjabi",
    name: "Punjabi Heat",
    description: "High-octane Punjabi bangers and melodic drill",
    badge: "🔥 Hype",
    tracks: [
      {
        id: "FoOWz-cQ",
        title: "Cheques",
        artist: "Shubh",
        album: "Still Rollin",
        duration: 183,
        image:
          "https://c.saavncdn.com/704/Still-Rollin-Punjabi-2023-20230512121542-500x500.jpg",
        streamUrl:
          "https://aac.saavncdn.com/704/1d43cfc150d1aef7c597c2a9bec1fa48_160.mp4",
      },
      {
        id: "xzUVX40K",
        title: "Brown Munde",
        artist: "AP Dhillon, Gurinder Gill",
        album: "Brown Munde",
        duration: 268,
        image:
          "https://c.saavncdn.com/978/Brown-Munde-Punjabi-2020-20200915201103-500x500.jpg",
        streamUrl:
          "https://aac.saavncdn.com/973/76216adb3df5ef476f948891b40efb7a_160.mp4",
      },
      {
        id: "477_elevated",
        title: "Elevated",
        artist: "Shubh",
        album: "Elevated",
        duration: 200,
        image:
          "https://c.saavncdn.com/393/Elevated-Punjabi-2022-20221019084742-500x500.jpg",
        streamUrl:
          "https://aac.saavncdn.com/477/e97849f7ed8c692c4e206bef3e286d45_160.mp4",
      },
    ],
  },
  {
    id: "trending",
    name: "Trending Now",
    description: "Chart-topping hits across languages and genres",
    badge: "✨ Viral",
    tracks: [
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
        id: "rjkrTnma",
        title: "Kesariya",
        artist: "Pritam, Arijit Singh",
        album: "Brahmastra",
        duration: 268,
        image:
          "https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg",
        streamUrl:
          "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_160.mp4",
      },
      {
        id: "396_starboy",
        title: "Starboy",
        artist: "The Weeknd, Daft Punk",
        album: "Starboy",
        duration: 230,
        image:
          "https://c.saavncdn.com/423/Starboy-English-2016-500x500.jpg",
        streamUrl:
          "https://aac.saavncdn.com/396/b4e570050007b056c662f2a98c9f28ec_160.mp4",
      },
    ],
  },
]
