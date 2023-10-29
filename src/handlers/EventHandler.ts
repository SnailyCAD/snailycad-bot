import { captureException } from "@sentry/node";
import { globby } from "globby";
import { importFileFromFilename } from "../lib/utils.js";
import type { Bot } from "../structures/Bot.js";
import type { Event } from "../structures/Event.js";

export class EventHandler {
  bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  async loadEvents() {
    try {
      const path =
        process.env.NODE_ENV === "production" ? "./dist/events/**/*.js" : "./src/events/**/*.ts";

      const files = await globby(path);
      await Promise.all(files.map(async (filename) => this.loadEvent(filename)));
    } catch (e) {
      captureException(e);
      console.log("An error occurred when loading the events", { e });
    }
  }

  private async loadEvent(filename: string) {
    const event = await importFileFromFilename<Event>({
      filename,
      constructorOptions: [this.bot],
    });

    this.bot.on(event.name, async (...args) => {
      try {
        event.execute(this.bot, ...args);
      } catch (err) {
        captureException(err);
      }
    });
  }
}
