import ApiClient from "./axios";

class ImageApi extends ApiClient {
  constructor() {
    super("/image");
  }
}

export default new ImageApi();