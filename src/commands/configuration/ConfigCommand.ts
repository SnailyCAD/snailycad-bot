import { ApplicationCommandOptionType } from "discord.js";
import { request } from "undici";
import { prisma } from "../../lib/prisma.js";
import type { Bot } from "../../structures/Bot.js";
import { Command, CommandContext } from "../../structures/Command.js";

export default class ConfigCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "config",
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
      }

      const dbGuild = await prisma.discordGuild.upsert({
        where: { id: interaction.guildId },
        create: createUpdateData,
        update: createUpdateData,
      });

      await interaction.reply(`Set API URL to ${dbGuild.apiUrl}`);
    }
  }

  private async testURL(url: string) {
    // todo: test for is-url & /v1

    try {
      const response = await request(url);
      return response.statusCode === 200;
    } catch {
      return false;
    }
  }
}
