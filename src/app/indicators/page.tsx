import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
import { IndicatorsHero, IndicatorsListSection } from "@/components/indicators";

export const metadata = {
  title: "Indicators | GIRAI Global Index",
  description:
    "The full set of structured indicators used to evaluate how countries govern, regulate, and implement responsible artificial intelligence.",
};

export default function IndicatorsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />

      <main className="flex-1">
        <IndicatorsHero />
        <IndicatorsListSection />
      </main>

      <FooterSection />
    </div>
  );
}
