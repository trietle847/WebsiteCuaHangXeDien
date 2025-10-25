import ApiClient from "./axios";

class CartApi extends ApiClient {
  constructor() {
    super("/cart");
  }
}

export default new CartApi();
