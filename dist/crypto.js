class CryptoService {
  async hmacSHA256(secret, data) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    return this.arrayBufferToHex(signature);
  }
  async generateRandomString(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  async generateTransactionId() {
    return `txn_${await this.generateRandomString(12)}`;
  }
  async generateReference() {
    return `ref_${await this.generateRandomString(8)}`;
  }
  arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  async verifyHMAC(secret, data, signature) {
    try {
      const expectedSignature = await this.hmacSHA256(secret, data);
      return this.constantTimeCompare(signature, expectedSignature);
    } catch {
      return false;
    }
  }
  constantTimeCompare(a, b) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
}
export {
  CryptoService
};
