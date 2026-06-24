import { FooterSection } from "@/components/footer-section";
import { getFooterContent } from "@/content/footer";

export async function SiteFooter() {
  const content = await getFooterContent();
  return <FooterSection content={content} />;
}
