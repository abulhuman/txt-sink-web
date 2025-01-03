
import {
  Tabs,
} from '../../components/material-tailwind';
import { TxtFileSearchBy } from "../../repositories/txt-files.repository";

export function SearchByTabs({
  value,
  onChange
}: {
  value?: string;
  onChange: React.Dispatch<React.SetStateAction<TxtFileSearchBy | undefined>>;
}) {
  return (
    <Tabs
      data-testid='txt-files-search-by-tabs'
      value={value}
      onValueChange={(e) => onChange(e as TxtFileSearchBy)}
      className='bg-white rounded-md h-9'
    >
      <Tabs.List className='w-full bg-transparent p-1'>
        <Tabs.Trigger className='w-full rounded-md' value='tags'>
          Tags
        </Tabs.Trigger>
        <Tabs.Trigger className='w-full rounded-md' value='contents'>
          Contents
        </Tabs.Trigger>
        <Tabs.Trigger className='w-full rounded-md' value='name'>
          Filename
        </Tabs.Trigger>
        <Tabs.TriggerIndicator className='rounded-lg bg-secondary opacity-50' />
      </Tabs.List>
    </Tabs>
  );
}