// added by ketan 29-11-2024
// -------------------------

// Applicant-homepage hook
export { default as useApplicantHome } from "./applicant-home.hook";

// Applicant-homepage style
export { default as useApplicantHomeStyle } from "./applicant-home.style";

// appliant primary drawer
export { default as ApplicantPrimaryDrawer } from "./applicant-home-components/applicant-primary-drawer/applicant-primary-drawer";

// applicant body files
export { default as ApplicantBody } from "./applicant-home-components/applicant-body/applicant-body";
export { default as Apply } from "./applicant-home-components/applicant-body/apply/apply";
export { default as MyApps } from "./applicant-home-components/applicant-body/my-apps/my-apps";
export { default as FAQ } from "./applicant-home-components/applicant-body/faq/faq";
export { default as Contact } from "./applicant-home-components/applicant-body/contact/contact";

// -------------------------------

// added by kushar 29-11-2024
//--------------------------
// faq related new file
export { default as FaqDropdown } from "./applicant-home-components/applicant-body/faq/faq-dropdown/faq-drodown";
//--------------------
// added by kushar(4/12/2024)
//------------------------------------------------
//Contact related files
//contact-card
export { default as ContactCard } from "./applicant-home-components/applicant-body/contact/contact-card/contact-card";
// added by kushar(13/12/2024)
//------------------------------------------------
//new hook file for api integration for contact
export { default as useContactData } from "./applicant-home-components/applicant-body/contact/contact-hook";
//----------------------------------------------------
//end by kushar (13/12/2024)
// ---------------------------------------------------------------------------
//----------------------------------------------------
//end by kushar (4/12/2024)
// added by kushar(5/12/2024)
//------------------------------------------------
//new hook file for api integration
export { default as useFaqData } from "./applicant-home-components/applicant-body/faq/faq-hook";
//----------------------------------------------------
//end by kushar (5/12/2024)
//added By Priya
//--------------------
//Common Applicant Card And Summary Card
export { default as ApplicationCard } from "./applicant-home-components/applicant-body/my-apps/common-application-card/common-application-card";
export { default as SummaryCard } from "./applicant-home-components/applicant-body/my-apps/common-summary-card/common-summary-card";
//---------------------

// added by furkan 29/11/2024
//------------------------------
//apply for permit related files
export { default as Building } from "./applicant-home-components/applicant-body/apply/departments/building/building";
export { default as Health } from "./applicant-home-components/applicant-body/apply/departments/health/health";
export { default as Planning } from "./applicant-home-components/applicant-body/apply/departments/planning/planning";
export { default as Fire } from "./applicant-home-components/applicant-body/apply/departments/fire/fire";
export { default as Dog } from "./applicant-home-components/applicant-body/apply/departments/dog/dog";
export { default as Concom } from "./applicant-home-components/applicant-body/apply/departments/concom/concom";
//-------------------
//added By priya 02-12-2024
//-----------------------
//Application Homepage Skeleton related files
// export { default as ApplicantSkeletonLoaders } from "./applicant-home-components/applicant-skeleton-loaders/applicant-skeleton-loaders";
//------------------------
//end priya 02-12-2024
