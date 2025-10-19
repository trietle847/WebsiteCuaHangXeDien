import {
  Button,
  Box,
  IconButton,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import ManageItemDialog from "../dialog/ManageItemDialog";
import UploadFile from "../inputs/UploadFile";
import { colorFormConfig } from "../../lib/entities/form/color.form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type UseFormSetValue, type UseFormUnregister } from "react-hook-form";

interface ColorImagesProps {
  setValue: UseFormSetValue<any>;
  unregister: UseFormUnregister<any>;
}

export default function ColorImages({ setValue, unregister }: ColorImagesProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [colorImages, setColorImages] = useState<
    { color_id: string; images: string }[]
  >([]);

  const { data: colors } = useQuery({
    queryKey: ["colors"],
    queryFn: () => colorFormConfig.api.getAll(),
  });

  const addColortoProduct = async () => {
    if (
      selectedColor === "" ||
      colorImages.find((ci) => ci.color_id === selectedColor)
    )
      return;
    setColorImages((prev) => [
      ...prev,
      { color_id: selectedColor, images: "" },
    ]);
    const selectedColors = colors?.data.filter((color: any) =>
      [...colorImages, { color_id: selectedColor }].some(
      (ci) => ci.color_id === color.color_id
      )
    );
    setValue('colors', selectedColors);
    setSelectedColor("");
  };

  const removeColorFromProduct = async (color_id: string) => {
    setColorImages((prev) => prev.filter((ci) => ci.color_id !== color_id));
    unregister(`images_${color_id}`);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          select
          value={selectedColor}
          label="Chọn màu sắc"
          fullWidth
          sx={{ maxWidth: 500, mr: 2 }}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          <MenuItem value="">
            <em>Chọn màu sắc</em>
          </MenuItem>
          {colors?.data.map(
            (color: {
              color_id: string | number;
              name: string;
              code: string;
            }) => (
              <MenuItem key={color.color_id} value={color.color_id}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: color.code,
                    border: "1px solid #000",
                    borderRadius: "25px",
                    mr: 1,
                  }}
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {color.name}
                </Box>
              </MenuItem>
            )
          )}
        </TextField>
        <Button variant="contained" onClick={() => addColortoProduct()}>
          Thêm màu
        </Button>
        <Box
          sx={{
            width: "2px",
            backgroundColor: "black",
            mx: 2,
            alignSelf: "stretch",
            display: "inline-block",
          }}
        />
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Quản lý màu sắc
        </Button>
        <ManageItemDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          config={colorFormConfig}
          data={colors?.data || []}
          isColor={true}
          permission={{
            update: false,
            create: true,
            delete: true,
          }}
          idName="color_id"
        />
      </Box>
      {colorImages.map((colorImage, index) => {
        const modelColor = colors.data.find(
          (c: any) => c.color_id === colorImage.color_id
        );
        return (
          <Box key={index}>
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Hình ảnh màu: {modelColor?.name}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: modelColor?.code,
                  border: "1px solid #000",
                  borderRadius: "25px",
                  ml: 1,
                }}
              />
              <IconButton
                onClick={() => removeColorFromProduct(colorImage.color_id)}
              >
                <RemoveCircle />
              </IconButton>
            </Typography>
            <UploadFile
              acceptedFileTypes={["image/*"]}
              onChange={(files) =>
                setValue(`images_${colorImage.color_id}`, files)
              }
              compact={true}
              columns={3}
              previewHeight={150}
              maxFiles={5}
            />
          </Box>
        );
      })}
    </Box>
  );
}
