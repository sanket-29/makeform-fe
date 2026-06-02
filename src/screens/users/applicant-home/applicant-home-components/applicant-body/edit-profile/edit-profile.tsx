import { useState } from "react";
import { Box, Stack, TextField } from "@mui/material";
import { CommonButton, CommonTypography } from "@/components/user.components";
import { getUser } from "@/src/utils/auth";

const EditProfileBody = () => {
  const [name, setName] = useState(() => {
    const user = getUser();
    return user ? user.name || user.fullName || user.username || "" : "";
  });
  const [email, setEmail] = useState(() => {
    const user = getUser();
    return user ? user.email || "" : "";
  });

  const handleSave = () => {
    const user = getUser() || {};
    const updatedUser = {
      ...user,
      name,
      email,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        width: "100%",
        bgcolor: "#18181b",
        px: { xs: 2, md: 0 },
        py: { xs: 2, md: 0 },
      }}
    >
      <Stack
        spacing={2}
        sx={{
          maxWidth: 720,
          mx: { xs: "auto", md: 0 },
          ml: { md: 0 },
          color: "#E5E7EB",
        }}
      >
        <CommonTypography
          variant="h4"
          text="Edit Profile"
          sx={{ fontWeight: 700, fontSize: { xs: "20px", md: "30px" } }}
        />

        <CommonTypography
          text="Update your profile details below to keep your applicant account current."
          sx={{ fontSize: "16px", fontWeight: 300, color: "#bec5d1" }}
        />

        <Stack spacing={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            variant="outlined"
            fullWidth
            placeholder="Enter your name"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#2f3640",
                borderRadius: 2,
                color: "#ffffff",

                "& input": {
                  color: "#ffffff",
                },

                "& input::placeholder": {
                  color: "#f8fafc",
                  opacity: 0.7,
                },

                "& fieldset": {
                  borderColor: "#4b5563",
                },
                "&:hover fieldset": {
                  borderColor: "#60a5fa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#60a5fa",
                },
              },

              "& .MuiInputLabel-root": {
                color: "#d2d4d6",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#d2d4d6",
              },
            }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            variant="outlined"
            fullWidth
            placeholder="Enter your email"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#2f3640",
                borderRadius: 2,
                color: "#ffffff",

                "& input": {
                  color: "#ffffff",
                },

                "& input::placeholder": {
                  color: "#f8fafc",
                  opacity: 0.7,
                },

                "& fieldset": {
                  borderColor: "#4b5563",
                },
                "&:hover fieldset": {
                  borderColor: "#60a5fa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#60a5fa",
                },
              },

              "& .MuiInputLabel-root": {
                color: "#d2d4d6",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#d2d4d6",
              },
            }}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <CommonButton
            BtnTitle="Save changes"
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: "#2563eb", width: { xs: "100%", sm: "auto" } }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditProfileBody;
