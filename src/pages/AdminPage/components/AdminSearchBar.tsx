import { Search, X } from 'lucide-react';

interface AdminSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = 'Search...',
}: AdminSearchBarProps) {
  return (
    <div className='flex items-center h-10 bg-white border border-neutral-200 rounded-xl px-3 gap-2 w-full max-w-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
      <Search className='w-4 h-4 text-neutral-400 shrink-0' />
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='flex-1 bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400'
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className='text-neutral-400 hover:text-neutral-600'
        >
          <X className='w-4 h-4' />
        </button>
      )}
    </div>
  );
}
