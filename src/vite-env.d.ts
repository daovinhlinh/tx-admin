/// <reference types="vite/client" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_URL: string;
      // other environment variables...
    }
  }
}
