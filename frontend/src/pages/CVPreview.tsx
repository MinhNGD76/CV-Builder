import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCV, type CV } from '../api/gateway';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';

const CVPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCV = async () => {
      if (!id) return;
      
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }
        
        const data = await getCV(id, token);
        
        if ('error' in data) {
          setError(data.error);
        } else {
          setCv(data);
        }
      } catch (error) {
        console.error('Error fetching CV:', error);
        setError('Failed to load CV. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id]);

  const renderTemplate = () => {
    if (!cv) return null;

    // Default sections if none are provided
    const sections = cv.sections || [];
    
    // Group sections by type for templates
    const personalInfo = sections.find(s => s.type === 'personal') || 
                         { id: 'personal', title: 'About Me', content: '', type: 'personal' };
    const educationSections = sections.filter(s => s.type === 'education');
    const experienceSections = sections.filter(s => s.type === 'experience');
    const skillsSections = sections.filter(s => s.type === 'skills');
    const otherSections = sections.filter(s => !['personal', 'education', 'experience', 'skills'].includes(s.type || ''));

    // Template props
    const templateProps = {
      name: cv.title,
      personalInfo,
      educationSections,
      experienceSections,
      skillsSections,
      otherSections
    };

    switch (cv.template || cv.templateId) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'classic':
      default:
        return <ClassicTemplate {...templateProps} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToEditor = () => {
    // Use navigate instead of window.history.back() to ensure we go to the editor page
    if (id) {
      navigate(`/cv/${id}`);
    } else {
      navigate('/cv');
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
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Print Controls - hidden when printing */}
      <div className="print:hidden bg-white shadow-md p-4 mb-6 fixed top-0 left-0 right-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{cv?.title || 'CV Preview'}</h1>
          <p className="text-sm text-gray-500">Template: {cv?.template || cv?.templateId || 'Classic'}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleBackToEditor}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Editor
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Template Display */}
      <div className="pt-24 pb-12 px-4 print:p-0 print:pt-0">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none p-0 print:p-0 print:max-w-none">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
