import { Token } from "./token.js";
import { tokenEmbed } from "../../utilities/embeds.js";

export class Elementals extends Token {
  contract = "0x3af2a97414d1101e2107a70e7f33955da1346305";

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
