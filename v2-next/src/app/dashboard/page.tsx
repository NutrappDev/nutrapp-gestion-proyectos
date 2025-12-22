'use client';


export default function DashboardPage() {


  return (
    <div className="
      w-full h-full
      bg-surface
      rounded-lg
      p-6
      shadow
      gap-4 flex flex-col
      border border-border
    ">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="bg-background p-6 rounded-lg h-[calc(100vh-350px)] overflow-auto">
        <p>Dashboard projects</p>
      </div>
      <div className="bg-background p-6 rounded-lg h-[calc(100vh-250px)] overflow-auto">
        kanbanProjects
      </div>

    </div>
  );
}
