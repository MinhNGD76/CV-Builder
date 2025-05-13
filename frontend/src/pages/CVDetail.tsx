import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCV, addSection, updateSection, removeSection, renameCV, changeTemplate, undoCV, type Section } from '../api/gateway';
import SectionEditor from '../components/SectionEditor';
import HistoryDrawer from '../components/HistoryDrawer';

// Generate a unique ID without requiring the uuid package
const generateId = (): string => {
  // Simple implementation that should work for our purposes
  return 'temp-' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Local CV interface that matches what we need for this component
interface CV {
  id?: string;
  cvId?: string;
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
  const [newSectionType, setNewSectionType] = useState('text');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Using useCallback to memoize the fetchCV function
  const fetchCV = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      const data = await getCV(id, token);
      
      if ('error' in data) {
        setError(data.error);
        // Check if the error is auth-related
        if (data.error.includes('token') || data.error.includes('authentication')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        setCv({
          id: data.id || data.cvId,
          cvId: data.cvId || data.id,
          title: data.title,
          template: data.template || data.templateId || 'classic',
          sections: Array.isArray(data.sections) ? data.sections : [],
          updatedAt: data.updatedAt || new Date().toISOString()
        });
        setEditTitle(data.title);
        setSelectedTemplate(data.template || data.templateId || 'classic');
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
      setError(error instanceof Error ? error.message : 'Failed to load CV');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCV();
  }, [fetchCV]);

  const handleRename = async () => {
    if (!id || !editTitle.trim() || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }
      
      const response = await renameCV(id, editTitle.trim(), token);
      
      if ('error' in response) {
        setError(response.error);
      } else {
        setIsTitleEditing(false);
        // Update the local state to reflect the change
        if (cv) {
          setCv({
            ...cv,
            title: editTitle.trim()
          });
        }
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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }
      
      const response = await changeTemplate(id, selectedTemplate, token);
      
      if ('error' in response) {
        setError(response.error);
      } else {
        // Update the local state to reflect the change
        if (cv) {
          setCv({
            ...cv,
            template: selectedTemplate
          });
        }
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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }
      
      const response = await undoCV(id, token);
      
      if ('error' in response) {
        setError(response.error);
      } else {
        // Refresh the CV data
        fetchCV();
      }
    } catch (error) {
      console.error('Error undoing changes:', error);
      setError('Failed to undo last action');
    } finally {
      setOperationInProgress(false);
    }
  };


  const handleRebuild = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Just refresh the page data
      await fetchCV();
    } catch (error) {
      console.error('Error rebuilding CV:', error);
      setError(error instanceof Error ? error.message : 'Failed to rebuild CV');
    } finally {
      setLoading(false);
    }
  };

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

  // Function to get a default section title based on type
  const getDefaultSectionTitle = (type: string): string => {
    switch(type) {
      case 'personal': return 'Personal Information';
      case 'education': return 'Education';
      case 'experience': return 'Work Experience';
      case 'skills': return 'Skills';
      case 'projects': return 'Projects';
      case 'languages': return 'Languages';
      case 'certificates': return 'Certifications';
      case 'interests': return 'Interests';
      case 'references': return 'References';
      default: return '';
    }
  };

  // Update the handleAddSection function to include section type
  const handleAddSection = async () => {
    if (!id || (!newSectionTitle.trim() && newSectionType === 'text') || operationInProgress) return;
    
    setOperationInProgress(true);
    
    // Use either the custom title or the default title for the section type
    const sectionTitle = newSectionTitle.trim() || getDefaultSectionTitle(newSectionType);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }
      
      // Create a temporary section to show in UI while waiting for API response
      const tempSection: Section = {
        id: generateId(),
        title: sectionTitle,
        content: '',
        type: newSectionType
      };
      
      // Optimistically update UI
      if (cv) {
        setCv({
          ...cv,
          sections: [...cv.sections, tempSection]
        });
      }
      
      const response = await addSection(id, { 
        title: sectionTitle, 
        content: '',
        type: newSectionType
      }, token);
      
      if ('error' in response) {
        setError(response.error);
        // Revert optimistic update
        fetchCV();
      } else {
        setNewSectionTitle('');
        setNewSectionType('text');
        setIsAddingSectionVisible(false);
        // Refresh to get server-generated IDs
        fetchCV();
      }
    } catch (error) {
      console.error('Error adding section:', error);
      setError('Failed to add section');
      // Revert optimistic update
      fetchCV();
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleUpdateSection = async (updatedSection: Section) => {
    if (!id || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setOperationInProgress(false);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      // Optimistically update UI
      if (cv) {
        setCv({
          ...cv,
          sections: cv.sections.map(s => 
            s.id === updatedSection.id ? updatedSection : s
          )
        });
      }
      
      const response = await updateSection(id, updatedSection, token);
      
      if ('error' in response) {
        setError(response.error);
        // Check if the error is auth-related
        if (response.error.includes('token') || response.error.includes('authentication')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        // Revert optimistic update
        fetchCV();
      }
    } catch (error) {
      console.error('Error updating section:', error);
      setError('Failed to update section. Please try again.');
      // Revert optimistic update
      fetchCV();
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleRemoveSection = async (sectionId: string) => {
    if (!id || operationInProgress) return;
    
    setOperationInProgress(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }
      
      // Optimistically update UI
      if (cv) {
        setCv({
          ...cv,
          sections: cv.sections.filter(s => s.id !== sectionId)
        });
      }
      
      const response = await removeSection(id, sectionId, token);
      
      if ('error' in response) {
        setError(response.error);
        // Revert optimistic update
        fetchCV();
      }
    } catch (error) {
      console.error('Error removing section:', error);
      setError('Failed to remove section');
      // Revert optimistic update
      fetchCV();
    } finally {
      setOperationInProgress(false);
    }
  };

  // ...existing code for rendering...
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
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              title="View history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>
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
              
              <div className="mb-3">
                <label htmlFor="section-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type
                </label>
                <select
                  id="section-type"
                  value={newSectionType}
                  onChange={(e) => {
                    setNewSectionType(e.target.value);
                    // If user selects a pre-defined type, let's set a default title
                    if (e.target.value !== 'text' && !newSectionTitle) {
                      setNewSectionTitle(getDefaultSectionTitle(e.target.value));
                    }
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                >
                  {sectionTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {newSectionType === 'text' && (
                <div className="mb-3">
                  <label htmlFor="section-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    id="section-title"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="Enter section title"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required={newSectionType === 'text'}
                  />
                </div>
              )}
              
              {newSectionType !== 'text' && (
                <div className="mb-3">
                  <label htmlFor="section-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Title (Optional)
                  </label>
                  <input
                    type="text"
                    id="section-title"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder={getDefaultSectionTitle(newSectionType)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSectionVisible(false);
                    setNewSectionTitle('');
                    setNewSectionType('text');
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSection}
                  disabled={(newSectionType === 'text' && !newSectionTitle.trim()) || operationInProgress}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Section
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
      {/* History Drawer */}
      {id && (
        <HistoryDrawer
          cvId={id}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onRebuild={handleRebuild}
        />
      )}
      
      {/* Overlay to close drawer when clicking outside */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-10"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
};

export default CVDetail;
