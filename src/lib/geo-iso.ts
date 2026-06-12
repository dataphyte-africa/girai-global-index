/** GeoJSON admin-0 properties (Natural Earth / customgeo). */
export interface GeoAdminProperties {
  iso_a3?: string;
  iso_a2?: string;
  iso_a3_eh?: string;
  iso_a2_eh?: string;
  adm0_a3?: string;
  sov_a3?: string;
  admin?: string;
}

/** Resolve ISO3 from GeoJSON when `iso_a3` is missing or "-99". */
export function resolveGeoIso3(
  props?: GeoAdminProperties | null
): string | undefined {
  if (!props) return undefined;
  const iso3 = props.iso_a3;
  if (iso3 && iso3 !== "-99") return iso3;
  const fallback = props.adm0_a3 ?? props.iso_a3_eh ?? props.sov_a3;
  return fallback && fallback !== "-99" ? fallback : undefined;
}

/** Resolve ISO2 from GeoJSON when `iso_a2` is missing or "-99". */
export function resolveGeoIso2(
  props?: GeoAdminProperties | null
): string | undefined {
  if (!props) return undefined;
  const iso2 = props.iso_a2;
  if (iso2 && iso2 !== "-99") return iso2.toLowerCase();
  const eh = props.iso_a2_eh;
  if (eh && eh !== "-99") return eh.toLowerCase();
  const iso3 = resolveGeoIso3(props);
  return iso3 ? getIso2FromIso3(iso3) : undefined;
}

/** ISO3 → ISO2 for flag images (lowercase). */
export const iso3ToIso2: Record<string, string> = {
  NLD: "nl",
  DEU: "de",
  IRL: "ie",
  GBR: "gb",
  USA: "us",
  EST: "ee",
  ITA: "it",
  FRA: "fr",
  CAN: "ca",
  AUS: "au",
  SGP: "sg",
  JPN: "jp",
  SVN: "si",
  PRT: "pt",
  CHE: "ch",
  ESP: "es",
  ARE: "ae",
  BRA: "br",
  URY: "uy",
  FIN: "fi",
  POL: "pl",
  ROU: "ro",
  CHL: "cl",
  BEL: "be",
  IND: "in",
  UKR: "ua",
  KOR: "kr",
  GRC: "gr",
  LTU: "lt",
  AUT: "at",
  PHL: "ph",
  CHN: "cn",
  VNM: "vn",
  TWN: "tw",
  SVK: "sk",
  HUN: "hu",
  QAT: "qa",
  JOR: "jo",
  BGR: "bg",
  SAU: "sa",
  MYS: "my",
  ZAF: "za",
  NZL: "nz",
  CRI: "cr",
  LVA: "lv",
  PSE: "ps",
  THA: "th",
  COL: "co",
  HRV: "hr",
  DOM: "do",
  MAR: "ma",
  HKG: "hk",
  BEN: "bj",
  ARG: "ar",
  SRB: "rs",
  SEN: "sn",
  KWT: "kw",
  MKD: "mk",
  RWA: "rw",
  GEO: "ge",
  PER: "pe",
  TUN: "tn",
  EGY: "eg",
  MEX: "mx",
  MNE: "me",
  OMN: "om",
  IDN: "id",
  PAK: "pk",
  MDA: "md",
  UZB: "uz",
  KHM: "kh",
  LKA: "lk",
  NAM: "na",
  KAZ: "kz",
  PAN: "pa",
  MNG: "mn",
  KEN: "ke",
  BHR: "bh",
  KGZ: "kg",
  NGA: "ng",
  TJK: "tj",
  NPL: "np",
  JAM: "jm",
  PRY: "py",
  MUS: "mu",
  GHA: "gh",
  ETH: "et",
  AZE: "az",
  GUY: "gy",
  NER: "ne",
  ATG: "ag",
  ZMB: "zm",
  TTO: "tt",
  LBY: "ly",
  ECU: "ec",
  ALB: "al",
  CMR: "cm",
  ZWE: "zw",
  LBN: "lb",
  LCA: "lc",
  ARM: "am",
  BLZ: "bz",
  SLV: "sv",
  DZA: "dz",
  BWA: "bw",
  UGA: "ug",
  BFA: "bf",
  TZA: "tz",
  XKX: "xk",
  BLR: "by",
  TKM: "tm",
  BRB: "bb",
  BTN: "bt",
  MOZ: "mz",
  GAB: "ga",
  LAO: "la",
  BOL: "bo",
  GTM: "gt",
  MWI: "mw",
  TCD: "td",
  LSO: "ls",
  TGO: "tg",
  CIV: "ci",
  SLE: "sl",
  GMB: "gm",
  SOM: "so",
  HND: "hn",
  GIN: "gn",
  HTI: "ht",
  BDI: "bi",
  MLI: "ml",
  COD: "cd",
  LBR: "lr",
  MMR: "mm",
  AFG: "af",
  CAF: "cf",
  ERI: "er",
  SSD: "ss",
  NOR: "no",
  ISR: "il",
  BGD: "bd",
  AGO: "ao",
  COG: "cg",
  DNK: "dk",
  SWE: "se",
  ISL: "is",
  LUX: "lu",
  CZE: "cz",
  TUR: "tr",
  RUS: "ru",
  IRN: "ir",
  IRQ: "iq",
  SYR: "sy",
  YEM: "ye",
  MDG: "mg",
  MDV: "mv",
  FJI: "fj",
  PNG: "pg",
  VUT: "vu",
  SLB: "sb",
  KIR: "ki",
  TUV: "tv",
  WSM: "ws",
  TON: "to",
  PLW: "pw",
  FSM: "fm",
  MHL: "mh",
  NRU: "nr",
  CUB: "cu",
  VEN: "ve",
  NIC: "ni",
  CYP: "cy",
  MLT: "mt",
  AND: "ad",
  MCO: "mc",
  SMR: "sm",
  LIE: "li",
  VAT: "va",
  BRN: "bn",
  TLS: "tl",
  SUR: "sr",
  GNB: "gw",
  GNQ: "gq",
  STP: "st",
  CPV: "cv",
  COM: "km",
  DJI: "dj",
  ESH: "eh",
  GRL: "gl",
  PRI: "pr",
  MAC: "mo",
};

export function getIso2FromIso3(iso3: string): string | undefined {
  return iso3ToIso2[iso3.toUpperCase()];
}

export function flagUrlForIso3(iso3: string, width = 40): string | null {
  const iso2 = getIso2FromIso3(iso3);
  return iso2 ? `https://flagcdn.com/w${width}/${iso2}.png` : null;
}
