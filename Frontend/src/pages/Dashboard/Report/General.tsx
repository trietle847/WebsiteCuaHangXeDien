import { Box, Divider } from "@mui/material";
import GeneralKPI from "./GeneralKPI";
import GeneralChart from "./GeneralChart";

interface GeneralReportProps {
    selectedDate: Date | null;
}

export default function GeneralReport({selectedDate}: GeneralReportProps) {
    return (
        <Box>
            <GeneralKPI selectedDate={selectedDate} />
            <Divider sx={{ my: 4 }} />
            <GeneralChart />
        </Box>
    );
}