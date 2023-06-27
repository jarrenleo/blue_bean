import { getData } from "./reservoirAPI.js";
import { getQueryParams } from "../utilities/helpers.js";

export class AutoCompleteData {
  async getAutoCompleteData(query) {
    const queryParams = getQueryParams(query);
    const collections = await getData(
      `https://api.reservoir.tools/collections/v5?${queryParams}=${query}&includeTopBid=true&limit=5`
    );

    return collections;
  }
}
