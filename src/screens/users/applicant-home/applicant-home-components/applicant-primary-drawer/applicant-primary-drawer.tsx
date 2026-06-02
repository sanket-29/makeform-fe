import { CommonButton, Stack } from '@/components/user.components'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApplicantHome } from '@applicant-home'

const ApplicantPrimaryDrawer = () => {
  const router = useRouter()
  const { formContext } = useApplicantHome()
  const { watch, setValue } = formContext
  const { bodyComponent } = watch()
  const setMainBodyComponent = (value : 'APPLY' | 'CONTACT' | 'FAQ' | 'MY-APPS')=>{
    setValue('bodyComponent', value)
    router.push(`/user/home-page?section=${value}`)
  }
  return (
    <>
      {/* laptop view */}
      <Stack sx={{ display: { xs: 'none', md: 'flex' }, height: '100%', overflow: 'hidden', pt: '70px', rowGap: '48px', backgroundColor: '#09090b' }}>
        <CommonButton
          BtnTitle={'Apply form permit'}
          variant='text'
          textColor={bodyComponent === 'APPLY' ? '#60A5FA' : '#E5E7EB'}
          sx={{ width: '90%', fontWeight: '700', fontSize: '16px', bgcolor: bodyComponent === 'APPLY' ? 'rgba(96,165,250,0.15)' : 'transparent', borderTopRightRadius: bodyComponent === 'APPLY' ? '10px' : undefined, borderBottomRightRadius: bodyComponent === 'APPLY' ? '10px' : undefined }}
          onClick={() => setMainBodyComponent('APPLY')}
        />
        <CommonButton
          BtnTitle={'My Applications'}
          variant='text'
          textColor={bodyComponent === 'MY-APPS' ? '#60A5FA' : '#E5E7EB'}
          sx={{ width: '90%', fontWeight: '700', fontSize: '16px', bgcolor: bodyComponent === 'MY-APPS' ? 'rgba(96,165,250,0.15)' : 'transparent', borderTopRightRadius: bodyComponent === 'MY-APPS' ? '10px' : undefined, borderBottomRightRadius: bodyComponent === 'MY-APPS' ? '10px' : undefined }}
          onClick={() => setMainBodyComponent('MY-APPS')}
        />
        <CommonButton
          BtnTitle={'FAQ'}
          variant='text'
          textColor={bodyComponent === 'FAQ' ? '#60A5FA' : '#E5E7EB'}
          sx={{ width: '90%', fontWeight: '700', fontSize: '16px', bgcolor: bodyComponent === 'FAQ' ? 'rgba(96,165,250,0.15)' : 'transparent', borderTopRightRadius: bodyComponent === 'FAQ' ? '10px' : undefined, borderBottomRightRadius: bodyComponent === 'FAQ' ? '10px' : undefined }}
          onClick={() => setMainBodyComponent('FAQ')}
        />
        <CommonButton
          BtnTitle={'Contact'}
          variant='text'
          textColor={bodyComponent === 'CONTACT' ? '#60A5FA' : '#E5E7EB'}
          sx={{ width: '90%', fontWeight: '700', fontSize: '16px', bgcolor: bodyComponent === 'CONTACT' ? 'rgba(96,165,250,0.15)' : 'transparent', borderTopRightRadius: bodyComponent === 'CONTACT' ? '10px' : undefined, borderBottomRightRadius: bodyComponent === 'CONTACT' ? '10px' : undefined }}
          onClick={() => setMainBodyComponent('CONTACT')}
        />
      </Stack>
      {/* mobile and tablet view */}
      <Stack sx={{ display: { xs: 'flex', md: 'none' }, height: '100%', overflow: 'hidden', flexDirection: 'row', width: { xs: '300px', sm: '500px' }, alignSelf: 'center', justifySelf: 'center', backgroundColor: '' }}>
        <CommonButton
          BtnTitle={'APPLY'}
          textColor={bodyComponent === 'APPLY' ? '#60A5FA' : '#E5E7EB'}
          sx={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'flex-end', borderBottom: bodyComponent === 'APPLY' ? '2px solid #60A5FA' : undefined, borderRadius: '0px',width:'25%' }}
          onClick={() => setMainBodyComponent('APPLY')}
        />
        <CommonButton
          BtnTitle={'MY APPS'}
          textColor={bodyComponent === 'MY-APPS' ? '#60A5FA' : '#E5E7EB'}
          sx={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'flex-end', borderBottom: bodyComponent === 'MY-APPS' ? '2px solid #60A5FA' : undefined, borderRadius: '0px',width:'30%' }}
          onClick={() => setMainBodyComponent('MY-APPS')}
        />
        <CommonButton
          BtnTitle={'FAQ'}
          textColor={bodyComponent === 'FAQ' ? '#60A5FA' : '#E5E7EB'}
          sx={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'flex-end', borderBottom: bodyComponent === 'FAQ' ? '2px solid #60A5FA' : undefined, borderRadius: '0px',width:'25%' }}
          onClick={() => setMainBodyComponent('FAQ')}
        />
        <CommonButton
          BtnTitle={'CONTACT'}
          textColor={bodyComponent === 'CONTACT' ? '#60A5FA' : '#E5E7EB'}
          sx={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'flex-end', borderBottom: bodyComponent === 'CONTACT' ? '2px solid #60A5FA' : undefined, borderRadius: '0px',width:'25%' }}
          onClick={() => setMainBodyComponent('CONTACT')}
        />
      </Stack>
    </>
  )
}

export default ApplicantPrimaryDrawer