import React, { useState } from 'react';

export interface Section {
  id: string;
  title: string;
  content: string;
  type?: string;
}

interface SectionEditorProps {
  section: Section;
  onUpdate: (section: Section) => void;
  onDelete: (sectionId: string) => void;
}

// Section type options
const sectionTypes = [
  { value: 'personal', label: 'Personal Information' },
  { value: 'education', label: 'Education' },
  { value: 'experience', label: 'Work Experience' },
  { value: 'skills', label: 'Skills' },
  { value: 'projects', label: 'Projects' },
  { value: 'languages', label: 'Languages' },
  { value: 'certificates', label: 'Certifications' },
  { value: 'interests', label: 'Interests' },
  { value: 'references', label: 'References' },
  { value: 'text', label: 'Custom Section' }
];

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);
  const [type, setType] = useState(section.type || 'text');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdvancedEditing, setIsAdvancedEditing] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onUpdate({
      ...section,
      title: title.trim(),
      content: content,
      type: type
    });
    setIsEditing(false);
    setIsAdvancedEditing(false);
  };

  const handleCancel = () => {
    setTitle(section.title);
    setContent(section.content);
    setType(section.type || 'text');
    setIsEditing(false);
    setIsAdvancedEditing(false);
  };

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(section.id);
    } else {
      setIsDeleting(true);
      // Auto-reset delete confirmation after 3 seconds
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  // Helper function to determine if content is structured as JSON
  const isJsonContent = (content: string): boolean => {
    try {
      const parsed = JSON.parse(content);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false;
    }
  };

  // Get template based on section type
  const getSectionTemplate = (type: string): string => {
    switch(type) {
      case 'personal':
        return JSON.stringify({
          title: '',
          phone: '',
          email: '',
          address: '',
          website: '',
          bio: ''
        }, null, 2);
      case 'education':
        return JSON.stringify({
          school: '',
          degree: '',
          dateRange: 'YYYY - YYYY',
          location: '',
          description: ''
        }, null, 2);
      case 'experience':
        return JSON.stringify({
          position: '',
          company: '',
          dateRange: 'YYYY - Present',
          location: '',
          description: ''
        }, null, 2);
      case 'skills':
        return JSON.stringify([
          'Skill 1',
          'Skill 2',
          'Skill 3'
        ], null, 2);
      case 'languages':
        return JSON.stringify([
          'English - Fluent',
          'Spanish - Intermediate',
          'French - Basic'
        ], null, 2);
      case 'projects':
        return JSON.stringify({
          name: '',
          role: '',
          dateRange: 'YYYY - YYYY',
          url: '',
          description: ''
        }, null, 2);
      default:
        return '';
    }
  };

  // Function to apply the template for a specific section type
  const applyTemplate = () => {
    if (!isJsonContent(content) || content.trim() === '') {
      setContent(getSectionTemplate(type));
    } else {
      // Ask for confirmation if there's already structured content
      if (window.confirm('This will replace your current content with a template. Continue?')) {
        setContent(getSectionTemplate(type));
      }
    }
  };

  // Content format guidance based on section type
  const renderFormatGuidance = () => {
    switch(type) {
      case 'personal':
        return (
          <div className="text-xs text-gray-500 mt-1 mb-2">
            Use JSON format to provide contact details. Include fields like phone, email, address, etc.
          </div>
        );
      case 'education':
      case 'experience':
        return (
          <div className="text-xs text-gray-500 mt-1 mb-2">
            Use JSON format for structured data or enter free text. JSON allows better formatting in templates.
          </div>
        );
      case 'skills':
      case 'languages':
        return (
          <div className="text-xs text-gray-500 mt-1 mb-2">
            For best results, use a JSON array of strings - each item will be displayed as a bullet point.
          </div>
        );
      default:
        return null;
    }
  };

  // Render a preview of structured content
  const renderStructuredPreview = () => {
    try {
      if (!content) return null;
      
      const parsed = JSON.parse(content);
      
      if (Array.isArray(parsed)) {
        return (
          <ul className="list-disc ml-5 text-gray-700">
            {parsed.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      }
      
      if (typeof parsed === 'object' && parsed !== null) {
        return (
          <div className="space-y-1 text-gray-700">
            {Object.entries(parsed).map(([key, value]) => (
              value && key !== 'description' ? (
                <div key={key} className="flex">
                  <span className="font-medium capitalize w-24">{key}:</span>
                  <span>{String(value)}</span>
                </div>
              ) : null
            ))}
            {parsed.description && (
              <div className="mt-2">
                <div className="font-medium">Description</div>
                <p className="whitespace-pre-wrap">{parsed.description}</p>
              </div>
            )}
          </div>
        );
      }
      
      // Fallback to regular text display
      return <div className="whitespace-pre-wrap text-gray-700">{content}</div>;
    } catch {
      // If parsing fails, just show the raw content
      return <div className="whitespace-pre-wrap text-gray-700">{content}</div>;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {isEditing ? (
        <div className="p-4">
          <div className="mb-3">
            <label htmlFor={`section-title-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <input
              id={`section-title-${section.id}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor={`section-type-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Section Type
            </label>
            <div className="flex items-center">
              <select
                id={`section-type-${section.id}`}
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
              >
                {sectionTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={applyTemplate}
                className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                title="Apply template for this section type"
              >
                Apply Template
              </button>
            </div>
            {renderFormatGuidance()}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <label htmlFor={`section-content-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <button
                type="button"
                onClick={() => setIsAdvancedEditing(!isAdvancedEditing)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {isAdvancedEditing ? 'Simple Editor' : 'Advanced Editor'}
              </button>
            </div>
            {isAdvancedEditing ? (
              <textarea
                id={`section-content-${section.id}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                spellCheck="false"
              />
            ) : (
              <textarea
                id={`section-content-${section.id}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              disabled={!title.trim()}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="font-medium text-gray-800">{section.title}</h3>
              {section.type && section.type !== 'text' && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {section.type}
                </span>
              )}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 hover:text-blue-600"
                title="Edit section"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className={`p-1 ${isDeleting ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                title={isDeleting ? "Click again to confirm deletion" : "Delete section"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="prose max-w-none">
              {content ? (
                isJsonContent(content) ? renderStructuredPreview() : (
                  <div className="whitespace-pre-wrap text-gray-700">{content}</div>
                )
              ) : (
                <p className="text-gray-400 italic">No content yet. Click edit to add content to this section.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionEditor;
