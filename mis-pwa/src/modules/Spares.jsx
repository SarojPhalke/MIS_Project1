import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../shared/supabase'

export default function Spares() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['spares'], queryFn: async () => {
    const { data, error } = await supabase.from('spare_parts_inventory').select('id, part_code, part_name, stock_on_hand, reorder_level')
    if (error) throw error
    return data
  }})
  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('spare_parts_inventory').insert({ part_code: crypto.randomUUID().slice(0,8), part_name: 'New Part' })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spares'] })
  })
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


