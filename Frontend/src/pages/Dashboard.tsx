import productApi from "../services/product.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import UserClient from "../services/user.api";

import { useState } from "react";
export default function Dashboard() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["products"],
    queryFn: () => productApi.getAll(),
  });
  const [user, setUser] = useState<any>({
    username: "",
    password: "",
  });
  // const handleLogin = (formData: any) => {
  //   UserClient.login(formData)
  //     .then((response) => {
  //       console.log("Login successful:", response);
  //       alert("Đăng nhập thành công");
  //     })
  //     .catch((error) => {
  //       console.error("Login failed:", error);
  //       alert("Đăng nhập thất bại");
  //     });
  // };

  const mutation = useMutation({
    mutationFn: (formData: any) => UserClient.login(formData),
    onSuccess: () => {
      alert("Đăng nhập thành công");
    },
    onError: () => {
      alert("Đăng nhập thất bại");
    },
  });
  return (
    <div>
      <div>
        {" "}
        <h1>Demo test</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <div>
            <span>{data.message}</span>
            <ul>
              {data.products?.map((product: any) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2>Test login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(user);
          }}
        >
          <div>
            <label>Username:</label>
            <input
            className="border border-black"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div>
            <label>Password:</label>
            <input className="border border-black"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
