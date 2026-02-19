import { X } from 'lucide-react';
import FilterSidebar from '@/pages/BookListPage/components/FilterSidebar';
import { useDispatch } from 'react-redux';
import { resetFilters } from '@/store/uiSlice';
import Button from '@/components/shared/Button';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
}: MobileFilterDrawerProps) {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-40 bg-black/40' onClick={onClose} />

      {/* Drawer */}
      <div className='fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto'>
        {/* Handle */}
        <div className='flex justify-center pt-3 pb-1'>
          <div className='w-10 h-1 rounded-full bg-neutral-300' />
        </div>

        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-neutral-100'>
          <span className='text-base font-bold text-neutral-900'>Filter</span>
          <button
            onClick={onClose}
            className='text-neutral-400 hover:text-neutral-600'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Filter content */}
        <div className='px-4 py-5'>
          <FilterSidebar />
        </div>

        {/* Actions */}
        <div className='flex gap-3 px-4 pb-6 pt-2 border-t border-neutral-100'>
          <Button
            variant='secondary'
            className='flex-1'
            onClick={() => dispatch(resetFilters())}
          >
            Reset
          </Button>
          <Button className='flex-1' onClick={onClose}>
            Terapkan
          </Button>
        </div>
      </div>
    </>
  );
}
