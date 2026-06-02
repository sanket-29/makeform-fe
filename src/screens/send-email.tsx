import React, { useState, useEffect } from "react";
import OwnerConfirmationModal from "../components/OwnerConfirmationModal";
import FeeCalculatedModal from "../components/FeeCalculatedModal";
import CslConfirmationModal from "../components/CslConfirmationModal";
import { BASE_URL } from "@/src/config/api";

// Application data interface (based on backend model)
interface ApplicationData {
  _id: string;
  formType?: string;
  data: Record<string, unknown>;
  rawData?: unknown[];
  responseId?: string;
  formId?: string;
  formCode?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to find field value from data
const getFieldValue = (data: Record<string, unknown>, possibleKeys: string[]): string => {
  for (const key of possibleKeys) {
    const foundKey = Object.keys(data).find(k => k.toLowerCase().includes(key.toLowerCase()));
    if (foundKey && data[foundKey]) {
      return String(data[foundKey]);
    }
  }
  return "";
};

// Generate email template based on application data
const generateEmailTemplate = (type: string, appData: ApplicationData) => {
  const data = appData.data || {};
  
  const ownerName = getFieldValue(data, ["owner_name", "ownername", "owner", "property_owner"]);
  const ownerEmail = getFieldValue(data, ["owner_email", "owneremail", "email", "owner_email_address"]);
  const propertyAddress = getFieldValue(data, ["property_address", "address", "site_address", "location", "street_address"]);
  const applicantName = getFieldValue(data, ["applicant_name", "applicantname", "applicant", "name", "first_name"]);
  // Use formType from application data, fallback to data field
  const permitType = appData.formType || getFieldValue(data, ["permit_type", "permittype", "permit", "type", "form_type"]);
  const applicationDate = appData.createdAt ? new Date(appData.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  const departmentName = "Building Department";
  const authorizationLink = `https://permiteyes.online/anytown/building/ownerauthorization.php?ApplicationId=${appData._id}`;

  switch (type) {
    case "Owner Confirmation":
      return {
        to: ownerEmail,
        cc: "",
        subject: `Owner Confirmation`,
        message: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <p>Dear ${ownerName || "Owner"},</p>
            <p>We have received an application for permit for your property whose details are listed below.</p>
            <p><strong>Address:</strong> ${propertyAddress || "N/A"}</p>
            <p><strong>Applicant Name:</strong> ${applicantName || "N/A"}</p>
            <p><strong>Permit Type:</strong> ${permitType || "N/A"}</p>
            <p><strong>Date of Application:</strong> ${applicationDate}</p>
            <p>Please authorize the above details by submitting the authorization form online by visiting the following link:</p>
            <p>
              <a href="${authorizationLink}">${authorizationLink}</a>
            </p>
            <p>Please note that this application will not be processed unless and until your authorization is received.</p>
            <p style="margin: 0 0 18px 0;">${departmentName}</p>
            <p style="margin: 0;">Town Of Anytown</p>
          </div>
        `,
      };

    case "Fee Calculated":
      return {
        to: ownerEmail,
        cc: "",
        subject: `Fee Payment Notice from Anytown Building Department`,
        message: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <p>Dear ${ownerName || "Owner"},</p>
            <p>Fee for your application has been calculated. You can now login to your account and pay the fee.</p>
            <table style="width:100%; border-collapse:collapse; border:1px solid black; margin:12px 0 18px 0;">
              <thead>
                <tr style="background:#f7fafc;">
                  <th style="border:1px solid black; padding:8px; text-align:left">Application No.</th>
                  <th style="border:1px solid black; padding:8px; text-align:left">Type</th>
                  <th style="border:1px solid black; padding:8px; text-align:left">Name</th>
                  <th style="border:1px solid black; padding:8px; text-align:left">Site Address</th>
                  <th style="border:1px solid black; padding:8px; text-align:left">Date</th>
                  <th style="border:1px solid black; padding:8px; text-align:left">Amount Payable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border:1px solid black; padding:8px">${appData.formCode || "N/A"}</td>
                  <td style="border:1px solid black; padding:8px">${permitType || "N/A"}</td>
                  <td style="border:1px solid black; padding:8px">${applicantName || "N/A"}</td>
                  <td style="border:1px solid black; padding:8px">${propertyAddress || "N/A"}</td>
                  <td style="border:1px solid black; padding:8px">${applicationDate}</td>
                  <td style="border:1px solid black; padding:8px">$0.00</td>
                </tr>
              </tbody>
            </table>
            <p>URL : <a href="https://permiteyes.online/anytown/loginuser.php" style="color:#0d6efd; text-decoration:underline">https://permiteyes.online/anytown/loginuser.php</a></p>
            <p>Thank you.<br/>Town Of Anytown</p>
          </div>
        `,
      };

    case "CSL Confirmation":
      return {
        to: ownerEmail,
        cc: "",
        subject: `CSL Confirmation`,
        message: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <p style="margin: 0 0 18px 0;">I As Licensed Construction Supervisor, you will be responsible for the work done at ${propertyAddress || "N/A"} for ${permitType || "Home Improvement Contractor"}.</p>

            <p style="margin: 0 0 18px 0;">Please authorize the above details by submitting the authorization form online by visiting the following link:</p>

            <p style="margin: 0 0 18px 0;">
              <a href="${authorizationLink}">${authorizationLink}</a>
            </p>

            <p style="margin: 0 0 18px 0;">Please note that this application will not be processed unless and until your authorization is received.</p>

            <p style="margin: 0 0 18px 0;">${departmentName}</p>
            <p style="margin: 0;">Town Of Anytown</p>
          </div>
        `,
      };

    default:  
      return {
        to: ownerEmail,
        cc: "",
        subject: `Application Update - ${permitType || "Permit Application"}`,
        message: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <p>Dear ${ownerName || "Owner"},</p>
            <p>You have a new update regarding your permit application.</p>
            <p><strong>Address:</strong> ${propertyAddress || "N/A"}</p>
            <p><strong>Permit Type:</strong> ${permitType || "N/A"}</p>
            <p><strong>Application Date:</strong> ${applicationDate}</p>
            <p>Building Department<br/>${departmentName}</p>
          </div>
        `,
      };
  }
};

export default function SendEmail({ applicationId }: { applicationId: string }) {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<{ to: string; cc?: string; subject: string; message: string } | null>(null);

  // Fetch application data when component mounts
  useEffect(() => {
    const fetchApplicationData = async () => {
      console.log("[SendEmail] applicationId:", applicationId);
      if (!applicationId) return;
      try {
        const url = `${BASE_URL}/api/form/application/${applicationId}`;
        console.log("[SendEmail] Fetching:", url);
        const response = await fetch(url);
        const result = await response.json();
        console.log("[SendEmail] API result:", result);
        if (result.success && result.application) {
          setApplicationData(result.application);
        } else {
          console.error("Failed to fetch application:", result.message);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };
    fetchApplicationData();
  }, [applicationId]);

  const buttons = [
    "Owner Confirmation",
    "Fee Calculated",
    "CSL Confirmation",
  ];

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
    if (!applicationData) {
      // Instead of alert, show a loader message (set a loading state)
      setShowLoader(true);
      return;
    }
    if (button === "Owner Confirmation" || button === "Fee Calculated" || button === "CSL Confirmation") {
      // Generate template from application data
      const template = generateEmailTemplate(button, applicationData);
      setEmailTemplate(template);
      setModalOpen(true);
    }
  };

  // Handler for sending mail via server API
  const handleSendServer = async (emailData: { to: string; cc?: string; subject: string; message: string }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Email sent successfully!");
        setModalOpen(false);
        setActiveButton(null);
        setEmailTemplate(null);
      } else {
        alert(`Failed to send email: ${result.error || result.message}`);
      }
    } catch (error) {
      console.error("Email send error:", error);
      alert("Error sending email. Please try again.");
    }
  };

  const [showLoader, setShowLoader] = useState(false);
  const selectedTemplate = emailTemplate;

  useEffect(() => {
    if (applicationData && showLoader) {
      setShowLoader(false);
    }
  }, [applicationData, showLoader]);

  return (
    <div className="w-full">
      <div className="pb-1 font-medium text-lg">Send Email</div>
      {showLoader && (
        <div style={{ color: '#22d3ee', margin: '10px 0', fontWeight: 500 }}>
          Loading application data, please wait...
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {buttons.map((button) => {
          const isSelected = activeButton === button;
          return (
            <button
              key={button}
              type="button"
              onClick={() => handleButtonClick(button)}
              style={{
                padding: "6px 0",
                borderRadius: "7px",
                border: isSelected ? "2px solid #22d3ee" : "1px solid #334155",
                background: isSelected ? "#0f172a" : "#18181b",
                color: isSelected ? "#22d3ee" : "#cbd5e1",
                fontSize: "0.83rem",
                cursor: "pointer",
                transition: "all 0.2s",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "0.01em",
                minHeight: "28px",
                minWidth: "0",
              }}
            >
              {isSelected && (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ marginRight: 5 }}
                >
                  <path
                    d="M7.5 10.8333L9.16667 12.5L12.5 9.16667"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="9"
                    stroke="#22d3ee"
                    strokeWidth="2"
                  />
                </svg>
              )}
              {button}
            </button>
          );
        })}
      </div>
      {activeButton === "Owner Confirmation" && selectedTemplate && (
        <OwnerConfirmationModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setActiveButton(null);
          }}
          to={selectedTemplate.to}
          cc={selectedTemplate.cc}
          subject={selectedTemplate.subject}
          message={selectedTemplate.message}
          onSendServer={handleSendServer}
        />
      )}
      {activeButton === "Fee Calculated" && selectedTemplate && (
        <FeeCalculatedModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setActiveButton(null);
          }}
          to={selectedTemplate.to}
          cc={selectedTemplate.cc}
          subject={selectedTemplate.subject}
          message={selectedTemplate.message}
          onSendServer={handleSendServer}
        />
      )}
      {activeButton === "CSL Confirmation" && selectedTemplate && (
        <CslConfirmationModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setActiveButton(null);
          }}
          to={selectedTemplate.to}
          cc={selectedTemplate.cc}
          subject={selectedTemplate.subject}
          message={selectedTemplate.message}
          onSendServer={handleSendServer}
        />
      )}
    </div>
  );
}
