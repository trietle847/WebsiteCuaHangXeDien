import { Box, Typography, Card } from "@mui/material";
import type { Vehicle } from "../../lib/types";
import vehicleApi from "../../services/vehicle.api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { ElectricMoped, CheckCircle } from "@mui/icons-material";

export default function ChooseVehicle({
  onChange,
  selectedVehicleId,
}: {
  onChange: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
}) {
  const { data } = useQuery({
    queryKey: ["customerVehicles"],
    queryFn: () => vehicleApi.getVehicleByCustomer(),
  });

  const vehicles: Vehicle[] = data?.data || [];

  return (
    <Box sx={{
      width: "100%"
    }}>
      {vehicles && vehicles.length > 0 ? (
        <Box>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            <ElectricMoped fontSize="large" /> Chọn xe của bạn
          </Typography>
          <Typography sx={{ mb: 2 }} color="text.secondary">
            Vui lòng chọn xe bạn muốn đăng ký dịch vụ.
          </Typography>
          <Box
            sx={{
              p: 2,
              mb: 2,
              gap: 2,
              overflowY: "auto",
              maxHeight: {
                xs: "300px",
                sm: "400px",
                md: "500px",
              },
            }}
          >
            {vehicles.map((vehicle) => {
              const isSelected = vehicle.vehicle_id === selectedVehicleId;
              return (
                <Card
                  key={vehicle.vehicle_id}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    // Logic Style khi được chọn
                    border: isSelected ? "1px solid #1976d2" : "1px solid #ccc",
                    bgcolor: isSelected ? "rgba(33, 150, 243, 0.08)" : "white", // blue[500] with opacity
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: 2,
                    },
                    mb: 2,
                  }}
                  onClick={() => onChange(vehicle)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {vehicle.ProductColor?.Product.name} (
                      {vehicle.ProductColor?.Color.name})
                    </Typography>
                    {isSelected && <CheckCircle sx={{
                      color: "#1976d2"
                    }} />}
                  </Box>
                  <Typography>Số khung: {vehicle.vin}</Typography>
                  <Typography>
                    Ngày mua:{" "}
                    {format(new Date(vehicle.createdAt), "dd/MM/yyyy")}
                  </Typography>
                </Card>
              );
            })}
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
