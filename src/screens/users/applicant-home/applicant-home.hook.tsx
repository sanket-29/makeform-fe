"use client";
import { useForm, useFormContext } from "react-hook-form";
import { ApplicantHomeData } from "./applicant-home.type";
import {
  CalendarMonthOutlinedIcon,
  ChatOutlinedIcon,
  FeeIcon,
  FileUploadOutlinedIcon,
  GroupsOutlinedIcon,
  HealthAndSafetyOutlinedIcon,
  HomeWorkOutlinedIcon,
  LocalPrintshopOutlinedIcon,
  MonetizationOnOutlinedIcon,
  PendingActionsOutlinedIcon,
  PreviewOutlinedIcon,
  ProfileCardIcon,
  RefreshOutlinedIcon,
  VisibilityOutlinedIcon,
} from "@/assets/export.assets";
import { Stack, useMediaQuery } from "@mui/material";
import { useApplicantHomeStyle } from "@applicant-home";
import { useEffect } from "react";
import { CommonTypography } from "@/components/user.components";
import { getUser, fetchUserProfile } from "@/src/utils/auth";
import { Paperclip } from "lucide-react";
import { Tooltip } from "@mui/material";
import { BASE_URL } from "@/src/config/api";


interface FeeItem {
  amount?: number;
}

interface Signoff {
  department: string;
  currentStatus: string;
}

interface Application {
  _id: string;
  formType: string;
  data: {
    street_number?: string;
    street_name?: string;
  };
}

const getIconForFormType = (formType: string) => {
  switch (formType.toLowerCase()) {
    case 'plumbing':
      return <HomeWorkOutlinedIcon />;
    case 'electrical':
      return <HealthAndSafetyOutlinedIcon />;
    case 'gas':
      return <GroupsOutlinedIcon />;
    case 'residential':
      return <HomeWorkOutlinedIcon />;
    case 'commercial':
      return <MonetizationOnOutlinedIcon />;
    default:
      return <HomeWorkOutlinedIcon />;
  }
};

const useApplicantHome = () => {
  //added By priya 29-11-2024
  //-----------------------

  const user = getUser();
  const profileName =
    user?.name || user?.fullName || user?.username || user?.email || "Guest User";
  const profilePic = user?.profilePic || undefined;

  const {
    ApplicantHomeStyle: { Fee_Icon },
  } = useApplicantHomeStyle();

  const isMobile = useMediaQuery("(min-width:320px) and (max-width:426px)");
  //end priya 02-12-2024

  //-----------------------

  const methods = useForm<ApplicantHomeData>({
    defaultValues: {
      headerDetails: {
        townName: "Concord",
        profileDetails: {
          profileName,
          profilePic,
          profileEmail: user?.email,
          onProfileClick: () => undefined,
        },
      },
      bodyComponent: "APPLY",
      //added By priya 29-11-2024
      //-----------------------
      myAppPageDetails: {
        //added By priya 03-12-2024
        //-----------------------

        title: (
          <CommonTypography
            variant="body1"
            sx={{
              fontSize: "16px",
              fontWeight: 300,
              letterSpacing: "-0.5%",
              color: "#E5E7EB",
              lineHeight: "32px",
            }}
            text={
              <>
                <b>Review, edit and update your applications here.</b> Urgent
                actions can be found in the Summary section.
              </>
            }
          />
        ),
        //-------------------------
        //end priya 03-12-2024

        applicantData: [],

        summaryData: [],
        //added By priya 04-12-2024
        //-----------------------
        summaryBodyData: [],
        applicationBodyData: [],
        //-----------------------
        //end priya 04-12-2024
      },
      //-----------------------
      //added By Kushar 17-12-2024
      //-----------------------
      ContactUsDetails: {
        //added By Kushar 03-12-2024
        //-----------------------
        ContactUsBodyData: [
          {
            address: "123 Main St",
            address1: "Suite 400",
            address2: "Concord, CA 94520",
            phone: "(123) 456-7890",
          },
        ],
        //-----------------------
        ContactUsBodyCardData: [],
        //-----------------------
        //end Kushar 04-12-2024
      },
      //-----------------------
    },
  });
  //added By priya 29-11-2024
  //-----------------------

  const safeFetch = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("API ERROR:", url, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const profile = await fetchUserProfile();
        const applications = profile.applications || [];

        window.dispatchEvent(
          new CustomEvent("setApplications", { detail: applications })
        );

        // 🔥 MAIN CHANGE (dynamic mapping)
        const mappedApplicantData = await Promise.all(
          applications.map(async (app: Application) => {
            const [transaction, feeData, signoffData] = await Promise.all([
              safeFetch(`${BASE_URL}/api/transactions/${app._id}`),
              safeFetch(`${BASE_URL}/api/fees/records?applicationId=${app._id}`),
              safeFetch(`${BASE_URL}/api/signoffs/${app._id}`),
            ]);
            const progress = transaction?.progress || {};

            let totalFee = 0;

            if (Array.isArray(feeData)) {
              totalFee = feeData.reduce(
               (sum: number, item: FeeItem) => sum + (item.amount || 0),
                0
              );
            }


            let departments = "";

            if (signoffData?.signoffs?.length) {
              departments = signoffData.signoffs
                .map((s: Signoff) => s.department)
                .join(", ");
            }

            let signoffTooltip = "";

            if (signoffData?.signoffs?.length) {
              signoffTooltip = signoffData.signoffs
                .map((s: Signoff) => `• ${s.department} - ${s.currentStatus}`)
                .join("\n");
            }

            // ✅ SECTION TEXTS
            const signoffText = signoffData?.signoffs?.length
              ? "Sign off submitted"
              : "Waiting for approval";

            const feeText = progress.payfee
              ? `Fees paid - $${totalFee.toFixed(2)}`
              : "Fees pending";

            const inspectionText = progress.inspection
              ? "Inspection Done"
              : "Inspection required";

            const permitText = progress.permit
              ? "Permit Issued"
              : "Permit not issued";

            // ✅ 🔥 DYNAMIC STATUS PILL (PRIORITY BASED)
            let statusPill = "Pending";

            if (progress.permit) {
              statusPill = "Permit Issued";
            } else if (progress.inspection) {
              statusPill = "Inspection Done";
            } else if (progress.payfee) {
              statusPill = "Fees Paid";
            } else if (progress.signoffs) {
              statusPill = "Approved";
            }

            return {
              iconTitle: getIconForFormType(app.formType),
              title: app.formType,
              address: `${app.data?.street_number || ""} ${app.data?.street_name || ""}`.trim(),

              // 🔥 UPDATED HERE
              status: statusPill,

              sections: [
                {
                  icon: <PendingActionsOutlinedIcon />,
                  text: signoffText,
                  tooltip: signoffTooltip,
                },
                {
                  icon: (
                    <Stack sx={Fee_Icon}>
                      <FeeIcon />
                    </Stack>
                  ),
                  text: feeText,
                },
                {
                  icon: <VisibilityOutlinedIcon />,
                  text: inspectionText,
                },
                {
                  icon: <ProfileCardIcon />,
                  text: permitText,
                },
                {
                  icon: <ChatOutlinedIcon />,
                  text: "Facing issues - Chat with us",
                  onApplicationListStatus: () =>
                    window.dispatchEvent(
                      new CustomEvent("openChat", { detail: app._id })
                    ),
                },
              ],

              _id: app._id,
            };
          })
        );

        console.log("FINAL DATA:", mappedApplicantData);
        // 🔥 SET DATA (unchanged)
        methods.setValue(
          "myAppPageDetails.applicantData",
          mappedApplicantData
        );

      } catch (error) {
        console.error("Failed to fetch applications", error);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const dynamicSummaryBodyData = [
      {
        iconTitle: <PreviewOutlinedIcon />,
        title: !isMobile ? "Review Applications" : "Review Apps",
        noOfData: 0,
        onStatusClick: () => alert("under progress"),
        isButtonDisable: true,
        description: "",
        status: "Review",
        balance: 0,
      },
      {
        iconTitle: <RefreshOutlinedIcon />,
        title: !isMobile ? "Renew Applications" : "Renew Apps",
        noOfData: 1,
        onStatusClick: () => alert("under progress"),
        isButtonDisable: true,
        description: "",
        status: "Renew",
        balance: 0,
      },
      {
        iconTitle: <MonetizationOnOutlinedIcon />,
        title: "Pay Fees",
        noOfData: 1,
        onStatusClick: () => alert("under progress"),
        isButtonDisable: true,
        description: "",
        balance: 100,
        status: "Pay",
      },
      {
        iconTitle: <CalendarMonthOutlinedIcon />,
        title: "Inspections",
        noOfData: 0,
        onStatusClick: () => alert("under progress"),
        isButtonDisable: true,
        description: "",
        status: "Schedule",
        balance: 0,
      },
      {
        iconTitle: <FileUploadOutlinedIcon />,
        title: "Documents",
        noOfData: 0,
        onStatusClick: () => alert("under progress"),
        isButtonDisable: true,
        description: "",
        status: "Review",
        balance: 0,
      },
      {
        iconTitle: <LocalPrintshopOutlinedIcon />,
        title: "Permits",
        noOfData: 0,
        onStatusClick: () => alert("under progress"),
        isButtonDisable: true,
        description: "",
        status: "Print",
        balance: 0,
      },
    ];
    methods.setValue(
      "myAppPageDetails.summaryBodyData",
      dynamicSummaryBodyData
    );
  }, [isMobile, methods]);



  const formContext = useFormContext<ApplicantHomeData>();

  return {
    methods,
    formContext,
    ApplicantHomeStyle: useApplicantHomeStyle().ApplicantHomeStyle,
  };
};

export default useApplicantHome;
