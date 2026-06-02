"use client";

import { Stack } from '@/components/user.components'
import React from 'react'
import {useApplicantHome,Contact,FAQ,Apply,MyApps} from '@applicant-home'
import EditProfileBody from './edit-profile/edit-profile'
import LicenseDetailsBody from './add-details/license/license'
import EstablishmentDetailsBody from './add-details/establishment/establishment'
import DesignerDetailsBody from './add-details/designer/designer'
import InstallerDetailsBody from './add-details/installer/installer'
import AffidavitDetailsBody from './add-details/affidavit/affidavit'
import { usePathname } from 'next/navigation'

const getAddDetailsContent = (pathname: string) => {
    if (pathname.includes('/user/add-details/license')) return <LicenseDetailsBody />
    if (pathname.includes('/user/add-details/establishment')) return <EstablishmentDetailsBody />
    if (pathname.includes('/user/add-details/designer')) return <DesignerDetailsBody />
    if (pathname.includes('/user/add-details/installer')) return <InstallerDetailsBody />
    if (pathname.includes('/user/add-details/affidavit')) return <AffidavitDetailsBody />
    return null
}

const ApplicantBody = () => {
    const {formContext} = useApplicantHome()
    const {watch} = formContext
    const pathname = usePathname()
    const {bodyComponent} = watch()
    return (
        <Stack sx={{ px:{xs:'16px',md:'48px'},pt:{xs:'32px',md:'20px'},height: '100%', overflowX: 'hidden', overflowY:'scroll', backgroundColor: '#18181b', 'boxSizing': 'border-box', '&::-webkit-scrollbar': {width: '6px'},'&::-webkit-scrollbar-thumb': {backgroundColor: 'rgba(193, 193, 193, 0.70)',borderRadius: '10px'},'&::-webkit-scrollbar-track': {backgroundColor: 'transparent'} }}>
            {
                bodyComponent === 'APPLY' &&
                <Apply/>
            }
            {
                bodyComponent === 'MY-APPS' &&
                <MyApps/>
            }
            {
                bodyComponent === 'FAQ' &&
                <FAQ/>
            }
            {
                bodyComponent === 'CONTACT' &&
                <Contact/>
            }
            {
                bodyComponent === 'EDIT-PROFILE' &&
                <EditProfileBody />
            }
            {
                bodyComponent === 'ADD-DETAILS' &&
                getAddDetailsContent(pathname)
            }
        </Stack>
    )
}

export default ApplicantBody