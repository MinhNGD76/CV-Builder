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

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onUpdate({
      ...section,
      title: title.trim(),
      content: content
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(section.title);
    setContent(section.content);
    setIsEditing(false);
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
          
          <div className="mb-4">
            <label htmlFor={`section-content-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id={`section-content-${section.id}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            <h3 className="font-medium text-gray-800">{section.title}</h3>
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
                <div className="whitespace-pre-wrap text-gray-700">{content}</div>
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
