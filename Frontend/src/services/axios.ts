import axios from "axios";

const apiURL = "http://localhost:3000";
// Hàm tạo API client theo baseURL
const AxiosCreate = (endpoint: string) => {
  const instance = axios.create({
    baseURL: `${apiURL}${endpoint}`,
  });
  return instance;
};

// Ép kiểu cho endpoint
type Endpoint = `/${string}`;

class ApiClient {
  api;
  constructor(endpoint: Endpoint) {
    this.api = AxiosCreate(endpoint);
  }

  async getAll() {
    try {
      return (await this.api.get("/")).data;
    } catch (error) {
      throw new Error(`Failed to fetch all: ${error}`);
    }
  }

  async getById(id: string) {
    try {
      return (await this.api.get(`/${id}`)).data;
    } catch (error) {
      throw new Error(`Failed to fetch by id: ${error}`);
    }
  }

  async create(data: any) {
    try {
      return (await this.api.post("/", data)).data;
    } catch (error) {
      throw new Error(`Failed to create: ${error}`);
    }
  }

  async update(id: string, data: any) {
    try {
      return (await this.api.patch(`/${id}`, data)).data;
    } catch (error) {
      throw new Error(`Failed to update: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return (await this.api.delete(`/${id}`)).data;
    } catch (error) {
      throw new Error(`Failed to delete: ${error}`);
    }
  }
}

export default ApiClient;
