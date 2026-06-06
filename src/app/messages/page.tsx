import BottomNav from "@/components/home/BottomNav";
import MobileShell from "@/components/layout/MobileShell";
import MessagesPage from "@/components/messages/MessagesPage";

export default function MessagesRoute() {
  return (
    <MobileShell>
      <MessagesPage />
      <BottomNav />
    </MobileShell>
  );
}
