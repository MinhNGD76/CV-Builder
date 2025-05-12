const API_URL = 'http://localhost:3000';

const headers = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: token } : {}),
});

export const register = async (body: any) =>
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const login = async (body: any) =>
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const getProfile = async (token: string) =>
  fetch(`${API_URL}/user/me`, {
    method: 'GET',
    headers: headers(token),
  }).then((res) => res.json());

export const updateProfile = async (body: any, token: string) =>
  fetch(`${API_URL}/user/me/update`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const createCV = async (body: any, token: string) =>
  fetch(`${API_URL}/cv/create`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const listCVs = async (token: string) =>
  fetch(`${API_URL}/cv/list`, {
    method: 'GET',
    headers: headers(token),
  }).then((res) => res.json());

export const getCV = async (id: string, token: string) =>
  fetch(`${API_URL}/cv/${id}`, {
    method: 'GET',
    headers: headers(token),
  }).then((res) => res.json());

export const addSection = async (cvId: string, section: any, token: string) =>
  fetch(`${API_URL}/cv/add-section`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ cvId, section }),
  }).then((res) => res.json());

  export const updateSection = async (cvId: string, section: any, token: string) =>
  fetch(`${API_URL}/cv/update-section`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ cvId, section }),
  }).then((res) => res.json());

export const removeSection = async (cvId: string, sectionId: string, token: string) =>
  fetch(`${API_URL}/cv/remove-section`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ cvId, sectionId }),
  }).then((res) => res.json());

export const renameCV = async (cvId: string, newTitle: string, token: string) =>
  fetch(`${API_URL}/cv/rename`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ cvId, newTitle }),
  }).then((res) => res.json());

export const changeTemplate = async (cvId: string, template: string, token: string) =>
  fetch(`${API_URL}/cv/change-template`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ cvId, template }),
  }).then((res) => res.json());

export const undoCV = async (cvId: string, token: string) =>
  fetch(`${API_URL}/cv/undo`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ cvId }),
  }).then((res) => res.json());
