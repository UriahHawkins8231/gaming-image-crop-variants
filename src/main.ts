import { InfraiClient } from "./infrai_client.js";
import { cropPlayerAsset } from "./crop_service.js";

const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("Set INFRAI_API_KEY before running the example.");
const client = new InfraiClient(key);
const bucket = process.env.INFRAI_BUCKET ?? "game-assets-demo";
const result = await cropPlayerAsset(client, {
  playerId: "player-42", filename: "victory-screen.png", imageBase64: process.env.IMAGE_BASE64 ?? "demo-image-data",
  eventId: "match-2026-09-13", moderationQueue: "new-player-assets"
});
const outputKey = `${result.playerId}/${result.eventId}/square.json`;
const signed = await client.request<{ url: string }>("POST", `/v1/storage/object/presign/${bucket}/${encodeURIComponent(outputKey)}`, { op: "put", expires_seconds: 900, content_type: "application/json" });
console.log(JSON.stringify({ result, uploadUrl: signed.url }, null, 2));
