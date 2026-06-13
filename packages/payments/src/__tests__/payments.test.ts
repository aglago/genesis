import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import { payments, generateReference, PaystackClient } from "../index.js";

describe("@genesis/payments", () => {
  it("creates payments config", () => {
    const config = payments({ provider: "paystack" });
    expect(config.id).toBe("payments");
  });

  it("generates unique references", () => {
    const ref1 = generateReference();
    const ref2 = generateReference();
    expect(ref1).not.toBe(ref2);
    expect(ref1.startsWith("genesis_")).toBe(true);
  });

  it("verifies webhook signatures", () => {
    const client = new PaystackClient("sk_test", "pk_test");
    const payload = '{"event":"charge.success"}';
    const sig = createHmac("sha512", "secret").update(payload).digest("hex");
    expect(client.verifyWebhookSignature(payload, sig, "secret")).toBe(true);
  });
});
