export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Project {
  id: string;
  projectName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  userUuid: string;
  projectUuid: string;
  hasUsersTable: boolean;
  jwtSecret: string | null;
}

export interface ProjectResponse {
  message: string;
  data: ProjectSummary[];
}

export interface ProjectSummary {
  projectUuid: string;
  projectName: string;
  description: string;
  dbSchema: string;
}

export interface CreateProjectRequest {
  projectName: string;
  description: string;
  clientAuthEnabled: boolean;
}
