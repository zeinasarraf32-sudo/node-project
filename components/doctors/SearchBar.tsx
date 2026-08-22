import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or specialty..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder-gray-400 transition"
        />
      </div>

      {/* Controls Container (Sort & Filters) */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
        {/* Sort Dropdown */}
        <div className="relative flex-1 md:flex-initial">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none bg-gray-50/80 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 pr-8 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition focus:outline-none cursor-pointer truncate"
          >
            <option value="rating">Sort: Rating</option>
            <option value="price-low">Sort: Price (Low to High)</option>
            <option value="price-high">Sort: Price (High to Low)</option>
            <option value="experience">Sort: Experience</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Filters Button */}
        <button className="flex items-center justify-center gap-2 border border-gray-200 bg-gray-50/80 hover:bg-gray-100 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}