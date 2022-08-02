import { Command, type CommandContext } from "../../structures/Command.js";
import type { Bot } from "../../structures/Bot.js";
import { EmbedBuilder } from "@discordjs/builders";
import type { APIEmbedField } from "discord.js";

export default class PingCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "help",
      description: "Returns a list of commands.",
    });
  }

  async execute({ interaction }: CommandContext) {
    const commands = this.bot.commands;

    const fields: APIEmbedField[] = [];
    const embed = new EmbedBuilder()
      .setTitle("Help")
      .setColor([30, 40, 62])
      .setDescription(
        "**Support server:** https://discord.gg/eGnrPqEH7U\n**Documentation:** https://cad-docs.caspertheghost.me/docs/discord-integration/discord-bot/configuration**",
      );

    if (this.bot.user) {
      embed.setFooter({
        text: this.bot.user.username,
        iconURL: this.bot.user.avatarURL() ?? undefined,
      });
    }

    for (const [commandName, command] of commands.entries()) {
      fields.push({
        name: `/${commandName}`,
        value: command.options.description ?? "None",
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed.addFields(fields)] });
  }
}
