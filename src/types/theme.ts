import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      text: {
        primary: string;
        secondary: string;
      };
      background: {
        default: string;
        paper: string;
      };
    };
    breakpoints: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    spacing: (multiplier?: number) => string;
  }
}