const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // node-fetch v2 사용

const app = express();
app.use(cors());
app.use(bodyParser.json());

// GAS 웹 앱 URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzH5K50hiNgPvLWyLmg0BkUKQnLlbXdq8cOLDVpnfu11SQEC-ecXrz5yNvoXEExvRVr/exec";

app.post("/save", async (req, res) => {
  try {
    // ✅ payload를 URLSearchParams로 감싸서 전송
    const payload = new URLSearchParams();
    payload.append("payload", JSON.stringify(req.body)); // 핵심 포인트

    const fetchResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString()
    });

    const text = await fetchResponse.text();
    console.log("✅ GAS 응답:", text);
    res.status(200).send({ status: "ok", result: text });
  } catch (error) {
    console.error("🔥 프록시 서버 오류:", error.message);
    res.status(500).send({ status: "error", message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Enata Google Sheets Proxy 서버 작동 중");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy 서버가 ${PORT}번 포트에서 실행 중`);
});
