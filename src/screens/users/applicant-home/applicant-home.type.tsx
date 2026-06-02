import { ApplicationSection } from "./applicant-home-components/applicant-body/my-apps/common-application-card/common-application-card";

interface HeaderData {
  townName: string;
  seal: any;
  profileDetails: {
    profileName: string;
    profilePic?: string;
    profileEmail?: string;
    onProfileClick: () => void;
  };
}

interface ApplicantHomeData {
  headerDetails: HeaderData;
  bodyComponent: "APPLY" | "MY-APPS" | "FAQ" | "CONTACT" | "EDIT-PROFILE" | "ADD-DETAILS";
  myAppPageDetails: MyAppsPageData;
  ContactUsDetails: ContactUsFormData;
}
//added By priya 29-11-2024
//-----------------------
interface ApplicationCardData {
  iconTitle: React.ReactNode;
  title: string;
  address: string;
  status: string;
 sections: ApplicationSection[];
  _id: string;
}
interface SummaryCardData {
  iconTitle: React.ReactNode;
  title: string;
  description: string;
  status: string;
}
//-----------------------

//added By Kushar 13-12-2024
//-----------------------
interface ContactUsFormData {
  ContactUsBodyCardData: ContactUsCardData[];
  ContactUsBodyData: ContactUsFetchData[];
}

interface ContactUsCardData {
  name: string;
  email: string;
  subject: string;
  description: string;
}

interface ContactUsFetchData {
  address: string;
  address1: string;
  address2: string;
  phone: string;
}

//-----------------------

interface MyAppsPageData {
  title: React.ReactNode;
  search: string;
  applicantData: ApplicationCardData[];
  summaryData: SummaryCardData[];
  summaryBodyData: summaryData[];
  applicationBodyData: applicationData[];
}
//added By priya 02-12-2024
//-----------------------

interface ApplicantSkeletonLoadersData {
  type:
    | "my summary cards"
    | "my application cards"
    | "search in myapps"
    | "sortBy in myapps"
    | "applicant text"
    | "my apps"
    | "my apps title";
}
//-----------------------
//end priya 02-12-2024

//added By priya 04-12-2024
//-----------------------
interface summaryData {
  noOfData: number;
  onStatusClick: () => void;
  isButtonDisable: boolean;
  description: string;
  title: string;
  iconTitle: React.ReactNode;
  balance: number;
  status: string;
}
interface applicationData {
  iconTitle: React.ReactNode;
  title: string;
  address: string;
  onApplicationStatus: string;
  applicationListData: {
    icon: React.ReactNode;
    text: string;
    onApplicationListStatus: () => void;
  }[];
}
//-----------------------
//end priya 04-12-2024

export type {
  ApplicantHomeData,
  ApplicationCardData,
  SummaryCardData,
  //added By priya 02-12-2024
  //--------------------
  ApplicantSkeletonLoadersData,
  //-----------------------
  //end priya 02-12-2024
  //added By Kushar 13-12-2024
  //--------------------
  ContactUsFormData,
  ContactUsCardData,
  ContactUsFetchData,
  //-----------------------
  //end Kushar 13-12-2024
  //added By priya 04-12-2024
  //--------------------
  summaryData,
  //-----------------------
  //end priya 04-12-2024
};
