import * as DJS from "discord.js";
import { InteractionHandler } from "../../handlers/InteractionHandler.js";
import type { Bot } from "../../structures/Bot.js";
import { Event } from "../../structures/Event.js";

export default class ReadyEvent extends Event {
  constructor(bot: Bot) {
    super({ bot, name: DJS.Events.ClientReady });
  }

  async execute(bot: Bot) {
    const userCount = bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const serverCount = bot.guilds.cache.size;

    console.info(`Bot is running ${userCount} users and ${serverCount} servers`);

    new InteractionHandler(bot).loadInteractions();

    bot.user?.setActivity("snailycad.org", { type: DJS.ActivityType.Watching });
  }
}
