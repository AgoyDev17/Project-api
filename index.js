const express = require('express')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000

// ==============================
// 🏠 WEB UI
// ==============================
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Agoy API Tools</title>
</head>
<body style="text-align:center;background:#111;color:white;font-family:sans-serif;">

<h1>🚀 Agoy API Tools</h1>

<input id="url" placeholder="Paste link disini..." style="width:300px;padding:10px;"><br><br>

<button onclick="cek()">🔍 Cek Link</button>
<button onclick="tiktok()">🎵 TikTok</button>
<button onclick="extract()">🎥 Extract</button>

<p id="status"></p>

<script>
async function cek() {
  let url = document.getElementById('url').value
  let res = await fetch('/cek-link?url=' + encodeURIComponent(url))
  let data = await res.json()
  document.getElementById('status').innerText = data.result
}

async function tiktok() {
  let url = document.getElementById('url').value
  let res = await fetch('/tiktok?url=' + encodeURIComponent(url))
  let data = await res.json()

  if (data.status) {
    window.open(data.video, '_blank')
  } else {
    alert("Gagal ambil video TikTok")
  }
}

async function extract() {
  let url = document.getElementById('url').value
  let res = await fetch('/extract-video?url=' + encodeURIComponent(url))
  let data = await res.json()

  if (data.status) {
    window.open(data.video, '_blank')
  } else {
    alert("Gagal extract video")
  }
}
</script>

</body>
</html>`)
})

// ==============================
// 📊 STATUS
// ==============================
app.get('/api', (req, res) => {
  res.json({ status: true })
})

// ==============================
// 🎵 TIKTOK
// ==============================
app.get('/tiktok', async (req, res) => {
  const url = req.query.url
  if (!url) return res.json({ status: false })

  try {
    const api = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`)
    const data = api.data?.data

    res.json({
      status: true,
      video: data.play
    })
  } catch {
    res.json({ status: false })
  }
})

// ==============================
// 🔍 CEK LINK
// ==============================
app.get('/cek-link', (req, res) => {
  const url = req.query.url
  if (!url) return res.json({ status: false })

  let score = 0
  if (url.includes("@")) score += 3
  if (url.includes("bit.ly")) score += 2
  if (url.includes(".xyz")) score += 2

  let result = "AMAN"
  if (score >= 5) result = "BAHAYA"
  else if (score >= 2) result = "MENCURIGAKAN"

  res.json({ status: true, result })
})

// ==============================
// 🎥 EXTRACT VIDEO
// ==============================
app.get('/extract-video', async (req, res) => {
  const url = req.query.url
  if (!url) return res.json({ status: false })

  try {
    const { data } = await axios.get(url)

    const video = data.match(/https?:\/\/[^"' ]+\.(mp4|m3u8|webm)/)?.[0]

    if (!video) return res.json({ status: false })

    res.json({ status: true, video })
  } catch {
    res.json({ status: false })
  }
})

// ==============================
// 🚀 RUN
// ==============================
app.listen(port, () => {
  console.log("🚀 Server jalan di port " + port)
})
