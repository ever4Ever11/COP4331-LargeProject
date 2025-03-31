declare module 'jwt-decode' {
    export function jwtDecode<T = unknown>(token: string): T;
  }
  
