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
import { useState } from "react";

interface GalleryProps {
  items: any[];
  idKey: string;
  urlKey: string;
  isEdit?: boolean;
  onSelect?: (selectedIds: number[]) => void;
}

export default function Gallery({
  items,
  idKey,
  urlKey,
  isEdit = false,
  onSelect,
}: GalleryProps) {
  const images = items.map((item) => ({
    src: `/api${item[urlKey]}`,
    id: item[idKey],
  }));

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Toggle chọn ảnh
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    if (selectedIds.length + 1 === images.length && !selectedIds.includes(id)) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
    }
    if (onSelect) {
      const newSelected = selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id];
      onSelect(newSelected);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
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
                  setSelectedAll((prev) => !prev);
                  if (!selectedAll) {
                    setSelectedIds(images.map((img) => img.id));
                  } else {
                    setSelectedIds([]);
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
              md: "repeat(4, 1fr)", // Desktop: 4 cột
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
                  border: selectedIds.includes(img.id)
                    ? "3px solid #f01e2c"
                    : "3px solid transparent",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.02)",
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
                  sx={{ width: "100%", height: "100%" }}
                />

                {/* Overlay mờ trắng khi ảnh được chọn */}
                {selectedIds.includes(img.id) && isEdit && (
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
                        color: selectedIds.includes(img.id)
                          ? "#f01e2c"
                          : "#828282",
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
        animation={{ fade: 300 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </Box>
  );
}
