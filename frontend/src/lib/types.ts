//frontend\src\lib\types.ts
export interface Auth0User {
    name?: string | null;
    email?: string;
    picture?: string;
    sub?: string;
    [key: string]: any; // Para permitir otros campos opcionales
  }