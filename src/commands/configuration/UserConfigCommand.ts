import { ApplicationCommandOptionType } from "discord.js";
import { prisma } from "../../lib/prisma.js";
import type { Bot } from "../../structures/Bot.js";
import { Command, CommandContext } from "../../structures/Command.js";

export default class UserConfigCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "user-config",
      description: "Set configuration for this member within this guild.",
      options: [
        {
          name: "set",
          type: ApplicationCommandOptionType.Subcommand,
          description: "This command will set the configuration data",
          options: [
            {
              name: "user-api-token",
              description: "Your user API token from SnailyCAD",
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
    const userApiToken = interaction.options.getString("user-api-token");

    if (command === "set") {
      let message = null;

      const createUpdateData = {
        id: interaction.user.id,
        guildId: interaction.guildId,
        apiToken: userApiToken || undefined,
      };

      if (userApiToken) {
        message = `Set API URL to ${userApiToken}`;
      }

      await prisma.discordGuildMember.upsert({
        where: { idGuildId: { guildId: interaction.guildId, id: interaction.user.id } },
        create: createUpdateData,
        update: createUpdateData,
      });

      await interaction.reply({ content: message || "No changes made.", ephemeral: true });
    }
  }
}
