"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"

/**
 * Column definition for the data table
 */
export interface DataTableColumn<TData> {
  /** Unique identifier for the column */
  id: string
  /** Column header text */
  header: string
  /** Accessor function to get cell value from row data */
  accessorKey?: keyof TData
  /** Custom cell renderer */
  cell?: (row: TData) => React.ReactNode
  /** Enable sorting for this column */
  enableSorting?: boolean
  /** Enable column filtering */
  enableFiltering?: boolean
  /** Custom column width class */
  className?: string
}

/**
 * Row action definition
 */
export interface DataTableAction<TData> {
  /** Action identifier */
  id: string
  /** Action label */
  label: string
  /** Action icon */
  icon?: React.ReactNode
  /** Action onClick handler */
  onClick: (row: TData) => void
  /** Show condition based on row data */
  show?: (row: TData) => boolean
  /** Variant for the action button */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export interface DataTableProps<TData> {
  /** Column definitions */
  columns: DataTableColumn<TData>[]
  /** Table data */
  data: TData[]
  /** Loading state */
  isLoading?: boolean
  /** Enable row selection */
  enableRowSelection?: boolean
  /** Selected row IDs */
  selectedRows?: Set<string>
  /** Row selection change handler */
  onRowSelectionChange?: (selectedIds: Set<string>) => void
  /** Get unique row ID */
  getRowId?: (row: TData) => string
  /** Row actions */
  actions?: DataTableAction<TData>[]
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Custom toolbar actions */
  toolbarActions?: React.ReactNode
  /** Empty state message */
  emptyStateMessage?: string
  /** Initial page size */
  initialPageSize?: number
  /** Page size options */
  pageSizeOptions?: number[]
}

/**
 * Sort direction type
 */
type SortDirection = "asc" | "desc" | null

/**
 * Reusable data table component with pagination, sorting, filtering, and row selection
 */
export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  enableRowSelection = false,
  selectedRows = new Set(),
  onRowSelectionChange,
  getRowId = (row) => String(row.id),
  actions = [],
  searchPlaceholder = "Search...",
  toolbarActions,
  emptyStateMessage = "No results found.",
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTableProps<TData>) {
  const [searchValue, setSearchValue] = React.useState("")
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(initialPageSize)

  /**
   * Filter data based on search value
   */
  const filteredData = React.useMemo(() => {
    if (!searchValue) return data

    return data.filter((row) => {
      return columns.some((column) => {
        if (!column.enableFiltering && column.enableFiltering !== undefined)
          return false

        const value = column.accessorKey
          ? row[column.accessorKey]
          : column.cell
            ? column.cell(row)
            : null

        return String(value).toLowerCase().includes(searchValue.toLowerCase())
      })
    })
  }, [data, searchValue, columns])

  /**
   * Sort filtered data
   */
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData

    return [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.id === sortColumn)
      if (!column?.accessorKey) return 0

      const aValue = a[column.accessorKey]
      const bValue = b[column.accessorKey]

      if (aValue === bValue) return 0

      const comparison = aValue > bValue ? 1 : -1
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [filteredData, sortColumn, sortDirection, columns])

  /**
   * Paginate sorted data
   */
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  /**
   * Handle column sorting
   */
  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId)
    if (!column?.enableSorting) return

    if (sortColumn === columnId) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  /**
   * Handle select all rows
   */
  const handleSelectAll = (checked: boolean) => {
    if (!onRowSelectionChange) return

    if (checked) {
      const allIds = new Set(paginatedData.map((row) => getRowId(row)))
      onRowSelectionChange(allIds)
    } else {
      onRowSelectionChange(new Set())
    }
  }

  /**
   * Handle select individual row
   */
  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onRowSelectionChange) return

    const newSelection = new Set(selectedRows)
    if (checked) {
      newSelection.add(rowId)
    } else {
      newSelection.delete(rowId)
    }
    onRowSelectionChange(newSelection)
  }

  /**
   * Reset all filters
   */
  const handleResetFilters = () => {
    setSearchValue("")
    setSortColumn(null)
    setSortDirection(null)
    setCurrentPage(1)
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  /**
   * Handle page size change
   */
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  /**
   * Get sort icon for column
   */
  const getSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />
    }
    if (sortDirection === "asc") {
      return <ChevronUp className="ml-2 h-4 w-4" />
    }
    return <ChevronDown className="ml-2 h-4 w-4" />
  }

  const hasActiveFilters = searchValue !== "" || sortColumn !== null
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.has(getRowId(row)))
  const isSomeSelected =
    paginatedData.some((row) => selectedRows.has(getRowId(row))) &&
    !isAllSelected

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={searchPlaceholder}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      >
        {toolbarActions}
      </DataTableToolbar>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableRowSelection && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={
                      isSomeSelected ? "data-[state=checked]:bg-primary/50" : ""
                    }
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.id} className={column.className}>
                  {column.enableSorting ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.id)}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      <span>{column.header}</span>
                      {getSortIcon(column.id)}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {enableRowSelection && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (enableRowSelection ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  {emptyStateMessage}
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              paginatedData.map((row) => {
                const rowId = getRowId(row)
                const isSelected = selectedRows.has(rowId)

                return (
                  <TableRow
                    key={rowId}
                    data-state={isSelected ? "selected" : undefined}
                  >
                    {enableRowSelection && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectRow(rowId, checked === true)
                          }
                          aria-label={`Select row ${rowId}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id} className={column.className}>
                        {column.cell
                          ? column.cell(row)
                          : column.accessorKey
                            ? String(row[column.accessorKey] ?? "")
                            : ""}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {actions
                            .filter(
                              (action) => !action.show || action.show(row)
                            )
                            .map((action) => (
                              <Button
                                key={action.id}
                                variant={action.variant || "ghost"}
                                size="icon-sm"
                                onClick={() => action.onClick(row)}
                                aria-label={action.label}
                              >
                                {action.icon || <MoreHorizontal className="h-4 w-4" />}
                              </Button>
                            ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={sortedData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  )
}