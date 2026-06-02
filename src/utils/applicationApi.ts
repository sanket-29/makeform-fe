import { getToken } from './auth';
import { BASE_URL } from '@/src/config/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api/user`;

const postJson = async (path: string, body: object) => {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication token missing');
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
};

export type EstablishmentPayload = {
  establishment: {
    name: string;
    dba?: string;
    streetName: string;
    streetNumber: string;
    mapBlockLot?: string;
    city: string;
    state: string;
    zip: string;
    telephone?: string;
    fax?: string;
    manualAddressEntry: boolean;
  };
  propertyOwner?: {
    name?: string;
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    zip?: string;
    telephone?: string;
  };
  businessOwner: {
    sameAsPropertyOwner: boolean;
    name: string;
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zip: string;
    telephone?: string;
    email?: string;
  };
};

export type LicensePayload = {
  businessName?: string;
  licenses: Array<{
    licenseType: string;
    licenseNumber: string;
    licenseExpiration: string;
  }>;
};

export type DesignerPayload = {
  sameAsApplicant: boolean;
  designer: {
    name: string;
    companyName: string;
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zip: string;
    telephone?: string;
    email?: string;
  };
};

export type InstallerPayload = {
  sameAsApplicant: boolean;
  installer: {
    name: string;
    companyName: string;
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zip: string;
    telephone?: string;
    email?: string;
    expirationDate?: string;
  };
};

export type AffidavitPayload = {
  isSoleProprietor: boolean;
  employerStatus: string;
  insuranceCompany?: string;
  policyNumber?: string;
  policyExpiration?: string;
  employerEmployeeCount?: number;
};

export const submitEstablishmentDetails = async (payload: EstablishmentPayload) =>
  postJson('/establishment', payload);

export const submitLicenseDetails = async (payload: LicensePayload) =>
  postJson('/licenses', payload);

export const submitDesignerDetails = async (payload: DesignerPayload) =>
  postJson('/designer', payload);

export const submitInstallerDetails = async (payload: InstallerPayload) =>
  postJson('/installer', payload);

export const submitAffidavit = async (payload: AffidavitPayload) =>
  postJson('/affidavit', payload);
