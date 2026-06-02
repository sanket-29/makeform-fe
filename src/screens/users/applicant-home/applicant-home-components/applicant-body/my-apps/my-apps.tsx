"use client";
import {
  SearchIcon
} from '@/assets/export.assets';
import { ApplicationCard, SummaryCard, useApplicantHome } from '@applicant-home'
import { useMediaQuery, TextField, InputAdornment } from '@mui/material';
import { CommonTypography, Stack, Box } from '@/components/user.components';
import useSummary from './common-summary-card/summary-hook';
import { summaryData } from '@/screens/users/applicant-home/applicant-home.type';
import React, { useMemo, useState, useEffect } from 'react'
import Chat from '@/screens/chat';
import Attachments from '@/screens/attachments';
import { X } from "lucide-react";

type AppType = {
  _id: string;
  formType: string;
  data?: {
    street_number?: string;
    street_name?: string;
  };
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const MyApps = () => {
  const { formContext } = useApplicantHome()
  const { watch } = formContext
  const { summaryBodyData } = useSummary();

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedAttachmentAppId, setSelectedAttachmentAppId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'All' | 'Title' | 'Address'>('All');

  const isSmallMobile = useMediaQuery('(min-width:320px) and (max-width:380px)')

  const [apps, setApps] = useState<AppType[]>([]);
  const [attachmentTab, setAttachmentTab] = useState<"add" | "files">("add");

  const applicantData = watch('myAppPageDetails.applicantData')
  const myAppTitle = watch('myAppPageDetails.title')

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    let list = Array.isArray(applicantData) ? [...applicantData] : [];

    if (normalizedSearch) {
      list = list.filter((item) => {
        const title = item?.title?.toString().toLowerCase() || '';
        const address = item?.address?.toString().toLowerCase() || '';
        const status = item?.status?.toString().toLowerCase() || '';
        return (
          title.includes(normalizedSearch) ||
          address.includes(normalizedSearch) ||
          status.includes(normalizedSearch)
        );
      });
    }

    if (sortBy === 'Title') {
      return list.sort((a, b) =>
        (a.title || '').toString().localeCompare((b.title || '').toString())
      );
    }

    if (sortBy === 'Address') {
      return list.sort((a, b) =>
        (a.address || '').toString().localeCompare((b.address || '').toString())
      );
    }

    return list;
  }, [applicantData, searchTerm, sortBy]);


  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSelectedAppId(customEvent.detail);
    };

    window.addEventListener("openChat", handler);

    return () => window.removeEventListener("openChat", handler);
  }, []);

  useEffect(() => {
    const closeHandler = () => {
      setSelectedAppId(null);
    };

    window.addEventListener("closeChat", closeHandler);

    return () => window.removeEventListener("closeChat", closeHandler);
  }, []);


  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSelectedAttachmentAppId(customEvent.detail);
    };

    window.addEventListener("openAttachments", handler);

    return () => window.removeEventListener("openAttachments", handler);
  }, []);


  useEffect(() => {
    const closeHandler = () => {
      setSelectedAttachmentAppId(null);
    };

    window.addEventListener("closeAttachments", closeHandler);

    return () => window.removeEventListener("closeAttachments", closeHandler);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
  const customEvent = e as CustomEvent<AppType[]>;
  setApps(customEvent.detail);
};
    window.addEventListener("setApplications", handler);

    return () => window.removeEventListener("setApplications", handler);
  }, []);

  return (
    <>
      <Stack component="div" sx={{ gap: 0 }}>
        {/* {loading ? <ApplicantSkeletonLoaders type ="my apps"/>:  */}
        <CommonTypography text={'My Applications'} variant='h6' sx={{ fontSize: !isSmallMobile ? '30px' : '20px', fontWeight: !isSmallMobile ? 700 : 600, color: '#E5E7EB', lineHeight: '40.6px', textWrap: 'nowrap', }}
        />
        {/* } */}
        {/* {loading ? <ApplicantSkeletonLoaders type='applicant text'/>: */}
        <CommonTypography text={
          myAppTitle
        } />
        {/* } */}
      </Stack>
      {/* {loading ? <ApplicantSkeletonLoaders type = 'my apps title'/> : */}
      <CommonTypography text={'My summary'} sx={{ mt: 2, mb: 2, fontSize: '24px', fontWeight: 300, letterSpacing: '-0.5%', color: '#E5E7EB' }} />
      <Stack
        component="div"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(240px, 1fr))',
            sm: 'repeat(2, minmax(260px, 1fr))',
            md: 'repeat(3, minmax(260px, 1fr))',
          },
          gap: 3,
          mb: 3,
          width: '100%',
          maxWidth: '1040px',
          mx: 'auto',
          justifyItems: 'center',
          alignItems: 'stretch',
          gridAutoRows: '1fr',
          '& > div': {
            width: '100%',
            display: 'flex',
          },
          '@media (max-width: 375px)': {
            gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))',
          },
        }}
      >
        {summaryBodyData.map((data: summaryData, index: number) => (
          <Box key={index}>
            <SummaryCard
              status={data.status}
              noOfData={data.noOfData}
              balance={data.balance}
              iconTitle={data.iconTitle}
              title={data.title}
              isButtonDisable={data.isButtonDisable}
              description={data.description}
              onStatusClick={data.onStatusClick}
            />
          </Box>
        ))}
      </Stack>
      <Stack
        component="div"
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          maxWidth: '1200px',
          width: '100%',
          '@media (min-width:599px) and (max-width:630px)': {
            flexDirection: 'column',
          },
        }}
      >
        <CommonTypography text={'My applications'} sx={{ mt: 2, mb: 1, fontSize: '24px', fontWeight: 300, letterSpacing: '-0.5%', color: '#E5E7EB' }} />
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ mr: 1, color: '#BDBDBD' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { lg: '320px', xs: '100%', md: '280px', sm: '280px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(255,255,255,0.25)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.25)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.45)',
            },
            '& .MuiOutlinedInput-input': {
              color: '#fff',
            },
            mb: 2,
            mt: 2,
            ml: { xs: 0, sm: 2 },
          }}
        />
        <Stack
          sx={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            alignSelf: 'flex-end',
            flexGrow: 1,
            mt: { xs: '12px', sm: 0 },
            ml: { xs: 0, sm: 2 },
            width: 'auto',
          }}
        >
          <CommonTypography
            onClick={() =>
              setSortBy((current) =>
                current === 'All' ? 'Title' : current === 'Title' ? 'Address' : 'All'
              )
            }
            sx={{
              alignSelf: 'flex-end',
              mb: 3,
              cursor: 'pointer',
              color: '#fff',
              '&:hover': {
                color: '#93C5FD',
              },
            }}
            text={`Sort by | ${sortBy}`}
          />
        </Stack>
      </Stack>
      <Stack
        component="div"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(240px, 1fr))',
            sm: 'repeat(2, minmax(280px, 1fr))',
            md: 'repeat(3, minmax(300px, 1fr))',
          },
          columnGap: 3,
          rowGap: 3,
          mt: '24px',
          mb: 3,
          justifyItems: 'center',
          width: '100%',
          maxWidth: '1160px',
          mx: 'auto',
          alignItems: 'stretch',
          '@media (max-width: 600px)': {
            gridTemplateColumns: 'repeat(1, minmax(240px, 1fr))',
          },
        }}
      >
        {apps.map((app, index) => {
          const data = filteredApplications.find(a => a._id === app._id); // keep UI data

          return (
            <Box key={index} sx={{ width: '100%' }}>
              <ApplicationCard
                status={data?.status || "Status"}
                iconTitle={data?.iconTitle}
                title={app.formType}
                address={`${app.data?.street_number || ''} ${app.data?.street_name || ''}`}
                sections={data?.sections || []}
                _id={app._id}
                onAttachmentClick={() => {
                  console.log("ATTACH CLICKED", app._id); // ✅ WILL WORK NOW
                  setSelectedAttachmentAppId(app._id);
                }}
              />
            </Box>
          );
        })}
      </Stack>

      {selectedAppId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ width: "500px" }}>
            <Chat applicationId={selectedAppId} role="user" />
          </div>
        </div>
      )}


{selectedAttachmentAppId && (
  <div style={overlayStyle}>
    <div
      style={{
        width: "650px",
        background: "#0f172a",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        position: "relative", // 👈 IMPORTANT
      }}
    >

      {/* ❌ CLOSE ICON */}
      <button
        onClick={() => setSelectedAttachmentAppId(null)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#9CA3AF",
        }}
      >
        <X size={20} />
      </button>

      {/* CONTENT */}
      <div style={{ padding: "10px" }}>
        <Attachments
          applicationId={selectedAttachmentAppId}
          onTabChange={setAttachmentTab}
        />
      </div>

    </div>
  </div>
)}
    </>

  )
}

export default MyApps