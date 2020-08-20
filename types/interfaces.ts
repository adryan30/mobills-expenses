export interface Expense {
  value: number;
  description: string;
  date: Date;
  paid: boolean;
  userId: string;
}

export interface Revenue {
  value: number;
  description: string;
  date: Date;
  paid: boolean;
  userId: string;
}
