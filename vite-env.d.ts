interface ImportMetaEnv {
    readonly VITE_STRAVA_CLIENT_ID: string;
    readonly VITE_STRAVA_REDIRECT_URI: string;
    readonly VITE_SERVER_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  declare module '*.png' {
    const src: string;
    export default src;
  }