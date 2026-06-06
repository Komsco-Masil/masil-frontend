import Header from "@/components/home/Header";
import HeroBanner from "@/components/home/HeroBanner";
import HomeFeedSections from "@/components/home/HomeFeedSections";
import StoreSection from "@/components/home/StoreSection";
import BottomNav from "@/components/home/BottomNav";
import MobileShell from "@/components/layout/MobileShell";

export default function HomePage() {
  return (
    <MobileShell>
      <Header />
      <HeroBanner />
      <StoreSection />
      <HomeFeedSections />
      <BottomNav />
    </MobileShell>
  );
}
