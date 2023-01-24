import type { ChatInputCommandInteraction } from "discord.js";
import { request } from "undici";
import { prisma } from "./prisma.js";

interface Options<T> {
  tokenType?: "global" | "user";
  apiPath: string;
  method: "POST" | "GET";
  interaction: ChatInputCommandInteraction<"cached">;
  data?: T;
}

export async function performAPIRequest<T>(options: Options<T>) {
  const dbGuild = await prisma.discordGuild.findUnique({
    where: { id: options.interaction.guildId },
  });

  const tokenData = await getTokenByType(options);
  if (!tokenData) return;

  const response = await request(`${dbGuild!.apiUrl}${options.apiPath}`, {
    method: options.method,
    body: JSON.stringify(options.data),
    headers: {
      "content-type": "application/json",
      [tokenData.headerName]: tokenData.token,
    },
  }).catch(() => null);

  const json = (await response?.body.json().catch(() => null)) ?? null;
  const errors = json?.errors ?? [];
  const data = json;

  return { errors, data };
}

async function getTokenByType<T>(options: Pick<Options<T>, "tokenType" | "interaction">) {
  let token = "";
  let headerName = "";

  if (options.tokenType === "user") {
    const dbUser = await prisma.discordGuildMember.findUnique({
      where: {
        idGuildId: { guildId: options.interaction.guildId, id: options.interaction.user.id },
      },
    });

    if (!dbUser?.apiToken) {
      await options.interaction.reply({
        ephemeral: true,
        content: "You must set your user API Token first: `/user-config set`.",
      });
      return null;
    }

    token = dbUser.apiToken;
    headerName = "snaily-cad-user-api-token";
  } else {
    const dbGuild = await prisma.discordGuild.findUnique({
      where: { id: options.interaction.guildId },
    });

    if (!dbGuild?.apiToken || !dbGuild.apiUrl) {
      await options.interaction.reply(
        "This server is not configured. Use the `/config set api-url` command to configure this server.",
      );
      return null;
    }

    token = dbGuild.apiToken;
    headerName = "snaily-cad-api-token";
  }

  return { token, headerName };
}
