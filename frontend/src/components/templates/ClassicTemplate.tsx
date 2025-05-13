// import { Section } from '../../api/gateway';
import { type TemplateProps } from './TemplateProps';

const ClassicTemplate = ({ 
  name, 
  personalInfo, 
  educationSections, 
  experienceSections, 
  skillsSections, 
  otherSections 
}: TemplateProps) => {
  // Parse personal info if it exists
  const contactInfo = {
    phone: '',
    email: '',
    address: '',
    title: ''
  };

  try {
    if (personalInfo.content) {
      const parsed = JSON.parse(personalInfo.content);
      if (typeof parsed === 'object') {
        contactInfo.phone = parsed.phone || '';
        contactInfo.email = parsed.email || '';
        contactInfo.address = parsed.address || '';
        contactInfo.title = parsed.title || '';
      }
    }
  } catch (e) {
    // If parsing fails, use content as is or leave empty
    console.warn('Failed to parse personal info:', e);
  }

  // Helper function to render section content
  const renderContent = (content: string) => {
    try {
      // Try to parse as JSON for structured data
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return (
          <ul className="list-disc ml-5 space-y-1">
            {parsed.map((item: string, idx: number) => (
              <li key={idx} className="text-sm">{item}</li>
            ))}
          </ul>
        );
      }
      // Render as is if not an array
      return <p className="text-gray-700 whitespace-pre-wrap">{content}</p>;
    } catch {
      // Render as plain text if not JSON
      return <p className="text-gray-700 whitespace-pre-wrap">{content}</p>;
    }
  };

  return (
    <div className="min-h-[297mm] w-full bg-white p-8 font-sans text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-blue-500 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">{name}</h1>
          {contactInfo.title && (
            <p className="text-lg text-gray-600 mt-1">{contactInfo.title}</p>
          )}
        </div>
        <div className="mt-3 md:mt-0 text-right">
          {contactInfo.phone && (
            <p className="text-sm flex items-center justify-end mb-1">
              <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {contactInfo.phone}
            </p>
          )}
          {contactInfo.email && (
            <p className="text-sm flex items-center justify-end mb-1">
              <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {contactInfo.email}
            </p>
          )}
          {contactInfo.address && (
            <p className="text-sm flex items-center justify-end">
              <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {contactInfo.address}
            </p>
          )}
        </div>
      </div>

      {/* About Me Section */}
      {personalInfo && personalInfo.content && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">
            {personalInfo.title || 'About Me'}
          </h2>
          <div>
            {renderContent(personalInfo.content)}
          </div>
        </div>
      )}

      {/* Education Section */}
      {educationSections.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-4">
            {educationSections.map((section) => (
              <div key={section.id}>
                <h3 className="text-lg font-medium text-gray-800">{section.title}</h3>
                <div>
                  {renderContent(section.content)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {experienceSections.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experienceSections.map((section) => (
              <div key={section.id}>
                <h3 className="text-lg font-medium text-gray-800">{section.title}</h3>
                <div>
                  {renderContent(section.content)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skillsSections.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">
            Skills
          </h2>
          <div className="space-y-4">
            {skillsSections.map((section) => (
              <div key={section.id}>
                <h3 className="text-lg font-medium text-gray-800">{section.title}</h3>
                <div>
                  {renderContent(section.content)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Sections */}
      {otherSections.map((section) => (
        <div key={section.id} className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">
            {section.title}
          </h2>
          <div>
            {renderContent(section.content)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassicTemplate;
