export const MetricCard = ({ title, value }: { title: string, value: any }) => { 
  return (
    <div className="p-4 bg-background rounded-lg shadow flex flex-col min-w-[150px] w-full sm:w-1/7">
      <p className="text-muted-foreground text-sm">{title}</p>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  )
}