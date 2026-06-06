import BottomNav from "@/components/home/BottomNav";
import MobileShell from "@/components/layout/MobileShell";
import CommunityPage from "@/components/community/CommunityPage";

export default function CommunityRoute() {
  return (
    <MobileShell>
      <CommunityPage />
      <BottomNav />
    </MobileShell>
  );
}
