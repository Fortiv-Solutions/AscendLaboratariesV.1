import { PressRelease, LeadershipMember, Facility, Milestone, Metric } from '../types';

export const KEY_METRICS: Metric[] = [
  {
    value: 300,
    suffix: '+',
    label: 'Formulation Approvals',
    description: 'Comprehensive generic and specialty portfolio spanning essential therapies'
  },
  {
    value: 50,
    suffix: '+',
    label: 'States & US Markets Served',
    description: 'Reliable nationwide distribution connecting health systems and pharmacies'
  },
  {
    value: 25,
    suffix: '+',
    label: 'Years Industry Heritage',
    description: 'Decades of scientific precision, regulatory rigor, and patient dedication'
  },
  {
    value: 99.8,
    suffix: '%',
    label: 'Batch Release Quality Index',
    description: 'Uncompromising analytical testing adhering to strict cGMP & FDA standards'
  }
];

export const PRESS_RELEASES: PressRelease[] = [
  {
    id: 'pr-fda-approval-cardio',
    title: 'Ascend Laboratories Receives FDA Final Approval for Novel Generic Solid Dosage Cardiovascular Line',
    date: 'February 18, 2026',
    category: 'Regulatory Approval',
    summary: 'The United States FDA grants Abbreviated New Drug Application (ANDA) approval for an extended-release anti-hypertensive medication.',
    content: 'Ascend Laboratories today announced that it has received final approval from the U.S. Food and Drug Administration (FDA) for its Abbreviated New Drug Application (ANDA) for an extended-release formulation within the cardiovascular segment. The commercial launch will commence immediately through Ascend’s direct-to-wholesaler distribution network, reinforcing the company’s commitment to high-barrier generic access.',
    readTime: '3 min read'
  },
  {
    id: 'pr-facility-expansion-nj',
    title: 'Ascend Laboratories Completes Multi-Million Dollar Modernization of Advanced Analytical Testing Laboratory',
    date: 'January 14, 2026',
    category: 'Facility Expansion',
    summary: 'Investment boosts high-performance liquid chromatography (HPLC) and microbiological testing capabilities by 45%.',
    content: 'As part of our continuous investment in quality infrastructure, Ascend Laboratories has finalized the expansion of its state-of-the-art analytical testing center in New Jersey. The facility features next-generation mass spectrometry, automated dissolution testing suites, and real-time environmental monitoring systems designed to exceed cGMP and USP standards.',
    readTime: '4 min read'
  },
  {
    id: 'pr-supply-chain-resilience',
    title: 'Ascend Laboratories Announces Strategic Multi-Site Redundancy Program to Safeguard US Drug Supply',
    date: 'November 20, 2025',
    category: 'Supply Chain',
    summary: 'Initiative establishes dual-sourcing for critical active pharmaceutical ingredients (APIs) and finished dosage forms.',
    content: 'In response to growing demand for resilient drug supply in US hospitals and community pharmacies, Ascend Laboratories has implemented a proactive multi-site redundancy strategy. This operational framework guarantees uninterrupted commercial availability of critical antibiotics, central nervous system therapies, and cardiac medications.',
    readTime: '3 min read'
  },
  {
    id: 'pr-commercial-launch-cns',
    title: 'Ascend Laboratories Expands Neurology Portfolio with Commercial Launch of Duloxetine DR Capsules',
    date: 'September 08, 2025',
    category: 'Product Launch',
    summary: 'Expansion addresses nationwide supply shortages with high-quality enteric pellet technology.',
    content: 'Ascend Laboratories has initiated nationwide commercial shipments of Duloxetine Delayed-Release Capsules in 20 mg, 30 mg, and 60 mg presentations. Manufactured under rigorous quality controls, the product provides healthcare providers with a dependable therapeutic alternative.',
    readTime: '2 min read'
  }
];

export const LEADERSHIP: LeadershipMember[] = [
  {
    id: 'lead-1',
    name: 'Dr. Michael Vance, Ph.D.',
    role: 'Chief Executive Officer & President',
    bio: 'Over 28 years of pharmaceutical leadership across global supply chain management, commercial operations, and regulatory strategy in US generic markets.',
    credentials: 'Ph.D. in Pharmaceutical Sciences, Rutgers University'
  },
  {
    id: 'lead-2',
    name: 'Elena Rostova, M.S., RAC',
    role: 'Executive VP, Regulatory Affairs & Quality Assurance',
    bio: 'Former FDA compliance liaison specializing in cGMP validation, ANDA submissions, and quality systems oversight across sterile and solid oral dose facilities.',
    credentials: 'M.S. in Regulatory Toxicology, Johns Hopkins'
  },
  {
    id: 'lead-3',
    name: 'David K. Reynolds',
    role: 'Senior VP, Commercial Operations & Supply Chain',
    bio: 'Leads nationwide logistics, customer partnerships, and trade relations with top US wholesalers, health systems, and retail pharmacy networks.',
    credentials: 'MBA, Harvard Business School'
  },
  {
    id: 'lead-4',
    name: 'Dr. Ananya Iyer, Ph.D.',
    role: 'VP, Pharmaceutical R&D & Formulation Science',
    bio: 'Pioneered advanced oral extended-release matrix formulations and bioequivalence strategies for complex generic medications.',
    credentials: 'Ph.D. in Industrial Pharmacy, Purdue University'
  }
];

export const FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'US Corporate Headquarters & Quality Operations',
    location: 'Bridgewater, New Jersey, USA',
    type: 'Quality Control Lab',
    capabilities: ['cGMP Analytical Testing', 'Stability Studies', 'Regulatory Submissions', 'Pharmacovigilance Hub'],
    certifications: ['FDA Registered', 'DEA Schedule II-V', 'ISO/IEC 17025'],
    sqft: '85,000 sq. ft.'
  },
  {
    id: 'fac-2',
    name: 'Advanced Solid Dosage Formulation Facility',
    location: 'Montgomery County, Pennsylvania, USA',
    type: 'Manufacturing Plant',
    capabilities: ['High-Shear Wet Granulation', 'Fluid Bed Drying', 'Automated Tableting', 'Enteric Coating'],
    certifications: ['FDA cGMP Compliant', 'OSHA VPP Star', 'State Board of Pharmacy Licensed'],
    sqft: '240,000 sq. ft.'
  },
  {
    id: 'fac-3',
    name: 'Central Logistics & Cold-Chain Distribution Center',
    location: 'Columbus, Ohio, USA',
    type: 'Distribution Hub',
    capabilities: ['Climate-Controlled Storage', 'Full Serialization (DSCSA)', 'Next-Day Hospital Fulfillment', 'EDI Automated Dispatch'],
    certifications: ['VAWD / NABP Accredited', 'DEA Registered', 'ISO 9001:2015'],
    sqft: '320,000 sq. ft.'
  },
  {
    id: 'fac-4',
    name: 'Specialty Sterile & R&D Development Center',
    location: 'Research Triangle Park, North Carolina, USA',
    type: 'R&D Center',
    capabilities: ['Aseptic Fill-Finish', 'Lyophilization', 'Particle Characterization', 'Analytical Method Validation'],
    certifications: ['FDA Inspected', 'cGMP Grade A/B Cleanrooms'],
    sqft: '110,000 sq. ft.'
  }
];

export const MILESTONES: Milestone[] = [
  {
    year: '2007',
    title: 'Founding & US Market Entry',
    description: 'Ascend was established with a singular vision: to deliver affordable, rigorously compliant generic pharmaceuticals to American patients.',
    tag: 'Foundation'
  },
  {
    year: '2012',
    title: 'Commercial Scale & First 50 ANDAs',
    description: 'Surpassed 50 commercial ANDA approvals and built direct trade relationships with top tier-1 pharmaceutical wholesalers.',
    tag: 'Expansion'
  },
  {
    year: '2018',
    title: 'State-of-the-Art Distribution Hub',
    description: 'Commissioned a 320,000 sq. ft. automated logistics and cold-chain facility in the Midwest with full DSCSA serialization.',
    tag: 'Infrastructure'
  },
  {
    year: '2022',
    title: 'Sterile & Complex Injectables Pipeline',
    description: 'Diversified beyond solid oral dosage into complex delayed-release matrices and specialized sterile institutional products.',
    tag: 'Innovation'
  },
  {
    year: '2026',
    title: 'Next-Generation cGMP Modernization',
    description: 'Reached 300+ approved formulations with continuous multi-site supply chain redundancy and digital analytical automation.',
    tag: 'Current Era'
  }
];
