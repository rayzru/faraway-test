import { stringify } from 'querystring';
import { Url } from 'url';
import { Method, User } from './types';

export class API {
  private _api: string = '';
  private _apiPrefix: string = 'http://';
  private _headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  constructor(host?: string) {
    this._api = host || `${process.env.NEXT_PUBLIC_API_ENDPOINT || 'api'}:8010`;
  }

  get host() {
    return this._apiPrefix + this._api;
  }

  get headers() {
    return new Headers(this._headers);
  }

  private request = async (endpoint: string, method: Method = 'GET', params?: Record<string, string>) => {
    const response = await fetch(`${this.host}${endpoint}`, {
      method,
      headers: this.headers,
      body: params ? JSON.stringify(params) : undefined,
    });

    const data = await response.json();

    return data;
  };

  getUsers = async () => {
    return await this.request('/users');
  };

  createUser = async (name: string, email: string) => {
    return await this.request('/users', 'POST', { name, email });
  };

  updateUser = async (id: number, name: string, email: string) => {
    return await this.request(`/users/${id}`, 'PUT', { name, email });
  };

  deleteUser = async (id: number) => {
    return await this.request(`/users/${id}`, 'DELETE');
  };
}
