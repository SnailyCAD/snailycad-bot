import { Command, type CommandContext } from "../../structures/Command.js";
import type { Bot } from "../../structures/Bot.js";
import { prisma } from "../../lib/prisma.js";
import { request } from "undici";
import { ApplicationCommandOptionType } from "discord.js";

export default class Call911Command extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "call911",
      description: "Call the 911",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          description: "The caller name",
          name: "caller",
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

    const location = interaction.options.getString("location", true);
    const caller = interaction.options.getString("caller", true);
    const description = interaction.options.getString("description", false);

    const data = await request(`${dbGuild.apiUrl}/v1/911-calls`, {
      method: "POST",
      body: JSON.stringify({ location, caller, description }),
    });

    console.log(data.headers);

    console.log({ data });
  }
}
