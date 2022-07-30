import "dotenv/config";
import * as Sentry from "@sentry/node";
import { Bot } from "./structures/Bot.js";

const bot = new Bot();

await bot.login(process.env["BOT_TOKEN"]);
Sentry.init({
  dsn: "https://5152dff1b7334743b67ee49ae394aee6@o518232.ingest.sentry.io/6613141",
  tracesSampleRate: 1.0,
});
