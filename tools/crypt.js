#!/usr/bin/env node
/* Cifra y descifra la tabla de datos del ilustrador.
 *
 *   ACS_PASS="la clave" node tools/crypt.js encrypt    data.src.json  -> assets/data.enc.js
 *   ACS_PASS="la clave" node tools/crypt.js decrypt    assets/data.enc.js -> data.src.json
 *
 * La clave también se puede pasar como segundo argumento.
 * data.src.json está en .gitignore: la copia que se commitea es la cifrada,
 * y "decrypt" la reconstruye, así que no hay riesgo de perder los números.
 */
"use strict";
var crypto = require("crypto"), fs = require("fs"), path = require("path");

var ROOT = path.join(__dirname, "..");
var SRC  = path.join(ROOT, "data.src.json");
var ENC  = path.join(ROOT, "assets", "data.enc.js");
var ITER = 310000, KEYLEN = 32, TAGLEN = 16;

var mode = process.argv[2];
var pass = process.argv[3] || process.env.ACS_PASS;

if (mode !== "encrypt" && mode !== "decrypt") {
  console.error('uso: ACS_PASS="clave" node tools/crypt.js encrypt|decrypt');
  process.exit(1);
}
if (!pass) {
  console.error('falta la clave: ACS_PASS="clave" node tools/crypt.js ' + mode);
  process.exit(1);
}

if (mode === "encrypt") {
  var plain = fs.readFileSync(SRC, "utf8");
  JSON.parse(plain); // que reviente acá si el JSON está roto, no en el browser

  var salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
  var key = crypto.pbkdf2Sync(pass, salt, ITER, KEYLEN, "sha256");
  var c = crypto.createCipheriv("aes-256-gcm", key, iv);
  var ct = Buffer.concat([c.update(plain, "utf8"), c.final(), c.getAuthTag()]);

  var blob = {
    v: 1, kdf: "PBKDF2-SHA256", iter: ITER,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    ct: ct.toString("base64")
  };
  fs.writeFileSync(ENC,
    "/* Tabla del ilustrador, cifrada con AES-256-GCM. Se genera con tools/crypt.js\n" +
    "   — no editar a mano: se edita data.src.json y se vuelve a cifrar. */\n" +
    "var ACS_ENC = " + JSON.stringify(blob, null, 2) + ";\n");
  console.log("cifrado -> assets/data.enc.js (" + ct.length + " bytes)");

} else {
  var src = fs.readFileSync(ENC, "utf8");
  var m = src.match(/var ACS_ENC = ([\s\S]*);\s*$/);
  if (!m) { console.error("assets/data.enc.js no tiene el formato esperado."); process.exit(1); }
  var enc = JSON.parse(m[1]);

  var all = Buffer.from(enc.ct, "base64");
  var d = crypto.createDecipheriv("aes-256-gcm",
    crypto.pbkdf2Sync(pass, Buffer.from(enc.salt, "base64"), enc.iter, KEYLEN, "sha256"),
    Buffer.from(enc.iv, "base64"));
  d.setAuthTag(all.slice(all.length - TAGLEN));

  var out;
  try { out = Buffer.concat([d.update(all.slice(0, all.length - TAGLEN)), d.final()]).toString("utf8"); }
  catch (e) { console.error("clave incorrecta."); process.exit(1); }

  fs.writeFileSync(SRC, out);
  console.log("descifrado -> data.src.json");
}
