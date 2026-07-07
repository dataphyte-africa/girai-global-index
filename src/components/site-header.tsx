import { Header } from "@/components/header";
import { getHeaderContent } from "@/content/header";
import { getIndicatorNames } from "@/content/indicatorPages";

export async function SiteHeader() {
  const [content, indicatorNames] = await Promise.all([
    getHeaderContent(),
    getIndicatorNames(),
  ]);
  return <Header content={content} indicatorNames={indicatorNames} />;
}
