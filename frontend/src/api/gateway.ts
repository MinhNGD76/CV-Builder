// Better approach
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiError {
  message?: string;
  status?: number;
}

// Explicitly define this union type to make TypeScript understand 
// that ApiResponse can either be T OR an object with an error property
type ApiResponse<T> = T | { error: string };

const headers = (token?: string): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Try to get error message from response
    try {
      const contentType = response.headers.get('content-type');
      // Check if the response contains JSON before trying to parse it
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        // Make sure there's actually content to parse
        if (text) {
          const errorData = JSON.parse(text) as ApiError;
          throw new Error(errorData.message || `HTTP error ${response.status}`);
        }
      }
      // If we can't parse JSON, just throw a generic error
      throw new Error(`HTTP error ${response.status}`);
    } catch (error) {
      // No variable name when we don't use it
      throw error instanceof Error ? error : new Error(`HTTP error ${response.status}`);
    }
  }
  
  try {
    const text = await response.text();
    // Handle empty responses
    if (!text) {
      return {} as T;
    }
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    throw new Error('Invalid response format from server');
  }
};

interface RegisterData {
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  userId?: string;
}

export const register = async (body: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    return await handleResponse<AuthResponse>(response);
  } catch (error) {
    console.error('Register API error:', error);
    return { error: error instanceof Error ? error.message : 'Registration failed' };
  }
};

export const login = async (body: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    return await handleResponse<AuthResponse>(response);
  } catch (error) {
    console.error('Login API error:', error);
    return { error: error instanceof Error ? error.message : 'Login failed' };
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: headers(token),
    });
    const data = await handleResponse<{ valid: boolean }>(response);
    return data.valid;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

interface ProfileData {
  name: string;
  email: string;
  bio?: string;
}

export const getProfile = async (token: string): Promise<ApiResponse<ProfileData>> => {
  try {
    const response = await fetch(`${API_URL}/user/me`, {
      method: 'GET',
      headers: headers(token),
    });
    return await handleResponse<ProfileData>(response);
  } catch (error) {
    console.error('Get profile API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to get profile' };
  }
};

// Continue with rest of the gateway functions using the same pattern
export const updateProfile = async (body: ProfileData, token: string): Promise<ApiResponse<ProfileData>> => {
  try {
    if (!token) {
      return { error: 'Authentication token not found' };
    }
    
    const response = await fetch(`${API_URL}/user/me/update`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(body),
    });
    return await handleResponse<ProfileData>(response);
  } catch (error) {
    console.error('Update profile API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update profile' };
  }
};

interface CreateCVResponse {
  cvId: string;
}

export const createCV = async (body: { title: string; template: string }, token: string): Promise<ApiResponse<CreateCVResponse>> => {
  try {
    const response = await fetch(`${API_URL}/cv/create`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({
        title: body.title,
        templateId: body.template // Match the expected field name in the API
      }),
    });
    return await handleResponse<CreateCVResponse>(response);
  } catch (error) {
    console.error('Create CV API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create CV' };
  }
};

// Define a Block interface to replace any
interface Block {
  id: string;
  title?: string;
  content?: string;
  type?: string;
  [key: string]: unknown;
}

// Export the interfaces so they can be used elsewhere
export interface Section {
  id: string;
  title: string;
  content: string;
  type?: string;
}

export interface CV {
  id?: string;
  cvId?: string;
  title: string;
  template?: string;
  templateId?: string;
  sections?: Section[];
  blocks?: Block[];
  updatedAt?: string;
}

// Backend response type for CV list
interface CVListResponse {
  cvId: string;
  _id?: string;
  title?: string;
  templateId?: string;
  updatedAt?: string;
}

export const listCVs = async (token: string): Promise<ApiResponse<CV[]>> => {
  try {
    const response = await fetch(`${API_URL}/cv/list`, {
      method: 'GET',
      headers: headers(token),
    });
    const data = await handleResponse<CVListResponse[]>(response);
    
    // Transform the response to match the CV interface expected by the frontend
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.cvId || item._id || '',
        cvId: item.cvId || '',
        title: item.title || 'Untitled CV',
        template: item.templateId || 'classic',
        updatedAt: item.updatedAt || '',
      }));
    }
    return data;
  } catch (error) {
    console.error('List CVs API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to list CVs' };
  }
};

// Backend response type for a single CV
interface CVDetailResponse {
  cvId?: string;
  _id?: string;
  title?: string;
  templateId?: string;
  blocks?: Block[];
  updatedAt?: string;
}

export const getCV = async (id: string, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/${id}`, {
      method: 'GET',
      headers: headers(token),
    });
    const data = await handleResponse<CVDetailResponse>(response);
    
    // Transform the response to match the CV interface expected by the frontend
    if (data && !('error' in data)) {
      // Map blocks to sections format for the frontend
      const sections = Array.isArray(data.blocks) 
        ? data.blocks.map((block: Block) => ({
            id: block.id,
            title: block.title || '',
            content: block.content || '',
            type: block.type || 'text'
          }))
        : [];
        
      const transformedCV: CV = {
        id: data.cvId || data._id || '',
        cvId: data.cvId || '',
        title: data.title || 'Untitled CV',
        template: data.templateId || 'classic',
        sections: sections,
        updatedAt: data.updatedAt || ''
      };
      
      return transformedCV;
    }
    
    // If data has an error property, it's already an ApiResponse with error
    if (data && 'error' in data) {
      return data as { error: string };
    }
    
    // If we get here without a valid CV, return a generic error
    return { error: 'Failed to load CV data' };
  } catch (error) {
    console.error('Get CV API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to get CV' };
  }
};

export const addSection = async (cvId: string, section: Omit<Section, 'id'>, token: string): Promise<ApiResponse<CV>> => {
  try {
    // Generate a temporary ID for the new section
    const tempId = 'temp-' + Math.random().toString(36).substring(2, 15);
    
    const response = await fetch(`${API_URL}/cv/add-section`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ 
        cvId, 
        section: {
          id: tempId,
          title: section.title,
          content: section.content || '',
          type: section.type || 'text'
        } 
      }),
    });
    return await handleResponse<CV>(response);
  } catch (error) {
    console.error('Add section API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to add section' };
  }
};

export const updateSection = async (cvId: string, section: Section, token: string): Promise<ApiResponse<CV>> => {
  try {
    if (!token) {
      return { error: 'Authentication token not found' };
    }
    
    const response = await fetch(`${API_URL}/cv/update-section`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ 
        cvId, 
        section: {
          id: section.id,
          title: section.title,
          content: section.content,
          type: section.type || 'text'
        } 
      }),
    });
    return await handleResponse<CV>(response);
  } catch (error) {
    console.error('Update section API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update section' };
  }
};

export const removeSection = async (cvId: string, sectionId: string, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/remove-section`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ cvId, sectionId }),
    });
    return await handleResponse<CV>(response);
  } catch (error) {
    console.error('Remove section API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to remove section' };
  }
};

export const renameCV = async (cvId: string, newTitle: string, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/rename`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ cvId, newTitle }),
    });
    return await handleResponse<CV>(response);
  } catch (error) {
    console.error('Rename CV API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to rename CV' };
  }
};

export const changeTemplate = async (cvId: string, template: string, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/change-template`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ cvId, template }),
    });
    return await handleResponse<CV>(response);
  } catch (error) {
    console.error('Change template API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to change template' };
  }
};

export const undoCV = async (cvId: string, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/undo`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ cvId }),
    });
    return await handleResponse<CV>(response);
  } catch (error) {
    console.error('Undo CV API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to undo changes' };
  }
};

// Event type for CV history
export interface CVEvent {
  eventType: string;
  cvId: string;
  userId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export const getCVEvents = async (cvId: string, token: string): Promise<ApiResponse<CVEvent[]>> => {
  try {
    const response = await fetch(`${API_URL}/cv/event/cv/${cvId}`, {
      method: 'GET',
      headers: headers(token),
    });
    return await handleResponse<CVEvent[]>(response);
  } catch (error) {
    console.error('Get CV events API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to get CV events' };
  }
};

export const rebuildToVersion = async (cvId: string, version: number, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/${cvId}/version/${version}`, {
      method: 'GET',
      headers: headers(token),
    });
    const data = await handleResponse<CVDetailResponse>(response);
    
    // Transform the response to match the CV interface
    if (data && !('error' in data)) {
      // Map blocks to sections format for the frontend
      const sections = Array.isArray(data.blocks) 
        ? data.blocks.map((block: Block) => ({
            id: block.id,
            title: block.title || '',
            content: block.content || '',
            type: block.type || 'text'
          }))
        : [];
        
      const transformedCV: CV = {
        id: data.cvId || data._id || '',
        cvId: data.cvId || '',
        title: data.title || 'Untitled CV',
        template: data.templateId || 'classic',
        sections: sections,
        updatedAt: data.updatedAt || ''
      };
      
      return transformedCV;
    }
    
    if (data && 'error' in data) {
      return data as { error: string };
    }
    
    return { error: 'Failed to rebuild CV' };
  } catch (error) {
    console.error('Rebuild CV API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to rebuild CV' };
  }
};
