import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Chip, Divider } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState, useMemo } from "react";
import UploadFile from "./UploadFile";
import { Controller } from "react-hook-form";
import Gallery from "../ImageGallery/Gallery";

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
        <Box className="flex flex-col gap-6">
          <Controller
            name={onDeleteKey}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Gallery
                items={items}
                idKey={idName}
                urlKey={urlName}
                isEdit={true}
                onSelect={(value) => {
                  field.onChange(value);
                  setMarkedSet(new Set(value));
                }}
              />
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
                      columns={4}
                      previewHeight={150}
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
