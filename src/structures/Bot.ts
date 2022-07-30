import * as DJS from "discord.js";
import type { Command } from "./Command.js";
import { EventHandler } from "../handlers/EventHandler.js";
import { prisma } from "../lib/prisma.js";

export class Bot extends DJS.Client {
  commands: DJS.Collection<string, Command> = new DJS.Collection();
  prisma: typeof prisma;

  constructor() {
    super({
      intents: [
        DJS.IntentsBitField.Flags.Guilds,
        /* provide your intents here */
      ],
    });

    new EventHandler(this).loadEvents();

    this.prisma = prisma;
  }
}
