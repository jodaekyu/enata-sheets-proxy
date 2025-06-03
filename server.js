const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // v2 이하 사용

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👇 본인의 Google Apps Script URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzH5K50hiNgPvLWyLmg0BkUKQnLlbXdq8cOLDVpnfu11SQEC-ecXrz5yNvoXEExvRVr/exec";

// POST 요청을 Google Apps Script로 전달
app.post("/save", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    res.status(200).send({ status: "ok", result: text });
  } catch (error) {
    console.error("🔥 프록시 서버 오류:", error);
    res.status(500).send({ status: "error", message: error.message });
  }
});

// 상태 확인용 엔드포인트
app.get("/", (req, res) => {
  res.send("✅ Enata Google Sheets Proxy 서버 작동 중");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy 서버가 ${PORT}번 포트에서 실행 중`);
});
