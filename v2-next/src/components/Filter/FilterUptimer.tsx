export const FilterUptimer = ({
  timeFilter,
  setTimeFilter,

}: {
  timeFilter: string
  setTimeFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
}) => {
  const timeOptions = [
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '48h', label: 'Últimas 48 horas' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
  ]

  return (
    <div className="bg-background p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col w-full sm:w-auto">
        <label htmlFor="time" className="text-sm font-medium mb-1">
          Periodo
        </label>
        <select
          id="time"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="w-full px-3 py-2 bg-background rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
