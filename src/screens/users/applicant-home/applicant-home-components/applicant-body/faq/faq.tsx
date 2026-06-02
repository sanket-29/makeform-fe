import React from "react";
import { CommonTypography, Stack } from "@/components/user.components";
import { FaqDropdown } from "@applicant-home";
import useFaqData from "./faq-hook";

const FAQ = () => {
  const { contact } = useFaqData();

  return (
    <Stack sx={{ width: "72%" }}>
      <CommonTypography
        text="Frequently Asked Questions"
        sx={{
          fontWeight: "700",
          fontSize: { xs: "20px", md: "30px" },
          width: { xs: "140%" },
          color: "#E5E7EB",
        }}
      />
      <CommonTypography
        text={`What would you like to do today? Please select what you would like to do
        or call ${contact} for help.`}
        sx={{
          fontWeight: "300",
          fontSize: { xs: "14px", md: "16px" },
          color: "#E5E7EB",
          width: { xs: "140%" },
          pt: "2px",
        }}
      />
      <FaqDropdown />
    </Stack>
  );
};

export default FAQ;
