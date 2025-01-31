// components/DataTable/index.jsx
'use client'
import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from "@/components/ui/input";

const DataTable = ({ columns, data, searchPlaceholder = "Search..." }) => {
  // State for global search filter
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Initialize table with React Table
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-2 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-2">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;