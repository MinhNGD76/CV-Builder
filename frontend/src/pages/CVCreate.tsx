import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCV } from '../api/gateway';
// Import images
import classicTemplate from '../assets/templates/classic.png';
import modernTemplate from '../assets/templates/modern.png';
import minimalTemplate from '../assets/templates/minimal.png';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  previewUrl?: string;
}

const templates: TemplateOption[] = [
  { 
    id: 'classic', 
    name: 'Classic', 
    description: 'A timeless design suitable for most industries',
    previewUrl: classicTemplate
  },
  { 
    id: 'modern', 
    name: 'Modern', 
    description: 'A contemporary layout for creative professionals',
    previewUrl: modernTemplate
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    description: 'A clean, simple design with focus on content',
    previewUrl: minimalTemplate
  }
];

const CVCreate = () => {
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for your CV');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
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
      
      const response = await createCV({ title: title.trim(), template: selectedTemplate }, token);
      
      if ('error' in response) {
        setError(response.error);
      } else if (response.cvId) {
        setSuccess('CV created successfully! Redirecting to editor...');
        setTimeout(() => {
          navigate(`/cv/${response.cvId}`);
        }, 1000);
      } else {
        setError('Failed to create CV. Please try again.');
      }
    } catch (error) {
      console.error('Error creating CV:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New CV</h2>
        
        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 text-green-700 bg-green-100 rounded-lg">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              CV Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Professional CV"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Choose a name that helps you identify this CV.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition
                    ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="h-24 bg-gray-100 mb-3 rounded flex items-center justify-center">
                    {template.previewUrl ? (
                      <img 
                        src={template.previewUrl} 
                        alt={template.name}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">{template.name}</span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium">{template.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/cv')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-3 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create CV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CVCreate;
