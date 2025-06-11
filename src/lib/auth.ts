import axios from './api';

interface LoginResponse {
  token: string;
  token_type: string;
}

export async function login(email: string, password: string): Promise<void> {
  const response = await axios.post<LoginResponse>('/sign-in', { email, password });
  localStorage.setItem('token', response.data.token);
}

export function logout() {
  localStorage.removeItem('token');
}
