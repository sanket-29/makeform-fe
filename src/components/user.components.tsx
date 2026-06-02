"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {Logout, Person, Add, Verified, Business, Brush, Build, Description} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import DropdownItem from "./drop-down-item";
import { logout } from "@/src/utils/auth";

type CommonTypographyProps = {
  text: React.ReactNode;
  variant?:
    | "body1"
    | "body2"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";
  sx?: SxProps<Theme>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const CommonTypography = ({
  text,
  variant = "body1",
  sx,
  onClick,
}: CommonTypographyProps) => {
  return (
    <Typography variant={variant} sx={sx} onClick={onClick}>
      {text}
    </Typography>
  );
};

type CommonButtonProps = {
  BtnTitle: React.ReactNode;
  variant?: "text" | "contained" | "outlined";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  textColor?: string;
  sx?: SxProps<Theme>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export const CommonButton = ({
  BtnTitle,
  variant = "contained",
  color = "primary",
  textColor,
  sx,
  onClick,
  disabled,
}: CommonButtonProps) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      sx={{ color: textColor, textTransform: "none", ...sx }}
    >
      {BtnTitle}
    </Button>
  );
};

type CommonHeaderProps = {
  type?: string;
  applicantHeaderDetails?: {
    leftContent?: { townSeal?: React.ReactNode };
    centerContent?: { component?: React.ReactNode };
    rightContent?: {
      profileDetails?: {
        profileName: string;
        profileImage?: string;
        profileEmail?: string;
        onProfileImageClick?: () => void;
      };
    };
  };
};

export const CommonHeader = ({
  applicantHeaderDetails,
}: CommonHeaderProps) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileName = applicantHeaderDetails?.rightContent?.profileDetails?.profileName;
  const profileImage = applicantHeaderDetails?.rightContent?.profileDetails?.profileImage;
  const profileInitials = profileName
    ? profileName
        .split(" ")
        .map((part) => part[0].toUpperCase())
        .join("")
        .slice(0, 2)
    : "";
  const profileEmail =
    applicantHeaderDetails?.rightContent?.profileDetails?.profileEmail;
  const profileClickAction =
    applicantHeaderDetails?.rightContent?.profileDetails?.onProfileImageClick;
  const handleToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const [addDetailsOpen, setAddDetailsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setDropdownOpen(false);
    setAddDetailsOpen(false);
    router.push(path);
  };

  const handleEditProfile = () => {
    profileClickAction?.();
    setDropdownOpen(false);
    setAddDetailsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setAddDetailsOpen(false);
    router.push("/user/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: 3,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#09090b",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 16 }}>
        {applicantHeaderDetails?.leftContent?.townSeal}
      </Box>
      <Box>{applicantHeaderDetails?.centerContent?.component}</Box>
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        {profileName ? (
          <Button
            onClick={handleToggle}
            sx={{
              textTransform: "none",
              color: "#E5E7EB",
              p: 0,
              minWidth: 0,
              gap: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              src={profileImage}
              alt={profileName}
              sx={{ width: 38, height: 38, bgcolor: "#1F2937" }}
            >
              {profileInitials}
            </Avatar>
            <Typography sx={{ color: "#E5E7EB", fontWeight: 500 }}>
              {profileName}
            </Typography>
          </Button>
        ) : null}

        {dropdownOpen && (
          <Box
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: 260,
              bgcolor: "#09090b",
              borderRadius: "16px",
              boxShadow: "0px 20px 50px rgba(0,0,0,0.08)",
              zIndex: 20,
            }}
          >
            <Box sx={{ p: 2, borderBottom: "2px solid #18181b", display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar src={profileImage} alt={profileName} sx={{ width: 48, height: 48, bgcolor: "#1F2937" }}>
                {profileInitials}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#d7d9db" }}>
                  {profileName}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#bac8d4" }}>
                  {profileEmail || "Logged in user"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <Button fullWidth sx={{ justifyContent: "flex-start", color: "#E5E7EB", textTransform: "none" }} onClick={handleEditProfile}>
               <Person sx={{ mr: 1, size: "small" }} /> 
                Edit Profile
              </Button>
            <Box
              onMouseEnter={() => setAddDetailsOpen(true)}
              onMouseLeave={() => setAddDetailsOpen(false)}
              sx={{ position: "relative", width: "100%" }}
            >
              <Button
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  color: "#E5E7EB",
                  textTransform: "none",
                }}
              >
                <Add sx={{ mr: 1, size: "small" }} />
                Add Details
              </Button>
              {addDetailsOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "calc(100% - 38px)",
                    left: -250,
                    width: "100%",
                    bgcolor: "#09090b",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0px 16px 40px rgba(0,0,0,0.25)",
                    overflow: "hidden",
                    zIndex: 30,
                  }}
                >
                  <DropdownItem
                    label="LICENSE(S)"
                    icon={<Verified fontSize="small" />}
                    onClick={() => handleNavigate("/user/add-details/license")}
                  />
                  <DropdownItem
                    label="ESTABLISHMENT"
                    icon={<Business fontSize="small" />}
                    onClick={() => handleNavigate("/user/add-details/establishment")}
                  />
                  <DropdownItem
                    label="DESIGNER"
                    icon={<Brush fontSize="small" />}
                    onClick={() => handleNavigate("/user/add-details/designer")}
                  />
                  <DropdownItem
                    label="INSTALLER"
                    icon={<Build fontSize="small" />}
                    onClick={() => handleNavigate("/user/add-details/installer")}
                  />
                  <DropdownItem
                    label="AFFIDAVIT"
                    icon={<Description fontSize="small" />}
                    onClick={() => handleNavigate("/user/add-details/affidavit")}
                  />
                </Box>
              )}
            </Box>
              <Button fullWidth sx={{ justifyContent: "flex-start", color: "#f51b1b", textTransform: "none" }} onClick={handleLogout}>
                <Logout sx={{ mr: 1, size: "small" }} />
                Logout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const ConfirmationModal = ({
  open,
  modalDescp,
  successIcon,
  okBtn,
  onOkClick,
}: {
  open: boolean;
  modalDescp: string;
  successIcon?: boolean;
  okBtn?: boolean;
  onOkClick?: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onOkClick}>
      <DialogTitle>{successIcon ? "Success" : "Message"}</DialogTitle>
      <DialogContent>{modalDescp}</DialogContent>
      {okBtn ? (
        <DialogActions>
          <Button onClick={onOkClick}>OK</Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
};

export { Box, Stack, Grid, Card };
