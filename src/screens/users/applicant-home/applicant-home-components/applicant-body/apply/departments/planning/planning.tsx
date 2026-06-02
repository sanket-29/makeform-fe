import React from 'react';
import { Box, Link, useMediaQuery } from '@mui/material';
import { CommonTypography } from '@/components/user.components';
import { useTheme } from '@mui/material/styles';


const PlanningDepartment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Target small screens

  const planningApplications = [
    'Approval Not Required',
    'Special Permit',
    'Approval of Definitive Plan',
    'Special Permit Modification',
    'Preliminary Form'

  ];

  // Split applications into three columns for desktop view
  const column1 = planningApplications.slice(0, 2);
  const column2 = planningApplications.slice(2, 4);
  const column3 = planningApplications.slice(4);

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Render body content only if not in mobile view */}
      {!isMobile && (
        <>
          <CommonTypography
            sx={{ fontWeight: 400, fontSize: 16, color: '#E5E7EB' }}
            text={
              <>
                The Town Planning Department is dedicated to guiding sustainable growth and development that aligns with the <br />
                community's vision for the future. We oversee land use, zoning, permitting, and long-term planning initiatives to <br />
                ensure balanced economic development while preserving our town’s character and natural resources.
              </>
            }
            variant="body1"
          />
          {/* Applications List */}
          <CommonTypography
            text="Department of planning Applications"
            variant="h6"
            sx={{ fontWeight: 300, fontSize: 24, mt: 2, color: '#E5E7EB' }}
          />
        </>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          gap: 2,
          mt: isMobile ? 0 : 3,
        }}
      >
        {isMobile ? (
          planningApplications.map((application) => (
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

export default PlanningDepartment;
