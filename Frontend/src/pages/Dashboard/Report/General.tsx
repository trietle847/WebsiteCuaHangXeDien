import { Box, Divider } from "@mui/material";
import GeneralKPI from "./GeneralKPI";
import GeneralChart from "./GeneralChart";

export default function GeneralReport() {
    return (
        <Box>
            <GeneralKPI />
            <Divider sx={{ my: 4 }} />
            <GeneralChart />
        </Box>
    );
}