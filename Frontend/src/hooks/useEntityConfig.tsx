import { useParams, Navigate } from "react-router-dom";
import { getEntityConfig } from "../lib/entities";

export default function useEntityConfig() {
  const { entity } = useParams<{ entity: string }>();
  const config = getEntityConfig(entity || "");
  if(!config) {
    return {
        config: null,
        error: <div>Entity not found</div>
    }
  }
  return {
    config,
    error: null
  };
}