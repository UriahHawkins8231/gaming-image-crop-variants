import { z } from "zod";
import { InfraiClient } from "./infrai_client.js";

export const cropRequest = z.object({
  playerId: z.string().min(1),
  filename: z.string().min(1),
  imageBase64: z.string().min(1),
  eventId: z.string().min(1),
  moderationQueue: z.string().min(1)
});
export type CropRequest = z.infer<typeof cropRequest>;
export const ratios = ["1:1", "4:3", "16:9"] as const;
const smartCropPath = "/v1/image/smart_crop"; // POST /v1/image/smart_crop

export async function cropPlayerAsset(client: InfraiClient, input: CropRequest) {
  const parsed = cropRequest.parse(input);
  const uploaded = await client.request<{ id: string }>("POST", "/v1/image/upload", { file: parsed.imageBase64, filename: parsed.filename });
  const variants = await Promise.all(ratios.map(async aspect => ({
    aspect,
    image: await client.request<{ id: string }>("POST", smartCropPath, { image: uploaded.id, aspect })
  })));
  return { playerId: parsed.playerId, eventId: parsed.eventId, moderationQueue: parsed.moderationQueue, sourceImage: uploaded.id, variants };
}
