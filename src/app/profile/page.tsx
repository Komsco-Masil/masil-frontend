import BottomNav from "@/components/home/BottomNav";
import MobileShell from "@/components/layout/MobileShell";
import ProfilePage from "@/components/profile/ProfilePage";

export default function ProfileRoute() {
  return (
    <MobileShell>
      <ProfilePage />
      <BottomNav />
    </MobileShell>
  );
}
