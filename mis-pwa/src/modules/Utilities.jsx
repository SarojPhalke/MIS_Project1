import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../shared/supabase'

export default function Utilities() {
  const { data } = useQuery({ queryKey: ['utilities'], queryFn: async () => {
    const { data, error } = await supabase.from('utilities_log').select('id, utility_type, meter_point, reading, reading_at').order('reading_at', { ascending: false }).limit(100)
    if (error) throw error
    return data
  }})
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Utilities</h2>
      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Point</th>
              <th className="text-left p-2">Reading</th>
              <th className="text-left p-2">At</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">{row.utility_type}</td>
                <td className="p-2">{row.meter_point}</td>
                <td className="p-2">{row.reading}</td>
                <td className="p-2">{new Date(row.reading_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


