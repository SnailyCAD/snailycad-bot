import { Command, type CommandContext } from "../../structures/Command.js";
import type { Bot } from "../../structures/Bot.js";
import { createCall } from "../../lib/functions/createCall.js";

const callTemplate = createCall();

export default class Call911Command extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "call911",
      description: "Call emergency services",
      options: callTemplate.defaultCommandArgs,
    });
  }

  async execute({ interaction }: CommandContext) {
    await callTemplate.handler({ type: "911-calls", interaction });
  }
}
