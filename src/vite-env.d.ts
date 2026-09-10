/// <reference types="vite/client" />

interface OrbitPublicApiConfig {
  baseUrl: "/api/public/v1" | string;
  apiKey: string;
}

interface Window {
  ORBIT_PUBLIC_API?: OrbitPublicApiConfig;
}
