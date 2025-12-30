import { JiraIssue } from "@/types/jira"
import { useState } from "react"
import {
  IconMessageCircle,
  IconClock,
  IconUser,
  IconArrowUpRight,
  IconInfoCircle,
} from "@tabler/icons-react"
import { formatDisplayName } from "@/utils/jira"

interface IssueProps {
  issue: JiraIssue
}

export const IssuesCard = ({ issue }: IssueProps) => {
  const [viewComments, setViewComments] = useState(false)
  const [viewInfo, setViewInfo] = useState(false)

  console.log(issue)

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

  const comments = issue.fields.comment?.comments || []
  const lastComment = comments.at(-1)

  const getCommentText = (body: any): string => {
    if (!body?.content) return "Sin comentario"

    return body.content
      .flatMap((block: any) => block.content || [])
      .map((node: any) => node.text)
      .filter(Boolean)
      .join(' ')
  }

  const reporter = issue.fields.reporter

  return (
    <div className="flex-none p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
              issue.fields.priority.name
            )}`}
          >
            {issue.fields.priority.name || "Sin prioridad"}
          </span>

          <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
            {issue.key}
          </span>

          {issue.fields.customfield_10297 !== null && (
            <div className="p-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              {issue.fields.customfield_10297?.value} SP
            </div>
          )}
        </div>

        {issue.self && (
          <a
            href={issue.self}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Abrir en Jira"
          >
            <IconArrowUpRight size={18} />
          </a>
        )}

      </div>

      <div className="mb-4">
        <h3 className="text-gray-800 font-medium line-clamp-2">
          {issue.fields.summary}
        </h3>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {issue.fields.assignee?.avatarUrls ? (
            <img
              src={issue.fields.assignee.avatarUrls['16x16']}
              alt={issue.fields.assignee.displayName}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <IconUser size={14} className="text-gray-500" />
            </div>
          )}
          <span className="text-xs text-gray-600 truncate">
            {formatDisplayName(issue.fields.assignee?.displayName) || "Sin asignar"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {issue.fields.created && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <IconClock size={14} />
              <span>{formatDate(issue.fields.created)}</span>
            </div>
          )}

          {lastComment && (
            <button
              onClick={() => setViewComments(!viewComments)}
              className={`flex items-center gap-1 text-xs p-1 rounded transition-colors ${viewComments
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
            className={`flex items-center gap-1 text-xs p-1 rounded transition-colors ${viewInfo
              ? "bg-green-100 text-green-700"
              : "text-gray-500 hover:text-green-600 hover:bg-green-50"
              }`}
            title="Ver información"
          >
            <IconInfoCircle size={14} />
          </button>
        </div>
      </div>

      {viewComments && lastComment && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {lastComment.author.avatarUrls?.['16x16'] ? (
                <img
                  src={lastComment.author.avatarUrls['16x16']}
                  alt={lastComment.author.displayName}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <IconUser size={12} className="text-gray-500" />
                </div>
              )}

              <span className="text-sm font-medium text-gray-700">
                {formatDisplayName(lastComment.author.displayName)}
              </span>
            </div>

            <span className="text-xs text-gray-500">
              {formatDate(lastComment.created)}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
            {getCommentText(lastComment.body)}
          </div>
        </div>
      )}

      {viewInfo && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm space-y-2">
          {/* FECHA DE CREACIÓN */}
          <div className="flex gap-2">
            <span className="font-medium text-gray-700">Creado:</span>
            <span className="text-gray-600">
              {formatDate(issue.fields.created)}
            </span>
          </div>

          {reporter && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Reporter:</span>

              {reporter.avatarUrls?.['16x16'] ? (
                <img
                  src={reporter.avatarUrls['16x16']}
                  alt={reporter.displayName}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <IconUser size={12} className="text-gray-500" />
                </div>
              )}

              <span className="text-gray-600 truncate">
                {reporter.displayName}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
