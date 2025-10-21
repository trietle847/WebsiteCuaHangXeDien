import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import {
  Box,
  IconButton,
  Checkbox,
  Chip,
  FormControlLabel,
  CardMedia,
  Typography,
} from "@mui/material";
import { Collections, HighlightOff } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { set, useFormContext } from "react-hook-form";

interface GalleryProps {
  items: any[];
  idKey: string;
  urlKey: string;
  isEdit?: boolean;
  onChange?: (number: number) => void;
  pcId?: string;
}

export default function Gallery({
  items,
  idKey,
  urlKey,
  isEdit = false,
  onChange,
  pcId,
}: GalleryProps) {
  const images = items.map((item) => ({
    src: `/api${item[urlKey]}`,
    id: item[idKey],
  }));

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedAll, setSelectedAll] = useState(false);
  const { watch, setValue, getValues, formState } = useFormContext();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Toggle chọn ảnh
  const handleToggleSelect = (id: number) => {
    const updateSet = new Set(selectedIds);
    const deleteImageIds = getValues("deleteImageIds") as Set<number>;
    if (updateSet.has(id)) {
      updateSet.delete(id);
      deleteImageIds.delete(id);
    } else {
      updateSet.add(id);
      deleteImageIds.add(id);
    }
    if (updateSet.size === images.length) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
    }
    if (onChange) {
      onChange(updateSet.size);
    }
    setSelectedIds(updateSet);
    setValue("deleteImageIds", deleteImageIds);
    console.log("deleteImageIds:", deleteImageIds);
  };

const pcDelete = watch("deleteProductColorIds") as Set<string>;

  useEffect(() => {
    if (formState.isSubmitSuccessful || (pcId && pcDelete.has(pcId))) {
      setSelectedIds(new Set());
      setSelectedAll(false);
      setValue("deleteImageIds", new Set());
      onChange && onChange(0);
    }
  }, [formState.isSubmitSuccessful, pcDelete]);

  return (
    <Box sx={{}}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          <Collections /> Hình ảnh hiện có
        </Typography>
        {isEdit && images.length > 0 && (
          <FormControlLabel
            label="Chọn xóa tất cả"
            control={
              <Checkbox
                checked={selectedAll}
                onChange={() => {
                  const newSelectedAll = !selectedAll;
                  setSelectedAll(newSelectedAll);
                  const updatedSet = new Set<number>();
                  const deleteImageIds = getValues(
                    "deleteImageIds"
                  ) as Set<number>;
                  if (newSelectedAll) {
                    // Chọn tất cả
                    images.forEach((img) => {
                      updatedSet.add(img.id);
                      deleteImageIds.add(img.id);
                    });
                  } else {
                    images.forEach((img) => {
                      // Xóa tất cả ở local
                      updatedSet.clear();
                      // Xóa toàn bộ ids ở local mà có trong deleteImageIds
                      deleteImageIds.delete(img.id);
                    });
                  }
                  console.log("deleteImageIds:", deleteImageIds);
                  setValue("deleteImageIds", deleteImageIds);
                  setSelectedIds(updatedSet);
                  if (onChange) {
                    onChange(updatedSet.size);
                  }
                }}
              />
            }
          />
        )}
      </Box>
      {images.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)", // Mobile: 2 cột
              sm: "repeat(3, 1fr)", // Tablet: 3 cột
              md: "repeat(4, 1fr)", // Desktop: 4 hoặc 5 cột
              lg: "repeat(5, 1fr)",
            },
            gap: 2,
            p: 1,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          {images.map((img) => (
            <Box key={img.id}>
              <Box
                sx={{
                  position: "relative",
                  aspectRatio: "1",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: selectedIds.has(img.id)
                    ? "3px solid #f01e2c"
                    : "3px solid transparent",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 4,
                    "& .overlay": {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => {
                  const idx = images.findIndex((i) => i.id === img.id);
                  setIndex(idx);
                  setOpen(true);
                }}
              >
                {/* Ảnh nền */}
                <CardMedia
                  component="img"
                  image={img.src}
                  alt={`Image ${img.id}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // ✅ Thêm dòng này
                  }}
                />

                {/* Overlay mờ trắng khi ảnh được chọn */}
                {selectedIds.has(img.id) && isEdit && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      label="Sẽ xóa"
                      color="error"
                      variant="filled"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                )}

                {isEdit && (
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      zIndex: 2,
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(img.id);
                      }}
                      sx={{
                        color: selectedIds.has(img.id) ? "#f01e2c" : "#828282",
                      }}
                    >
                      <HighlightOff fontSize="large" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
          Không có ảnh nào
        </Box>
      )}

      {/* Lightbox với đầy đủ tính năng */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images}
        index={index}
        plugins={[Thumbnails, Fullscreen, Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        carousel={{
          finite: false,
        }}
        animation={{ fade: 300 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </Box>
  );
}
