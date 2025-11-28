import { TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../redux/slices/searchSlice";

export default function SearchBar({ onSearch }: { onSearch: (keyword: string) => void }) {
  const dispatch = useDispatch();
  const query = useSelector((state: any) => state.search.query);

  const handleSearch = () => {
    dispatch(setSearchQuery(query)); 
    onSearch(query);
  };

  return (
    <TextField
      size="small"
      placeholder="Tìm kiếm..."
      value={query}
      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      sx={{ width: { xs: "180px", lg: "250px", xl: "300px" }, }}
      slotProps={{
        input: {
          endAdornment: (
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          ),
        },
      }}
    />
  );
}
