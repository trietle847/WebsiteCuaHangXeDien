import ApiClient from "./axios";

class ProductApi extends ApiClient {
  constructor() {
    super("/product");
  }
}

export default new ProductApi();
