const wa = require("@open-wa/wa-automate");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const { capitalizeName } = require("./helpers/helpers");

// Router
const indexRouter = require("./routes/index/index.router");

// Middleware
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

const NOMOR_PETUGAS_PST = "6285322609204@c.us";

// WA Bot
wa.create({
  sessionId: "COVID_HELPER",
  multiDevice: true,
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: "PT_BR",
  logConsole: false,
  popup: true,
  qrTimeout: 0,
}).then((client) => start(client));

function start(client) {
  // Handle incoming messages
  client.onMessage(async (message) => {
    console.log(message);
    console.log(message.from);
    const lowerCaseMessage = message.body.toLowerCase();

    switch (true) {
      case lowerCaseMessage === "0":
        await client.sendText(
          message.from,
          `Silahkan ketik angka untuk:
1. Rekomendasi Statistik
2. Permintaan Data
3. Pembinaan Statistik Sektoral
4. Konsultasi Data Statistik

Silahkan pilih layanan yang diinginkan
`
        );
        break;

      case lowerCaseMessage === "1":
        await client.sendText(
          message.from,
          `Untuk mendapatkan Rekomendasi kegiatan Statistik dari BPS silakan mengakses website Romantik BPS melalui link berikut:
s.id/Rekomendasi-Statistik-BPS-Keerom

Apakah Anda memerlukan pendampingan dari kami?
1a. Ya
1b. Tidak

Ketik '1a' atau '1b'`
        );
        break;

      case lowerCaseMessage === "1b":
        await client.sendText(
          message.from,
          "Silahkan ketik 'menu utama' atau ketik 0"
        );
        break; // Break added here to stop fall-through

      case lowerCaseMessage === "1a":
        await client.sendText(
          message.from,
          `Silahkan deskripsikan kegiatan Statistik Anda dengan detail dan jelas dengan format

#PENDAMPINGAN#Penjelasan`
        );
        break;

      case lowerCaseMessage.startsWith("#pendampingan#"):
        const dataPendampingan = lowerCaseMessage.split("#");
        if (dataPendampingan.length >= 3) {
          const penjelasan = dataPendampingan[2].trim();
          console.log(penjelasan);
          await client.sendText(
            NOMOR_PETUGAS_PST,
            `Halo pak Azmi, ada yang butuh pendampingan, berikut detailnya:

Nama: ${message.notifyName}
Nomor: ${message.sender.formattedName}
Penjelasan: ${penjelasan}`
          );

          await client.sendText(
            message.from,
            "Berikut ini adalah kontak nomor petugas PST."
          );

          await client.sendContact(message.from, NOMOR_PETUGAS_PST);

          await client.sendText(
            message.from,
            `Baik, penjelasan Anda sudah kami terima dan sampaikan ke petugas PST. Mohon tunggu untuk follow up selanjutnya.
            
Silahkan ketik 'menu utama' atau ketik 0`
          );
        } else {
          await client.sendText(
            message.from,
            `Format yang Anda masukkan salah. Pastikan formatnya seperti: #PENDAMPINGAN#Penjelasan`
          );
        }
        break;

      case lowerCaseMessage === "2":
        await client.sendText(
          message.from,
          `2a. Tabulasi data
2b. Publikasi
        
Silahkan pilih data yang diinginkan`
        );
        break;

      case lowerCaseMessage === "file":
        await client.sendFile(
          message.chatId,
          "./example.pdf",
          "file.pdf",
          "Berikut ini adalah file yang diminta",
          message.quotedMessageId
        );
        break;

      case lowerCaseMessage === "arief":
        await client.sendText(message.from, "Anjay arief");
        break;

      case lowerCaseMessage.startsWith("#input_data#"):
        const data = lowerCaseMessage.split("#");
        if (data.length >= 4) {
          const name = capitalizeName(data[2].trim());
          const email = data[3].trim();
          console.log(`Name: ${name}`);
          console.log(`Email: ${email}`);

          await client.sendText(
            message.from,
            `Terima kasih, ${name}. Data Anda dengan email ${email} sudah diterima.

Silahkan ketik angka untuk:
1. Rekomendasi Statistik
2. Permintaan Data
3. Pembinaan Statistik Sektoral
4. Konsultasi Data Statistik

Silahkan pilih layanan yang diinginkan`
          );
        } else {
          await client.sendText(
            message.from,
            `Format yang Anda masukkan salah. Pastikan formatnya seperti: #INPUT_DATA#Nama#Email`
          );
        }
        break;

      default:
        await client.sendText(
          message.from,
          `Halo selamat datang di WA Bot *BPS Kab. Keerom*.
Mohon isi data pengunjung di bawah ini dengan benar
Nama dan Email

Dengan Format
#INPUT_DATA#Nama#Email`
        );
        break;
    }
  });
}

// Routes
app.use("/", indexRouter);

module.exports = app;
