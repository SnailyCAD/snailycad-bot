import { captureException } from "@sentry/node";
import * as DJS from "discord.js";
import type { Bot } from "../../structures/Bot.js";
import { Event } from "../../structures/Event.js";

export default class InteractionEvent extends Event {
  constructor(bot: Bot) {
    super({ bot, name: DJS.Events.InteractionCreate });
  }

  async execute(bot: Bot, interaction: DJS.Interaction<"cached">) {
    if (interaction.type !== DJS.InteractionType.ApplicationCommand) return;
    if (interaction.commandType !== DJS.ApplicationCommandType.ChatInput) return;
    if (!interaction.inGuild()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute({ interaction });
    } catch (err) {
      captureException(err);
      console.error(err);

      const reply = await interaction.fetchReply().catch(() => null);
      if (reply?.id) return;

      if (interaction.deferred) {
        interaction.editReply({ content: "An error occurred! Please try again later." });
      } else {
        interaction.reply({
          ephemeral: true,
          content: "An error occurred! Please try again later.",
        });
      }
    }
  }
}
