import createAPI from "./createAPI.service";

export interface LoginData {
    username: string,
    password: string,
} 

const userService = {
  login: async (data: LoginData) => {
    const response = await createAPI.post("/user/login", data);

    const token = response.data.token;
    localStorage.setItem("token", token);

    return response.data;
  },
};

export default userService;
