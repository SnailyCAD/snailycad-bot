import { Command, type CommandContext } from "../../structures/Command.js";
import type { Bot } from "../../structures/Bot.js";
import { prisma } from "../../lib/prisma.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { performAPIRequest } from "../../lib/request.js";

interface HandleRequestOptions {
  interaction: ChatInputCommandInteraction<"cached">;
  activeOfficer: any;
}

export default class PanicButtonCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "panic-button",
      description: "Toggle the panic button",
    });
  }

  async execute({ interaction }: CommandContext) {
    const dbUser = await prisma.discordGuildMember.findUnique({
      where: { idGuildId: { guildId: interaction.guildId, id: interaction.user.id } },
    });

    if (!dbUser?.apiToken) {
      await interaction.reply({
        ephemeral: true,
        content: "You must set your user API Token first: `/user-config set`.",
      });
      return;
    }

    const activeOfficer = await this.getUserActiveOfficer(interaction);
    if (!activeOfficer) {
      await interaction.reply({
        ephemeral: true,
        content: "You must have an active officer to use this command.",
      });
      return;
    }

    await this.handleRequest({ interaction, activeOfficer });
  }

  private async getUserActiveOfficer(interaction: ChatInputCommandInteraction<"cached">) {
    const response = await performAPIRequest({
      tokenType: "user",
      apiPath: "/leo/active-officer",
      method: "GET",
      interaction,
    });

    if (!response?.data?.id) {
      return null;
    }

    return response.data;
  }

  private async handleRequest(options: HandleRequestOptions) {
    const requestData = {
      officerId: options.activeOfficer.id,
    };

    const response = await performAPIRequest({
      apiPath: "/leo/panic-button",
      method: "POST",
      data: requestData,
      interaction: options.interaction,
    });

    const isPanicButtonActive = response?.data.status.shouldDo === "PANIC_BUTTON";
    if (response?.data?.id && isPanicButtonActive) {
      await options.interaction.reply({ content: "Panic button activated." });
      return;
    }

    await options.interaction.reply({ content: "Panic button deactivated." });
  }
}
