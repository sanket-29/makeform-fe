import React, { useState } from "react";
import { Box, Typography, IconButton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { CommonTypography } from "@/components/user.components";
import useFaqData from "../faq-hook";

const FaqDropdown = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { faqs, loading, error } = useFaqData();

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <Typography>Loading FAQs...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        width: { xs: "140%", md: "100%", sm: "120%" },
        maxWidth: "800px",
        paddingTop: { xs: "1px", md: "20px" },
      }}
    >
      {faqs.map((faq, index) => (
        <Box
          key={index}
          sx={{
            borderBottom: "1px solid #ddd",
            pb: { xs: "8px", md: "16px" },
            borderRadius: { xs: "12px", md: "0px", sm: "0px" },
            boxShadow: {
              xs: "0px 3px 1px -2px #00000033, 0px 2px 2px 0px #00000024, 0px 1px 5px 0px #0000001F", // Elevation=2 for mobile
              md: "none",
              sm: "none",
            },
            mb: { xs: 2, md: 0, sm: 0 }, // Spacing between items
            p: { xs: 1, md: 1 }, // Padding for better spacing
            backgroundColor: { xs: "#fff" },
            cursor: { xs: "pointer", md: "default", sm: "default" }, // Cursor only for mobile
            width: { xs: "92%", md: "100%", sm: "100%" },
          }}
        >
          {/* Question */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <CommonTypography
              text={faq.question}
              sx={{
                fontWeight: "600",
                fontSize: { xs: "14px", md: "18px" },
                color: "#09090b",
              }}
            />

            <IconButton onClick={() => toggleDropdown(index)}>
              {openIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
            <CommonTypography
              text={faq.answer}
              sx={{
                fontWeight: "300",
                fontSize: "15px",
                mt: 1,
                color: "#09090b",
              }}
            />
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default FaqDropdown;
