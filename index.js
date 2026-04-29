const express = require('express')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000

// ==============================
// 🏠 WEB UI
// ==============================
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Agoy API Tools</title>
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
      }
      button {
        padding: 10px;
        margin-top: 10px;
        width: 95%;
        border: none;
        border-radius: 5px;
        background: #22c55e;
        color: white;
        cursor: pointer;
      }
      video {
        width: 100%;
        margin-top: 10px;
        border-radius: 10px;
      }
    </style>
  </head>
  <body>

    <h1>🚀 Agoy API Tools</h1>

    <div class="box">
      <input id="url" placeholder="Paste link disini...">

      <button onclick="cek()">🔍 Cek Link</button>
      <button onclick="tiktok()">🎵 Download TikTok</button>
      <button onclick="extract()">🎥 Extract Video</button>

      <p id="status"></p>
      <video id="video" controls style="display:none;"></video>
    </div>

    <script>
      async function cek() {
        let url = document.getElementById('url').value
        let status = document.getElementById('status')

        status.innerText = "⏳ Mengecek..."

        let res = await fetch('/cek-link?url=' + encodeURIComponent(url))
        let data = await res.json()

        status.innerText = data.result + " (score: " + data.score + ")"
      }

      async function tiktok() {
        let url = document.getElementById('url').value
        let status = document.getElementById('status')
        let video = document.getElementById('video')

        status.innerText = "⏳ Download TikTok..."

        let res = await fetch('/tiktok?url=' + encodeURIComponent(url))
        let data = await res.json()

        if (data.status) {
          video.src = data.video
          video.style.display = "block"
          status.innerText = "✅ Sukses"
        } else {
          status
