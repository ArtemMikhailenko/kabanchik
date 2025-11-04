interface PaginationProps {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export const Pagination = ({ 
  currentPage = 2, 
  totalPages = 15, 
  onPageChange 
}: PaginationProps) => (
  <div className="flex items-center justify-center gap-2 mt-8">
    <button 
      onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="w-10 h-10 rounded-full border border-[#e6e6e6] flex items-center justify-center text-[#a2a6b0] text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      ‹
    </button>
    
    <button 
      onClick={() => onPageChange?.(1)}
      className={`w-10 h-10 rounded-full border ${currentPage === 1 ? 'border-2 border-[#55c4c8] text-[#282a35] font-semibold' : 'border-[#e6e6e6] text-[#a2a6b0]'} flex items-center justify-center text-sm hover:bg-gray-50 transition-colors`}
    >
      1
    </button>
    
    <button 
      onClick={() => onPageChange?.(2)}
      className={`w-10 h-10 rounded-full border ${currentPage === 2 ? 'border-2 border-[#55c4c8] text-[#282a35] font-semibold' : 'border-[#e6e6e6] text-[#a2a6b0]'} flex items-center justify-center text-sm hover:bg-gray-50 transition-colors`}
    >
      2
    </button>
    
    <button 
      onClick={() => onPageChange?.(3)}
      className={`w-10 h-10 rounded-full border ${currentPage === 3 ? 'border-2 border-[#55c4c8] text-[#282a35] font-semibold' : 'border-[#e6e6e6] text-[#a2a6b0]'} flex items-center justify-center text-sm hover:bg-gray-50 transition-colors`}
    >
      3
    </button>
    
    {totalPages > 5 && (
      <>
        <span className="text-[#a2a6b0] text-sm">...</span>
        <button 
          onClick={() => onPageChange?.(totalPages)}
          className={`w-12 h-10 rounded-full border ${currentPage === totalPages ? 'border-2 border-[#55c4c8] text-[#282a35] font-semibold' : 'border-[#e6e6e6] text-[#a2a6b0]'} flex items-center justify-center text-sm hover:bg-gray-50 transition-colors`}
        >
          {totalPages}
        </button>
      </>
    )}
    
    <button 
      onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="w-10 h-10 rounded-full border border-[#e6e6e6] flex items-center justify-center text-[#a2a6b0] text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      ›
    </button>
  </div>
)
