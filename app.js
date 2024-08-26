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
          `Silahkan ketik kode yang ingin Anda pilih untuk bidang:
2a Sosial dan Kependudukan
2b Ekonomi dan Perdagangan
2c Pertanian dan Pertambangan`
        );
        break;

      case lowerCaseMessage === "2a":
        await client.sendText(
          message.from,
          `Anda telah memilih bidang Sosial dan Kependudukan

Silahkan ketik kode yang ingin Anda pilih untuk Subjek:
2a1 Geografi
2a2 Iklim
2a3 Indeks Pembangunan Manusia
2a4 Kemiskinan
2a5 Kependudukan
2a6 Kesehatan
2a7 Konsumsi dan Pengeluaran
2a8 Pemerintahan
2a9 Pendidikan
2a10 Perumahan
2a11 Politik dan Keamanan
2a12 Tenaga Kerja

Pilih untuk menampilkan Indikator

Ketik 2 untuk kembali ke pilihan bidang`
        );
        break;

      case lowerCaseMessage === "2a5":
        await client.sendText(
          message.from,
          `Anda telah memilih Subjek 2a5 Kependudukan

Silahkan ketik kode yang ingin Anda tampilkan untuk indikator:
*2a51* Jumlah penduduk menurut distrik dan jenis kelamin
*2a52* Proyeksi penduduk
*2a53* Rasio jenis kelamin menurut Kecamatan

Pilih untuk menampilkan tahun

Ketik *2a* untuk kembali ke pilihan subjek`
        );
        break;

      case lowerCaseMessage === "2a51":
        await client.sendText(
          message.from,
          `Anda telah memillih Jumlah penduduk menurut distrik dan jenis kelamin

Silahkan ketik kode yang ingin Anda pilih untuk tahun:
*25a11* 2010-2015
*25a12* 2011-2016
*25a13* 2012-2017`
        );
        break;

      case lowerCaseMessage === "2a511":
        await client.sendText(
          message.from,
          `Anda telah memillih Jumlah penduduk menurut distrik dan jenis kelamin untuk tahun 2010-2015
Berikut ini adalah filenya`
        );

        await client.sendFile(
          message.chatId,
          "./example.pdf",
          "file.pdf",
          "Jumlah penduduk menurut distrik dan jenis kelamin untuk tahun 2010-2015",
          message.quotedMessageId
        );

        await client.sendText(
          message.from,
          "Silahkan ketik 'menu utama' atau 0 untuk kembali ke awal"
        );
        break;

      case lowerCaseMessage === "2b":
        await client.sendText(
          message.from,
          `Anda telah memilih bidang Ekonomi dan Perdagangan

Silakan ketik kode yang ingin Anda pilih untuk Subjek:
2b1 Energi
2b2 Harga Eceran
2b3 Harga Produsen
2b4 Industri
2b5 Keuangan
2b6 Komunikasi
2b7 Konstruksi
2b8 Pariwisata
2b9 Produk Domestik Regional Bruto
2b10 Transportasi

Pilih untuk menampilkan Indikator

Ketik 2 untuk kembali ke pilihan bidang`
        );
        break;

      case lowerCaseMessage === "2c":
        await client.sendText(
          message.from,
          `Anda telah memilih bidang Pertanian dan Pertambangan

Silakan ketik kode yang ingin Anda pilih untuk Subjek:
2c1 Hortikultura
2c2 Kehutanan
2c3 Perikanan
2c4 Perkebunan
2c5 Pertambangan
2c6 Peternakan
2c7 Tanaman Pangan

Pilih untuk menampilkan Indikator

Ketik 2 untuk kembali ke pilihan bidang`
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
