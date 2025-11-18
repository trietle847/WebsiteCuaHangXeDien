import { Box, Typography, Card } from "@mui/material";
import type { Vehicle } from "../../lib/types";
import vehicleApi from "../../services/vehicle.api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";

export default function ChooseVehicle({onChange}: {onChange: (vehicle: Vehicle) => void}) {
  const { data } = useQuery({
    queryKey: ["customerVehicles"],
    queryFn: () => vehicleApi.getVehicleByCustomer(),
  });

  const vehicles: Vehicle[] = data?.data || [];

  return (
    <Box>
      {vehicles && vehicles.length > 0 ? (
        <Box>
          <Typography variant="h5" gutterBottom>Chọn xe của bạn:</Typography>
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
              maxHeight: 330,
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
                  onClick={() => onChange(vehicle)}
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
    </Box>
  );
}
