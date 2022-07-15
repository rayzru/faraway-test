export type Headers<T, U> = {
  key: T;
  value: U;
};

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';

export interface User {
  id?: number;
  name?: string;
  email?: string;
}
