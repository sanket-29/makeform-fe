"use client";

import { CommonButton, CommonTypography } from '@/components/user.components'
import { Card, Stack, useMediaQuery } from '@mui/material'
import React from 'react'
import { useApplicantHomeStyle } from "@applicant-home"
import { ApplicationCardData } from '../../../../applicant-home.type'
import { Paperclip } from "lucide-react";
import { Tooltip } from "@mui/material";


export interface ApplicationSection {
    icon: React.ReactNode;
    text: string;
    onApplicationListStatus?: () => void;
    tooltip?: string;
}

function ApplicationCard(
    {
        iconTitle,
        title,
        address,
        status,
        sections,
        onAttachmentClick,
    }: ApplicationCardData & { onAttachmentClick?: () => void }
) {
    const isSmallMobile = useMediaQuery('(min-width:320px) and (max-width:380px)')
    const {
        ApplicantHomeStyle: { Application_card },
    } = useApplicantHomeStyle();

    return (
        <>
            <Card sx={Application_card}>

                {/* HEADER */}
                <Stack component="div" direction="row" sx={{ gap: 1, p: 2, alignItems: 'flex-start' }}>
                    <Stack component="div" direction="row" sx={{ gap: 1 }}>
                        <Stack component="div" sx={{
                            width: '32px', height: '20px', p: 1, backgroundColor: '#E5E7EB', color: '#fff', ml: '-24px', borderRadius: '0px 20px 20px 0px', alignItems: 'center', mt: 2
                        }}> {iconTitle}</Stack>

                        <Stack component="div" direction="column" sx={{ ml: 2, gap: '8px' }}>
                            <CommonTypography
                                variant='h6'
                                sx={{
                                    fontWeight: !isSmallMobile ? 700 : 600,
                                    whiteSpace: !isSmallMobile ? 'nowrap' : 'wrap',
                                    lineHeight: '27.16px',
                                    fontSize: !isSmallMobile ? '20px' : '14px',
                                    mt: 2
                                }}
                                text={title}
                            />

                            <CommonTypography
                                variant='body1'
                                sx={{ whiteSpace: 'nowrap' }}
                                text={address}
                            />
                        </Stack>
                    </Stack>

                    <Stack
                        direction="row"
                        sx={{
                            ml: 'auto',
                            mr: 4,
                            mt: '21px',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        {/* ✅ ATTACHMENT ICON */}
                        {onAttachmentClick && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAttachmentClick();
                                }}
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                }}
                            >
                                <Paperclip size={16} />
                            </div>
                        )}

                        {/* STATUS BUTTON */}
                        <CommonButton
                            BtnTitle={status}
                            variant="contained"
                            color="info"
                            sx={{
                                borderRadius: "20px",

                                // 🔥 FIXED SIZE
                                minWidth: "90px",      // increase width
                                height: "26px",         // better height

                                // 🔥 TEXT
                                fontSize: "12px",
                                fontWeight: 600,

                                // 🔥 SPACING
                                px: 2,                  // horizontal padding
                                textTransform: "none",

                                // 🔥 ALIGNMENT
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                whiteSpace: "nowrap",   // prevent breaking

                                "&.MuiButton-root": {
                                    minWidth: "90px",
                                    height: "26px",
                                },
                            }}
                        />
                    </Stack>
                </Stack>

                {/* DIVIDER */}
                <Stack component="div" sx={{
                    border: '0.85px solid rgba(224, 224, 224, 1)',
                    mt: '1px',
                    ml: 7,
                    mb: 2,
                    width: isSmallMobile ? '210px' : '261px'
                }} />

                {/* SECTIONS */}
                <Stack component="div" direction="column" sx={{ gap: 2, ml: 7, flexWrap: 'wrap' }}>
                    {sections.map((section: ApplicationSection, index) => (
                        <Stack
                            key={index}
                            component="div"
                            direction="row"
                            sx={{
                                gap: 1,
                                alignItems: "center",
                                cursor: section.onApplicationListStatus ? "pointer" : "default",
                            }}
                            onClick={() => {
                                if (section.onApplicationListStatus) {
                                    section.onApplicationListStatus();
                                }
                            }}
                        >
                            {section.icon}

                            {section.tooltip ? (
                                <Tooltip
                                    title={
                                        <span style={{ whiteSpace: "pre-line" }}>
                                            {section.tooltip}
                                        </span>
                                    }
                                    arrow
                                    placement="right"   
                                    slotProps={{
                                        popper: {
                                            modifiers: [
                                                {
                                                    name: "offset",
                                                    options: {
                                                        offset: [0, 0], // adjust if needed
                                                    },
                                                },
                                            ],
                                        },
                                    }}
                                >
                                    <span style={{ display: "inline-flex" }}>
                                        <CommonTypography
                                            variant="body1"
                                            text={section.text}
                                            sx={{
                                                fontSize: !isSmallMobile ? "12px" : "10px",
                                                fontWeight: "400",
                                            }}
                                        />
                                    </span>
                                </Tooltip>
                            ) : (
                                <CommonTypography
                                    variant="body1"
                                    text={section.text}
                                    sx={{
                                        fontSize: !isSmallMobile ? "12px" : "10px",
                                        fontWeight: "400",
                                        color: section.onApplicationListStatus ? "#1976d2" : "inherit",
                                        textDecoration: section.onApplicationListStatus ? "underline" : "none",
                                        cursor: section.onApplicationListStatus ? "pointer" : "default",

                                        "&:hover": {
                                            color: section.onApplicationListStatus ? "#1565c0" : "inherit",
                                        },
                                    }}
                                />
                            )}
                        </Stack>
                    ))}
                </Stack>

            </Card>
        </>
    )
}

export default ApplicationCard