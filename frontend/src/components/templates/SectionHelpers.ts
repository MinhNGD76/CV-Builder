import { type Section } from '../../api/gateway';

// Define a type for structured content
type StructuredContent = Record<string, unknown> | string[] | null;

// Parse structured content from a section
export const parseStructuredContent = (content: string): StructuredContent => {
  try {
    if (!content) return null;
    return JSON.parse(content);
  } catch {
    // Ignore the error, just return null for invalid JSON
    return null;
  }
};

// Extract contact information from personal section
export const extractContactInfo = (personalInfo: Section): {
  phone: string;
  email: string;
  address: string;
  title: string;
  website: string;
  photo: string;
  bio: string;
} => {
  const defaultInfo = {
    phone: '',
    email: '',
    address: '',
    title: '',
    website: '',
    photo: '',
    bio: ''
  };

  try {
    if (!personalInfo?.content) return defaultInfo;
    
    const parsed = parseStructuredContent(personalInfo.content);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return defaultInfo;
    
    return {
      ...defaultInfo,
      ...Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>)
          .filter(([value]) => typeof value === 'string')
          .map(([key, value]) => [key, value as string])
      )
    };
  } catch {
    return defaultInfo;
  }
};

// Safely extract a field from structured content
export const extractField = (content: string, field: string, fallback: string = ''): string => {
  try {
    const parsed = parseStructuredContent(content);
    if (!parsed || typeof parsed !== 'object') return fallback;
    if (Array.isArray(parsed)) return fallback;
    
    return (parsed as Record<string, unknown>)[field] as string || fallback;
  } catch {
    return fallback;
  }
};

// Check if content is a JSON array
export const isJsonArray = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed);
  } catch {
    return false;
  }
};

// Check if content is JSON object
export const isJsonObject = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
  } catch {
    return false;
  }
};

// Convert a section to a time-based entry (for education, experience, etc.)
export const toTimeEntry = (section: Section): {
  title: string;
  organization: string;
  dateRange: string;
  location: string;
  description: string;
} => {
  const defaultEntry = {
    title: section.title,
    organization: '',
    dateRange: '',
    location: '',
    description: ''
  };

  try {
    const parsed = parseStructuredContent(section.content);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return defaultEntry;
    
    // Handle different field naming conventions
    return {
      title: section.title,
      organization: (parsed as Record<string, unknown>).organization as string || 
                   (parsed as Record<string, unknown>).company as string || 
                   (parsed as Record<string, unknown>).school as string || '',
      dateRange: (parsed as Record<string, unknown>).dateRange as string || 
                (parsed as Record<string, unknown>).date as string || '',
      location: (parsed as Record<string, unknown>).location as string || '',
      description: (parsed as Record<string, unknown>).description as string || '',
    };
  } catch {
    return defaultEntry;
  }
};
