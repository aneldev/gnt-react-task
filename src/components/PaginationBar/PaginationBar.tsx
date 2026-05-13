import * as React from "react";
import {
  Pagination,
  Typography,
} from "@mui/material";

import {
  FlexContainerHorizontal,
  FlexItemMax,
  FlexItemMin,
} from "../FlexContainer";

export interface IPaginationBarProps {
  pageNo: number;
  pageSize: number;
  availableCount: number;
  onPageChange: (pageNo: number) => void;
}

export const PaginationBar: React.FC<IPaginationBarProps> = (
  {
    pageNo,
    pageSize,
    availableCount,
    onPageChange,
  },
) => {
  const totalPages = Math.ceil(availableCount / pageSize);
  const firstItem = availableCount === 0 ? 0 : pageNo * pageSize + 1;
  const lastItem = Math.min((pageNo + 1) * pageSize, availableCount);

  return (
    <FlexContainerHorizontal sx={{alignItems: "center", px: 2, py: 1}}>
      <FlexItemMin sx={{minWidth: 84}}>
        <Typography variant="body2" color="text.secondary">
          {availableCount === 0 ? "No results" : `${firstItem}–${lastItem} of ${availableCount}`}
        </Typography>
      </FlexItemMin>
      <FlexItemMax>
        <Pagination
          count={totalPages}
          page={pageNo + 1}
          onChange={(_, page) => onPageChange(page - 1)}
          siblingCount={1}
          boundaryCount={1}
        />
      </FlexItemMax>
    </FlexContainerHorizontal>
  );
};
