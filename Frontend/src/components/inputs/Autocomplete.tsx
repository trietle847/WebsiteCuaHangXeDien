import {
  Autocomplete as MUIAutocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import ApiClient from "../../services/axios";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface UserAutocompleteProps {
  value: any; // truyền vào id
  onChange: (item: any) => void;
  api: ApiClient;
  idKey: string;
  optionLabelKey: string[];
  objectName?: string;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export default function Autocomplete({
  value,
  onChange,
  api,
  idKey,
  optionLabelKey,
  objectName,
  label = "Tìm kiếm ...",
  placeholder = "Nhập tên...",
  error = false,
  helperText = "",
  required = false,
}: UserAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 500), // 500ms delay
    []
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [objectName, "search", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [] };
      }
      return await api.getAll({ keyword: searchTerm });
    },
    enabled: searchTerm.length >= 2,
    staleTime: 30000, // cache 30 seconds
  });

  const options = data?.data || [];
  const loading = isLoading || isFetching;

  return (
    <MUIAutocomplete
      fullWidth
      options={options}
      isOptionEqualToValue={(option: any, value: any) =>
        option[idKey] === value[idKey]
      }
      getOptionLabel={(option: any) => optionLabelKey.map((key) => option[key]).join(" - ") || ""}
      value={value}
      onChange={(_, newValue: any) => {
        onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);
        if (reason === "input") {
          debouncedSetSearchTerm(newInputValue);
        }
      }}
      loading={loading}
      loadingText="Đang tìm kiếm..."
      noOptionsText={
        searchTerm.length < 2
          ? "Nhập ít nhất 2 ký tự để tìm kiếm"
          : "Không tìm thấy kết quả"
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
