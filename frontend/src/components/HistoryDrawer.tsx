import { useState, useEffect, useCallback } from 'react';
import { type CVEvent, getCVEvents, rebuildToVersion } from '../api/gateway';

interface HistoryDrawerProps {
  cvId: string;
  isOpen: boolean;
  onClose: () => void;
  onRebuild: (version?: number) => void;
}

// Helper to format event names for display
const formatEventType = (eventType: string): string => {
  switch (eventType) {
    case 'CV_CREATED': return 'CV Created';
    case 'SECTION_ADDED': return 'Section Added';
    case 'SECTION_UPDATED': return 'Section Updated';
    case 'SECTION_REMOVED': return 'Section Removed';
    case 'CV_RENAMED': return 'CV Renamed';
    case 'TEMPLATE_CHANGED': return 'Template Changed';
    default: return eventType.replace(/_/g, ' ').toLowerCase();
  }
};

// Helper to format event details - making it more robust against missing data
const formatEventDetails = (event: CVEvent): string => {
  try {
    switch (event.eventType) {
      case 'CV_CREATED':
        return `Title: ${event.payload?.title || 'Untitled'}, Template: ${event.payload?.templateId || 'Default'}`;
      case 'SECTION_ADDED':
        return `${event.payload?.title || 'New Section'}`;
      case 'SECTION_UPDATED':
        return `${event.payload?.title || 'Updated Section'}`;
      case 'SECTION_REMOVED':
        return `Section ID: ${event.payload?.id || 'Unknown'}`;
      case 'CV_RENAMED':
        return `New Title: ${event.payload?.title || 'Untitled'}`;
      case 'TEMPLATE_CHANGED':
        return `Template: ${event.payload?.templateId || 'Default'}`;
      default:
        try {
          return typeof event.payload === 'object' ? 
            JSON.stringify(event.payload, null, 2) : 
            String(event.payload || 'No details');
        } catch {
          return 'No details available';
        }
    }
  } catch (error) {
    console.error('Error formatting event details:', error);
    return 'Failed to format event details';
  }
};

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ cvId, isOpen, onClose, onRebuild }) => {
  const [events, setEvents] = useState<CVEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [isRebuildLoading, setIsRebuildLoading] = useState(false);
  const [rebuildingIndex, setRebuildingIndex] = useState<number | null>(null);

  // Use useCallback to memoize the fetchEvents function with proper error handling
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }
      
      const response = await getCVEvents(cvId, token);
      
      if ('error' in response) {
        setError(response.error);
      } else if (Array.isArray(response)) {
        // Make sure events are valid before setting state
        const validEvents = response.filter(event => 
          event && typeof event === 'object' && 'eventType' in event
        );
        setEvents(validEvents);
      } else {
        setError('Received invalid event data');
      }
    } catch (err) {
      setError('Failed to load CV history');
      console.error('Error fetching CV events:', err);
    } finally {
      setLoading(false);
    }
  }, [cvId]);

  // Use a safer effect that doesn't cause blank screen if it fails
  useEffect(() => {
    let isMounted = true;
    
    if (isOpen && cvId) {
      fetchEvents().catch(error => {
        console.error('Error in fetchEvents effect:', error);
        if (isMounted) {
          setError('Failed to fetch events');
          setLoading(false);
        }
      });
    }
    
    return () => {
      isMounted = false;
    };
  }, [isOpen, cvId, fetchEvents]);

  const handleRebuildToVersion = async (index: number) => {
    if (rebuildingIndex !== null) return; // Prevent multiple simultaneous rebuilds
    
    setRebuildingIndex(index);
    setIsRebuildLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }
      
      const version = index + 1; // Events are 0-indexed, versions are 1-indexed
      
      // Visual feedback for the selected event
      setSelectedEvent(index);
      
      const result = await rebuildToVersion(cvId, version, token);
      
      if ('error' in result) {
        setError(result.error);
        // Reset selection on error
        setSelectedEvent(null);
      } else {
        // Success! Show a brief success message
        setError('');
        
        // Call the parent's onRebuild callback to update the main view
        try {
          onRebuild(version);
          
          // Success message (optional)
          const eventType = events[index]?.eventType || 'Unknown event';
          const successMsg = `Successfully rebuilt CV to "${formatEventType(eventType)}" state`;
          console.log(successMsg);
        } catch (rebuildError) {
          console.error('Error during rebuild callback:', rebuildError);
          setError('Error applying rebuild changes');
        }
      }
    } catch (err) {
      console.error('Error rebuilding CV:', err);
      setError('Failed to rebuild CV');
      setSelectedEvent(null);
    } finally {
      setIsRebuildLoading(false);
      setRebuildingIndex(null);
    }
  };

  // Function to rebuild to latest version
  const handleRebuildToLatest = async () => {
    setIsRebuildLoading(true);
    setSelectedEvent(null);
    
    try {
      // Just call the parent's onRebuild without a version to rebuild to latest
      onRebuild();
    } catch (error) {
      console.error('Error rebuilding to latest:', error);
      setError('Failed to rebuild to latest version');
    } finally {
      setIsRebuildLoading(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-20 flex flex-col`}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">CV History</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {isRebuildLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30">
          <div className="flex flex-col items-center p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-blue-600 font-medium">
              {rebuildingIndex !== null ? 'Rebuilding to selected version...' : 'Rebuilding to latest version...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-auto p-4">
        {loading && !isRebuildLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading events...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
            {error}
            <button 
              onClick={() => fetchEvents().catch(e => console.error('Error refreshing events:', e))}
              className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No events found for this CV.
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-2">
              Click on any event to rebuild the CV to that point in time.
            </div>
            <div className="space-y-2">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md cursor-pointer transition-colors relative
                    ${selectedEvent === index ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}
                    ${rebuildingIndex === index ? 'pointer-events-none' : ''}
                  `}
                  onClick={() => handleRebuildToVersion(index)}
                >
                  {rebuildingIndex === index && (
                    <div className="absolute inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">{formatEventType(event.eventType)}</div>
                    <div className="text-xs text-gray-500">{formatDate(event.createdAt)}</div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{formatEventDetails(event)}</div>
                  {selectedEvent === index && (
                    <div className="text-xs text-blue-600 mt-1 font-medium">
                      Current state
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleRebuildToLatest}
          disabled={isRebuildLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isRebuildLoading ? 'Rebuilding...' : 'Rebuild to Latest'}
        </button>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Event sourcing allows you to rebuild your CV to any point in time
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;
