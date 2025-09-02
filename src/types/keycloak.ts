import { z } from "zod";

export interface KeycloakUserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  credentials: {
    type: string;
    value: string;
    temporary: boolean;
  }[];
}

export interface KeycloakError extends Error {
  name: string;
  issues?: Array<{
    path: (string | number)[];
    message: string;
  }>;
}

export interface KeycloakUserResponse {
  id: string;
}
