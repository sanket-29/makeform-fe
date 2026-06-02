const useApplicantHomeStyle = () => {
  const ApplicantHomeStyle = {
    Fee_Icon: {
      fontWeight: 900,
      color: 'black',
      '.css-kcj299-MuiPaper-root-MuiCard-root': {
        color: 'black !important'
      }

    },
    Summary_card: {
      width: '100%',
      minHeight: '170px',
      borderRadius: '16px',
      backgroundColor: '#111827',
      color: '#E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid rgba(148, 163, 184, 0.12)',
      boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.15)',
      '@media (max-width: 375px)': {
        minHeight: '170px',
      },
    },
    Application_card: {
      width: '346px', height: '339px', borderRadius: '16px', 
      // boxShadow: '0px 2.55px 4.24px -0.85px (#00000033),0px 4.24px 6.79px 0px (#00000024), 0px 0.85px 11.88px 0px (#0000001F)',
      boxShadow: '0px 2.55px 4.24px -0.85px rgba(0, 0, 0, 0.2), 0px 4.24px 6.79px 0px rgba(0, 0, 0, 0.14), 0px 0.85px 11.88px 0px rgba(0, 0, 0, 0.12)',
      border: '1px solid #EOEOEO',
      '@media (min-width:320px) and (max-width:380px)': {
        width: '290px',
      },
    }
  }
  return {
    ApplicantHomeStyle
  }
}

export default useApplicantHomeStyle