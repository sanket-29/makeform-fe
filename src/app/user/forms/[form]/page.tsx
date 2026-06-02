import { notFound } from "next/navigation";
import ApplicantHome from "@/screens/users/applicant-home/applicant-home.screen";

const formMap: Record<string, string> = {
  commercial: "ty0lt90",
  electrical: "zbkwm3g",
  gas: "jtt6wwc",
  plumbing: "5pft51b",
  residential: "wglvshz",
};

interface UserFormPageProps {
  params: Promise<{
    form: string;
  }>;
}

export default async function UserFormPage({ params }: UserFormPageProps) {
  const { form } = await params;
  const formKey = form?.toLowerCase();
  const iframeId = formMap[formKey];

  if (!iframeId) {
    notFound();
  }

  return (
    <ApplicantHome
      customBody={
        <div className="bg-white rounded-xl overflow-hidden">
          <iframe
            src={`https://in.makeforms.co/${iframeId}/`}
            className="w-full"
            style={{ height: "700px" }}
          />
        </div>
      }
    />
  );
}
