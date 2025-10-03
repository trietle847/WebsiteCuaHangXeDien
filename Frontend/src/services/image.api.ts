import ApiClient from "./axios";

export interface Image {
  image_id: number;
  title: string;
  data: string;
  product_id: number;
}

class ImageApi extends ApiClient {
  constructor() {
    super("/image");
  }

  async getAll(): Promise<{ message: string; images: Image[] }> {
    return (await this.api.get("/")).data;
  }
}

export default new ImageApi();
