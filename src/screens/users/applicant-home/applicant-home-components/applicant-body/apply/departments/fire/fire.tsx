import React from 'react';
import { Box, Link, useMediaQuery } from '@mui/material';
import { CommonTypography } from '@/components/user.components';
import { useTheme } from '@mui/material/styles';

const FireDepartment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Target small screens

  const fireApplications = [
    '21E Review',
    'Above ground Storage Tank',
    'Blasting Permit',
    'Cannon or Mortar Firing',
    'Certificate of Compliance...',
    'CO Technical Permit',
    'Commercial Fire Alarm Impairment / Mod',
    'Commercial Fire Alarm Installation',
    'Commercial Fire Alarm Plan Review',
    'Dumpster (>6 cu. yds.)',
    'Fire Plan Review Inspection',
    'Fire Protection System Impairment',

    'Fire Protection System Installation',
    'Fire Protection System Plan Review',
    'Fuel Supply Line Permit',
    'Garage',
    'Gas Station',
    'Hazardous Materials Permit',
    'Magazine or Gunpowder',
    'Miscellaneous Permit',
    'Model Rocket',
    'Movie / TV Production / Special Effects',
    'Oil Burner & Tank - New',
    'Oil Burner - Replacement',

    'Propane Tank Permit',
    'Residential Fire Alarm Plan Review',
    'Smoke & CO Alarm Installation...',
    'Smoke / CO Detector Inspection',
    'Storage of Combustible Materials Permit',
    'Storage of Flammable Materials',
    'Tank Trucks',
    'Tar Kettles / Power Burners / Salamanders',
    'Tire Storage Permit',
    'Transfer Tank Permit',
    'Underground Storage Tank',
    'Vent-Free Gas Appliance Permit',
    'Waste Oil Storage Permit'

  ];

  // Split applications into three columns
  const column1 = fireApplications.slice(0, 12);
  const column2 = fireApplications.slice(12, 24);
  const column3 = fireApplications.slice(24);

  return (
    <Box sx={{ padding: '20px' }}>
    {/* Render body content only if not in mobile view */}
    {!isMobile && (
      <>
        <CommonTypography
          sx={{ fontWeight: 400, fontSize: 16,color: '#E5E7EB' }}
          text={
            <>
            The Town Fire Department is committed to safeguarding the lives, property, and environment of our community<br />through fire suppression, emergency medical response, rescue services, and fire prevention education. Our <br />dedicated team of trained professionals works around the clock to respond to emergencies, conduct safety <br /> inspections, and offer community education on fire safety  practices.
          </>
        } variant="body1"
      />
      {/* Applications List */}
      <CommonTypography
        text="Fire Department Applications"
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
            fireApplications.map((application) => (
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

export default FireDepartment;
