import axios from "axios";

const apiURL = "/api";
// Hàm tạo API client theo baseURL
const AxiosCreate = (endpoint: string) => {
  const instance = axios.create({
    baseURL: `${apiURL}${endpoint}`,
    // headers: {
    //   "Content-Type": "application/json",
    // },
  });

  // interceptor: tự gắn token
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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

  async getAll(queryParams?: Record<string, any>) {
    try {
      return (await this.api.get("/", { params: queryParams })).data;
    } catch (error: any) {
      throw new Error(`Lấy thông tin thất bại: ${error.response.data.message}`);
    }
  }

  async getById(id: string) {
    try {
      return (await this.api.get(`/${id}`)).data;
    } catch (error: any) {
      throw new Error(`Lấy thông tin thất bại: ${error.response.data.message}`);
    }
  }

  async create(data: any) {
    try {
      return (await this.api.post("/", data)).data;
    } catch (error: any) {
      throw new Error(`Tạo đối tượng thất bại: ${error.response.data.message}`);
    }
  }

  async update(id: number, data: any) {
    try {
      return (await this.api.put(`/${id}`, data)).data;
    } catch (error: any) {
      throw new Error(`Cập nhật đối tượng thất bại: ${error.response.data.message}`);
    }
  }

  async delete(id: number) {
    try {
      return (await this.api.delete(`/${id}`)).data;
    } catch (error: any) {
      throw new Error(`Xóa đối tượng thất bại: ${error.response.data.message}`);
    }
  }
}

export default ApiClient;
