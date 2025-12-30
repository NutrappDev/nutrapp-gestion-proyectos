interface FilterProjectsProps {
  projects: { id: string; key: string; name: string }[]
  value: string
  onChange: (projectId: string) => void
}

export const FilterProjects = ({
  projects,
  value,
  onChange,
}: FilterProjectsProps) => {
  return (
    <div className="bg-background p-4">
      <div className="flex flex-col gap-1 w-full sm:w-64">
        <label
          htmlFor="project-filter"
          className="text-xs font-medium opacity-70"
        >
          Proyecto
        </label>

        <select
          id="project-filter"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg
            bg-background border border-gray-300
            text-sm
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            transition-colors
          "
        >
          <option value="all">Todos los proyectos</option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.key} — {project.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
