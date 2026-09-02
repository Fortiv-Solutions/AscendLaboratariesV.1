export interface Product {
  id: string;
  name: string;
  genericName: string;
  brandReference?: string;
  dosageForm: 'Tablets' | 'Capsules' | 'Oral Solution' | 'Injectable' | 'Extended-Release';
  strength: string;
  therapeuticCategory: string;
  ndc: string;
  packaging: string;
  description: string;
  indications: string;
  dosageAdmin: string;
  storage: string;
  safetyWarnings: string;
  isNew?: boolean;
  featured?: boolean;
  hasPI?: boolean;
}

export interface TherapeuticArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
  highlight: string;
}

export interface PressRelease {
  id: string;
  title: string;
  date: string;
  category: 'Regulatory Approval' | 'Facility Expansion' | 'Supply Chain' | 'Corporate' | 'Product Launch';
  summary: string;
  content: string;
  readTime: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  credentials: string;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  type: 'R&D Center' | 'Manufacturing Plant' | 'Distribution Hub' | 'Quality Control Lab';
  capabilities: string[];
  certifications: string[];
  sqft: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  tag: string;
}

export interface Metric {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export type ActivePage = 'home' | 'about' | 'products' | 'quality' | 'operations' | 'news' | 'contact';
