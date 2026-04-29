const express = require('express')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
<title>Agoy API</title>
</head>
<body style="text-align:center;background:#111;color:white;">
<h1>🚀 API Jalan</h1>
<input id="url" placeholder="Paste link"><br><br>
<button onclick="go()">Test</button>
<p id="out"></p>

<script>
async function go(){
 let url = document.getElementById('url').value
 let res = await fetch('/cek-link?url='+encodeURIComponent(url))
 let data = await res.json()
 document.getElementById('out').innerText = data.result
}
</script>

</body>
</html>`)
})

app.get('/api', (req, res) => {
  res.json({ status: true })
})

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

app.listen(port, () => {
  console.log("Server jalan")
})
