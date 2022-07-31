import { Command, type CommandContext } from "../../structures/Command.js";
import type { Bot } from "../../structures/Bot.js";
import { prisma } from "../../lib/prisma.js";
import { ApplicationCommandOptionType } from "discord.js";
import { performAPIRequest } from "../../lib/request.js";

export default class Call911Command extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "call911",
      description: "Call the 911",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          description: "The caller's name",
          name: "name",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          description: "The call's location",
          name: "location",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          description: "The call's description",
          name: "description",
          required: false,
        },
      ],
    });
  }

  async execute({ interaction }: CommandContext) {
    const dbGuild = await prisma.discordGuild.findUnique({
      where: { id: interaction.guildId },
    });

    if (!dbGuild) {
      await interaction.reply(
        "This server is not configured. Use the `/config set api-url` command to configure this server.",
      );
      return;
    }

    const requestData = {
      location: interaction.options.getString("location", true),
      name: interaction.options.getString("name", true),
      description: interaction.options.getString("description", false),
    };

    const response = await performAPIRequest({
      apiPath: "/911-calls",
      method: "POST",
      data: requestData,
      interaction,
    });

    if (response?.data?.id) {
      await interaction.reply({
        content:
          "Successfully created the 911 call. Active units and Dispatchers have been notified.",
      });
      return;
    }

    await interaction.reply({
      content: "Could not create the 911 call. Please try again later.",
    });
  }
}
