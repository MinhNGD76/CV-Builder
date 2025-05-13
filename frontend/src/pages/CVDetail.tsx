import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCV, addSection, updateSection, removeSection, renameCV, changeTemplate, undoCV } from '../api/gateway';
import SectionEditor, { type Section } from '../components/SectionEditor';

interface CV {
  id: string;
  title: string;
  template: string;
  sections: Section[];
  updatedAt: string;
}

const CVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [isAddingSectionVisible, setIsAddingSectionVisible] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);
  
  const token = localStorage.getItem('token') || '';

  // Using useCallback to memoize the fetchCV function
  const fetchCV = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await getCV(id, token);
      
      if ('error' in data) {
        setError(data.error);
      } else {
        setCv(data);
        setEditTitle(data.title);
        setSelectedTemplate(data.template || 'classic');
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
      setError(error instanceof Error ? error.message : 'Failed to load CV');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchCV();
  }, [fetchCV]); // Now properly including the dependency

  const handleRename = async () => {
    if (!id || !editTitle.trim() || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      await renameCV(id, editTitle, token);
      setIsTitleEditing(false);
      // Update the local state to reflect the change
      if (cv) {
        setCv({
          ...cv,
          title: editTitle
        });
      }
    } catch (error) {
      console.error('Error renaming CV:', error);
      setError('Failed to rename CV');
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleTemplateChange = async () => {
    if (!id || !selectedTemplate || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      await changeTemplate(id, selectedTemplate, token);
      // Update the local state to reflect the change
      if (cv) {
        setCv({
          ...cv,
          template: selectedTemplate
        });
      }
    } catch (error) {
      console.error('Error changing template:', error);
      setError('Failed to change template');
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleUndo = async () => {
    if (!id || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      await undoCV(id, token);
      // Refresh the CV data
      fetchCV();
    } catch (error) {
      console.error('Error undoing changes:', error);
      setError('Failed to undo last action');
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleAddSection = async () => {
    if (!id || !newSectionTitle.trim() || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      await addSection(id, { title: newSectionTitle, content: '' }, token);
      setNewSectionTitle('');
      setIsAddingSectionVisible(false);
      fetchCV();
    } catch (error) {
      console.error('Error adding section:', error);
      setError('Failed to add section');
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleUpdateSection = async (updatedSection: Section) => {
    if (!id || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      await updateSection(id, updatedSection, token);
      // Update the local state to reflect the change
      if (cv) {
        setCv({
          ...cv,
          sections: cv.sections.map(s => 
            s.id === updatedSection.id ? updatedSection : s
          )
        });
      }
    } catch (error) {
      console.error('Error updating section:', error);
      setError('Failed to update section');
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleRemoveSection = async (sectionId: string) => {
    if (!id || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      await removeSection(id, sectionId, token);
      // Update the local state to reflect the change
      if (cv) {
        setCv({
          ...cv,
          sections: cv.sections.filter(s => s.id !== sectionId)
        });
      }
    } catch (error) {
      console.error('Error removing section:', error);
      setError('Failed to remove section');
    } finally {
      setOperationInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading CV...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="space-x-3">
            <button 
              onClick={fetchCV} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/cv')} 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Back to CV List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="bg-white shadow rounded-lg p-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">CV Not Found</h3>
          <p className="text-gray-500 mb-6">The CV you're looking for doesn't exist or you don't have permission to view it.</p>
          <button 
            onClick={() => navigate('/cv')} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to CV List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex justify-between items-center">
          {isTitleEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 mr-2"
                autoFocus
              />
              <button 
                onClick={handleRename}
                disabled={operationInProgress}
                className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
              <button 
                onClick={() => {
                  setIsTitleEditing(false);
                  setEditTitle(cv.title);
                }}
                className="px-2 py-1 ml-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-gray-800">{cv.title}</h2>
              <button
                onClick={() => setIsTitleEditing(true)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="classic">Classic Template</option>
              <option value="modern">Modern Template</option>
              <option value="minimal">Minimal Template</option>
            </select>
            <button
              onClick={handleTemplateChange}
              disabled={operationInProgress}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Apply Template
            </button>
            <button
              onClick={handleUndo}
              disabled={operationInProgress}
              className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
              title="Undo last change"
            >
              Undo
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sections</h3>
            <button
              onClick={() => setIsAddingSectionVisible(!isAddingSectionVisible)}
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Section
            </button>
          </div>
          
          {isAddingSectionVisible && (
            <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Section</h4>
              <div className="flex">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Section Title"
                  className="flex-grow border border-gray-300 rounded-l px-3 py-2"
                />
                <button
                  onClick={handleAddSection}
                  disabled={!newSectionTitle.trim() || operationInProgress}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          )}
          
          {cv.sections && cv.sections.length > 0 ? (
            <div className="space-y-6">
              {cv.sections.map((section) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  onUpdate={handleUpdateSection}
                  onDelete={handleRemoveSection}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No sections added yet. Add your first section to begin.</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate('/cv')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Back to CV List
          </button>
          
          <button
            onClick={() => window.open(`/cv/${id}/preview`, '_blank')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Preview CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVDetail;
