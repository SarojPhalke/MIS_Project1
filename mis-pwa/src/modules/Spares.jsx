import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { supabase } from '../shared/supabase'

export default function Spares() {
  // Supabase not connected, so skip Spares query and mutations
  const qc = useQueryClient()
  const { data } = { data: [] }
  const createMutation = { mutate: () => {} }
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Spares Inventory</h2>
        <button className="px-3 py-1.5 rounded bg-sky-600 text-white text-sm" onClick={() => createMutation.mutate()}>New Part</button>
      </div>
      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2">Code</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Stock</th>
              <th className="text-left p-2">Reorder</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">{row.part_code}</td>
                <td className="p-2">{row.part_name}</td>
                <td className="p-2">{row.stock_on_hand}</td>
                <td className="p-2">{row.reorder_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


