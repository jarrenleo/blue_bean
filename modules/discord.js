import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes, Events } from "discord.js";
import { commands } from "../utilities/commands.js";
import { AutoComplete } from "./collections/autoComplete.js";
import { Collection } from "./collections/collection.js";
import { Azuki } from "./tokens/azuki.js";
import { Beanz } from "./tokens/beanz.js";
config();

export class Discord {
  discordToken = process.env.DISCORD_TOKEN;

  autoComplete = new AutoComplete();
  collection = new Collection();
  azuki = new Azuki();
  beanz = new Beanz();

  constructor() {
    this.discord = this.login();
    this.setCommands();
    this.handleAutoCompleteInteraction();
    this.handleChatInputInteraction();
    this.handleMenuInteraction();
  }

  login() {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    client.login(this.discordToken);

    return client;
  }

  async setCommands() {
    const rest = new REST({ version: "10" }).setToken(this.discordToken);
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });
  }

  handleAutoCompleteInteraction() {
    this.discord.on("interactionCreate", async (interaction) => {
      if (!interaction.isAutocomplete()) return;
      this.autoComplete.handleInteraction(interaction);
    });
  }

  handleChatInputInteraction() {
    this.discord.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply();

      switch (interaction.commandName) {
        case "find":
          await this.collection.handleInteraction(
            interaction,
            this.autoComplete.storedData
          );
          break;
        case "azuki":
          await this.azuki.handleInteraction(interaction);
          break;
        case "beanz":
          await this.beanz.handleInteraction(interaction);
      }
    });
  }

  handleMenuInteraction() {
    this.discord.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isStringSelectMenu()) return;
      await interaction.deferUpdate();

      switch (interaction.customId) {
        case "azukiMenu":
          await this.azuki.handleInteraction(interaction);
          break;
        case "beanzMenu":
          await this.beanz.handleInteraction(interaction);
      }
    });
  }
}
