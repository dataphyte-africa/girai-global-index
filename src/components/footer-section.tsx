import Image from "next/image";
import Link from "next/link";

const results2024Links = [
  { label: "Results", href: "/" },
  { label: "Top takeaways", href: "/takeaways" },
  { label: "Countries", href: "/countries" },
  { label: "Dimensions", href: "/" },
];

const exploreRegionsLinks = [
  { label: "Africa", href: "/regions/africa" },
  { label: "Asia and Oceania", href: "/regions/asia-and-oceania" },
  { label: "The Caribbean", href: "/regions/caribbean" },
  { label: "Europe", href: "/regions/europe" },
  { label: "Middle East", href: "/regions/middle-east" },
  { label: "North America", href: "/regions/northern-america" },
  {
    label: "South and Central America",
    href: "/regions/south-and-central-america",
  },
];

const otherProjectsLinks = [
  { label: "African Observatory on Responsible AI", href: "/" },
  { label: "Global Center on AI Governance", href: "/" },
];

export function FooterSection() {
  return (
    <footer className="w-full bg-[#1a1145] text-white mt-auto">
      {/* Subscribe Section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="bg-[#241960] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          {/* Left - Subscribe text */}
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold italic mb-4">
              Subscribe
            </h2>
            <p className="text-white/70 text-sm max-w-xs">
              Join our mailing list for insights, commentary and analysis on the
              work of the Index
            </p>
          </div>

          {/* Right - Form */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                placeholder="Input Name"
                className="flex-1 bg-transparent border border-white/30 rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors"
              />
              <input
                type="email"
                placeholder="Input Email"
                className="flex-1 bg-transparent border border-white/30 rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors"
              />
            </div>
            <button className="w-full border-2 border-[#7c3aed] hover:bg-[#7c3aed] text-white rounded-md py-2.5 text-sm font-medium transition-colors cursor-pointer">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          {/* Logo & Description */}
          <div className="flex-1 max-w-xs">
            <Image
              src="/girai-logo-white.png"
              alt="GIRAI Logo"
              width={200}
              height={70}
              className="mb-4"
            />
           
            {/* Social Icons */}
            <div className="flex gap-3">
              <SocialIcon href="https://instagram.com" label="Instagram">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" label="LinkedIn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://x.com" label="X">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://facebook.com" label="Facebook">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Link Columns */}
          <div className="flex flex-wrap gap-10 md:gap-16 flex-2">
            {/* Results 2024 */}
            <div className="min-w-[120px]">
              <h3 className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">
                Results 2024
              </h3>
              <ul className="space-y-2.5">
                {results2024Links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore Regions */}
            <div className="min-w-[140px]">
              <h3 className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">
                Explore Regions
              </h3>
              <ul className="space-y-2.5">
                {exploreRegionsLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Projects */}
            <div className="min-w-[140px]">
              <h3 className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">
                Other Projects
              </h3>
              <ul className="space-y-2.5">
                {otherProjectsLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors"
    >
      {children}
    </a>
  );
}
