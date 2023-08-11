import { SegmentedControl, SegmentedControlItem } from '@mantine/core';
import useUi from '../../store/useUi';

interface SegControlProps {
  data: string[] | SegmentedControlItem[];
  value?: string;
  onChange?: (value: string) => void;
}

const SegControl: React.FC<SegControlProps> = ({ data, value, onChange }) => {
  const { darkMode } = useUi();

  return (
    <SegmentedControl
      data={data}
      value={value}
      onChange={onChange}
      sx={{ width: '100%' }}
      color={darkMode ? 'gray' : 'dark'}
    />
  );
};

export default SegControl;
