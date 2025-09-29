import ApiClient from "./axios";

class PromotionApi extends ApiClient {
  constructor() {
    super("/promotion");
  }
}

export default new PromotionApi();