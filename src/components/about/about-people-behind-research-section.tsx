const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const PILL_TEXT = "#333333";

/** Placeholder contributor names — replace with real researchers when available. */
const CONTRIBUTORS = [
  "Amara Okafor",
  "Luca Tiziana",
  "Zacharie Auguste",
  "Ulrike Dora",
  "James Whitmore",
  "Priya Sharma",
  "Henrik Lindqvist",
  "Fatima Al-Hassan",
  "Marco Benedetti",
  "Yuki Tanaka",
  "Elena Vasquez",
  "Samuel Okonkwo",
  "Ingrid Bergstrom",
  "Raj Patel",
  "Chioma Eze",
  "Thomas Müller",
  "Aisha Rahman",
  "Diego Fernández",
  "Nadia Petrov",
  "Kwame Asante",
  "Sofia Andersson",
  "Oliver Chen",
  "Leila Mansouri",
  "Benjamin Clarke",
  "Mei Lin",
  "André Dubois",
  "Hannah O'Brien",
  "Ibrahim Saleh",
  "Clara Novak",
  "Daniel Kim",
  "Rosa Martinez",
  "Emmanuel Ndiaye",
  "Freya Johansson",
  "Michael Torres",
  "Anika Desai",
  "Pierre Laurent",
  "Grace Mbeki",
  "Jonas Eriksson",
  "Zara Haddad",
  "William Fraser",
  "Nkechi Adewale",
  "Mateo Silva",
  "Helena Kowalski",
  "David Osei",
  "Yasmin Farouk",
  "Robert Hughes",
  "Camille Rousseau",
  "Isaac Mensah",
  "Anna Kowalczyk",
  "Omar Hassan",
] as const;

function ContributorPill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-normal shadow-[0_1px_2px_rgba(26,26,46,0.04)]">
      <span style={{ color: PILL_TEXT }}>{name}</span>
    </span>
  );
}

/**
 * Researchers and contributors — centered heading with a wrapping pill cloud.
 */
export function AboutPeopleBehindResearchSection() {
  return (
    <section className="w-full bg-[#F9FAFB] px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>The </span>
            <span style={{ color: PURPLE }}>People</span>
            <span style={{ color: HEADING_DARK }}> Behind the Research</span>
          </h2>

          <p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            Recognising the researchers, experts, and contributors who supported
            the development and validation of GIRAI.
          </p>
        </header>

        <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12 md:gap-3.5">
          {CONTRIBUTORS.map((name) => (
            <ContributorPill key={name} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
