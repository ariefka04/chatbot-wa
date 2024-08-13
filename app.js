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

    if (message === "Hello") {
      await client.sendText(message.from, "Hai, WA BPS disini");
    }
  });
}

//Routes
app.use("/", indexRouter);

module.exports = app;
