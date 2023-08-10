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
  selectedDate: Date | null;
  setCurrentCopticDates: (currentCopticDates: DateProps) => void;
  setSelectedCopticDates: (selectedCopticDates: DateProps) => void;
  setSelectedDate: (date: Date) => void;
}

const useDates = create<DateState>((set) => ({
  currentCopticDates: null,
  selectedCopticDates: null,
  selectedDate: null,
  setCurrentCopticDates: (currentCopticDates: DateProps) => set({ currentCopticDates: { ...currentCopticDates } }),
  setSelectedCopticDates: (selectedCopticDates: DateProps) => set({ selectedCopticDates: { ...selectedCopticDates } }),
  setSelectedDate: (selectedDate: Date) => set({ selectedDate: selectedDate }),
}))

export default useDates;
