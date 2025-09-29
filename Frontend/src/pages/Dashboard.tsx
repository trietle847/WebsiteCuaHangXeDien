import productApi from "../services/product.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
export default function Dashboard() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["products"],
    queryFn: () => productApi.getAll(),
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
    </div>
  );
}
