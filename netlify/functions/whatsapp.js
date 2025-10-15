import fetch from "node-fetch";

const VERIFY_TOKEN = "bookproject2025"; // use the same token in Meta Dashboard
const N8N_WEBHOOK_URL = "https://www.n8n-kylobite.com/webhook/whatsapp-audio"; // your n8n webhook

export async function handler(event) {
  // 1️⃣ Facebook verification
  if (event.httpMethod === "GET") {
    const params = new URLSearchParams(event.rawQuery);
    const mode = params.get("hub.mode");
    const token = params.get("hub.verify_token");
    const challenge = params.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return { statusCode: 200, body: challenge };
    } else {
      return { statusCode: 403, body: "Verification failed" };
    }
  }

  // 2️⃣ Incoming WhatsApp messages
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);

      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      return { statusCode: 200, body: "Forwarded to n8n" };
    } catch (err) {
      console.error("Error forwarding:", err);
      return { statusCode: 500, body: "Error forwarding to n8n" };
    }
  }

  return { statusCode: 404, body: "Not Found" };
}