import { ApplicationCommandOptionType } from "discord.js";
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
              required: true,
            },
          ],
        },
      ],
    });
  }

  async execute({ interaction }: CommandContext) {
    const command = interaction.options.getSubcommand(true);
    const apiUrl = interaction.options.getString("api-url", true);

    if (command === "set") {
      const createUpdateData = {
        id: interaction.guildId,
        name: interaction.guild.name,
        apiUrl,
      };

      const dbGuild = await prisma.discordGuild.upsert({
        where: { id: interaction.guildId },
        create: createUpdateData,
        update: createUpdateData,
      });

      interaction.reply(`Set API URL to ${dbGuild.apiUrl}`);
    }
  }
}
