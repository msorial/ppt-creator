import { create } from 'zustand'

interface DateProps {
  copticDate: string;
  sunday: string;
  ocassion: string;
  season: string;
}

interface DateState {
  currentCopticDates: DateProps | undefined;
  selectedCopticDates: DateProps | undefined;
  apiDate: string | undefined; // YYYY-MM-DD  - API
  setCurrentCopticDates: (currentCopticDates: DateProps) => void;
  setSelectedCopticDates: (selectedCopticDates: DateProps) => void;
  setApiDate: (apiDate: string | undefined) => void;
}

const useDates = create<DateState>((set) => ({
  currentCopticDates: undefined,
  selectedCopticDates: undefined,
  apiDate: undefined,
  setCurrentCopticDates: (currentCopticDates: DateProps) => set({ currentCopticDates: { ...currentCopticDates } }),
  setSelectedCopticDates: (selectedCopticDates: DateProps) => set({ selectedCopticDates: { ...selectedCopticDates } }),
  setApiDate: (apiDate: string | undefined ) => set({apiDate: apiDate})
}))

export default useDates;
