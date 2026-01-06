export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hirebridge_token');
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hirebridge_token', token);
  }
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hirebridge_token');
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('hirebridge_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hirebridge_user', JSON.stringify(user));
  }
};
