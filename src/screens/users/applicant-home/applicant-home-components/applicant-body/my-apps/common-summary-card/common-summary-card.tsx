import React from 'react'
import { CommonButton, CommonTypography } from '@/components/user.components'
import { Stack } from '@mui/material'
import { useApplicantHomeStyle } from "@applicant-home"
import { summaryData } from '../../../../applicant-home.type'

function SummaryCard({
  onStatusClick,
  isButtonDisable,
  description,
  title,
  noOfData,
  status,
  iconTitle
}: summaryData) {

  const {
    ApplicantHomeStyle: { Summary_card },
  } = useApplicantHomeStyle();

  return (
    <Stack
      sx={{
        ...Summary_card,
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #0f172a, #1e293b)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
        }
      }}
    >

      {/* 🔹 Header */}
      <Stack
        direction="row"
        sx={{
          gap: 1.5,
          p: 1.5,
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <Stack
          sx={{
            width: 38,
            height: 38,
            borderRadius: '12px',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 600,
            color: noOfData > 0 ? '#DC2626' : '#1E293B',
            background: noOfData > 0
              ? 'linear-gradient(135deg, #fecaca, #f87171)'
              : '#cbd5e1',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}
        >
          {iconTitle}
        </Stack>

        <CommonTypography
          sx={{
            fontWeight: 700,
            fontSize: '14px',
            color: '#F1F5F9',
            letterSpacing: '0.3px'
          }}
          text={title}
        />
      </Stack>

      {/* 🔹 Body */}
      <Stack
        sx={{
          flexGrow: 1,
          p: 2,
          justifyContent: 'space-between'
        }}
      >
        <CommonTypography
          sx={{
            fontSize: '13px',
            lineHeight: '20px',
            color: noOfData > 0 ? '#FCA5A5' : '#94A3B8'
          }}
          text={description}
        />

        {/* 🔹 Footer */}
<Stack
  direction="row"
  sx={{
    justifyContent: "flex-end",
    alignItems: "center",
    mt: 2,
  }}
>          <CommonButton
            BtnTitle={status}
            onClick={onStatusClick}
            disabled={isButtonDisable}
            sx={{
              px: 3,
              py: 1,
              minWidth: '110px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'none',
              background: isButtonDisable
                ? '#1F2937'
                : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: isButtonDisable ? '#64748B' : '#FFFFFF',
              '&:hover': {
                background: isButtonDisable
                  ? '#1F2937'
                  : 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
              }
            }}
          />
        </Stack>

      </Stack>
    </Stack>
  )
}

export default SummaryCard