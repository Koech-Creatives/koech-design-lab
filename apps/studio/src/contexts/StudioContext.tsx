import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface StudioState {
  selectedProject: any | null;
  projects: any[];
  templates: any[];
  brands: any[];
  user: any | null;
  loading: boolean;
}

type StudioAction = 
  | { type: 'SET_PROJECTS'; payload: any[] }
  | { type: 'SET_SELECTED_PROJECT'; payload: any }
  | { type: 'SET_TEMPLATES'; payload: any[] }
  | { type: 'SET_BRANDS'; payload: any[] }
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: StudioState = {
  selectedProject: null,
  projects: [],
  templates: [],
  brands: [],
  user: null,
  loading: false,
};

const StudioContext = createContext<{
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
} | null>(null);

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_SELECTED_PROJECT':
      return { ...state, selectedProject: action.payload };
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface StudioContextProviderProps {
  children: ReactNode;
}

export function StudioContextProvider({ children }: StudioContextProviderProps) {
  const [state, dispatch] = useReducer(studioReducer, initialState);

  return (
    <StudioContext.Provider value={{ state, dispatch }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioContextProvider');
  }
  return context;
} 