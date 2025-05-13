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
      const errorData = await response.json() as ApiError;
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    } catch {
      // No variable name when we don't use it
      throw new Error(`HTTP error ${response.status}`);
    }
  }
  
  return response.json() as Promise<T>;
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
      body: JSON.stringify(body),
    });
    return await handleResponse<CreateCVResponse>(response);
  } catch (error) {
    console.error('Create CV API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create CV' };
  }
};

interface Section {
  id: string;
  title: string;
  content: string;
}

interface CV {
  id: string;
  title: string;
  template: string;
  sections: Section[];
  updatedAt: string;
}

export const listCVs = async (token: string): Promise<ApiResponse<CV[]>> => {
  try {
    const response = await fetch(`${API_URL}/cv/list`, {
      method: 'GET',
      headers: headers(token),
    });
    return await handleResponse<CV[]>(response);
  } catch (error) {
    console.error('List CVs API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to list CVs' };
  }
};

export const getCV = async (id: string, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/${id}`, {
      method: 'GET',
      headers: headers(token),
    });
    return await handleResponse<CV>(response);
  } catch (error) {
    console.error('Get CV API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to get CV' };
  }
};

export const addSection = async (cvId: string, section: Omit<Section, 'id'>, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/add-section`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ cvId, section }),
    });
    return await handleResponse<CV>(response);
  } catch (error) {
    console.error('Add section API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to add section' };
  }
};

export const updateSection = async (cvId: string, section: Section, token: string): Promise<ApiResponse<CV>> => {
  try {
    const response = await fetch(`${API_URL}/cv/update-section`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ cvId, section }),
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
