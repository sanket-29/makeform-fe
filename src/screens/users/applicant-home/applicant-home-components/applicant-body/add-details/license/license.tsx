"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { submitLicenseDetails } from '@/utils/applicationApi';
import { getUser } from '@/src/utils/auth';

type LicenseEntry = {
  id: number;
  licenseType: string;
  licenseNumber: string;
  licenseExpiration: string;
};

const defaultLicenseEntry: Omit<LicenseEntry, 'id'> = {
  licenseType: 'Select license type',
  licenseNumber: '',
  licenseExpiration: '',
};

const LicenseDetailsPage = () => {
  const [businessName, setBusinessName] = useState('');
  const [licenseEntries, setLicenseEntries] = useState<LicenseEntry[]>([
    { id: 1, ...defaultLicenseEntry },
  ]);
  const [entryErrors, setEntryErrors] = useState<
    Array<{
      licenseType?: string;
      licenseNumber?: string;
      licenseExpiration?: string;
    }>
  >([{ }]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const licenseTypes = [
    'Select license type',
    'CATV (CATV)',
    'General Contractor',
    'Electrical',
    'Plumbing',
    'Mechanical',
    'Fire Protection',
  ];

  const handleEntryChange = (index: number, field: keyof LicenseEntry, value: string) => {
    setLicenseEntries((prev) =>
      prev.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry))
    );
  };

  const handleAddLicense = () => {
    setLicenseEntries((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        ...defaultLicenseEntry,
      },
    ]);
  };

  const handleRemoveLicense = (index: number) => {
    setLicenseEntries((prev) => prev.filter((_, idx) => idx !== index));
    setEntryErrors((prev) => prev.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    const user = getUser();
    const licenseData = user?.license ?? user?.licenses;
    const items = licenseData?.licenses ?? licenseData?.items ?? [];

    if (items.length > 0) {
      setBusinessName(licenseData?.businessName ?? '');
      setLicenseEntries(
        items.map((item: { licenseType?: string; licenseNumber?: string; licenseExpiration?: string }, index: number) => ({
          id: index + 1,
          licenseType: item.licenseType ?? 'Select license type',
          licenseNumber: item.licenseNumber ?? '',
          licenseExpiration: item.licenseExpiration
            ? item.licenseExpiration.split('T')[0]
            : '',
        }))
      );
    }
  }, []);

  useEffect(() => {
    setEntryErrors(licenseEntries.map(() => ({})));
  }, [licenseEntries]);

  const handleSubmit = async () => {
    const errors = licenseEntries.map((entry) => ({
      licenseType:
        entry.licenseType === 'Select license type' ? 'License type is required' : undefined,
      licenseNumber: entry.licenseNumber.trim() ? undefined : 'License number is required',
      licenseExpiration: entry.licenseExpiration.trim() ? undefined : 'Expiration date is required',
    }));

    const hasErrors = errors.some((entry) =>
      Object.values(entry).some((message) => !!message)
    );

    setEntryErrors(errors);
    setSubmitError(null);
    setSubmitSuccess(null);

    if (hasErrors) {
      setSubmitError('Please fix the highlighted fields before submitting.');
      return;
    }

    const payload = {
      businessName: businessName.trim() || undefined,
      licenses: licenseEntries.map(({ licenseType, licenseNumber, licenseExpiration }) => ({
        licenseType,
        licenseNumber,
        licenseExpiration,
      })),
    };

    try {
      setSubmitting(true);
      await submitLicenseDetails(payload);
      setSubmitSuccess('License details saved successfully.');
    } catch (error) {
      setSubmitError((error as Error)?.message || 'Failed to save license details.');
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
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
          License(s) Details
        </Typography>
        <Typography sx={{ maxWidth: 760, lineHeight: 1.0, color: '#cbd5e1' }}>
          Enter your license information below, then complete the worker&apos;s compensation section.
        </Typography>

        <Stack spacing={3} sx={{ mt: 4 }}>
          <TextField
            label="Business Name"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            variant="outlined"
            fullWidth
            slotProps={{
              inputLabel: { style: { color: '#cbd5e1' } },
            }}
            sx={{
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
            }}
          />

          {licenseEntries.map((entry, index) => (
            <Box
              key={entry.id}
              sx={{
                width: '100%',
                p: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography sx={{ fontWeight: 700, letterSpacing: '0.00em' }}>
                </Typography>
                {licenseEntries.length > 1 && (
                  <Button
                    onClick={() => handleRemoveLicense(index)}
                    sx={{
                      textTransform: 'none',
                      color: '#f97316',
                      borderRadius: 2,
                      border: '1px solid rgba(249,115,22,0.3)',
                      bgcolor: 'rgba(248,113,28,0.08)',
                      '&:hover': { bgcolor: 'rgba(248,113,28,0.16)' },
                    }}
                  >
                    REMOVE
                  </Button>
                )}
              </Box>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#94a3b8' }} id={`license-type-label-${entry.id}`}>
                    License Type *
                  </InputLabel>
                  <Select
                    labelId={`license-type-label-${entry.id}`}
                    value={entry.licenseType}
                    required
                    error={Boolean(entryErrors[index]?.licenseType)}
                    label="License Type"
                    onChange={(event) => handleEntryChange(index, 'licenseType', event.target.value)}
                    sx={{
                      bgcolor: '#1f2937',
                      borderRadius: 2,
                      color: '#E5E7EB',
                      '& .MuiSelect-icon': { color: '#cbd5e1' },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.12)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#38bdf8',
                      },
                    }}
                  >
                    {licenseTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {entryErrors[index]?.licenseType ? (
                    <FormHelperText sx={{ color: '#f87171' }}>
                      {entryErrors[index]?.licenseType}
                    </FormHelperText>
                  ) : null}
                </FormControl>

                <TextField
                  label="License Number"
                  value={entry.licenseNumber}
                  onChange={(event) => handleEntryChange(index, 'licenseNumber', event.target.value)}
                  variant="outlined"
                  fullWidth
                  required
                  error={Boolean(entryErrors[index]?.licenseNumber)}
                  helperText={entryErrors[index]?.licenseNumber}
                  sx={{
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
                  }}
                />

                <TextField
                  label="Expiration Date"
                  type="date"
                  value={entry.licenseExpiration}
                  required
                  error={Boolean(entryErrors[index]?.licenseExpiration)}
                  helperText={entryErrors[index]?.licenseExpiration}
                  onChange={(event) => handleEntryChange(index, 'licenseExpiration', event.target.value)}
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  sx={{
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
                  }}
                />
              </Stack>
            </Box>
          ))}

          <Button
            onClick={handleAddLicense}
            sx={{
              textTransform: 'none',
              color: '#38bdf8',
              borderRadius: 2,
              border: '1px dashed #38bdf8',
              bgcolor: 'rgba(56,189,248,0.08)',
              '&:hover': { bgcolor: 'rgba(56,189,248,0.16)' },
              width: 'fit-content',
              alignSelf: 'center',
            }}
          >
            ADD NEW LICENSE TYPE
          </Button>

          {submitError ? (
            <Typography sx={{ color: '#f87171', textAlign: 'center' }}>{submitError}</Typography>
          ) : submitSuccess ? (
            <Typography sx={{ color: '#4ade80', textAlign: 'center' }}>{submitSuccess}</Typography>
          ) : null}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ 
              py: 2,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
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

  return content;
};

export default LicenseDetailsPage;