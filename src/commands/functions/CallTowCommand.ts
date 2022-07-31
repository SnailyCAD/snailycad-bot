import { Command, type CommandContext } from "../../structures/Command.js";
import type { Bot } from "../../structures/Bot.js";
import { createCall } from "../../lib/functions/createCall.js";

const callTemplate = createCall();

export default class CallTowCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "calltow",
      description: "Call tow services",
      options: callTemplate.defaultCommandArgs,
    });
  }

  async execute({ interaction }: CommandContext) {
    await callTemplate.handler({ type: "tow", interaction });
  }
}
