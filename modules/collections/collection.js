import { CollectionData } from "../../data/collectionData.js";
import { collectionEmbed } from "../../utilities/embeds.js";
import { Token } from "../tokens/token.js";

export class Collection extends CollectionData {
  token = new Token();

  constructor() {
    super();
  }

  getInput(interaction) {
    return interaction.options.get("query").value;
  }

  matchQueryToData(query, data) {
    if (!data.length) return null;

    for (const datum of data) {
      if (datum.name === query) return datum;
    }

    return null;
  }

  isCollection(interaction) {
    return interaction.options._hoistedOptions.length === 1;
  }

  async createEmbed(interaction, query, matchedData) {
    try {
      const data = await this.getCollectionData(query, matchedData);
      const embed = collectionEmbed(data);

      this.sendEmbed(interaction, embed);
    } catch {
      this.sendError(interaction, `Collection **${query}** not found.`);
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

  async handleInteraction(interaction, storedData) {
    const query = this.getInput(interaction);
    const matchedData = this.matchQueryToData(query, storedData);

    this.isCollection(interaction)
      ? this.createEmbed(interaction, query, matchedData)
      : this.token.handleInteraction(interaction, query, matchedData);
  }
}
