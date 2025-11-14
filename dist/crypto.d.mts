declare class CryptoService {
    hmacSHA256(secret: string, data: string): Promise<string>;
    generateRandomString(length?: number): Promise<string>;
    generateTransactionId(): Promise<string>;
    generateReference(): Promise<string>;
    private arrayBufferToHex;
    verifyHMAC(secret: string, data: string, signature: string): Promise<boolean>;
    private constantTimeCompare;
}

export { CryptoService };
