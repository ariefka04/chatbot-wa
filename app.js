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
      case lowerCaseMessage === "1":
        await client.sendText(
          message.from,
          `
1a. Penduduk
1b. Kemiskinan

Silahkan pilih rekomendasi statistik yang diinginkan
          `
        );
        break;

      case lowerCaseMessage === "2":
        await client.sendText(
          message.from,
          `
2a. Tabulasi data
2b. Publikasi
        
Silahkan pilih data yang diinginkan
        `
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
        await client.sendText("Anjay arief");
        break;

      case lowerCaseMessage.startsWith("#input_data#"):
        // Detect the special hashtag and extract name and email
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
            "Format yang Anda masukkan salah. Pastikan formatnya seperti: #INPUT_DATA#Nama#Email"
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
#INPUT_DATA#Nama#Email
          `
        );
        break;
    }
  });
}

// Routes
app.use("/", indexRouter);

module.exports = app;
