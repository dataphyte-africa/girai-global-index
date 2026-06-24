import { Header } from "@/components/header";
import { getHeaderContent } from "@/content/header";

export async function SiteHeader() {
  const content = await getHeaderContent();
  return <Header content={content} />;
}
