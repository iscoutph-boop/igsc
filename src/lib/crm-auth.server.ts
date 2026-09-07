import { createHmac, randomUUID } from "node:crypto";

const CRM_PROTOCOL_VERSION = 1;
const CRM_ALLOWED_ACTIONS = new Set([
  "createBooking",
  "findBooking",
  "rescheduleBooking",
  "cancelBooking",
]);
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type SignedCrmEnvelope = {
  request: string;
  signature: string;
};

export function requireCrmSharedSecret(value: string | undefined): string {
  const secret = typeof value === "string" ? value.trim() : "";
  if (secret.length < 32) {
    throw new Error("Booking service is not configured.");
  }
  return secret;
}

export function buildSignedCrmEnvelope(
  action: string,
  payload: unknown,
  secretValue: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  nonce = randomUUID(),
): SignedCrmEnvelope {
  const secret = requireCrmSharedSecret(secretValue);
  if (!CRM_ALLOWED_ACTIONS.has(action)) {
    throw new Error("Invalid CRM request.");
  }
  if (!Number.isInteger(nowSeconds) || nowSeconds <= 0) {
    throw new Error("Invalid CRM request.");
  }
  if (!UUID_V4_PATTERN.test(nonce)) {
    throw new Error("Invalid CRM request.");
  }

  const request = JSON.stringify({
    version: CRM_PROTOCOL_VERSION,
    timestamp: nowSeconds,
    nonce,
    action,
    payload,
  });
  const signature = createHmac("sha256", secret).update(request, "utf8").digest("hex");

  return { request, signature };
}
