import { useRouter } from "next/router";
import "@/app/globals.css";
import ProfileCardDetail from "@/components/BrowsePage/ProfileCardDetail.js";
function Profile() {
  const router = useRouter();
  const { id } = router.query; // Access the dynamic part of the URL

  return <ProfileCardDetail id={id} />;
}

export default Profile;
