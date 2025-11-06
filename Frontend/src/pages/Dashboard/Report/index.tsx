import { Box, Tabs, Tab } from "@mui/material";
import GeneralReport from "./General";
import ProductReport from "./ProductReport";
import UserReport from "./UserReport";
import { useState } from "react";

export default function Report() {
    const [tabIndex, setTabIndex] = useState(0);

    return (
      <Box>
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
        >
          <Tab value={0} label="Tổng quan" />
          <Tab value={1} label="Sản phẩm" />
          <Tab value={2} label="Người dùng" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tabIndex === 0 && <GeneralReport />}
          {tabIndex === 1 && <ProductReport />}
          {tabIndex === 2 && <UserReport />}
        </Box>
      </Box>
    );
}