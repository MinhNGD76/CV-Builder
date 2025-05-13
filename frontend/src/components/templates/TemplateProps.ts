import { type Section } from '../../api/gateway';

export interface TemplateProps {
  name: string;
  personalInfo: Section;
  educationSections: Section[];
  experienceSections: Section[];
  skillsSections: Section[];
  otherSections: Section[];
}
