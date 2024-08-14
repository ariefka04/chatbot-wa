const wa = require("@open-wa/wa-automate");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

//Router
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
    if (message.body) {
      await client.sendText(
        message.from,
        `Halo selamat datang di WA Bot BPS Keerom.
          Silahkan ketik angka untuk:
          1. Rekomendasi Statistik
          2. Permintaan Data
          3. Pembinaan Statistik Sektoral
          4. Konsultasi Data Statistik

          Silahkan pilih layanan yang diinginkan
        `
      );
    } else if (message.body == "1") {
      await client.sendText(
        message.from,
        `
        1a. Penduduk
        1b. Kemiskinan

        Silahkan pilih rekomendasi statistik yang diinginkan
        `
      );
    } else if (message.body == "2") {
      await client.sendText(
        message.from,
        `
        2a. Tabulasi data
        2b. Publikasi
        
        Silahkan pilih data yang diingin
      `
      );
    } else if (message.body == "file") {
      await client.sendFile();
    }
  });
}

//Routes
app.use("/", indexRouter);

module.exports = app;
