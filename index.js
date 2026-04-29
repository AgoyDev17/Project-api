const express = require('express')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000

// ==============================
// 🏠 HOME
// ==============================
app.get('/', (req, res) => {
  res.send('🚀 Agoy API berjalan')
})

// ==============================
// 📊 STATUS
// ==============================
app.get('/api', (req, res) => {
  res.json({
    status: true,
    message: "API berjalan",
    author: "Agoy 😎"
  })
})

// ==============================
// 🎵 TIKTOK DOWNLOADER
// ==============================
app.get('/tiktok', async (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.json({
      status: false,
      message: "Masukkan URL TikTok"
    })
  }

  try {
    const api = await axios.get(
      `https://tikwm.com/api/?url=${encodeURIComponent(url)}`
    )

    const data = api.data?.data

    if (!data) {
      return res.json({
        status: false,
        message: "Gagal ambil data"
      })
    }

    res.json({
      status: true,
      title: data.title,
      video: data.play,
      audio: data.music,
      author: data.author?.nickname
    })

  } catch (err) {
    res.json({
      status: false,
      message: "Server error"
    })
  }
})

// ==============================
// 🔍 CEK LINK (NO API KEY)
// ==============================
app.get('/cek-link', (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.json({
      status: false,
      message: "Masukkan URL"
    })
  }

  let score = 0
  let alasan = []

  if (url.includes("@")) {
    score += 3
    alasan.push("Mengandung '@'")
  }

  if (url.includes("bit.ly")) {
    score += 2
    alasan.push("Shortlink")
  }

  if (url.includes(".xyz")) {
    score += 2
    alasan.push("Domain aneh")
  }

  if (url.length > 75) {
    score += 1
    alasan.push("URL terlalu panjang")
  }

  let result = "AMAN ✅"

  if (score >= 5) {
    result = "BERBAHAYA ⚠️"
  } else if (score >= 2) {
    result = "MENCURIGAKAN 🤔"
  }

  res.json({
    status: true,
    url,
    result,
    score,
    alasan
  })
})

// ==============================
// 🎥 EXTRACT VIDEO (SIMPLE)
// ==============================
app.get('/extract-video', async (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.json({
      status: false,
      message: "Masukkan URL"
    })
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": url
      }
    })

    const video =
      data.match(/https?:\/\/[^"' ]+\.(mp4|m3u8|webm)/)?.[0]

    if (!video) {
      return res.json({
        status: false,
        message: "Video tidak ditemukan"
      })
    }

    res.json({
      status: true,
      video
    })

  } catch (err) {
    res.json({
      status: false,
      message: "Gagal ambil video"
    })
  }
})

// ==============================
// 🚀 RUN SERVER
// ==============================
app.listen(port, () => {
  console.log("🚀 Server jalan di port " + port)
})
