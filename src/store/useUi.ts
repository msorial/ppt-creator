import {create} from 'zustand';

interface UiState {
  darkMode: boolean;
  toggleTheme: () => void;
}

const useDates = create<UiState>((set) => ({
  darkMode: true,
  toggleTheme: () => {
    set((state) => ({ darkMode: !state.darkMode }));
  },
}));

export default useDates;
