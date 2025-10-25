import {
  Button,
  Box,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { RemoveCircle, PlaylistRemove } from "@mui/icons-material";
import ManageItemDialog from "../dialog/ManageItemDialog";
import UploadFile from "../inputs/UploadFile";
import UpdateFile from "../inputs/UpdateFile";
import { colorFormConfig } from "../../lib/entities/form/color.form";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";

interface ColorImagesProps {
  ProductColors?: {
    productColor_id: string;
    color_id: string;
    product_id: string;
    stock_quantity: number;
    ColorImages: {
      image_id: number;
      productColor_id: number;
      title: string;
      url: string;
    }[];
    Color: {
      color_id: string;
      name: string;
      code: string;
    };
  }[];
}

export default function ProductVariant({ ProductColors }: ColorImagesProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [newColors, setNewColors] = useState<Set<string>>(new Set());
  const [deletePCIds, setDeletePCIds] = useState<Set<string>>(new Set());
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { setValue, getValues, unregister, control, formState } = useFormContext();

  const { data: colors } = useQuery({
    queryKey: ["colors"],
    queryFn: () => colorFormConfig.api.getAll(),
  });

  const addColortoProduct = () => {
    if (
      selectedColor === "" ||
      newColors.has(selectedColor) ||
      (ProductColors &&
        ProductColors.some((pc) => pc.color_id === selectedColor))
    )
      return;
    const updatedSet = new Set(newColors);
    updatedSet.add(selectedColor);
    setNewColors(updatedSet);
    setValue("colors", Array.from(updatedSet));
    setSelectedColor("");
  };

  const removeColorFromProduct = (color_id: string) => {
    const updatedSet = new Set(newColors);
    updatedSet.delete(color_id);
    setNewColors(updatedSet);
    setValue("colors", Array.from(updatedSet));
    unregister(`images_${color_id}`);
  };

  useEffect(() => {
    setNewColors(new Set());
    setValue("colors", []);
  }, [formState.isSubmitSuccessful]);

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
      {ProductColors && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {ProductColors.map((pc) => (
            <Box sx={{ display: "flex", gap: 1 }} key={pc.productColor_id}>
              <UpdateFile
                fileType="image"
                items={pc.ColorImages}
                quantity={pc.stock_quantity}
                idName="image_id"
                urlName="url"
                label={`Quản lý mẫu xe màu ${pc.Color.name}`}
                maxFiles={5}
                onAdd={(files) => {
                  setValue(`images_${pc.color_id}`, files);
                  setValue("addImgPCIds", [
                    ...(getValues("addImgPCIds") || []),
                    pc.productColor_id,
                  ]);
                }}
                pcId={pc.productColor_id}
                disableDropdown={deletePCIds.has(pc.productColor_id)}
              />
              <Tooltip
                title={
                  deletePCIds.has(pc.productColor_id)
                    ? `Bỏ chọn xóa màu ${pc.Color.name} khỏi sản phẩm`
                    : `Xóa màu ${pc.Color.name} khỏi sản phẩm`
                }
                placement="top" // Đặt tooltip phía trên button
              >
                <IconButton
                  sx={{
                    alignSelf: "flex-start",
                    top: 0,
                    color: deletePCIds.has(pc.productColor_id) ? "red" : "gray",
                  }}
                  onClick={() => {
                    const updateSet = new Set(deletePCIds);
                    updateSet.has(pc.productColor_id)
                      ? updateSet.delete(pc.productColor_id)
                      : updateSet.add(pc.productColor_id);
                    setValue("deleteProductColorIds", updateSet);
                    console.log(updateSet);
                    setDeletePCIds(updateSet);
                  }}
                >
                  <PlaylistRemove />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}
      {Array.from(newColors).map((color, index) => {
        const modelColor = colors.data.find((c: any) => c.color_id === color);
        return (
          <Box
            key={index}
            sx={{ border: "1px solid black", borderRadius: 2, p: 2, mt: 2 }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: "bold",
              }}
            >
              Thêm mẫu màu {modelColor?.name}
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
              <IconButton onClick={() => removeColorFromProduct(color)}>
                <RemoveCircle />
              </IconButton>
            </Typography>
            <Controller
              name={`newQuantities.id${color}`}
              control={control}
              defaultValue=""
              rules={{
                required: "Số lượng tồn kho là bắt buộc",
                min: {
                  value: 0,
                  message: "Số lượng phải >= 0",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Số lượng tồn kho"
                  type="number"
                  variant="outlined"
                  value={field.value}
                  required
                  onChange={(e) => {
                    const val = e.target.value;
                    // Empty string hoặc number
                    field.onChange(val === "" ? "" : Number(val));
                  }}
                  onBlur={(e) => {
                    field.onBlur();
                    // Trigger validation khi blur
                  }}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2 }}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
                />
              )}
            />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Hình ảnh (tối đa 5 file)
            </Typography>
            <UploadFile
              acceptedFileTypes={["image/*"]}
              onChange={(files) => setValue(`images_${color}`, files)}
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
