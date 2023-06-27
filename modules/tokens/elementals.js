import { Token } from "./token.js";
import { tokenEmbed } from "../../utilities/embeds.js";
import { elementalsButton } from "../../utilities/components.js";
import { updateMetadata } from "../../data/updateMetadata.js";

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

  getElementalsId(interaction) {
    return interaction.message.embeds[0].data.author.name
      .split(" ")
      .at(-1)
      .slice(1);
  }

  async updateEmbed(interaction, id) {
    const response = await updateMetadata(this.contract, id);
    if (response !== "Request accepted") return;

    setTimeout(() => this.createEmbed(interaction, id), 5000);
  }

  async sendEmbed(interaction, embed) {
    await interaction.editReply({
      embeds: embed,
      components: elementalsButton,
    });
  }

  async handleInteraction(interaction) {
    if (interaction.type === 2) {
      const id = this.getInput(interaction);
      this.createEmbed(interaction, id);
    }

    if (interaction.type === 3) {
      const id = this.getElementalsId(interaction);
      this.updateEmbed(interaction, id);
    }
  }
}
