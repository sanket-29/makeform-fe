import React, { useState } from "react";
import {
  CommonTypography,
  Stack,
  Card,
  CommonButton,
  ConfirmationModal,
} from "@/components/user.components";
import { CardContent, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useContactData from "../contact-hook";
import {
  ContactUsCardData,
} from "@/screens/users/applicant-home/applicant-home.type";

const ContactCard = () => {
  const { submitFormData } = useContactData(); // Use the custom hook
  const [isModalOpen, setModalOpen] = useState<boolean>(false); // State for modal visibility

  // React Hook Form setup
  const { control, handleSubmit, reset } = useForm<ContactUsCardData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
    },
  });

  const onSubmit = async (data: ContactUsCardData) => {
    try {
      await submitFormData(data); // Call API using the hook
      setModalOpen(true); // Open the modal on successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false); // Close the modal
    reset(); // Reset the form data
  };

  return (
    <>
      <Card
        sx={{
          width: { xs: 285, md: 500, sm: 375 },
          borderRadius: 2,
        }}
        elevation={2}
      >
        <CardContent>
          <CommonTypography
            text="Get in touch"
            sx={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#E5E7EB",
              pb: 1,
            }}
          />
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", md: "row", sm: "row" }}
              spacing={2}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Name"
                    {...field}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Email"
                    {...field}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Stack>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Subject"
                  {...field}
                  variant="outlined"
                  size="small"
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="How can we help?"
                  {...field}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              )}
            />
            <CommonTypography
              text={
                <>
                  By contacting us, you agree to the{" "}
                  <span style={{ fontWeight: 900 }}>Terms and Service</span> and{" "}
                  <span style={{ fontWeight: 900 }}>Privacy Policy</span>.
                </>
              }
              sx={{
                fontWeight: "400",
                fontSize: "12px",
                color: "#6c757d",
                pt: 1,
              }}
            />
            <CommonButton
              sx={{
                alignSelf: "flex-start",
                mt: 2,
                width: "101px",
              }}
              BtnTitle="Submit"
              color="primary"
              variant="contained"
              onClick={handleSubmit(onSubmit)} // Trigger form submission
            />
          </Stack>
        </CardContent>
      </Card>

      <ConfirmationModal
        open={isModalOpen}
        modalDescp="Submission Successful"
        successIcon
        okBtn
        onOkClick={handleModalClose}
      />
    </>
  );
};

export default ContactCard;
