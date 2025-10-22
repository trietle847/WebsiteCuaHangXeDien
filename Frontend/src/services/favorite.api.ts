import ApiClient from "./axios";

class FavoriteApi extends ApiClient {
  constructor() {
    super("/favourite");
  }
}

export default new FavoriteApi();
