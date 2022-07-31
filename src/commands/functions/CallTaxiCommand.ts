import { Command, type CommandContext } from "../../structures/Command.js";
import type { Bot } from "../../structures/Bot.js";
import { createCall } from "../../lib/functions/createCall.js";

const callTemplate = createCall();

export default class CallTaxiCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "calltaxi",
      description: "Call taxi services",
      options: callTemplate.defaultCommandArgs,
    });
  }

  async execute({ interaction }: CommandContext) {
    await callTemplate.handler({ type: "taxi", interaction });
  }
}
