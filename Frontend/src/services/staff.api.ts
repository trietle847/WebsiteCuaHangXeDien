import { UserClient } from "./user.api";

export interface LoginData {
  username: string;
  password: string;
}

export class StaffApi extends UserClient {

  async getAll(queryParams?: Record<string, any>) {
    try {
      return (await this.api.get("/staff", { params: queryParams })).data;
    } catch (error: any) {
      throw new Error(`Lấy danh sách nhân viên thất bại: ${error.response.data.message}`);
    }
  }

  async create(data: any) {
    try {
      return (await this.api.post("/staff", data)).data;
    } catch (error: any) {
      throw new Error(`Tạo nhân viên thất bại: ${error.response.data.message}`);
    }
  }

  async getMechanics() {
    try {
      return (await this.api.get("/staff/mechanics")).data;
    } catch (error: any) {
      throw new Error(`Lấy danh sách thợ máy thất bại: ${error.response.data.message}`);
    }
  }
}

export default new StaffApi();