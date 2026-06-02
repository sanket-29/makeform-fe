import React, { useState } from 'react';
import { useMediaQuery, Stack, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Tabs, Tab } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import {
  BuildingDepartmentIcon,
  HealthDepartmentIcon,
  PlanningDepartmentIcon,
  FireDepartmentIcon,
  DogDepartmentIcon,
  ConcomDepartmentIcon
} from '@assets/export.assets';
import BuildingDepartment from './departments/building/building';
import HealthDepartment from './departments/health/health';
import PlanningDepartment from './departments/planning/planning';
import FireDepartment from './departments/fire/fire';
import DogDepartment from './departments/dog/dog';
import ConcomDepartment from './departments/concom/concom';
import { CommonTypography } from '@/components/user.components';

const ApplyForPermit = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Target small screens

  const permitCategories = [
    { label: 'Building', icon: <BuildingDepartmentIcon />, component: <BuildingDepartment />, panel: 'building' },
    { label: 'Health', icon: <HealthDepartmentIcon />, component: <HealthDepartment />, panel: 'health' },
    { label: 'Planning', icon: <PlanningDepartmentIcon />, component: <PlanningDepartment />, panel: 'planning' },
    { label: 'Fire', icon: <FireDepartmentIcon />, component: <FireDepartment />, panel: 'fire' },
    { label: 'Dog', icon: <DogDepartmentIcon />, component: <DogDepartment />, panel: 'dog' },
    { label: 'Concom', icon: <ConcomDepartmentIcon />, component: <ConcomDepartment />, panel: 'concom' },
  ];

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Stack sx={{ width: "100%" }}> {/* Set full width for the stack */}
      <CommonTypography variant="h4"
        sx={{
          fontWeight: "700",
          fontSize: { xs: "20px", md: "30px" },
          width: { xs: "100%" },
          color: "#E5E7EB",
        }} text={'Welcome to Permiteyes '} />
      <CommonTypography variant="body1"
        sx={{
          fontWeight: "300",
          fontSize: { xs: "14px", md: "16px" },
          color: "#E5E7EB",
          width: { xs: "100%" },
          pt: "8px",
          marginBottom: 0
        }}
        text="To apply for a new permit, choose the town department from the tabs below 
        and then click on the application link"
      />

      {/* Desktop View */}
      {/* Desktop View */}
      {!isMobile && (
        <Tabs
          component="div"
          value={activeTab}
          onChange={handleTabChange}
          slotProps={{
            indicator: {
              sx: { height: '3px' }, // Optional styling for tab indicator
            },
          }}
          sx={{
            '& .MuiTab-root': {
              marginRight: 3, // Add spacing between tabs
              paddingX: 2, // Optional: Increase horizontal padding for better spacing
            },
          }}
        >
          {permitCategories.map((category, index) => (
            <Tab
              key={index}
              label={category.label}
              icon={category.icon}
              iconPosition="start"
              sx={{
                fontSize: '16px', // Optional: Customize tab label size
                fontWeight: 500, // Optional: Customize font weight
                 color: activeTab === index ? '#E5E7EB' : 'white',  // Change color when active
              }}
            />
          ))}
        </Tabs>
      )}
      {!isMobile && <Box sx={{ marginTop: 0 }}>{permitCategories[activeTab].component}</Box>}

      {/* Mobile View */}
      {isMobile && (
        <Stack
          spacing={expanded ? 1 : 2} // Adjust spacing dynamically
          sx={{ width: '100%' }}
        >
          {permitCategories.map((category) => (
            <Accordion
              key={category.panel}
              expanded={expanded === category.panel}
              onChange={handleAccordionChange(category.panel)}
              sx={{
                width: '100%',
                borderRadius: 2, // Add rounded corners
                overflow: 'hidden', // Ensure content stays within rounded corners
                '&:before': { // Remove default Mui Accordion outline
                  display: 'none',
                },
                marginTop: expanded === category.panel ? 0 : '16px', // Reduce margin when expanded
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {category.icon}
                <Typography
                  variant="h6"
                  sx={{
                    marginLeft: 2,
                    flexGrow: 1,
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '24px',
                    letterSpacing: '0.4px',
                  }}
                >
                  {category.label}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingLeft: 2, paddingRight: 2 }}>
                {category.component}
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

    </Stack>
  );
};

export default ApplyForPermit;
