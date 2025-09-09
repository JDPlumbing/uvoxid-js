// src/formats.js
import base32 from "hi-base32"; // lightweight base32 lib

// --- Helpers ---
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(buf) {
  return Array.from(buf)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// --- Binary ---
export function uvoxidToBin(uvoxid) {
  console.log("uvoxidToBin called with:", uvoxid);
  let hex = uvoxid.toString(16).padStart(48, "0");
  return hexToBytes(hex); // returns Uint8Array (24 bytes)
}

export function binToUvoxid(buf) {
  console.log("binToUvoxid called with:", buf);
  if (buf.length !== 24) throw new Error("Expected 24-byte buffer");
  const hex = bytesToHex(buf);
  return BigInt("0x" + hex);
}

// --- Hexadecimal ---
export function uvoxidToHex(uvoxid) {
  console.log("uvoxidToHex called with:", uvoxid);
  let rawHex = uvoxid.toString(16).padStart(48, "0");
  return `${rawHex.slice(0, 16)}-${rawHex.slice(16, 32)}-${rawHex.slice(32)}`;
}

export function hexToUvoxid(h) {
  console.log("hexToUvoxid called with:", h);
  let clean = h.replace(/-/g, "");
  return BigInt("0x" + clean);
}

// --- Base32 (3-field grouped) ---
export function uvoxidToBase32(uvoxid) {
  console.log("uvoxidToBase32 called with:", uvoxid);
  let buf = uvoxidToBin(uvoxid);
  let parts = [];
  for (let i = 0; i < 24; i += 8) {
    let chunk = buf.slice(i, i + 8);
    let enc = base32.encode(chunk).replace(/=+$/, ""); // strip padding
    parts.push(enc);
  }
  return "uvoxid:" + parts.join("-");
}

export function base32ToUvoxid(str) {
  console.log("base32ToUvoxid called with:", str);
  let clean = str.replace(/^uvoxid:/, "").replace(/-/g, "");
  let bytes = base32.decode.asBytes(clean.toUpperCase());
  return binToUvoxid(new Uint8Array(bytes));
}

// --- Base32 (flat) ---
export function uvoxidToBase32Flat(uvoxid) {
  console.log("uvoxidToBase32Flat called with:", uvoxid);
  let buf = uvoxidToBin(uvoxid);
  return base32.encode(buf).replace(/=+$/, "");
}

export function base32FlatToUvoxid(str) {
  console.log("base32FlatToUvoxid called with:", str);
  let bytes = base32.decode.asBytes(str.toUpperCase());
  return binToUvoxid(new Uint8Array(bytes));
}

// Alias
export { uvoxidToBase32 as uvoxidToB32 };
