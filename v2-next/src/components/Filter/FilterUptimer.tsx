export const FilterUptimer = () => {
  const statusOptions = [
    { value: 'all', label: 'last day' },
  ];

  return (
    <div className="bg-background p-4">
      <div className="flex flex-col w-full sm:w-auto">
        <select
          id="team"
          className="w-full px-3 py-2 bg-background rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value="24 hours">Last 24 hours</option>
          <option value="48 hours">Last Day</option>
        </select>
      </div>
    </div>
  )
}