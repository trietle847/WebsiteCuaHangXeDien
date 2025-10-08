import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  IconButton,
  FormControlLabel,
  Checkbox,
  Card,
  CardMedia,
  Chip,
  Divider,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState, useMemo } from "react";
import UploadFile from "./UploadFile";
import { Controller } from "react-hook-form";

interface FileItemProps {
  url: string;
  type: "image" | "video";
  isDeleted: boolean;
}

function FileItem({ url, type, isDeleted }: FileItemProps) {
  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: isDeleted ? "3px solid #ef4444" : "2px solid #e5e7eb",
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
      }}
    >
      {type === "image" ? (
        <CardMedia
          component="img"
          image={`/api${url}`}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            display: "block",
            filter: isDeleted ? "grayscale(100%)" : "none",
            transition: "filter 0.3s ease",
          }}
        />
      ) : (
        <CardMedia
          component="video"
          src={url}
          controls
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
            display: "block",
            filter: isDeleted ? "grayscale(100%)" : "none",
            transition: "filter 0.3s ease",
          }}
        />
      )}

      {isDeleted && (
        <Fade in={isDeleted}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(239, 68, 68, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <Chip
              icon={<DeleteOutlineIcon />}
              label="Sẽ xóa"
              color="error"
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          </Box>
        </Fade>
      )}
    </Card>
  );
}

interface UpdateFileProps {
  fileType: "image" | "video";
  label: string;
  onDeleteKey: string;
  onAddKey: string;
  control: any;
  maxFiles: number;
  items: any[];
  urlName: string;
  idName: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function UpdateFile({
  fileType,
  label,
  onDeleteKey,
  onAddKey,
  control,
  maxFiles,
  items,
  urlName,
  idName,
  required = false,
  error = false,
  helperText,
}: UpdateFileProps) {
  const [markedSet, setMarkedSet] = useState<Set<number>>(new Set());
  const markedAll = markedSet.size === items.length;

  const toggleMark = (id: number, onChange: (ids: number[]) => void) => {
    setMarkedSet((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      // Cập nhật về RHF
      onChange(Array.from(copy));
      return copy;
    });
  };

  const handleMarkupAll = (onChange: (ids: number[]) => void) => {
    setMarkedSet((prev) => {
      const newSet =
        prev.size === items.length
          ? new Set()
          : new Set(items.map((item: any) => item[idName]));
      // Cập nhật về RHF
      onChange(Array.from(newSet));
      return newSet;
    });
  };

  const maxAdd = useMemo(() => {
    return maxFiles - (items.length - markedSet.size);
  }, [items, markedSet]);

  return (
    <Accordion
      sx={{
        width: "100%",
        boxShadow: 2,
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        sx={{
          bgcolor: "#f9fafb",
          "&:hover": {
            bgcolor: "#f3f4f6",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography component="span" sx={{ fontWeight: 600 }}>
            {label || "Hình ảnh/Video"}
          </Typography>
          {items.length > 0 && (
            <Chip
              label={`${items.length} file`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {markedSet.size > 0 && (
            <Chip
              label={`${markedSet.size} đã chọn xóa`}
              size="small"
              color="error"
              variant="filled"
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        <div className="flex flex-col gap-6">
          <Controller
            name={onDeleteKey}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DeleteOutlineIcon color="action" fontSize="small" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Quản lý file hiện có
                    </Typography>
                  </Box>
                  {items.length > 0 && (
                    <FormControlLabel
                      label={
                        <Typography variant="body2">Chọn tất cả</Typography>
                      }
                      control={
                        <Checkbox
                          size="small"
                          onClick={() => handleMarkupAll(field.onChange)}
                          checked={markedAll}
                          color="error"
                        />
                      }
                    />
                  )}
                </Box>

                {items.length === 0 ? (
                  <Box
                    sx={{
                      border: "2px dashed #d1d5db",
                      borderRadius: 2,
                      padding: 4,
                      textAlign: "center",
                      bgcolor: "#f9fafb",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chưa có file nào
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: "2px solid #e5e7eb",
                      borderRadius: 2,
                      padding: 2,
                      background:
                        "linear-gradient(to bottom, #ffffff, #f9fafb)",
                      width: "100%",
                      maxHeight: "280px", // Giới hạn chiều cao cho 2 hàng
                      overflowY: "auto",
                      overflowX: "auto",
                      "&::-webkit-scrollbar": {
                        height: 8,
                        width: 8,
                      },
                      "&::-webkit-scrollbar-track": {
                        bgcolor: "#f3f4f6",
                        borderRadius: 4,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: "#d1d5db",
                        borderRadius: 4,
                        "&:hover": {
                          bgcolor: "#9ca3af",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)", // Cố định 5 cột
                        gap: 1.5,
                        gridAutoRows: fileType === "video" ? "140px" : "120px", // Chiều cao nhỏ hơn
                        minWidth: "max-content", // Cho phép scroll ngang
                      }}
                    >
                      {items.map((item) => (
                        <Box
                          key={item[idName]}
                          sx={{
                            width: "120px", // Chiều rộng cố định nhỏ gọn
                            height: "100%",
                            borderRadius: 2,
                            position: "relative",
                          }}
                        >
                          <FileItem
                            type={fileType}
                            url={item[urlName]}
                            isDeleted={markedSet.has(item[idName])}
                          />

                          {/* Nút X */}
                          <IconButton
                            size="small"
                            onClick={() =>
                              toggleMark(item[idName], field.onChange)
                            }
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: markedSet.has(item[idName])
                                ? "error.main"
                                : "rgba(255, 255, 255, 0.9)",
                              color: markedSet.has(item[idName])
                                ? "white"
                                : "error.main",
                              border: "2px solid",
                              borderColor: "error.main",
                              boxShadow: 2,
                              padding: "2px",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "error.main",
                                color: "white",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <CloseIcon sx={{ fontSize: "16px" }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          ></Controller>

          {maxAdd > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Controller
                name={onAddKey}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <AddPhotoAlternateIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Thêm file mới
                      </Typography>
                      <Chip
                        label={`Tối đa ${maxAdd} file`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <UploadFile
                      maxFiles={maxAdd}
                      acceptedFileTypes={
                        fileType === "image" ? ["image/*"] : ["video/*"]
                      }
                      compact={true}
                      columns={5}
                      previewHeight={80}
                      label=""
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      required={required}
                      error={error}
                      helperText={helperText}
                    />
                  </Box>
                )}
              ></Controller>
            </>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
