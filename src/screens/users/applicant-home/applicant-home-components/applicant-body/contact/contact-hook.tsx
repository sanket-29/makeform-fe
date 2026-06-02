"use client";
import { ContactUsCardData } from "../../../applicant-home.type";
import useApplicantHome from "../../../applicant-home.hook";

const useContactData = () => {
  const { methods } = useApplicantHome();
  const { watch } = methods;
  const ContactUsBodyData = watch("ContactUsDetails.ContactUsBodyData");

  const submitFormData = async (data: ContactUsCardData) => {
    console.log("Contact form submitted (mock):", data);
    return { success: true };
  };

  return {
    ContactUsBodyData,
    loading: false,
    error: null,
    submitFormData,
  };
};

export default useContactData;
