import { type TemplateProps } from './TemplateProps';

// Modern template inspired by the first example in the images
const ModernTemplate = ({ 
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
    photo: ''
  };

  try {
    if (personalInfo.content) {
      const parsed = JSON.parse(personalInfo.content);
      if (typeof parsed === 'object') {
        contactInfo.phone = parsed.phone || '';
        contactInfo.email = parsed.email || '';
        contactInfo.address = parsed.address || '';
        contactInfo.title = parsed.title || '';
        contactInfo.photo = parsed.photo || '';
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

  // For education and experience, we'll try to extract dates
  const renderTimelineItem = (section: { title: string, content: string }) => {
    let dateRange = '';
    let organization = '';
    let description = section.content;

    try {
      const parsed = JSON.parse(section.content);
      if (typeof parsed === 'object') {
        dateRange = parsed.date || parsed.dateRange || '';
        organization = parsed.organization || parsed.company || parsed.school || '';
        description = parsed.description || parsed.content || '';
      }
    } catch {
      // Use content as is if parsing fails
    }

    return (
      <div className="relative pl-8 mb-6">
        {/* Timeline dot */}
        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-blue-600"></div>
        {/* Timeline line */}
        <div className="absolute left-1.5 top-4 bottom-0 w-0.5 bg-blue-100"></div>
        
        <div>
          <h4 className="text-base font-medium">{section.title}</h4>
          {organization && (
            <div className="italic text-gray-600 text-sm">{organization}</div>
          )}
          {dateRange && (
            <div className="text-sm text-blue-700 font-medium mt-0.5">{dateRange}</div>
          )}
          <div className="mt-2">
            {renderContent(typeof description === 'string' ? description : section.content)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[297mm] w-full bg-white p-0 font-sans">
      {/* Header with photo and blue background */}
      <div className="bg-blue-600 text-white flex flex-col md:flex-row">
        {contactInfo.photo && (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white mx-auto md:mx-8 my-6 md:my-8 flex-shrink-0">
            <img 
              src={contactInfo.photo} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className={`p-8 flex-grow ${contactInfo.photo ? 'md:pl-0' : ''}`}>
          <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
          {contactInfo.title && (
            <h2 className="text-xl mt-2 font-light">{contactInfo.title}</h2>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="bg-gray-50 p-6 md:w-1/3">
          <div className="mb-8">
            <h3 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">Contact</h3>
            <div className="space-y-2">
              {contactInfo.phone && (
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{contactInfo.email}</span>
                </div>
              )}
              {contactInfo.address && (
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{contactInfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* About Me */}
          {personalInfo && personalInfo.content && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">About Me</h3>
              <div className="text-gray-700">
                {renderContent(personalInfo.content)}
              </div>
            </div>
          )}

          {/* Skills */}
          {skillsSections.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">Skills</h3>
              {skillsSections.map((section) => (
                <div key={section.id} className="mb-4">
                  <h4 className="font-medium mb-2">{section.title}</h4>
                  {renderContent(section.content)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="p-6 md:p-8 md:w-2/3">
          {/* Education */}
          {educationSections.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">Education</h3>
              {educationSections.map((section) => renderTimelineItem(section))}
            </div>
          )}

          {/* Experience */}
          {experienceSections.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">Experience</h3>
              {experienceSections.map((section) => renderTimelineItem(section))}
            </div>
          )}

          {/* Other Sections */}
          {otherSections.map((section) => (
            <div key={section.id} className="mb-8">
              <h3 className="text-lg font-semibold border-b-2 border-blue-600 pb-2 mb-4">{section.title}</h3>
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

export default ModernTemplate;
