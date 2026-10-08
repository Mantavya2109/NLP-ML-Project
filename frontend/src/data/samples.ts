export interface NewsSample {
  id: string;
  title: string;
  category: string;
  sourceType: string;
  text: string;
}

export const REAL_NEWS_SAMPLES: NewsSample[] = [
  {
    id: 'real-1',
    title: 'U.S. Congress Approves Bipartisan Infrastructure Investment Legislation',
    category: 'Politics & Policy',
    sourceType: 'Reuters Style Reporting',
    text: `WASHINGTON (Reuters) - The U.S. Senate on Thursday approved a comprehensive government funding and infrastructure investment bill, averting a shutdown and allocating billions for national highways, educational grants, and clean energy modernization. Lawmakers from both parties praised the bipartisan compromise following weeks of negotiations. Congressional leaders confirmed that the measure will be sent to the president's desk for signature before the end of the fiscal quarter.`,
  },
  {
    id: 'real-2',
    title: 'European Central Bank Maintains Benchmark Interest Rates Amid Inflation Cooldown',
    category: 'Global Economy',
    sourceType: 'Financial Journalism',
    text: `FRANKFURT (Reuters) - The European Central Bank kept its key benchmark interest rates unchanged on Thursday, citing steady progress toward its medium-term inflation target of two percent. Policymakers noted that economic growth across the eurozone had shown stability despite persistent supply chain adjustments and volatile energy markets. The central bank emphasized that future monetary policy decisions would remain data-dependent based on incoming economic indicators.`,
  },
  {
    id: 'real-3',
    title: 'NASA Perseverance Rover Identifies Ancient Sedimentary Riverbed on Mars',
    category: 'Science & Aerospace',
    sourceType: 'Scientific Dispatch',
    text: `WASHINGTON (Reuters) - Scientists analyzing geological data from NASA's Perseverance rover have confirmed the discovery of coarse sedimentary rock layers indicating a deep, fast-flowing river system on the Martian surface billions of years ago. The findings, published in the journal Nature, provide compelling evidence that water once shaped the Martian landscape in the Jezero Crater region and could preserve microscopic traces of ancient microbial life.`,
  },
  {
    id: 'real-4',
    title: 'International Tech Summit Concludes with 45 Nations Adopting AI Safety Standards',
    category: 'Technology & Governance',
    sourceType: 'Diplomatic Press',
    text: `GENEVA (Reuters) - Representatives from 45 countries concluded a high-level technology summit in Geneva on Friday by signing an international framework governing artificial intelligence safety benchmarks and risk mitigation protocols. The agreement establishes joint testing procedures for advanced machine learning models and establishes a multilateral notification channel for cybersecurity vulnerabilities and synthetic media detection.`,
  },
  {
    id: 'real-5',
    title: 'Western Regional Energy Grid Achieves Record Renewable Power Generation',
    category: 'Energy & Climate',
    sourceType: 'Environmental News',
    text: `DENVER (Reuters) - Solar, wind, and hydroelectric sources generated a record 68 percent of total electrical output across the western regional power grid during the second quarter, utility operators announced in their quarterly reliability report. The increase was driven by newly commissioned photovoltaic farms and favorable reservoir conditions throughout the Pacific Northwest and Rocky Mountain regions.`,
  },
];

export const FAKE_NEWS_SAMPLES: NewsSample[] = [
  {
    id: 'fake-1',
    title: 'Secret Subterranean Bunker Network Exposed Beneath Central Park by Whistleblowers',
    category: 'Conspiracy & Viral',
    sourceType: 'Fabricated Sensationalism',
    text: `SHOCKING DISCOVERY: Secret whistleblowers have exposed an underground military facility constructed beneath Central Park! Mainstream media is totally blacking out this unprecedented catastrophe to protect globalist elites. Classified blueprints leaked on dark web forums prove hundreds of political figures are secretly relocating to fortified subterranean luxury chambers! Share this before it gets deleted!`,
  },
  {
    id: 'fake-2',
    title: 'Globalist Cabal Replacing Municipal Water Supplies with Neural Tracking Particles',
    category: 'Misinformation Alert',
    sourceType: 'Paranoid Propaganda',
    text: `BREAKING EMERGENCY: Independent investigators have uncovered secret chemical manifests showing that municipal drinking water in major metropolitan cities is being laced with synthetic nano-tracking particles. Insiders claim these particles synchronize with cellular towers to manipulate brainwave frequencies and enforce digital compliance. Forward this emergency warning to your family and drink only distilled water!`,
  },
  {
    id: 'fake-3',
    title: 'Astronomers Accused of Faking Lunar Eclipse Using Orbital Hologram Drones',
    category: 'Viral Hoax',
    sourceType: 'Fabricated Science Claim',
    text: `UNBELIEVABLE TRUTH REVEALED: Rogue astrophysicists have dumped classified files proving that recent lunar and solar eclipses were entirely simulated using high-altitude orbital hologram projectors. The fraudulent celestial events were allegedly staged as global psychological operations to distract the general public from classified atmospheric geoengineering experiments in the upper stratosphere!`,
  },
  {
    id: 'fake-4',
    title: 'Leaked Military Memos Order Mandatory 10-Day Worldwide Internet Blackout',
    category: 'Panic & Hoax',
    sourceType: 'Fabricated Emergency',
    text: `CONFIRMED INTEL: Top secret military memos leaked this morning order all telecommunication providers to initiate a mandatory 10-day global communications blackout starting next Friday. Financial systems will be wiped and digital bank accounts frozen during the reset. Stock up on emergency rations, gold bullion, and cash immediately before the grid goes permanently dark!`,
  },
  {
    id: 'fake-5',
    title: 'Forbidden Jungle Root Proven to Cure All Known Viral Illnesses in 24 Hours',
    category: 'Health Misinformation',
    sourceType: 'Medical Fake News',
    text: `DOCTORS SILENCED ACROSS THE WORLD: Big pharmaceutical corporations were caught in a secret conspiracy to suppress a miracle jungle root that completely cures all respiratory viruses in under 24 hours with zero medical side effects. Corrupt health regulators are raiding natural health clinics to confiscate the plant extracts. Spread the word before this life-saving secret is erased from the internet forever!`,
  },
];
