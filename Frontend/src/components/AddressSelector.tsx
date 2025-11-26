import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Box,
  Stack,
  Typography,
  Paper,
} from "@mui/material";

interface LocationItem {
  code: string;
  name: string;
  name_with_type: string;
  slug: string;
  type: string;
}

interface ApiResponse {
  data: {
    data: LocationItem[];
  };
}

interface AddressSelectorProps {
  onAddressChange: (address: string) => void;
  initialAddress?: string;
}

const BASE_API_URL = "https://vn-public-apis.fpo.vn";

export default function AddressSelector({
  onAddressChange,
  initialAddress,
}: AddressSelectorProps) {
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [wards, setWards] = useState<LocationItem[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [selectedWardCode, setSelectedWardCode] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");

  const fetchData = async (
    url: string,
    setState: React.Dispatch<React.SetStateAction<LocationItem[]>>
  ) => {
    try {
      const res = await fetch(url);
      const data = (await res.json()) as ApiResponse;
      setState(data?.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi fetch địa chỉ:", error);
      setState([]);
    }
  };

  useEffect(() => {
    fetchData(`${BASE_API_URL}/provinces/getAll?limit=-1`, setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvinceCode) {
      fetchData(
        `${BASE_API_URL}/districts/getByProvince?provinceCode=${selectedProvinceCode}&limit=-1`,
        setDistricts
      );
    } else {
      setDistricts([]);
    }
    setSelectedDistrictCode("");
    setSelectedWardCode("");
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (selectedDistrictCode) {
      fetchData(
        `${BASE_API_URL}/wards/getByDistrict?districtCode=${selectedDistrictCode}&limit=-1`,
        setWards
      );
    } else {
      setWards([]);
    }
    setSelectedWardCode("");
  }, [selectedDistrictCode]);

  useEffect(() => {
    const provinceName =
      provinces.find((p) => p.code === selectedProvinceCode)?.name_with_type ||
      "";
    const districtName =
      districts.find((d) => d.code === selectedDistrictCode)?.name_with_type ||
      "";
    const wardName =
      wards.find((w) => w.code === selectedWardCode)?.name_with_type || "";

    if (selectedProvinceCode) {
      const fullAddress = [detailAddress, wardName, districtName, provinceName]
        .filter((item) => item && item.trim() !== "")
        .join(", ");

      onAddressChange(fullAddress);
    } else {
      onAddressChange("");
    }
  }, [
    detailAddress,
    selectedWardCode,
    selectedDistrictCode,
    selectedProvinceCode,
    provinces,
    districts,
    wards,
    onAddressChange,
  ]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h6" gutterBottom color="primary">
        Chọn địa chỉ
      </Typography>

      <Stack spacing={2}>
        <TextField
          select
          label="Tỉnh/Thành phố"
          value={selectedProvinceCode}
          onChange={(e) => setSelectedProvinceCode(e.target.value)}
          fullWidth
        >
          {provinces.map((p) => (
            <MenuItem key={p.code} value={p.code}>
              {p.name_with_type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Quận/Huyện"
          value={selectedDistrictCode}
          onChange={(e) => setSelectedDistrictCode(e.target.value)}
          fullWidth
          disabled={!selectedProvinceCode}
        >
          {districts.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.name_with_type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Phường/Xã"
          value={selectedWardCode}
          onChange={(e) => setSelectedWardCode(e.target.value)}
          fullWidth
          disabled={!selectedDistrictCode}
        >
          {wards.map((w) => (
            <MenuItem key={w.code} value={w.code}>
              {w.name_with_type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Số nhà, tên đường"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          fullWidth
          placeholder="VD: Số 10, Ngõ 123 đường Láng"
        />
      </Stack>
    </Paper>
  );
}
