export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  password?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Reclamation {
  id: number;
  title: string;
  description: string;
  status: string;
  userId: number;
}

