// formats.js
const base32 = require("hi-base32"); // lightweight base32 lib

// --- Binary ---
function uvoxidToBin(uvoxid) {
  let hex = uvoxid.toString(16).padStart(48, "0");
  return Buffer.from(hex, "hex"); // 24 bytes
}

function binToUvoxid(buf) {
  if (buf.length !== 24) throw new Error("Expected 24-byte buffer");
  return BigInt("0x" + buf.toString("hex"));
}

// --- Hexadecimal ---
function uvoxidToHex(uvoxid) {
  let rawHex = uvoxid.toString(16).padStart(48, "0");
  return `${rawHex.slice(0, 16)}-${rawHex.slice(16, 32)}-${rawHex.slice(32)}`;
}

function hexToUvoxid(h) {
  let clean = h.replace(/-/g, "");
  return BigInt("0x" + clean);
}

// --- Base32 (3-field grouped) ---
function uvoxidToBase32(uvoxid) {
  let buf = uvoxidToBin(uvoxid);
  let parts = [];
  for (let i = 0; i < 24; i += 8) {
    let chunk = buf.slice(i, i + 8);
    let enc = base32.encode(chunk).replace(/=+$/, ""); // strip padding
    parts.push(enc);
  }
  return "uvoxid:" + parts.join("-");
}

function base32ToUvoxid(str) {
  let clean = str.replace(/^uvoxid:/, "").replace(/-/g, "");
  let buf = Buffer.from(base32.decode.asBytes(clean.toUpperCase()));
  return binToUvoxid(buf);
}

// --- Base32 (flat) ---
function uvoxidToBase32Flat(uvoxid) {
  let buf = uvoxidToBin(uvoxid);
  return base32.encode(buf).replace(/=+$/, "");
}

function base32FlatToUvoxid(str) {
  let buf = Buffer.from(base32.decode.asBytes(str.toUpperCase()));
  return binToUvoxid(buf);
}

module.exports = {
  uvoxidToBin,
  binToUvoxid,
  uvoxidToHex,
  hexToUvoxid,
  uvoxidToBase32,
  base32ToUvoxid,
  uvoxidToBase32Flat,
  base32FlatToUvoxid
};
