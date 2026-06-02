import React from 'react';
import { Box, Link, useMediaQuery } from '@mui/material';
import { CommonTypography } from '@/components/user.components';
import { useTheme } from '@mui/material/styles';


const HealthDepartment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Target small screens
  const healthApplications = [
    'Beach',
    'Beaver Control Emergency (10 Day)',
    'Beaver Control Non-Emergency',
    'Body Art Apprentice',
    'Body Art Establishment',
    'Body Art Practitioner',
    'Disposal System Installer',
    'Disposal Works Septic (DSCP)',
    'Dumpster Food Establishment',
    'Food Establishment Plan Review',
    'Frozen Dessert Manufacturer and Soft Serve',
    'Funeral Director',

    'Funeral Home',
    'Hazardous Materials',
    'Hotel / Motel / Campground',
    'Ice Rink',
    'Keeping of Animals',
    'Local Upgrade Approval - Form 9A',
    'Mobile Food Vendor',
    'Mobile Home Park Mobile Ice Cream Truck Permit',
    'Recreational Camps for Children',
    'Request for Variance',
    'Rubbish Hauler',

    'Septage Hauler',
    'Swimming Pool',
    'Tanning Facility',
    'Temporary Food',
    'Title 5 Inspections',
    'Title 5 Registered Inspector',
    'Tobacco and Nicotine Sales',
    'Trenches',
    'Well Drilling'
  ];

  // Split applications into three columns
  const column1 = healthApplications.slice(0, 12);
  const column2 = healthApplications.slice(12, 24);
  const column3 = healthApplications.slice(24);

  return (
    <Box sx={{ padding: '20px' }}>
    {/* Render body content only if not in mobile view */}
    {!isMobile && (
      <>
        <CommonTypography
          sx={{ fontWeight: 400, fontSize: 16,color: '#E5E7EB' }}
          text={
            <>
           The Town Board of Health is committed to protecting and promoting the health, safety, and well-being of our <br />
            community. We offer resources, guidance, and programs on public health concerns, including disease <br />
            prevention, environmental health, food safety, emergency preparedness, and health education
          </>
        } variant="body1"
      />
      <CommonTypography
        text="Board of health Applications"
        variant="h6"
        sx={{ fontWeight: 300, fontSize: 24 , mt:2,color: '#E5E7EB' }}
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
          healthApplications.map((application) => (
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

export default HealthDepartment;
