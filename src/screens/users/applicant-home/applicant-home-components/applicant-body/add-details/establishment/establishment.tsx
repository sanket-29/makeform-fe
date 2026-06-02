
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
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { submitEstablishmentDetails } from '@/utils/applicationApi';
import { getUser } from '@/src/utils/auth';

const streetNames = ['--Select--', 'Main St', 'Elm St', 'Maple Ave', 'Oak Blvd'];
const streetNumbers = ['--Select--', '101', '202', '303', '404'];
const mapBlockLots = ['--Select--', 'Block 1 / Lot 12', 'Block 2 / Lot 34', 'Block 3 / Lot 56'];

const EstablishmentDetailsPage = () => {
  const [estName, setEstName] = useState('');
  const [dba, setDba] = useState('');
  const [streetName, setStreetName] = useState('--Select--');
  const [streetNumber, setStreetNumber] = useState('--Select--');
  const [mapBlockLot, setMapBlockLot] = useState('--Select--');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zip, setZip] = useState('');
  const [telephone, setTelephone] = useState('');
  const [fax, setFax] = useState('');
  const [manualAddressEntry, setManualAddressEntry] = useState(false);

  const toggleManualAddress = () => {
    setManualAddressEntry((prev) => !prev);
  };

  const [propertyOwnerName, setPropertyOwnerName] = useState('');
  const [propertyOwnerStreetNumber, setPropertyOwnerStreetNumber] = useState('');
  const [propertyOwnerStreetName, setPropertyOwnerStreetName] = useState('');
  const [propertyOwnerCity, setPropertyOwnerCity] = useState('');
  const [propertyOwnerState, setPropertyOwnerState] = useState('');
  const [propertyOwnerZip, setPropertyOwnerZip] = useState('');
  const [propertyOwnerTelephone, setPropertyOwnerTelephone] = useState('');

  const [sameAsPropertyOwner, setSameAsPropertyOwner] = useState(false);
  const [businessOwnerName, setBusinessOwnerName] = useState('');
  const [businessOwnerStreetNumber, setBusinessOwnerStreetNumber] = useState('');
  const [businessOwnerStreetName, setBusinessOwnerStreetName] = useState('');
  const [businessOwnerCity, setBusinessOwnerCity] = useState('');
  const [businessOwnerState, setBusinessOwnerState] = useState('');
  const [businessOwnerZip, setBusinessOwnerZip] = useState('');
  const [businessOwnerTelephone, setBusinessOwnerTelephone] = useState('');
  const [businessOwnerEmail, setBusinessOwnerEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const selectSx = {
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
    '& .MuiSelect-select': {
      color: '#E5E7EB',
      backgroundColor: '#1f2937',
      height: 'auto',
      // display: 'flex',
      // alignItems: 'center',
      // padding: '0 14px',
      // lineHeight: 1.2,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.12)',
    },
    '& .MuiSelect-icon': {
      color: '#cbd5e1',
    },
    '& .MuiInputLabel-root': {
      color: '#94a3b8',
    },
    '& .MuiInputBase-input': {
      color: '#E5E7EB',
    },
  };

  const handleSameAsPropertyOwner = (checked: boolean) => {
    setSameAsPropertyOwner(checked);

    if (checked) {
      setBusinessOwnerName(propertyOwnerName);
      setBusinessOwnerStreetNumber(propertyOwnerStreetNumber);
      setBusinessOwnerStreetName(propertyOwnerStreetName);
      setBusinessOwnerCity(propertyOwnerCity);
      setBusinessOwnerState(propertyOwnerState);
      setBusinessOwnerZip(propertyOwnerZip);
      setBusinessOwnerTelephone(propertyOwnerTelephone);
      setBusinessOwnerEmail('');
      return;
    }

    setBusinessOwnerName('');
    setBusinessOwnerStreetNumber('');
    setBusinessOwnerStreetName('');
    setBusinessOwnerCity('');
    setBusinessOwnerState('');
    setBusinessOwnerZip('');
    setBusinessOwnerTelephone('');
    setBusinessOwnerEmail('');
  };

  useEffect(() => {
    const user = getUser();
    const establishmentData = Array.isArray(user?.establishment)
      ? user.establishment[0]
      : user?.establishment;

    const details = establishmentData?.establishmentDetails ?? establishmentData;
    const propertyOwner = establishmentData?.propertyOwner ?? establishmentData?.propertyOwnerDetails;
    const business = establishmentData?.businessOwner ?? establishmentData?.businessOwnerDetails;

    if (details) {
      setEstName(details.name ?? '');
      setDba(details.dba ?? '');
      setStreetName(details.streetName ?? '--Select--');
      setStreetNumber(details.streetNumber ?? '--Select--');
      setMapBlockLot(details.mapBlockLot ?? '--Select--');
      setCity(details.city ?? '');
      setStateValue(details.state ?? '');
      setZip(details.zip ?? '');
      setManualAddressEntry(Boolean(details.manualAddressEntry));
    }

    if (propertyOwner) {
      setPropertyOwnerName(propertyOwner.name ?? '');
      setPropertyOwnerStreetNumber(propertyOwner.streetNumber ?? '');
      setPropertyOwnerStreetName(propertyOwner.streetName ?? '');
      setPropertyOwnerCity(propertyOwner.city ?? '');
      setPropertyOwnerState(propertyOwner.state ?? '');
      setPropertyOwnerZip(propertyOwner.zip ?? '');
      setPropertyOwnerTelephone(propertyOwner.telephone ?? '');
    }

    if (business) {
      setBusinessOwnerName(business.name ?? '');
      setBusinessOwnerStreetNumber(business.streetNumber ?? '');
      setBusinessOwnerStreetName(business.streetName ?? '');
      setBusinessOwnerCity(business.city ?? '');
      setBusinessOwnerState(business.state ?? '');
      setBusinessOwnerZip(business.zip ?? '');
      setBusinessOwnerTelephone(business.telephone ?? '');
      setSameAsPropertyOwner(Boolean(business.sameAsPropertyOwner));
    }
  }, []);

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async () => {
    const normalizedStreetName = manualAddressEntry ? streetName.trim() : streetName;
    const normalizedStreetNumber = manualAddressEntry ? streetNumber.trim() : streetNumber;
    const newErrors: Record<string, string> = {};

    if (!estName.trim()) newErrors.estName = 'Establishment name is required';
    if (!normalizedStreetName || normalizedStreetName === '--Select--') newErrors.streetName = 'Street name is required';
    if (!normalizedStreetNumber || normalizedStreetNumber === '--Select--') newErrors.streetNumber = 'Street number is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!stateValue.trim()) newErrors.state = 'State is required';
    if (!zip.trim()) newErrors.zip = 'Zip is required';

    if (!businessOwnerName.trim()) newErrors.businessOwnerName = 'Business owner name is required';
    if (!businessOwnerStreetNumber.trim()) newErrors.businessOwnerStreetNumber = 'Business owner street number is required';
    if (!businessOwnerStreetName.trim()) newErrors.businessOwnerStreetName = 'Business owner street name is required';
    if (!businessOwnerCity.trim()) newErrors.businessOwnerCity = 'Business owner city is required';
    if (!businessOwnerState.trim()) newErrors.businessOwnerState = 'Business owner state is required';
    if (!businessOwnerZip.trim()) newErrors.businessOwnerZip = 'Business owner zip is required';

    setErrors(newErrors);
    setSubmitError(null);
    setSubmitSuccess(null);

    if (Object.keys(newErrors).length > 0) {
      setSubmitError('Please fix the highlighted fields before submitting.');
      return;
    }

    const payload = {
      establishment: {
        name: estName.trim(),
        dba: dba.trim() || undefined,
        streetName: normalizedStreetName,
        streetNumber: normalizedStreetNumber,
        mapBlockLot: mapBlockLot === '--Select--' ? undefined : mapBlockLot,
        city: city.trim(),
        state: stateValue.trim(),
        zip: zip.trim(),
        telephone: telephone.trim() || undefined,
        fax: fax.trim() || undefined,
        manualAddressEntry,
      },
      propertyOwner: {
        name: propertyOwnerName.trim() || undefined,
        streetNumber: propertyOwnerStreetNumber.trim() || undefined,
        streetName: propertyOwnerStreetName.trim() || undefined,
        city: propertyOwnerCity.trim() || undefined,
        state: propertyOwnerState.trim() || undefined,
        zip: propertyOwnerZip.trim() || undefined,
        telephone: propertyOwnerTelephone.trim() || undefined,
      },
      businessOwner: {
        sameAsPropertyOwner,
        name: businessOwnerName.trim(),
        streetNumber: businessOwnerStreetNumber.trim(),
        streetName: businessOwnerStreetName.trim(),
        city: businessOwnerCity.trim(),
        state: businessOwnerState.trim(),
        zip: businessOwnerZip.trim(),
        telephone: businessOwnerTelephone.trim() || undefined,
        email: businessOwnerEmail.trim() || undefined,
      },
    };

    try {
      setSubmitting(true);
      await submitEstablishmentDetails(payload);
      setSubmitSuccess('Establishment details saved successfully.');
    } catch (error) {
      setSubmitError((error as Error)?.message || 'Failed to save establishment details.');
    } finally {
      setSubmitting(false);
    }
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              Establishment Details
            </Typography>
            <Typography sx={{ maxWidth: 760, lineHeight: 1.4, color: '#cbd5e1' }}>
              Complete the establishment, property owner, and business owner details below.
            </Typography>
          </Box>
          <Button
            onClick={toggleManualAddress}
            sx={{
              bgcolor: '#3B82F6',
              color: '#fff',
              textTransform: 'none',
              '&:hover': { bgcolor: '#2563eb' },
              px: 3,
              py: 1.25,
              whiteSpace: 'nowrap',
            }}
          >
            {manualAddressEntry ? 'STREET ADDRESS / OWNER' : 'ADDRESS DOES NOT APPEAR IN DROP-DOWN'}
          </Button>
        </Box>

        <Stack spacing={4} sx={{ mt: 2 }}>
          <Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Est. Name *"
                value={estName}
                onChange={(event) => {
                  setEstName(event.target.value);
                  clearError('estName');
                }}
                variant="outlined"
                fullWidth
                error={Boolean(errors.estName)}
                helperText={errors.estName}
                sx={textFieldSx}
              />
              <TextField
                label="DBA"
                value={dba}
                onChange={(event) => setDba(event.target.value)}
                variant="outlined"
                fullWidth
                sx={textFieldSx}
              />
            </Stack>

            {manualAddressEntry ? (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Street Name *"
                  value={streetName === '--Select--' ? '' : streetName}
                  onChange={(event) => {
                    setStreetName(event.target.value);
                    clearError('streetName');
                  }}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.streetName)}
                  helperText={errors.streetName}
                  sx={textFieldSx}
                />
                <TextField
                  label="Street Number *"
                  value={streetNumber === '--Select--' ? '' : streetNumber}
                  onChange={(event) => {
                    setStreetNumber(event.target.value);
                    clearError('streetNumber');
                  }}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.streetNumber)}
                  helperText={errors.streetNumber}
                  sx={textFieldSx}
                />
                <TextField
                  label="Map Block Lot"
                  value={mapBlockLot === '--Select--' ? '' : mapBlockLot}
                  onChange={(event) => setMapBlockLot(event.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={textFieldSx}
                />
              </Stack>
            ) : (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <FormControl fullWidth error={Boolean(errors.streetName)}>
                  <InputLabel sx={{ color: '#94a3b8' }} id="street-name-label">
                    Street Name *
                  </InputLabel>
                  <Select
                    labelId="street-name-label"
                    value={streetName}
                    label="Street Name *"
                    onChange={(event) => {
                      setStreetName(event.target.value);
                      clearError('streetName');
                    }}
                    sx={selectSx}
                  >
                    {streetNames.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.streetName ? (
                    <FormHelperText>{errors.streetName}</FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl fullWidth error={Boolean(errors.streetNumber)}>
                  <InputLabel sx={{ color: '#94a3b8' }} id="street-number-label">
                    Street Number *
                  </InputLabel>
                  <Select
                    labelId="street-number-label"
                    value={streetNumber}
                    label="Street Number *"
                    onChange={(event) => {
                      setStreetNumber(event.target.value);
                      clearError('streetNumber');
                    }}
                    sx={selectSx}
                  >
                    {streetNumbers.map((number) => (
                      <MenuItem key={number} value={number}>
                        {number}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.streetNumber ? (
                    <FormHelperText>{errors.streetNumber}</FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#94a3b8' }} id="map-block-lot-label">
                    Map Block Lot
                  </InputLabel>
                  <Select
                    labelId="map-block-lot-label"
                    value={mapBlockLot}
                    label="Map Block Lot"
                    onChange={(event) => setMapBlockLot(event.target.value)}
                    sx={selectSx}
                  >
                    {mapBlockLots.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="City *"
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  clearError('city');
                }}
                variant="outlined"
                fullWidth
                error={Boolean(errors.city)}
                helperText={errors.city}
                sx={textFieldSx}
              />
              <TextField
                label="State *"
                value={stateValue}
                onChange={(event) => {
                  setStateValue(event.target.value);
                  clearError('state');
                }}
                variant="outlined"
                fullWidth
                error={Boolean(errors.state)}
                helperText={errors.state}
                sx={textFieldSx}
              />
              <TextField
                label="Zip *"
                value={zip}
                onChange={(event) => {
                  setZip(event.target.value);
                  clearError('zip');
                }}
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
                label="Fax"
                value={fax}
                onChange={(event) => setFax(event.target.value)}
                variant="outlined"
                fullWidth
                sx={textFieldSx}
              />
            </Stack>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          <Box>
            <Typography sx={{ fontWeight: 700, letterSpacing: '0.02em', mb: 2 }}>
              PROPERTY OWNER DETAILS
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Property Owner Name"
                value={propertyOwnerName}
                onChange={(event) => setPropertyOwnerName(event.target.value)}
                variant="outlined"
                fullWidth
                sx={textFieldSx}
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Street Number"
                  value={propertyOwnerStreetNumber}
                  onChange={(event) => setPropertyOwnerStreetNumber(event.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={textFieldSx}
                />
                <TextField
                  label="Street Name"
                  value={propertyOwnerStreetName}
                  onChange={(event) => setPropertyOwnerStreetName(event.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={textFieldSx}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="City"
                  value={propertyOwnerCity}
                  onChange={(event) => setPropertyOwnerCity(event.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={textFieldSx}
                />
                <TextField
                  label="State"
                  value={propertyOwnerState}
                  onChange={(event) => setPropertyOwnerState(event.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={textFieldSx}
                />
                <TextField
                  label="Zip"
                  value={propertyOwnerZip}
                  onChange={(event) => setPropertyOwnerZip(event.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={textFieldSx}
                />
              </Stack>

              <TextField
                label="Telephone"
                value={propertyOwnerTelephone}
                onChange={(event) => setPropertyOwnerTelephone(event.target.value)}
                variant="outlined"
                fullWidth
                sx={textFieldSx}
              />
            </Stack>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          <Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700, letterSpacing: '0.02em' }}>
                BUSINESS OWNER DETAILS
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sameAsPropertyOwner}
                    onChange={(event) => handleSameAsPropertyOwner(event.target.checked)}
                    sx={{ color: '#38bdf8' }}
                  />
                }
                label={
                  <Typography sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                    Same As Property Owner
                  </Typography>
                }
              />
            </Stack>

            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Business Owner Name *"
                value={businessOwnerName}
                onChange={(event) => {
                  setBusinessOwnerName(event.target.value);
                  clearError('businessOwnerName');
                }}
                variant="outlined"
                fullWidth
                error={Boolean(errors.businessOwnerName)}
                helperText={errors.businessOwnerName}
                sx={textFieldSx}
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Street Number *"
                  value={businessOwnerStreetNumber}
                  onChange={(event) => {
                    setBusinessOwnerStreetNumber(event.target.value);
                    clearError('businessOwnerStreetNumber');
                  }}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.businessOwnerStreetNumber)}
                  helperText={errors.businessOwnerStreetNumber}
                  sx={textFieldSx}
                />
                <TextField
                  label="Street Name *"
                  value={businessOwnerStreetName}
                  onChange={(event) => {
                    setBusinessOwnerStreetName(event.target.value);
                    clearError('businessOwnerStreetName');
                  }}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.businessOwnerStreetName)}
                  helperText={errors.businessOwnerStreetName}
                  sx={textFieldSx}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="City *"
                  value={businessOwnerCity}
                  onChange={(event) => {
                    setBusinessOwnerCity(event.target.value);
                    clearError('businessOwnerCity');
                  }}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.businessOwnerCity)}
                  helperText={errors.businessOwnerCity}
                  sx={textFieldSx}
                />
                <TextField
                  label="State *"
                  value={businessOwnerState}
                  onChange={(event) => {
                    setBusinessOwnerState(event.target.value);
                    clearError('businessOwnerState');
                  }}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.businessOwnerState)}
                  helperText={errors.businessOwnerState}
                  sx={textFieldSx}
                />
                <TextField
                  label="Zip *"
                  value={businessOwnerZip}
                  onChange={(event) => {
                    setBusinessOwnerZip(event.target.value);
                    clearError('businessOwnerZip');
                  }}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.businessOwnerZip)}
                  helperText={errors.businessOwnerZip}
                  sx={textFieldSx}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Telephone"
                  value={businessOwnerTelephone}
                  onChange={(event) => setBusinessOwnerTelephone(event.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={textFieldSx}
                />
                <TextField
                  label="Email"
                  value={businessOwnerEmail}
                  onChange={(event) => setBusinessOwnerEmail(event.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={textFieldSx}
                />
              </Stack>
            </Stack>
          </Box>

          {submitError ? (
            <Typography sx={{ color: '#f87171', textAlign: 'center' }}>{submitError}</Typography>
          ) : submitSuccess ? (
            <Typography sx={{ color: '#4ade80', textAlign: 'center' }}>{submitSuccess}</Typography>
          ) : null}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'flex-end', mt: 2, pb: 2 }}>
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

export default EstablishmentDetailsPage;