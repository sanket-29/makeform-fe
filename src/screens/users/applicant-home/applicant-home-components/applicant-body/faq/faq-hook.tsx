"use client";

const useFaqData = () => {
  const contact = "(123) 456-7890";
  const faqs = [
    {
      question: "How do I apply for a permit?",
      answer:
        "Go to the Apply section, select the permit type, and complete the form. You can save and review it before submission.",
    },
    {
      question: "How can I track my application status?",
      answer:
        "Open My Applications to see the current status, fees, and any required actions for each application.",
    },
    {
      question: "What should I do if I need support?",
      answer:
        "Use the Contact section to submit your question or call the support number shown above.",
    },
  ];

  return { contact, faqs, loading: false, error: null };
};

export default useFaqData;
