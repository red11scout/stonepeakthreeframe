/**
 * Logo mapping for portfolio companies
 * Maps company names to their logo filenames
 */

export const COMPANY_LOGOS: Record<string, string> = {
  "Cologix": "/logos/cologix.png",
  "Astound Broadband": "/logos/astound-broadband.png",
  "CoreSite (JV)": "/logos/coresite.png",
  "Digital Edge": "/logos/digital-edge.png",
  "euNetworks": "/logos/eunetworks.png",
  "DELTA Fiber": "/logos/delta-fiber.png",
  "Cirion Technologies": "/logos/cirion-technologies.png",
  "Cellnex Nordics": "/logos/cellnex-nordics.png",
  "Extenet": "/logos/extenet.png",
  "Intrado": "/logos/intrado.png",
  "GTA TeleGuam": "/logos/gta-teleguam.png",
  "Xplore Inc": "/logos/xplore-inc.png",
  "Philippines Tower JVCo": "/logos/philippines-tower-jvco.png",
  "Princeton Digital Group": "/logos/princeton-digital-group.png",
  "Montera Infrastructure": "/logos/montera-infrastructure.png",
  "Clean Energy Fuels": "/logos/clean-energy-fuels.png",
  "Venture Global Calcasieu Pass": "/logos/venture-global.png",
  "Oryx Midstream": "/logos/oryx-midstream.png",
  "Evolve Transition Infrastructure": "/logos/evolve-transition-infrastructure.png",
  "Peak Energy": "/logos/peak-energy.png",
  "Synera Renewable Energy": "/logos/synera-renewable-energy.png",
  "Coastal Virginia Offshore Wind": "/logos/coastal-virginia-offshore-wind.png",
  "Maas Energy Works": "/logos/maas-energy-works.png",
  "KAPS": "/logos/kaps.png",
  "AGP Sustainable Real Assets": "/logos/agp-sustainable-real-assets.png",
  "Stonepeak Island Transition": "/logos/stonepeak-island-transition.png",
  "Kingdom Energy Storage": "/logos/kingdom-energy-storage.png",
  "TerraWind Renewables": "/logos/terrawind-renewables.png",
  "Orsted US Onshore Wind": "/logos/orsted-us-onshore-wind.png",
  "IOR": "/logos/ior.png",
  "JouleTerra": "/logos/jouleterra.png",
  "Longview Infrastructure": "/logos/longview-infrastructure.png",
  "Lestari Cooling Energy": "/logos/lestari-cooling-energy.png",
  "Pelican Pipeline": "/logos/pelican-pipeline.png",
  "Repsol US Renewables": "/logos/repsol-us-renewables.png",
  "WahajPeak": "/logos/wahajpeak.png",
  "Woodside Louisiana LNG": "/logos/woodside-louisiana-lng.png",
  "Lineage": "/logos/lineage.png",
  "TRAC Intermodal": "/logos/trac-intermodal.png",
  "Textainer": "/logos/textainer.png",
  "ATSG": "/logos/atsg.png",
  "The AA": "/logos/the-aa.png",
  "Emergent Cold LatAm": "/logos/emergent-cold-latam.png",
  "Seapeak": "/logos/seapeak.png",
  "Logistec": "/logos/logistec.png",
  "GeelongPort": "/logos/geelongport.png",
  "Rinchem": "/logos/rinchem.png",
  "Equalbase": "/logos/equalbase.png",
  "Forgital": "/logos/forgital.png",
  "Akumin": "/logos/akumin.png",
  "Arvida": "/logos/arvida.png",
  "Inspired Education Group": "/logos/inspired-education-group.png",
  "Cosmopolitan Las Vegas": "/logos/cosmopolitan-las-vegas.png",
  "Stonepeak Aviation Platform": "/logos/stonepeak-aviation-platform.png",
  "Stonepeak Infrastructure Logistics Platform": "/logos/stonepeak-infrastructure-logistics-platform.png",
};

/**
 * Get logo URL for a company name
 * Returns undefined if no logo is found
 */
export function getCompanyLogo(companyName: string): string | undefined {
  // Try exact match first
  if (COMPANY_LOGOS[companyName]) {
    return COMPANY_LOGOS[companyName];
  }
  
  // Try case-insensitive match
  const lowerName = companyName.toLowerCase();
  for (const [name, logo] of Object.entries(COMPANY_LOGOS)) {
    if (name.toLowerCase() === lowerName) {
      return logo;
    }
  }
  
  // Try partial match
  for (const [name, logo] of Object.entries(COMPANY_LOGOS)) {
    if (name.toLowerCase().includes(lowerName) || lowerName.includes(name.toLowerCase())) {
      return logo;
    }
  }
  
  return undefined;
}

/**
 * Company Logo component props
 */
export interface CompanyLogoProps {
  companyName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
