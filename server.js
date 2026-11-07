import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error("O servidor ainda não tem uma chave de API configurada.");
    err.status = 503;
    throw err;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const client = getClient();
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return res.status(400).json({ error: "Envia entre 1 e 30 mensagens." });
    }
    const safeMessages = messages.map(m => {
      if (!["user", "assistant"].includes(m?.role) || typeof m?.content !== "string") {
        throw new Error("Formato de mensagem inválido.");
      }
      return { role: m.role, content: m.content.slice(0, 8000) };
    });
    const response = await client.responses.create({
      model: "gpt-6-astra",
      instructions: "És o FLIX.Ia, um assistente prestável. Responde em português europeu, de forma clara e natural. Se não souberes algo, sê transparente.",
      input: safeMessages
    });
    res.json({ answer: response.output_text || "Não consegui gerar uma resposta. Tenta novamente." });
  } catch (err) {
    console.error("Erro /api/chat:", err.message);
    res.status(err.status || 500).json({ error: err.status === 503 ? err.message : "Não foi possível obter resposta da IA. Confirma a configuração e tenta novamente." });
  }
});

app.post("/api/images", async (req, res) => {
  try {
    const client = getClient();
    const prompt = req.body?.prompt;
    const style = req.body?.style || "Realista";
    if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 3000) {
      return res.status(400).json({ error: "Escreve uma descrição até 3000 caracteres." });
    }
    const result = await client.images.generate({
      model: "gpt-image-2.5-flare",
      prompt: `Cria uma imagem original. Estilo visual: ${String(style).slice(0, 50)}. Descrição: ${prompt.trim()}`,
      size: "1024x1024",
      quality: "medium",
      n: 1
    });
    const image = result.data?.[0]?.b64_json;
    if (!image) throw new Error("A API não devolveu uma imagem.");
    res.json({ image: `data:image/png;base64,${image}` });
  } catch (err) {
    console.error("Erro /api/images:", err.message);
    res.status(err.status || 500).json({ error: err.status === 503 ? err.message : "Não foi possível gerar a imagem. Confirma a tua conta/API e tenta novamente." });
  }
});

app.listen(port, () => {
  console.log(`FLIX.Ia disponível em http://localhost:${port}`);
});
