import React, { useState } from 'react';

export interface Section {
  id: string;
  title: string;
  content: string;
}

interface SectionEditorProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  onDelete: (id: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate, onDelete }) => {
  const [editedTitle, setEditedTitle] = useState(section.title);
  const [editedContent, setEditedContent] = useState(section.content);

  const handleUpdate = () => {
    onUpdate({
      ...section,
      title: editedTitle,
      content: editedContent,
    });
  };

  return (
    <div className="border p-4 mb-4 rounded shadow bg-white">
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
        placeholder="Section title"
      />
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Section content"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;
