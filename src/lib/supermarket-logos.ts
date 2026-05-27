import type { SupermarketId } from "@/lib/supermarketPricing";

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

export const supermarketLogos: Record<SupermarketId, string> = {
  tesco: favicon("tesco.com"),
  sainsburys: favicon("sainsburys.co.uk"),
  asda: favicon("asda.com"),
  waitrose: favicon("waitrose.com"),
  morrisons: favicon("morrisons.com"),
  aldi: favicon("aldi.co.uk"),
  lidl: favicon("lidl.co.uk"),
  booths: favicon("booths.co.uk"),
  ocado: favicon("ocado.com"),
};
