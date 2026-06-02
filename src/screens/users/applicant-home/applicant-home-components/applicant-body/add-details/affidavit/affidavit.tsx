"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  FormControl,
  Button,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { submitAffidavit, AffidavitPayload } from "@/utils/applicationApi";
import { getUser } from "@/src/utils/auth";

const AffidavitDetailsBody = () => {
  const [submitting, setSubmitting] = useState(false);
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyExpiration, setPolicyExpiration] = useState("");
  const [employerStatus, setEmployerStatus] = useState("sole");
  const [employerEmployeeCount, setEmployerEmployeeCount] = useState("");
  const [isSoleProprietor, setIsSoleProprietor] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    insuranceCompany?: string;
    policyNumber?: string;
    policyExpiration?: string;
  }>({})

  // Load affidavit data from user profile
  useEffect(() => {
    try {
      const user = getUser();
      const affidavitData = user?.affidavit;

      if (affidavitData) {
        setIsSoleProprietor(affidavitData.isSoleProprietor ?? true);
        setEmployerStatus(affidavitData.employerStatus ?? "sole");
        setInsuranceCompany(affidavitData.insuranceCompany ?? "");
        setPolicyNumber(affidavitData.policyNumber ?? "");
        
        // Format date if it exists (convert ISO string to yyyy-mm-dd)
        if (affidavitData.policyExpiration) {
          const date = new Date(affidavitData.policyExpiration);
          const formattedDate = date.toISOString().split('T')[0];
          setPolicyExpiration(formattedDate);
        }
        
        setEmployerEmployeeCount(affidavitData.employerEmployeeCount?.toString() ?? "");
      }
    } catch (error) {
      console.error("Error loading affidavit data:", error);
    }
  }, []);

  const handleUncheck = () => {

    setEmployerStatus("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const errors: {
      insuranceCompany?: string;
      policyNumber?: string;
      policyExpiration?: string;
    } = {};

    // Validation: if NOT sole proprietor, textfields are required
    if (!isSoleProprietor) {
      if (!insuranceCompany.trim()) {
        errors.insuranceCompany = "Insurance Company Name is required";
      }
      if (!policyNumber.trim()) {
        errors.policyNumber = "Policy Number is required";
      }
      if (!policyExpiration.trim()) {
        errors.policyExpiration = "Expiration Date is required";
      }
    }

    const hasErrors = Object.values(errors).some((err) => !!err);
    setFieldErrors(errors);

    if (hasErrors) {
      setSubmitError("Please complete all affidavit details before saving.");
      setSubmitting(false);
      return;
    }

    // Build payload
    const payload: AffidavitPayload = {
      isSoleProprietor,
      employerStatus,
    };

    // Only include insurance fields if NOT sole proprietor
    if (!isSoleProprietor) {
      payload.insuranceCompany = insuranceCompany.trim();
      payload.policyNumber = policyNumber.trim();
      payload.policyExpiration = policyExpiration;
      payload.employerEmployeeCount = employerEmployeeCount ? parseInt(employerEmployeeCount) : 0;
    } else {
      // If sole proprietor, include optional fields if they have values
      if (insuranceCompany.trim()) payload.insuranceCompany = insuranceCompany.trim();
      if (policyNumber.trim()) payload.policyNumber = policyNumber.trim();
      if (policyExpiration.trim()) payload.policyExpiration = policyExpiration;
      if (employerEmployeeCount) payload.employerEmployeeCount = parseInt(employerEmployeeCount);
    }

    try {
      await submitAffidavit(payload);
      setSubmitSuccess("Affidavit details saved successfully.");
    } catch (error) {
      setSubmitError((error as Error)?.message || "Failed to save affidavit details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <Box
      sx={{
        minHeight: "100%",
        width: "100%",
        bgcolor: "#18181b",
        px: { xs: 2, md: 0 },
        py: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          color: "#E5E7EB",
          p: { xs: 2, md: 0 },
        }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Affidavit Details
        </Typography>
        <Typography sx={{ maxWidth: 760, lineHeight: 1.0, color: "#cbd5e1" }}>
          Add your worker`s compensation affidavit details here.
        </Typography>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: 700, letterSpacing: "0.02em" }}>
            WORKER&apos;S COMP DETAILS
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={isSoleProprietor}
                onChange={(event) => {
                  setIsSoleProprietor(event.target.checked);
                  // Clear validation errors when checkbox is checked
                  if (event.target.checked) {
                    setFieldErrors({});
                    setSubmitError(null);
                  }
                }}
                sx={{ color: "#38bdf8" }}
              />
            }
            label={
              <Typography sx={{ color: "#cbd5e1", fontWeight: 600 }}>
                Sole proprietor
              </Typography>
            }
            sx={{ mb: 0 }}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Insurance Company Name"
              required={!isSoleProprietor}
              value={insuranceCompany}
              onChange={(event) => setInsuranceCompany(event.target.value)}
              variant="outlined"
              fullWidth
              error={Boolean(fieldErrors.insuranceCompany)}
              helperText={fieldErrors.insuranceCompany}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1f2937",
                  borderRadius: 2,
                  color: "#E5E7EB",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#38bdf8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#94a3b8",
                },
                "& .MuiOutlinedInput-input": {
                  color: "#E5E7EB",
                },
              }}
            />

            <TextField
              label="Policy Number"
              required={!isSoleProprietor}
              value={policyNumber}
              onChange={(event) => setPolicyNumber(event.target.value)}
              variant="outlined"
              fullWidth
              error={Boolean(fieldErrors.policyNumber)}
              helperText={fieldErrors.policyNumber}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1f2937",
                  borderRadius: 2,
                  color: "#E5E7EB",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#38bdf8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#94a3b8",
                },
                "& .MuiOutlinedInput-input": {
                  color: "#E5E7EB",
                },
              }}
            />

            <TextField
              label="Policy Expiration Date"
              type="date"
              value={policyExpiration}
              required={!isSoleProprietor}
              onChange={(event) => setPolicyExpiration(event.target.value)}
              variant="outlined"
              fullWidth
              error={Boolean(fieldErrors.policyExpiration)}
              helperText={fieldErrors.policyExpiration}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1f2937",
                  borderRadius: 2,
                  color: "#E5E7EB",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#38bdf8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#94a3b8",
                },
                "& .MuiOutlinedInput-input": {
                  color: "#E5E7EB",
                },
              }}
            />
          </Stack>
          <Typography sx={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Are you an employer? Check the appropriate box
          </Typography>

          <FormControl>
            <RadioGroup
              value={employerStatus}
              onChange={(event) => {
                const value = event.target.value;
                setEmployerStatus(value);
                setIsSoleProprietor(value === "sole");
              }}
              sx={{
                "& .MuiFormControlLabel-root": {
                  color: "#cbd5e1",
                  alignItems: "flex-start",
                },
                "& .MuiRadio-root": {
                  color: "#38bdf8",
                },
              }}
            >
              <FormControlLabel
                value="employer"
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ color: "#cbd5e1" }}>
                      I am an employer with
                    </Typography>
                    {employerStatus === "employer" ? (
                      <TextField
                        type="number"
                        value={employerEmployeeCount}
                        onChange={(event) =>
                          setEmployerEmployeeCount(event.target.value)
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          width: 150,
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#1f2937",
                            borderRadius: 2,
                            color: "#E5E7EB",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.12)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#38bdf8",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#94a3b8",
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#E5E7EB",
                          },
                        }}
                      />
                    ) : null}
                    <Typography sx={{ color: "#cbd5e1" }}>
                      employees (full and/or part-time).*
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="sole"
                control={<Radio />}
                label="I am a sole proprietor or partnership and have no employees working for me in any capacity. [No worker's comp. insurance required.]"
              />
              <FormControlLabel
                value="homeowner_self"
                control={<Radio />}
                label="I am a homeowner doing all work myself. [No workers' comp. insurance required.]"
              />
              <FormControlLabel
                value="homeowner_contractors"
                control={<Radio />}
                label="I am a homeowner and will be hiring contractors to conduct all work on my property. I will ensure that all contractors either have workers' compensation insurance or are sole proprietors with no employees."
              />
              <FormControlLabel
                value="general_contractor"
                control={<Radio />}
                label="I am a general contractor and I have hired the sub-contractors listed on the attached sheet. These sub-contractors have employees and have worker's comp. insurance.++"
              />
              <FormControlLabel
                value="corporation"
                control={<Radio />}
                label="We are a corporation and its officers have exercised their right of exemption per MGL c. 152, § 1(4) and we have no employees. [No worker's comp. insurance required.]"
              />
            </RadioGroup>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                pt: 2,
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                onClick={handleUncheck}
                sx={{
                  bgcolor: "#2563eb",
                  color: "#fff",
                  "&:hover": { bgcolor: "#1d4ed8" },
                  px: 4,
                }}
              >
                UNCHECK
              </Button>
            </Stack>
          </FormControl>
         {submitError ? (
            <Typography sx={{ color: "#f87171", fontSize: "0.9rem", mt: 1, textAlign: "center" }}>
              {submitError}
            </Typography>
          ) : submitSuccess ? (
            <Typography sx={{ color: "#4ade80", fontSize: "0.9rem", mt: 1, textAlign: "center" }}>
              {submitSuccess}
            </Typography>
          ) : null}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              py: 2,
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                bgcolor: "#0ea5e9",
                color: "#fff",
                "&:hover": { bgcolor: "#0284c7" },
                px: 4,
              }}
            >
              {submitting ? "SAVING..." : "SAVE"}
            </Button>
          </Stack>

        </Stack>
      </Box>
    </Box>
  );

  return content;
};

export default AffidavitDetailsBody;
