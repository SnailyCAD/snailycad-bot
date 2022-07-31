import type { ChatInputCommandInteraction } from "discord.js";
import { request } from "undici";
import { prisma } from "./prisma.js";

interface Options<T> {
  apiPath: string;
  method: "POST" | "GET";
  interaction: ChatInputCommandInteraction<"cached">;
  data: T;
}

export async function performAPIRequest<T>(options: Options<T>) {
  const dbGuild = await prisma.discordGuild.findUnique({
    where: { id: options.interaction.guildId },
  });

  if (!dbGuild) {
    await options.interaction.reply(
      "This server is not configured. Use the `/config set api-url` command to configure this server.",
    );
    return null;
  }

  const response = await request(`${dbGuild.apiUrl}${options.apiPath}`, {
    method: options.method,
    body: JSON.stringify(options.data),
    headers: {
      "content-type": "application/json",
      "snaily-cad-api-token": String(dbGuild.apiToken),
    },
  });

  const json = await response.body.json().catch(() => null);
  const errors = json?.errors ?? [];
  const data = json;

  return { errors, data };
}
