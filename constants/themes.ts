/**
 * Global Theme System
 * Centralized color constants for multi-theme support
 */

export type ThemeType = 'light' | 'dark' | 'ocean' | 'sunset' | 'forest';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  // Semantic colors
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  buttonBackground: string;
  buttonText: string;
  buttonDisabled: string;
  overlay: string;
  shadow: string;
}

export interface Theme {
  name: ThemeType;
  colors: ThemeColors;
}

const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#FFFFFF',
    card: '#F8FAFC',
    text: '#0F172A',
    secondaryText: '#64748B',
    primary: '#7C3AED',
    primaryLight: '#EDE9FE',
    secondary: '#EC4899',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    inputBackground: '#F1F5F9',
    inputBorder: '#CBD5E1',
    inputText: '#0F172A',
    buttonBackground: '#7C3AED',
    buttonText: '#FFFFFF',
    buttonDisabled: '#CBD5E1',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: '#000000',
  },
};

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F1F5F9',
    secondaryText: '#94A3B8',
    primary: '#A78BFA',
    primaryLight: '#3730A3',
    secondary: '#F472B6',
    border: '#334155',
    borderLight: '#1E293B',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#60A5FA',
    inputBackground: '#1E293B',
    inputBorder: '#475569',
    inputText: '#F1F5F9',
    buttonBackground: '#A78BFA',
    buttonText: '#0F172A',
    buttonDisabled: '#475569',
    overlay: 'rgba(0, 0, 0, 0.8)',
    shadow: '#000000',
  },
};

const oceanTheme: Theme = {
  name: 'ocean',
  colors: {
    background: '#0A1F36',
    card: '#162A46',
    text: '#E8F4F8',
    secondaryText: '#A8BED3',
    primary: '#00D9FF',
    primaryLight: '#003A52',
    secondary: '#0099CC',
    border: '#1E5A7A',
    borderLight: '#162A46',
    success: '#06D6A0',
    warning: '#FFB703',
    danger: '#FB5607',
    info: '#3A86FF',
    inputBackground: '#162A46',
    inputBorder: '#1E5A7A',
    inputText: '#E8F4F8',
    buttonBackground: '#00D9FF',
    buttonText: '#0A1F36',
    buttonDisabled: '#1E5A7A',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: '#000000',
  },
};

const sunsetTheme: Theme = {
  name: 'sunset',
  colors: {
    background: '#2B1B1F',
    card: '#3D2A2E',
    text: '#F5E6D3',
    secondaryText: '#D4A574',
    primary: '#FF6B35',
    primaryLight: '#5C2E1F',
    secondary: '#F7931E',
    border: '#5C2E1F',
    borderLight: '#3D2A2E',
    success: '#83C0C1',
    warning: '#EDD935',
    danger: '#E63946',
    info: '#457B9D',
    inputBackground: '#3D2A2E',
    inputBorder: '#5C2E1F',
    inputText: '#F5E6D3',
    buttonBackground: '#FF6B35',
    buttonText: '#F5E6D3',
    buttonDisabled: '#5C2E1F',
    overlay: 'rgba(0, 0, 0, 0.75)',
    shadow: '#000000',
  },
};

const forestTheme: Theme = {
  name: 'forest',
  colors: {
    background: '#1B3D2B',
    card: '#245D3F',
    text: '#E8F2E6',
    secondaryText: '#A8C695',
    primary: '#52B788',
    primaryLight: '#2D5A40',
    secondary: '#74C69D',
    border: '#2D5A40',
    borderLight: '#245D3F',
    success: '#40916C',
    warning: '#D4A574',
    danger: '#D62828',
    info: '#457B9D',
    inputBackground: '#245D3F',
    inputBorder: '#2D5A40',
    inputText: '#E8F2E6',
    buttonBackground: '#52B788',
    buttonText: '#1B3D2B',
    buttonDisabled: '#2D5A40',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: '#000000',
  },
};

export const themes: Record<ThemeType, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
};

export const defaultTheme: ThemeType = 'light';
