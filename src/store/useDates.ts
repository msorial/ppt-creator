import { create } from 'zustand'

interface DateProps {
  copticDate: string;
  sunday: string;
  ocassion: string;
  season: string;
}

interface DateState {
  currentCopticDates: DateProps | null;
  selectedCopticDates: DateProps | null;
  selectedDate: Date | null;     // MM/DD/YYYY - Readable
  apiDate: string | null | undefined;  // YYYY-MM-DD  - API
  setCurrentCopticDates: (currentCopticDates: DateProps) => void;
  setSelectedCopticDates: (selectedCopticDates: DateProps) => void;
  setSelectedDate: (selectedDate: Date | null) => void;
  setApiDate: (apiDate: string | null | undefined) => void;
  
}

const useDates = create<DateState>((set) => ({
  currentCopticDates: null,
  selectedCopticDates: null,
  selectedDate: null,
  apiDate: undefined,
  setCurrentCopticDates: (currentCopticDates: DateProps) => set({ currentCopticDates: { ...currentCopticDates } }),
  setSelectedCopticDates: (selectedCopticDates: DateProps) => set({ selectedCopticDates: { ...selectedCopticDates } }),
  setSelectedDate: (selectedDate: Date | null) => set({ selectedDate: selectedDate }),
  setApiDate: (apiDate: string | null | undefined) => set({apiDate: apiDate})
}))

export default useDates;

// http://localhost:5173/vespers?date=2023-08-27
