import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { supabase } from '../shared/supabase'

export default function PM() {
  // Supabase not connected, so skip PM query and mutations
  const qc = useQueryClient()
  const { data } = { data: [] }
  const createMutation = { mutate: () => {} }
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Preventive Maintenance</h2>
        <button className="px-3 py-1.5 rounded bg-sky-600 text-white text-sm" onClick={() => createMutation.mutate()}>New PM</button>
      </div>
      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2">Asset</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Due</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">{row.asset_id || '-'}</td>
                <td className="p-2">{row.title}</td>
                <td className="p-2">{row.due_date}</td>
                <td className="p-2">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


