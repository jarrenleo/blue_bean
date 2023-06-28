import { Token } from "./token.js";
import { tokenEmbed } from "../../utilities/embeds.js";

export class Elementals extends Token {
  contract = "0xb6a37b5d14d502c3ab0ae6f3a0e058bc9517786e";

  constructor() {
    super();
  }

  async createEmbed(interaction, id) {
    try {
      const data = await this.getTokenData(this.contract, id);
      const embed = tokenEmbed(data);

      await this.sendEmbed(interaction, embed);
    } catch {
      this.sendError(interaction, `Elementals #${id} not found.`);
    }
  }

  async sendEmbed(interaction, embed) {
    await interaction.editReply({
      embeds: embed,
    });
  }

  async handleInteraction(interaction) {
    const id = this.getInput(interaction);
    this.createEmbed(interaction, id);
  }
}
