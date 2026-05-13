"use client";

import React from "react";
import {GlobalStyles} from "@mui/material";

const isWebkit = typeof navigator !== "undefined" && /AppleWebKit/.test(navigator.userAgent);

export const GlobalScrollbars: React.FC = () => {
  if (isWebkit) {
    return (
      <GlobalStyles
        styles={{
          html: {overflowX: "hidden"},
          "*::-webkit-scrollbar": {width: "0.4em", height: "0.4em"},
          "*::-webkit-scrollbar-track": {boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)"},
          "*::-webkit-scrollbar-thumb": {backgroundColor: "rgba(164,164,164,0.50)"},
        }}
      />
    );
  }

  return (
    <GlobalStyles
      styles={{
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(164,164,164,0.50) rgba(164,164,164,0.05)",
        },
      }}
    />
  );
};
