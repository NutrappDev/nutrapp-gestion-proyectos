import { JiraIssue } from "@/types/jira"
import { useState } from "react"
import {
  IconMessageCircle,
  IconClock,
  IconUser,
  IconArrowUpRight,
  IconInfoCircle,
} from "@tabler/icons-react"

interface IssueProps {
  issue: JiraIssue
}

export const IssuesCard = ({ issue }: IssueProps) => {
  const [viewComments, setViewComments] = useState(false)
  const [viewInfo, setViewInfo] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const getPriorityColor = (priority?: string) => {
    const priorityLower = priority?.toLowerCase() || ""
    switch (priorityLower) {
      case "high":
      case "alta":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
      case "baja":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex-none p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
              issue.priority
            )}`}
          >
            {issue.priority || "Sin prioridad"}
          </span>

          <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
            {issue.key}
          </span>
        </div>

        {issue.url && (
          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Abrir en Jira"
          >
            <IconArrowUpRight size={18} />
          </a>
        )}
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h3 className="text-gray-800 font-medium line-clamp-2">
          {issue.summary}
        </h3>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 gap-2">
        {/* Assignee */}
        <div className="flex items-center gap-2 min-w-0">
          {issue.assignee?.avatar ? (
            <img
              src={issue.assignee.avatar}
              alt={issue.assignee.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <IconUser size={14} className="text-gray-500" />
            </div>
          )}
          <span className="text-xs text-gray-600 truncate">
            {issue.assignee?.name || "Sin asignar"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {issue.created && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <IconClock size={14} />
              <span>{formatDate(issue.created)}</span>
            </div>
          )}

          {issue.storyPoints !== undefined && (
            <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              {issue.storyPoints} SP
            </div>
          )}

          {issue.lastComment && (
            <button
              onClick={() => setViewComments(!viewComments)}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                viewComments
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
              title="Ver comentarios"
            >
              <IconMessageCircle size={14} />
            </button>
          )}

          <button
            onClick={() => setViewInfo(!viewInfo)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
              viewInfo
                ? "bg-green-100 text-green-700"
                : "text-gray-500 hover:text-green-600 hover:bg-green-50"
            }`}
            title="Ver información"
          >
            <IconInfoCircle size={14} />
          </button>
        </div>
      </div>

      {/* Comments */}
      {viewComments && issue.lastComment && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {issue.lastComment.author.avatar ? (
                <img
                  src={issue.lastComment.author.avatar}
                  alt={issue.lastComment.author.name}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <IconUser size={12} className="text-gray-500" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {issue.lastComment.author.name}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(issue.lastComment.created)}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
            {Array.isArray(issue.lastComment.content)
              ? issue.lastComment.content.map((text, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {text.text}
                  </p>
                ))
              : issue.lastComment.content || "Sin comentario"}
          </div>
        </div>
      )}

      {/* Info */}
      {viewInfo && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm space-y-2">
          <div className="flex gap-2">
            <span className="font-medium text-gray-700">Creado:</span>
            <span className="text-gray-600">
              {formatDate(issue.created)}
            </span>
          </div>

          {issue.reporter && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Reporter:</span>
              {issue.reporter.avatar && (
                <img
                  src={issue.reporter.avatar}
                  alt={issue.reporter.name}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-gray-600">{issue.reporter.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
