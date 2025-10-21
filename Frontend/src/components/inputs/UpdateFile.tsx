import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Chip, Divider } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState, useMemo, useEffect } from "react";
import UploadFile from "./UploadFile";
import Gallery from "../ImageGallery/Gallery";

interface UpdateFileProps {
  fileType: "image" | "video";
  label: string;
  maxFiles: number;
  items: any[];
  urlName: string;
  idName: string;
  onAdd: (files: File[]) => void;
  disableDropdown?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  pcId?: string;
}

export default function UpdateFile({
  fileType,
  label,
  maxFiles,
  items,
  urlName,
  idName,
  onAdd,
  disableDropdown = false,
  required = false,
  error = false,
  helperText,
  pcId,
}: UpdateFileProps) {
  const [markedNumber, setMarkedNumber] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const maxAdd = useMemo(() => {
    return maxFiles - (items.length - markedNumber);
  }, [items, markedNumber, maxFiles]);

  useEffect(() => {
    if (disableDropdown) {
      setIsExpanded(false);
    }
  }, [disableDropdown]);

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isNewExpanded: boolean
  ) => {
    // Chúng ta chỉ cho phép thay đổi state (mở/đóng)
    // khi nó *không* bị disable
    if (!disableDropdown) {
      setIsExpanded(isNewExpanded);
    }
  };

  return (
    <Accordion
      disabled={disableDropdown}
      expanded={isExpanded}
      onChange={handleAccordionChange}
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
          {markedNumber > 0 && (
            <Chip
              label={`${markedNumber} đã chọn xóa`}
              size="small"
              color="error"
              variant="filled"
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        <Box className="flex flex-col gap-6">
          <Gallery
            items={items}
            idKey={idName}
            urlKey={urlName}
            isEdit={true}
            onChange={(num) => setMarkedNumber(num)}
            pcId={pcId}
          />
          {maxAdd > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
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
                  previewHeight={150}
                  label=""
                  onChange={(value) => {
                    onAdd(value);
                  }}
                  required={required}
                  error={error}
                  helperText={helperText}
                  pcId={pcId}
                />
              </Box>
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
