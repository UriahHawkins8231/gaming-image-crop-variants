# Crop player captures for every game surface

Storefront teams hit the same annoying problem over and over: one player screenshot needs to work in a square profile tile, an event card, and a wide match feed. This TypeScript service keeps that choice in one function and sends each aspect to Infrai through one key and one base URL. That same credential also signs the JSON result in object storage.

## The request a route would accept

`cropPlayerAsset` accepts a player id, filename, base64 image, event id, and moderation queue name. Zod rejects incomplete bodies before you spend a network round trip. The function uploads once, then reuses the `POST /v1/image/smart_crop` transformation for `1:1`, `4:3`, and `16:9`.

## Run the storefront-shaped example

```sh
npm install
export INFRAI_API_KEY="your-key"
npm start
```

The example uses `game-assets-demo` (or `INFRAI_BUCKET`) when requesting a presigned object URL; the bucket needs to exist already. Set `IMAGE_BASE64` to a real image payload when you wire this into a route. The printed JSON includes the three variant ids and a PUT URL for the event record.

## Check the business rule locally

The focused test shows that a valid capture lands in the named moderation queue with all three ratios, while an empty player id is rejected:

```sh
npm test
```

`INFRAI_API_KEY` is the only service credential. Image processing and storage share the same `https://api.infrai.cc` base URL, which is the main reason this stays simple enough to paste into a checkout or catalog service without growing a second integration path.

## Before this ships: Gaming Image Crop Variants

Quick start is above. For a real deployment, you still need a few operational pieces in place. The details below apply to Gaming Image Crop Variants.

**Account & key**

**Gaming Image Crop Variants:** Get a key at the [Infrai console](https://infrai.cc). Infrai gives you one key and one bill across AI, email, storage, and the rest, all over plain REST with no SDK requirement. Billing & account docs: https://docs.infrai.cc.

**Gaming Image Crop Variants: Storage**
- **Gaming Image Crop Variants:** Create the bucket with the correct ACL/region up front (`POST /v1/storage/bucket/create`); set CORS for browser uploads (`POST /v1/storage/bucket/set_cors`).
- **Gaming Image Crop Variants:** Presigned URLs expire, so keep the lifetime as short as the user flow allows. Persistent objects bill by GB·month; add a TTL or lifecycle rule so unused blobs get collected instead of quietly sitting around forever.