import React from 'react';
import { Box, Link, useMediaQuery } from '@mui/material';
import { CommonTypography } from '@/components/user.components';
import { useTheme } from '@mui/material/styles';


const ConcomDepartment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Target small screens

  const concomApplications = [
    'Abbreviated Notice Of Resource',
    'Area Delineation',
    'Certificate of Compliance',

    'Notice of Intent',
    'Request for Determination of',

    'Applicability',
    'Request to Apply'

  ];

  // Split applications into three columns
  const column1 = concomApplications.slice(0, 3);
  const column2 = concomApplications.slice(3, 5);
  const column3 = concomApplications.slice(5);

  return (
   <Box sx={{ padding: '20px' }}>
      {/* Render body content only if not in mobile view */}
      {!isMobile && (
        <>
          <CommonTypography
            sx={{ fontWeight: 400, fontSize: 16, color: '#E5E7EB' }}
            text={
              <>
            The Town Conservation Commission (Con Com) is dedicated to preserving and protecting our community's <br /> natural resources, including wetlands, waterways, and open spaces. The Commission reviews projects to ensure <br /> compliance with state and local environmental regulations, working to balance development with ecological <br /> sustainability.
          </>
        } variant="body1"
      />
      {/* Applications List */}
      <CommonTypography
        text="Conservations commission Applications"
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
          concomApplications.map((application) => (
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

export default ConcomDepartment;
