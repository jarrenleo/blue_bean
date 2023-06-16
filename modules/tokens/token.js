import { TokenData } from "../../data/tokenData.js";
import { tokenEmbed } from "../../utilities/embeds.js";

export class Token extends TokenData {
  constructor() {
    super();
  }

  getInput(interaction) {
    return interaction.options.get("id").value;
  }

  async createEmbed(interaction, contract, id) {
    try {
      const data = await this.getTokenData(contract, id);
      const embed = tokenEmbed(data);

      await this.sendEmbed(interaction, embed);
    } catch {
      this.sendError(interaction, `Token #${id} not found.`);
    }
  }

  async sendEmbed(interaction, embed) {
    await interaction.editReply({
      embeds: embed,
    });
  }

  async sendError(interaction, message) {
    await interaction.editReply({
      content: message,
    });
  }

  async handleInteraction(interaction, query, matchedData) {
    const id = this.getInput(interaction);
    this.createEmbed(interaction, matchedData?.id ?? query, id);
  }
}
