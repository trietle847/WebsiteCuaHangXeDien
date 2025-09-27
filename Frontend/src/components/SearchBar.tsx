import { TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

return (
    <TextField
        size="small"
        placeholder="Tìm kiếm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        }}
        sx={{ width: { xs: '200px', lg: '250px', xl: '300px' } }}
        slotProps={{
            input: {
                endAdornment: (
                    <IconButton onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                ),
            }
        }}
    />
);
}
