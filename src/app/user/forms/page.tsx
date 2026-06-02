import { redirect } from "next/navigation";

export default function UserFormsIndexPage() {
  redirect('/user/home-page?section=APPLY');
}
