import React from "react";
import { CommonTypography, Stack, Box } from "@/components/user.components";
import ContactCard from "./contact-card/contact-card";
import useContactData from "./contact-hook";

const Contact = () => {
  const { ContactUsBodyData } = useContactData();

  // Safely access the first object from ContactUsBodyData array
  const contactDetails = ContactUsBodyData?.[0] || {
    address: "",
    address1: "",
    address2: "",
    phone: "",
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "72%" }}>
        {/* Header */}
        <CommonTypography
          text="Contact Us"
          sx={{
            fontWeight: "700",
            fontSize: { xs: "20px", md: "30px" },
            width: { xs: "140%" },
            color: "#E5E7EB",
          }}
        />
        <CommonTypography
          text="Need to contact us? Use any of the methods below or fill out the form on
        the right."
          sx={{
            fontWeight: "300",
            fontSize: { xs: "14px", md: "16px" },
            color: "#E5E7EB",
            width: { xs: "140%" },
            pt: "0",
          }}
        />
      </Box>
      <Stack
        direction={{ xs: "column", md: "row", sm: "row" }}
        sx={{
          pt: { xs: 2, md: 3 },
          pb: { xs: 2, md: 3 },
          gap: { xs: 5, md: 15 },
        }}
      >
        {/* Left Section */}
        <Box>
          <CommonTypography
            text="Address"
            sx={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#E5E7EB",
              pb: 1,
            }}
          />
          <CommonTypography
            text={`${contactDetails.address} ${contactDetails.address1} ${contactDetails.address2}`}
            sx={{
              fontWeight: "400",
              fontSize: "16px",
              color: "#E5E7EB",
              pb: 2,
              width: { xs: "100%", md: "135px" },
            }}
          />
          <CommonTypography
            text="Email"
            sx={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#E5E7EB",
              pb: 1,
            }}
          />
          <CommonTypography
            text="abcdef@perimiteyes.com"
            sx={{
              fontWeight: "400",
              fontSize: "16px",
              color: "#E5E7EB",
              pb: 2,
            }}
          />
          <CommonTypography
            text="General Inquiries"
            sx={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#E5E7EB",
              pb: 1,
            }}
          />
          <CommonTypography
            text={contactDetails.phone}
            sx={{
              fontWeight: "400",
              fontSize: "16px",
              color: "#E5E7EB",
              pb: 2,
            }}
          />
          <CommonTypography
            text="Customer Support/Helpdesk"
            sx={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#E5E7EB",
              pb: 1,
            }}
          />
          <CommonTypography
            text={contactDetails.phone}
            sx={{ fontWeight: "400", fontSize: "16px", color: "#E5E7EB" }}
          />
        </Box>
        <ContactCard />
      </Stack>
    </Box>
  );
};

export default Contact;
