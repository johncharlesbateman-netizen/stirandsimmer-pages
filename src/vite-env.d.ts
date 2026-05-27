/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

// vite-imagetools query imports — `?as=srcset` returns a srcset string.
declare module "*&as=srcset" {
  const srcset: string;
  export default srcset;
}
declare module "*?as=srcset" {
  const srcset: string;
  export default srcset;
}
