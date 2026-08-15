export interface Department {
  id: number;
  name: string;
}

export interface Designation {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;

  status?: string | null;

  department?: Department | null;
  designation?: Designation | null;

  roles?: string[];
  permissions?: string[];
}