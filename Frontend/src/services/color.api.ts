import ApiClient from "./axios";

class ColorApi extends ApiClient {
  constructor() {
    super("/color");
  }
}

export default new ColorApi();