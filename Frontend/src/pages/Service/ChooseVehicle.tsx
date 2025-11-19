import { Box, Typography, Card } from "@mui/material";
import type { Vehicle } from "../../lib/types";
import { useState } from "react";
import vehicleApi from "../../services/vehicle.api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";

export default function ChooseVehicle() {
  const { data } = useQuery({
    queryKey: ["customerVehicles"],
    queryFn: () => vehicleApi.getVehicleByCustomer(),
  });

  const vehicles: Vehicle[] = data?.data || [];

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  return (
    <Box>
      {vehicles && vehicles.length > 0 ? (
        <Box>
          <Typography variant="h6" gutterBottom>Chọn xe của bạn:</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              p: 2,
              mb: 2,
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1fr 1fr",
              },
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle.vehicle_id}
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    "&:hover": { color: "red" },
                  }}
                  variant="subtitle1"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <span>{vehicle.ProductColor.Product.name} ({vehicle.ProductColor.Color.name})</span>
                  <span>Số khung: {vehicle.vin}</span>
                  <span>Số máy: {vehicle.engine_number}</span>
                  <span>Ngày mua: {format(new Date(vehicle.createdAt), "dd/MM/yyyy")}</span>
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography>Bạn chưa có xe để đăng ký dịch vụ bảo dưỡng.</Typography>
        </Box>
      )}
      {selectedVehicle ? (
        <Box>
          <Typography variant="h6">Thông tin xe đã chọn:</Typography>
          <Typography>
            Tên xe: {selectedVehicle.ProductColor.Product.name}
          </Typography>
          <Typography>Số khung: {selectedVehicle.vin}</Typography>
          <Typography>Số máy: {selectedVehicle.engine_number}</Typography>
          <Typography>
            Ngày mua:{" "}
            {format(new Date(selectedVehicle.createdAt), "dd/MM/yyyy")}
          </Typography>
        </Box>
      ) : (
        <Typography>Chưa có xe được chọn.</Typography>
      )}
    </Box>
  );
}
