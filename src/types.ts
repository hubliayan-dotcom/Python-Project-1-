export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account?: string;
  paymentMethod?: string;
  userId: string;
  type: TransactionType;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  userId: string;
}

export interface Budget {
  id: string;
  month: string; // YYYY-MM
  categoryId: string;
  amount: number;
  userId: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}
