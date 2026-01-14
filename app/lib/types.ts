// TypeScript interfaces for Commission Calculator

export interface Entry {
  id: number;
  name: string;
  locks: number;
  stocks: number;
  barrels: number;
  sales: number;
  commission: number;
  isValid: boolean;
  errors: string[];
}

export interface FieldErrors {
  name: string;
  locks: string;
  stocks: string;
  barrels: string;
}
