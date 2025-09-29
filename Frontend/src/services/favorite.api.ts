import ApiClient from "./axios";

class FavoriteApi extends ApiClient {
  constructor() {
    super("/favorite");
  }
}

export default new FavoriteApi();