/*
 * Minimalni zapisovac ZIP.
 *
 * Duvod: Compress-Archive i .NET ZipFile na Windows zapisuji do zipu cesty
 * se zpetnym lomitkem. Shopify takovy archiv odmitne, protoze v nem nenajde
 * "layout/theme.liquid". Tenhle zapisovac pise cesty vzdy s lomitkem dopredu
 * a nastavuje priznak UTF-8 pro nazvy.
 *
 * Pouziti: node make-zip.js <zdrojova-slozka> <vystupni.zip> [podslozky...]
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const [, , SRC, OUT, ...ONLY] = process.argv;

if (!SRC || !OUT) {
  console.error("pouziti: node make-zip.js <slozka> <vystup.zip> [podslozky...]");
  process.exit(1);
}

/** CRC-32 (Node 20.15+ ma zlib.crc32, jinak spocitame tabulkou). */
const crc32 =
  typeof zlib.crc32 === "function"
    ? (buf) => zlib.crc32(buf) >>> 0
    : (() => {
        const table = new Int32Array(256);
        for (let i = 0; i < 256; i++) {
          let c = i;
          for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
          table[i] = c;
        }
        return (buf) => {
          let c = -1;
          for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
          return (c ^ -1) >>> 0;
        };
      })();

/** DOS cas a datum z Date. */
function dosTime(d) {
  return (
    ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() / 2)) & 0xffff
  );
}
function dosDate(d) {
  return (
    (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff
  );
}

/** Vsechny soubory ve slozce, relativni cesty s lomitkem dopredu. */
function walk(dir, base = dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return out;
}

let files = walk(SRC).sort();
if (ONLY.length) {
  files = files.filter((f) => ONLY.some((p) => f === p || f.startsWith(p + "/")));
}

const UTF8_FLAG = 0x0800;
const chunks = [];
const central = [];
let offset = 0;

for (const rel of files) {
  const full = path.join(SRC, rel.split("/").join(path.sep));
  const raw = fs.readFileSync(full);
  const deflated = zlib.deflateRawSync(raw, { level: 9 });
  // Ulozime bez komprese, pokud by deflate soubor zvetsil.
  const useDeflate = deflated.length < raw.length;
  const data = useDeflate ? deflated : raw;
  const method = useDeflate ? 8 : 0;

  const name = Buffer.from(rel, "utf8");
  const crc = crc32(raw);
  const mtime = fs.statSync(full).mtime;
  const time = dosTime(mtime);
  const date = dosDate(mtime);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4); // verze
  local.writeUInt16LE(UTF8_FLAG, 6);
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(time, 10);
  local.writeUInt16LE(date, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(raw.length, 22);
  local.writeUInt16LE(name.length, 26);
  local.writeUInt16LE(0, 28);

  chunks.push(local, name, data);

  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0);
  cd.writeUInt16LE(20, 4); // verze tvurce
  cd.writeUInt16LE(20, 6); // potrebna verze
  cd.writeUInt16LE(UTF8_FLAG, 8);
  cd.writeUInt16LE(method, 10);
  cd.writeUInt16LE(time, 12);
  cd.writeUInt16LE(date, 14);
  cd.writeUInt32LE(crc, 16);
  cd.writeUInt32LE(data.length, 20);
  cd.writeUInt32LE(raw.length, 24);
  cd.writeUInt16LE(name.length, 28);
  cd.writeUInt16LE(0, 30); // extra
  cd.writeUInt16LE(0, 32); // komentar
  cd.writeUInt16LE(0, 34); // disk
  cd.writeUInt16LE(0, 36); // interni atributy
  // Bitovy posun v JS je znamenkovy, proto >>> 0 zpet na bez znamenka.
  cd.writeUInt32LE(((0o100644 << 16) >>> 0), 38); // externi atributy
  cd.writeUInt32LE(offset, 42);

  central.push(cd, name);
  offset += local.length + name.length + data.length;
}

const cdBuf = Buffer.concat(central);
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0);
eocd.writeUInt16LE(0, 4);
eocd.writeUInt16LE(0, 6);
eocd.writeUInt16LE(files.length, 8);
eocd.writeUInt16LE(files.length, 10);
eocd.writeUInt32LE(cdBuf.length, 12);
eocd.writeUInt32LE(offset, 16);
eocd.writeUInt16LE(0, 20);

fs.writeFileSync(OUT, Buffer.concat([...chunks, cdBuf, eocd]));
console.log(
  "zabaleno " + files.length + " souboru, " + Math.round(fs.statSync(OUT).size / 1024) + " KB",
);
