import React from 'react';
import { Box, Link, useMediaQuery } from '@mui/material';
import { CommonTypography } from '@/components/user.components';
import { useTheme } from '@mui/material/styles';


const DogDepartment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Target small screens

  const dogApplications = [
    'Lorem ipsum',
    'Lorem ipsum',
    'Lorem ipsum '

  ];

  // Split applications into three columns
  const column1 = dogApplications.slice(0, 1);
  const column2 = dogApplications.slice(1, 2);
  const column3 = dogApplications.slice(2);

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Render body content only if not in mobile view */}
      {!isMobile && (
        <>
          <CommonTypography
            sx={{ fontWeight: 400, fontSize: 16,color: '#E5E7EB' }}
            text={
              <>
                The Town Dog License page provides information on licensing requirements to keep your pets safe and ensure <br /> compliance with local regulations. Licensing your dog helps reunite lost pets with their families and supports <br /> community animal control efforts. Here, you’ll find details on how to apply for or renew a license, fees, and <br /> vaccination requirements.
              </>
            } variant="body1"
          />
          {/* Applications List */}
          <CommonTypography
            text="Dog License Applications"
            variant="h6"
            sx={{ fontWeight: 300, fontSize: 24, mt: 2,color: '#E5E7EB' }}
          />
        </>
      )}

   {/* Applications List */}
   <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          gap: 2,
          mt: isMobile ? 0 : 3,
        }}
      >
        {isMobile ? (
          dogApplications.map((application) => (
            <Box key={application} sx={{ width: '100%' }}>
              <CommonTypography
                text={
                  <Link href="#" underline="hover">
                    {application}
                  </Link>
                }
                sx={{
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '29px',
                  letterSpacing: '0.4px',
                }}
              />
            </Box>
          ))
        ) : (
          <>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {column1.map((application) => (
                <CommonTypography
                  key={application}
                  text={
                    <Link href="#" underline="hover">
                      {application}
                    </Link>
                  }
                  sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '24px',
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {column2.map((application) => (
                <CommonTypography
                  key={application}
                  text={
                    <Link href="#" underline="hover">
                      {application}
                    </Link>
                  }
                  sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '24px',
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {column3.map((application) => (
                <CommonTypography
                  key={application}
                  text={
                    <Link href="#" underline="hover">
                      {application}
                    </Link>
                  }
                  sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '24px',
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DogDepartment;
