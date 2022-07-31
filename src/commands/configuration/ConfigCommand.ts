import { ApplicationCommandOptionType } from "discord.js";
import { request } from "undici";
import { prisma } from "../../lib/prisma.js";
import type { Bot } from "../../structures/Bot.js";
import { Command, CommandContext } from "../../structures/Command.js";

export default class ConfigCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "config",
      description: "Set the bot's configuration for this guild",
      options: [
        {
          name: "set",
          type: ApplicationCommandOptionType.Subcommand,
          description: "This command will set the configuration data",
          options: [
            {
              name: "api-url",
              description: "The API URL to your SnailyCAD",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: "api-token",
              description: "The API token to your SnailyCAD",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
          ],
        },
      ],
    });
  }

  async execute({ interaction }: CommandContext) {
    const command = interaction.options.getSubcommand(true);
    const apiUrl = interaction.options.getString("api-url");
    const apiToken = interaction.options.getString("api-token");

    if (command === "set") {
      let message = null;

      const createUpdateData = {
        id: interaction.guildId,
        name: interaction.guild.name,
        apiUrl: apiUrl || undefined,
        apiToken: apiToken || undefined,
      };

      if (apiUrl) {
        const isURLReachable = await this.testURL(apiUrl);

        if (!isURLReachable) {
          await interaction.reply("The URL is not reachable.");
          return;
        }

        message = `Set API URL to ${apiUrl}`;
      }

      if (apiToken) {
        message = `Set API URL to ${apiToken}`;
      }

      await prisma.discordGuild.upsert({
        where: { id: interaction.guildId },
        create: createUpdateData,
        update: createUpdateData,
      });

      await interaction.reply({ content: message || "No changes made.", ephemeral: true });
    }
  }

  private async testURL(url: string) {
    try {
      const response = await request(url);
      return url.endsWith("/v1") && response.statusCode === 404;
    } catch (e) {
      return false;
    }
  }
}
