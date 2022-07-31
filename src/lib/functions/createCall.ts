import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import { prisma } from "../prisma.js";
import { performAPIRequest } from "../request.js";

interface Options {
  interaction: ChatInputCommandInteraction<"cached">;
  type: "tow" | "taxi" | "911-calls";
}

const TYPED_NAMES = {
  tow: "tow",
  taxi: "taxi",
  "911-calls": "911",
} as const;

export function createCall() {
  const defaultCommandArgs: ApplicationCommandOptionData[] = [
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
      required: true,
    },
  ];

  async function handler(options: Options) {
    const dbGuild = await prisma.discordGuild.findUnique({
      where: { id: options.interaction.guildId },
    });

    if (!dbGuild) {
      await options.interaction.reply(
        "This server is not configured. Use the `/config set api-url` command to configure this server.",
      );
      return;
    }

    const requestData = {
      location: options.interaction.options.getString("location", true),
      name: options.interaction.options.getString("name", true),
      description: options.interaction.options.getString("description", true),
    };

    const response = await performAPIRequest({
      apiPath: `/${options.type}`,
      method: "POST",
      data: requestData,
      interaction: options.interaction,
    });

    if (response?.data?.id) {
      await options.interaction.reply({
        content: `Successfully created a ${
          TYPED_NAMES[options.type]
        } call. Active units have been notified.`,
      });
      return;
    }

    await options.interaction.reply({
      content: `Could not create a ${TYPED_NAMES[options.type]} call. Please try again later.`,
    });
  }

  return {
    defaultCommandArgs,
    handler,
  };
}
