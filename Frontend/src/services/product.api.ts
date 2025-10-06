import ApiClient from "./axios";
import { createFormData } from "../utils/formData";

class ProductApi extends ApiClient {
  constructor() {
    super("/product");
  }

  async create(data: any) {
    const formData = createFormData(data);
    return (await this.api.post("/", formData)).data;
  }
}

export default new ProductApi();
