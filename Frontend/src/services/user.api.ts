import ApiClient from "./axios";

export interface LoginData {
  username: string;
  password: string;
}

export class UserClient extends ApiClient {
  constructor() {
    super("/user");
  }

  async login(data: LoginData) {
    try {
      return (await this.api.post("/login", data)).data;
    } catch (error: any) {
      throw new Error(`Đăng nhập thất bại: ${error.response.data.message}`);
    }
  }

  async getInfoByUsername() {
    try {
      return (await this.api.get("/me")).data;
    } catch (error: any) {
      throw new Error(
        `Lấy thông tin người dùng thất bại: ${error.response.data.message}`
      );
    }
  }

  async verifyToken(token: string) {
    try {
      return (await this.api.get("/verify-token", { params: { token } })).data;
    } catch (error: any) {
      throw new Error(
        `Xác thực token thất bại: ${error.response.data.message}`
      );
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      return (await this.api.post("/reset-password", { token, newPassword }))
        .data;
    } catch (error: any) {
      throw new Error(
        `Đặt lại mật khẩu thất bại: ${error.response.data.message}`
      );
    }
  }

  async activate(id: string | number) {
    try {
      return (await this.api.patch(`/activate/${id}`)).data;
    } catch (error: any) {
      throw new Error(`${error.response.data.message}`);
    }
  }

  async deactivate(id: string | number) {
    try {
      return (await this.api.patch(`/deactivate/${id}`)).data;
    } catch (error: any) {
      throw new Error(`${error.response.data.message}`);
    }
  }

  async forgetPassword(email: string) {
    try {
      return (await this.api.post("/forget-password", { email })).data;
    } catch (error: any) {
      throw new Error(
        `Yêu cầu đặt lại mật khẩu thất bại: ${error.response.data.message}`
      );
    }
  }
}

export default new UserClient();
