import React, { useCallback, useMemo, useState } from "react";
import { useIssuesData } from "@hooks/useIssues";
import { KanbanColumn } from "@components/KanbanColumn/KanbanColumn";
import classes from "../../pages/Dashboard/Dashboard.module.scss";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { IssueCard } from "@components/IssueCard/IssueCard";
import type { JiraIssue } from "@/types/jira";
import { updateStatusIssue } from "@/api/jiraApi";

type DataStatus = "Por hacer" | "En curso" | "Esperando aprobación" | "Detenida";
type FrontendStatus = "Backlog" | "En progreso" | "Esperando Aprobacion" | "Detenido";

const columnMap: Record<FrontendStatus, { dataStatus: DataStatus; transitionName: string }> = {
  Backlog: { dataStatus: "Por hacer", transitionName: "Backlog" },
  "En progreso": { dataStatus: "En curso", transitionName: "Backlog_Proceso" },
  "Esperando Aprobacion": { dataStatus: "Esperando aprobación", transitionName: "Detenida" },
  Detenido: { dataStatus: "Detenida", transitionName: "Cancelada" },
};

export const KanbanView: React.FC = () => {
  const {
    data,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useIssuesData();

  const [activeIssue, setActiveIssue] = useState<JiraIssue | null>(null);
  const [activeColumn, setActiveColumn] = useState<FrontendStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: any) => {
    const issue = event.active.data.current?.issue as JiraIssue;
    const columnId = event.active.data.current?.columnId as FrontendStatus;
    setActiveIssue(issue);
    setActiveColumn(columnId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIssue(null);
    setActiveColumn(null);

    if (!over) return;

    const issue = active.data.current?.issue as JiraIssue;
    const from = active.data.current?.columnId as FrontendStatus;
    const to = over.data.current?.columnId as FrontendStatus;

    if (!issue || !from || !to || from === to) return;

    try {
      const mapping = columnMap[to];
      if (!mapping) {
        console.warn(`No mapping definido para la columna: ${to}`);
        return;
      }

      const updateStatus = await updateStatusIssue(issue.id, mapping.transitionName);
      console.log(
        `Issue ${issue.key} actualizada en backend a ${mapping.transitionName}: `,
        updateStatus
      );
    } catch (err) {
      console.error("Error al actualizar en backend:", err);
    }
  };

  const getIssuesAndTotal = (columnTitle: FrontendStatus) => {
    const mapping = columnMap[columnTitle];
    const dataStatus = mapping.dataStatus; 

    const issues =
      data?.pages.flatMap((page) => page.data[dataStatus]?.issues || []) || [];
    const total =
      data?.pages.reduce(
        (sum, page) => sum + (page.data[dataStatus]?.total || 0),
        0
      ) || 0;
    return { issues, total };
  };

  const todoIssues = useMemo(() => getIssuesAndTotal("Backlog"), [data]);
  const inProgressIssues = useMemo(() => getIssuesAndTotal("En progreso"), [data]);
  const awaitingApprovalIssues = useMemo(() => getIssuesAndTotal("Esperando Aprobacion"), [data]);
  const detainedIssues = useMemo(() => getIssuesAndTotal("Detenido"), [data]);

  const loadMoreIssues = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  if (isError) {
    return (
      <div className={classes.errorMessage}>
        Error al cargar incidencias: {error?.message || "Error desconocido"}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={classes.columnsContainer}>
        <KanbanColumn
          title="Backlog"
          data={todoIssues}
          titleColor="#ffffff"
          borderColor="#857C99"
          bgColor="#3f3ead"
          lightBgColor="#F6F6FA"
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreIssues={loadMoreIssues}
          isLoading={isLoading}
        />
        <KanbanColumn
          title="En progreso"
          data={inProgressIssues}
          titleColor="#ffffff"
          borderColor="#f6b46b"
          bgColor="#f3b03f"
          lightBgColor="#F6F6FA"
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreIssues={loadMoreIssues}
          isLoading={isLoading}
        />
        <KanbanColumn
          title="Esperando Aprobacion"
          data={awaitingApprovalIssues}
          titleColor="#ffffff"
          borderColor="#65D9A9"
          bgColor="#22C55E"
          lightBgColor="#F6F6FA"
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreIssues={loadMoreIssues}
          isLoading={isLoading}
        />
        <KanbanColumn
          title="Detenido"
          data={detainedIssues}
          titleColor="#ffffff"
          borderColor="#ef496f"
          bgColor="#e4484b"
          lightBgColor="#F6F6FA"
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreIssues={loadMoreIssues}
          isLoading={isLoading}
        />
      </div>

      <DragOverlay>
        {activeIssue ? (
          <IssueCard issue={activeIssue} columnId={activeColumn || ""} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
