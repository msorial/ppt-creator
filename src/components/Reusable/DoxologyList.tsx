import {
  Checkbox,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DoxologyItem {
  id: string;
  value: string;
  label: string;
  checked: boolean;
  isOptional?: boolean;
}

interface DoxologyListProps {
  title: string;
  items: DoxologyItem[];
  onItemToggle: (item: DoxologyItem, isChecked: boolean) => void;
  onReorder: (items: DoxologyItem[]) => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
}

interface SortableDoxologyItemProps {
  item: DoxologyItem;
  onToggle: (item: DoxologyItem, isChecked: boolean) => void;
}

function SortableDoxologyItem({ item, onToggle }: SortableDoxologyItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 0',
        }}
      >
        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            padding: '4px',
            borderRadius: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            border: '1px solid transparent',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#666',
              lineHeight: 1,
            }}
          >
            ⋮⋮
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Checkbox
            value={item.value}
            checked={item.checked}
            onChange={(event) => onToggle(item, event.currentTarget.checked)}
            label={item.label}
            transitionDuration={0}
          />
        </div>
      </div>
    </div>
  );
}

export default function DoxologyList({
  title,
  items,
  onItemToggle,
  onReorder,
  showSearch = false,
  searchValue = '',
  onSearchChange,
  isLoading = false,
}: DoxologyListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  };

  const filteredItems =
    showSearch && searchValue
      ? items.filter((item) =>
          item.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : items;

  return (
    <Stack align='flex-start' spacing={5}>
      <Text fz='md' fw={500}>
        {title}
      </Text>

      {showSearch && (
        <TextInput
          placeholder='Search...'
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.currentTarget.value)}
          mb='sm'
          style={{ width: '100%' }}
        />
      )}

      {isLoading ? (
        [1, 2, 3, 4].map((index: number) => (
          <Skeleton
            height={20}
            mt={5}
            width={Math.floor(Math.random() * (100 - 75 + 1)) + 75}
            radius='md'
            key={index}
          />
        ))
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {showSearch ? (
              <ScrollArea style={{ height: 200 }} type='scroll'>
                {filteredItems.map((item) => (
                  <SortableDoxologyItem
                    key={item.id}
                    item={item}
                    onToggle={onItemToggle}
                  />
                ))}
              </ScrollArea>
            ) : (
              filteredItems.map((item) => (
                <SortableDoxologyItem
                  key={item.id}
                  item={item}
                  onToggle={onItemToggle}
                />
              ))
            )}
          </SortableContext>
        </DndContext>
      )}
    </Stack>
  );
}
