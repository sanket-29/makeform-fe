"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { useApplicantHome } from '@applicant-home';
import { submitInstallerDetails } from '@/utils/applicationApi';
import { getUser } from '@/src/utils/auth';

const InstallerDetailsPage = () => {
  const { formContext } = useApplicantHome();
  const { watch } = formContext;
  const {
    headerDetails: {
      profileDetails: { profileName, profileEmail },
    },
  } = watch();

  const [sameAsApplicant, setSameAsApplicant] = useState(false);
  const [installerName, setInstallerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zip, setZip] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [expDate, setExpDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSameAsApplicant = (checked: boolean) => {
    setSameAsApplicant(checked);
    if (checked) {
      setInstallerName(profileName || '');
      setEmail(profileEmail || '');
    } else {
      setInstallerName('');
      setEmail('');
    }
  };

  useEffect(() => {
    const user = getUser();
    const installerProfile = user?.installer;
    if (!installerProfile) return;

    const installerData = installerProfile.data ?? {};
    setSameAsApplicant(Boolean(installerProfile.sameAsApplicant));
    setInstallerName(installerData.name ?? '');
    setCompanyName(installerData.companyName ?? '');
    setStreetNumber(installerData.streetNumber ?? '');
    setStreetName(installerData.streetName ?? '');
    setCity(installerData.city ?? '');
    setStateValue(installerData.state ?? '');
    setZip(installerData.zip ?? '');
    setTelephone(installerData.telephone ?? '');
    setEmail(installerData.email ?? '');
    setExpDate(installerData.expirationDate ?? '');
  }, []);

  const handleSubmit = async () => {
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      setSubmitting(true);
      await submitInstallerDetails({
        sameAsApplicant,
        installer: {
          name: installerName.trim(),
          companyName: companyName.trim(),
          streetNumber: streetNumber.trim(),
          streetName: streetName.trim(),
          city: city.trim(),
          state: stateValue.trim(),
          zip: zip.trim(),
          telephone: telephone.trim() || undefined,
          email: email.trim() || undefined,
          expirationDate: expDate.trim() || undefined,
        },
      });
      setSubmitSuccess('Installer details saved successfully.');
    } catch (error) {
      setSubmitError((error as Error)?.message || 'Failed to save installer details.');
    } finally {
      setSubmitting(false);
    }
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1f2937',
      borderRadius: 2,
      color: '#E5E7EB',
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.12)',
      },
      '&:hover fieldset': {
        borderColor: '#38bdf8',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#94a3b8',
    },
    '& .MuiOutlinedInput-input': {
      color: '#E5E7EB',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100%',
        width: '100%',
        bgcolor: '#18181b',
        px: { xs: 2, md: 0 },
        py: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          color: '#E5E7EB',
          p: { xs: 2, md: 0 },
        }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          INSTALLER DETAILS
        </Typography>
        <Stack spacing={4} sx={{ mt: 2 }}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sameAsApplicant}
                  onChange={(event) => handleSameAsApplicant(event.target.checked)}
                  sx={{ color: '#38bdf8' }}
                />
              }
              label={
                <Typography sx={{ fontWeight: 700, letterSpacing: '0.02em', color: '#E5E7EB' }}>
                  Same As Applicant
                </Typography>
              }
              sx={{ mb: 0 }}
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Septic Installer Name"
                value={installerName}
                onChange={(event) => setInstallerName(event.target.value)}
                variant="outlined"
                fullWidth
                error={Boolean(errors.installerName)}
                helperText={errors.installerName}
                sx={textFieldSx}
              />
              <TextField
                label="Name of Company"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                variant="outlined"
                fullWidth
                error={Boolean(errors.companyName)}
                helperText={errors.companyName}
                sx={textFieldSx}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Street Number"
                value={streetNumber}
                onChange={(event) => setStreetNumber(event.target.value)}
                variant="outlined"
                fullWidth
                error={Boolean(errors.streetNumber)}
                helperText={errors.streetNumber}
                sx={textFieldSx}
              />
              <TextField
                label="Street Name"
                value={streetName}
                onChange={(event) => setStreetName(event.target.value)}
                variant="outlined"
                fullWidth
                error={Boolean(errors.streetName)}
                helperText={errors.streetName}
                sx={textFieldSx}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="City"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                variant="outlined"
                fullWidth
                error={Boolean(errors.city)}
                helperText={errors.city}
                sx={textFieldSx}
              />
              <TextField
                label="State"
                value={stateValue}
                onChange={(event) => setStateValue(event.target.value)}
                variant="outlined"
                fullWidth
                error={Boolean(errors.stateValue)}
                helperText={errors.stateValue}
                sx={textFieldSx}
              />
              <TextField
                label="Zip"
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                variant="outlined"
                fullWidth
                error={Boolean(errors.zip)}
                helperText={errors.zip}
                sx={textFieldSx}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Telephone"
                value={telephone}
                onChange={(event) => setTelephone(event.target.value)}
                variant="outlined"
                fullWidth
                sx={textFieldSx}
              />
              <TextField
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                variant="outlined"
                fullWidth
                sx={textFieldSx}
              />
            </Stack>

            <TextField
              label="Exp. Date"
              value={expDate}
              onChange={(event) => setExpDate(event.target.value)}
              variant="outlined"
              fullWidth
              type="date"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{ ...textFieldSx, mt: 2 }}
            />
          </Box>

          {submitError ? (
            <Typography sx={{ color: '#f87171', textAlign: 'center' }}>{submitError}</Typography>
          ) : submitSuccess ? (
            <Typography sx={{ color: '#4ade80', textAlign: 'center' }}>{submitSuccess}</Typography>
          ) : null}

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', pb: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                bgcolor: '#0ea5e9',
                color: '#fff',
                '&:hover': { bgcolor: '#0284c7' },
                px: 4,
              }}
            >
              {submitting ? 'SAVING...' : 'SAVE'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default InstallerDetailsPage;
