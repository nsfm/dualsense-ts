/**
 * Byte buffer abstraction over Buffer (NodeJS) and DataView (web).
 */
export interface ByteArray {
    length: number;
    readUint8(offset: number): number;
    readUint16LE(offset: number): number;
}