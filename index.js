const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.userRequest.utterance;

  const gptReply = await askGPT(userMessage);

  return res.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: gptReply,
          },
        },
      ],
    },
  });
});
app.get("/", (req, res) => {
  res.send("🟢 GPT 카카오톡 챗봇 서버가 정상 작동 중입니다.");
});
async function askGPT(question) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
