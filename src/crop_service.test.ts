import assert from "node:assert/strict";
import { cropRequest, ratios } from "./crop_service.js";

const parsed = cropRequest.parse({ playerId: "p1", filename: "capture.png", imageBase64: "abc", eventId: "e1", moderationQueue: "review" });
assert.deepEqual(ratios, ["1:1", "4:3", "16:9"]);
assert.equal(parsed.moderationQueue, "review");
assert.throws(() => cropRequest.parse({ ...parsed, playerId: "" }));
console.log("crop request decision: valid assets enter review with three aspect ratios");
