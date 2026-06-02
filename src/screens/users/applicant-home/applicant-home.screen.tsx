"use client";
import { CommonHeader,Box, CommonTypography, Stack } from '@/components/user.components'
import React, { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {useApplicantHome,ApplicantPrimaryDrawer,ApplicantBody} from '@applicant-home'
import { FormProvider } from 'react-hook-form';

const ApplicantHome = ({
  defaultBodyComponent,
  customBody,
}: {
  defaultBodyComponent?: 'APPLY' | 'MY-APPS' | 'FAQ' | 'CONTACT' | 'EDIT-PROFILE' | 'ADD-DETAILS'
  customBody?: ReactNode
}) => {
    const router = useRouter();
    const {methods} = useApplicantHome()
    const {watch, setValue} = methods
    const {headerDetails:{townName,profileDetails:{profileName,profilePic,profileEmail},seal}} = watch()

    useEffect(() => {
      if (defaultBodyComponent) {
        setValue('bodyComponent', defaultBodyComponent)
      }
    }, [defaultBodyComponent, setValue])

    const handleEditProfile = () => router.push('/user/edit-profile')
  return (
    <FormProvider {...methods}>
    {/* Main Box */}
    <Box sx={{display:'flex',flexDirection:'column',height:'100lvh',overflow:'hidden', backgroundColor: '#09090b' }}>
        {/* Header */}
        <CommonHeader
        type='applicant'
        applicantHeaderDetails={{
            leftContent:{
                townSeal:seal
            },
            centerContent:{
                component:<CommonTypography text={`Town of ${townName}`} sx={{fontSize:{xs:'16px',md:'24px'},fontWeight:'800',color:'#E5E7EB'}}/>
            },
            rightContent:{
                profileDetails:{
                    profileName:profileName,
                    profileImage:profilePic,
                    profileEmail:profileEmail,
                    onProfileImageClick:handleEditProfile
                }
                
            }
        }}
        />
        <Stack sx={{flexDirection:{md:'row'},height:'100%',overflow:'hidden'}}>
            {/* Primary drawer */}
            <Stack sx={{width:{md:'300px'},height:{xs:'70px',md:'100%'},borderRight:'none',borderBottom: 'none'}}>
                <ApplicantPrimaryDrawer/>
            </Stack>
            {/* Body */}
            <Stack sx={{width:{md:'100%'},overflow:'hidden',height:'100%'}}>
                {customBody ?? <ApplicantBody />}
            </Stack>
        </Stack>
    </Box>
    </FormProvider>
  )
}

export default ApplicantHome