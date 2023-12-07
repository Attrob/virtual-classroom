const crypto = require('crypto');
const {secret_iv, secret_key, algorithm} = app_constants.data_security;

const key = crypto
  .createHash("sha512")
  .update(secret_key)
  .digest("hex")
  .substring(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update(secret_iv)
  .digest("hex")
  .substring(0, 16);

function encrypt(text) {
   const cipher = crypto.createCipheriv(algorithm, key, encryptionIV);
   return Buffer.from(
     cipher.update(text, "utf8", "hex") + cipher.final("hex")
   ).toString("base64");
};

function decrypt(text) {
   const buff = Buffer.from(text, "base64");
   const decipher = crypto.createDecipheriv(
     algorithm,
     key,
     encryptionIV
   );
   return (
     decipher.update(buff.toString("utf8"), "hex", "utf8") +
     decipher.final("utf8")
   ); 
}

module.exports = {
    decrypt, encrypt
};