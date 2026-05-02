import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  keyField?: keyof T
}

export default function Table<T extends Record<string, any>>({ columns, data, loading, keyField = 'id' }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-100">
      <table className="w-full">
        <thead className="bg-surface-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-header">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="table-cell">
                    <div className="skeleton h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-surface-400 text-sm">
                No data available
              </td>
            </tr>
          ) : data.map((row) => (
            <tr key={String(row[keyField])} className="hover:bg-surface-50 transition">
              {columns.map((col) => (
                <td key={col.key} className="table-cell">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}