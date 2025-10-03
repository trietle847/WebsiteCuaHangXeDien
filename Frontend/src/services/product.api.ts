import ApiClient from "./axios";

export interface Product {
  product_id?: number;
  name: string;
  price: number;
  stock_quantity: number;
  specifications: string;
  average_rating: number;
  company_id: number;
}

class ProductApi extends ApiClient {
  constructor() {
    super("/product");
  }


  async getAll(): Promise<Product[]> {
    return (await this.api.get("/")).data;
  }

    async get(id:number): Promise<Product> {
      return (await this.api.get(`/${id}`)).data;
  }
}

export default new ProductApi();
