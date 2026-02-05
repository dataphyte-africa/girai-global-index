import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitcher } from './theme-switcher'
import { YearSwitcher } from './year-switcher'
 const menuItems = [
  {
    label: "Research",
    href: "/",
  },
  {
    label: "Methodology",
    href: "/methodology",
  },
  {
   label: "About",
   href: "/about",
  }, 
  {
   lable: "DataVIZ Challenge",
   href: "/dataviz-challenge",

  }
 ]
export const Header = () => {
  return (
    <div className="sticky top-0 z-[1000] flex flex-row py-5 px-8 w-full bg-background/60 backdrop-blur-xl border-b border-border/40">
      <Image src="/girai-logo.png" alt="logo" width={230} height={40} className="block dark:hidden" />
      <Image src="/girai-logo-white.png" alt="logo" width={230} height={40} className="hidden dark:block" />

      <div className="hidden md:flex flex-row gap-8 items-center mx-auto">
         {menuItems.map((item) => (
          <Link key={item.href} href={item.href} >
            {item.label}
          </Link>
         ))}
      </div>

      <div className="relative z-[1001] flex flex-row gap-4 items-center">
         <YearSwitcher />
         <ThemeSwitcher />
      </div>

    </div>
  )
}
