import { type TemplateProps } from './TemplateProps';

// Minimal template inspired by the second example in the images
const MinimalTemplate = ({ 
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
    title: '',
    website: ''
  };

  try {
    if (personalInfo.content) {
      const parsed = JSON.parse(personalInfo.content);
      if (typeof parsed === 'object') {
        contactInfo.phone = parsed.phone || '';
        contactInfo.email = parsed.email || '';
        contactInfo.address = parsed.address || '';
        contactInfo.title = parsed.title || '';
        contactInfo.website = parsed.website || '';
      }
    }
  } catch (e) {
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
              <li key={idx} className="text-gray-700">{item}</li>
            ))}
          </ul>
        );
      }
      // Render as is if not an array
      return <div className="text-gray-700 whitespace-pre-wrap">{content}</div>;
    } catch {
      // Render as plain text if not JSON
      return <div className="text-gray-700 whitespace-pre-wrap">{content}</div>;
    }
  };

  return (
    <div className="min-h-[297mm] w-full bg-white p-8 font-sans text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-800">{name}</h1>
        {contactInfo.title && (
          <h2 className="text-lg text-gray-600 mt-2">{contactInfo.title}</h2>
        )}
        
        {/* Contact Info - Horizontal */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {contactInfo.phone && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{contactInfo.phone}</span>
            </div>
          )}
          {contactInfo.email && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{contactInfo.email}</span>
            </div>
          )}
          {contactInfo.website && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9a9 9 0 009-9m-9 9a9 9 0 01-9-9" />
              </svg>
              <span>{contactInfo.website}</span>
            </div>
          )}
          {contactInfo.address && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{contactInfo.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Two column layout for main content */}
      <div className="flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="md:w-1/3 pr-0 md:pr-6">
          {/* About Me */}
          {personalInfo && personalInfo.content && (
            <div className="mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                Profile
              </h2>
              <div className="text-gray-700">
                {renderContent(personalInfo.content)}
              </div>
            </div>
          )}

          {/* Skills */}
          {skillsSections.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                Skills
              </h2>
              {skillsSections.map((section) => (
                <div key={section.id} className="mb-4">
                  {section.title !== 'Skills' && (
                    <h3 className="font-semibold mb-2">{section.title}</h3>
                  )}
                  {renderContent(section.content)}
                </div>
              ))}
            </div>
          )}

          {/* Other sections that fit in left column */}
          {otherSections.slice(0, Math.ceil(otherSections.length / 2)).map((section) => (
            <div key={section.id} className="mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                {section.title}
              </h2>
              <div className="text-gray-700">
                {renderContent(section.content)}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="md:w-2/3">
          {/* Work Experience */}
          {experienceSections.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experienceSections.map((section) => {
                  // Try to extract structured data
                  let company = '';
                  let position = section.title;
                  let dateRange = '';
                  let location = '';
                  let description = section.content;

                  try {
                    const parsed = JSON.parse(section.content);
                    if (typeof parsed === 'object') {
                      company = parsed.company || '';
                      position = parsed.position || section.title;
                      dateRange = parsed.date || parsed.dateRange || '';
                      location = parsed.location || '';
                      description = parsed.description || parsed.content || '';
                    }
                  } catch {
                    // Use content as is
                  }

                  return (
                    <div key={section.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{position}</h3>
                          {company && <p className="text-gray-600">{company}</p>}
                        </div>
                        <div className="text-right">
                          {dateRange && <p className="text-gray-600 text-sm">{dateRange}</p>}
                          {location && <p className="text-gray-600 text-sm">{location}</p>}
                        </div>
                      </div>
                      <div className="mt-2">
                        {renderContent(typeof description === 'string' ? description : section.content)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {educationSections.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-4">
                {educationSections.map((section) => {
                  // Try to extract structured data
                  let school = '';
                  let degree = section.title;
                  let dateRange = '';
                  let location = '';
                  let description = section.content;

                  try {
                    const parsed = JSON.parse(section.content);
                    if (typeof parsed === 'object') {
                      school = parsed.school || '';
                      degree = parsed.degree || section.title;
                      dateRange = parsed.date || parsed.dateRange || '';
                      location = parsed.location || '';
                      description = parsed.description || parsed.content || '';
                    }
                  } catch {
                    // Use content as is
                  }

                  return (
                    <div key={section.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{degree}</h3>
                          {school && <p className="text-gray-600">{school}</p>}
                        </div>
                        <div className="text-right">
                          {dateRange && <p className="text-gray-600 text-sm">{dateRange}</p>}
                          {location && <p className="text-gray-600 text-sm">{location}</p>}
                        </div>
                      </div>
                      <div className="mt-2">
                        {renderContent(typeof description === 'string' ? description : section.content)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remaining other sections */}
          {otherSections.slice(Math.ceil(otherSections.length / 2)).map((section) => (
            <div key={section.id} className="mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                {section.title}
              </h2>
              <div className="text-gray-700">
                {renderContent(section.content)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
