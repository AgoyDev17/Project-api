const express = require('express')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000

// ==============================
// 🏠 WEB UI HOME
// ==============================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>TikTok Downloader</title>
  <style>
    body {
      font-family: Arial;
      background: #0f172a;
      color: white;
      text-align: center;
      padding-top: 50px;
    }
    .box {
      background: #1e293b;
      padding: 20px;
      margin: auto;
      width: 350px;
      border-radius: 10px;
    }
    input {
      width: 90%;
      padding: 10px;
      border-radius: 5px;
      border: none;
      margin-top: 10px;
    }
    button {
      padding: 10px;
      border: none;
      border-radius: 5px;
      background: #22c55e;
      color: white;
      cursor: pointer;
      margin-top: 10px;
      width: 95%;
    }
    video {
      width: 100%;
      margin-top: 10px;
      border-radius: 10px;
    }
  </style>
</head>
<body>

  <h1>🎵 TikTok Downloader</h1>

  <div class="box">
    <input id="url" placeholder="Paste link TikTok...">
    <button onclick="download()">Download</button>

    <p id="status"></p>
    <video id="video" controls style="display:none;"></video>
  </div>

  <script>
    async function download() {
      const url = document.getElementById('url').value
      const status = document.getElementById('status')
      const video = document.getElementById('video')

      status.innerText = "⏳ Memproses..."

      const res = await fetch('/tiktok?url=' + encodeURIComponent(url))
      const data = await res.json()

      if (data.status) {
        status.innerText = "✅ Sukses"
        video.src = data.video
        video.style.display = "block"
      } else {
        status.innerText = "❌ Gagal ambil video"
      }
    }
  </script>

</body>
</html>
  `)
})

// ==============================
// 📊 API STATUS
// ==============================
app.get('/api', (req, res) => {
  res.json({
    status: true,
    message: "API berjalan",
    author: "Agoy 😎"
  })
})

// ==============================
// 🎵 TIKTOK DOWNLOADER API
// ==============================
app.get('/tiktok', async (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.json({
      status: false,
      message: "Masukkan url TikTok"
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
// 🚀 RUN SERVER
// ==============================
app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`)
})
