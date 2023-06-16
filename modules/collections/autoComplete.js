import { AutoCompleteData } from "../../data/autoCompleteData.js";
import { isVerified } from "../../utilities/helpers.js";

export class AutoComplete extends AutoCompleteData {
  storedData = [];

  constructor() {
    super();
  }

  async createOptions(interaction, query) {
    const data = await this.getAutoCompleteData(query);
    this.sendOptions(interaction, data);
    this.storedData = data;
  }

  async sendOptions(interaction, data) {
    const options = data.map((datum) => {
      return {
        name: `${datum.name} ${isVerified(datum.openseaVerificationStatus)}`,
        value: `${datum.name}`,
      };
    });

    await interaction.respond(options);
  }

  handleInteraction(interaction) {
    const query = interaction.options.getFocused();
    if (!query) return;

    this.createOptions(interaction, query);
  }
}
