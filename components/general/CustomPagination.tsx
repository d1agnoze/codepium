import React from "react";
import Pagination, { PaginationProps } from "@mui/material/Pagination";

const CustomPagination = (props: PaginationProps) => {
  return (
    <Pagination
      {...props}
      color="primary"
      shape="rounded"
      size="medium"
      sx={{
        "& .MuiPaginationItem-root": {
          color: "var(--foreground)", // Change the text color of the pagination items
          backgroundColor: "transparent", // Change the background color of the pagination items
          "&:hover": {
            backgroundColor: "hsl(var(--hslvar))", // Change the background color of the pagination items on hover
          },
          "&.Mui-selected": {
            color: "hsl(var(--secondary))", // Change the text color of the selected item
            backgroundColor: "hsl(var(--primary))", // Change the background color of the selected item
            "&:hover": {
              backgroundColor: "hsl(var(--primary) / 0.6) ", // Change the background color of the selected item on hover
            },
          },
        },
      }}
    />
  );
};

export default CustomPagination;
