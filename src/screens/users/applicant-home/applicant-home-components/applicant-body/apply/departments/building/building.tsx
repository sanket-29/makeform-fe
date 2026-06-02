import React from 'react';
import { Box, Link, useMediaQuery } from '@mui/material';
import { CommonTypography } from '@/components/user.components';
import { useTheme } from '@mui/material/styles';

const BuildingDepartment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Target small screens

  const buildingApplications = [
    // 'Certificate Of Inspection',
    // 'Certificate Of Occupancy (Comm)',
    // 'Certificate Of Occupancy (Res)',
    'Commercial Building Permit',
    'Electrical Permit',
    'Gas Permit',
    // 'Mechanical Permit',
    'Plumbing Permit',
    'Residential Building Permit',
    // 'Shed Permit',
    // 'Sheet Metal Permit',
    // 'Sign Permit',
    // 'Smoke / CO Modification Permit',
    // 'Solid Fuel Appliance Permit',
    // 'Sprinkler & Fire Alarm Systems',
    // 'Tent Permit',
    // 'Trench Permit',
  ];

  // Split applications into three columns for desktop view
  const column1 = buildingApplications.slice(0, 6);
  const column2 = buildingApplications.slice(6, 12);
  const column3 = buildingApplications.slice(12);

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Render body content only if not in mobile view */}
      {!isMobile && (
        <>
          <CommonTypography
            sx={{ fontWeight: 400, fontSize: 16,color: '#E5E7EB' }}
            text={
              <>
                Building Department Service is based on whether you are making changes to a structure or to a building`s <br />
                occupancy. Permitting for minor changes can be done online or in person. Major changes usually can only be <br />
                started online, and you need to complete them in person.
              </>
            }
            variant="body1"
          />
          <CommonTypography
            text="Building Department Applications"
            variant="h6"
            sx={{ fontWeight: 300, fontSize: 24, mt: 2, color: '#E5E7EB' }}
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
          buildingApplications.map((application) => (
            <Box key={application} sx={{ width: '100%' }}>
              <CommonTypography
                text={
                  <Link href={`/user/forms/${application.split(" ")[0].toLowerCase()}`} underline="hover">
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
                    <Link href={`/user/forms/${application.split(" ")[0].toLowerCase()}`} underline="hover">
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
                    <Link href={`/user/forms/${application.split(" ")[0].toLowerCase()}`} underline="hover">
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
                    <Link href={`/user/forms/${application.split(" ")[0].toLowerCase()}`} underline="hover">
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

export default BuildingDepartment;
