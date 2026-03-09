//frontend\src\lib\types.ts
export interface AppUser {
    id: number;
    email: string;
    name?: string | null;
    privilege?: string | null;
    comp?: string | null;
    [key: string]: any;
  }