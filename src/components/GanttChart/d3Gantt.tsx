import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import type { ParsedJiraIssue } from '@/types/jira';
import { getProjectColor, parseJiraIssuesForGantt } from './GanttChartUtils';
import { drawGanttChart } from './GanttChartDrawing';
import { CHART_CONSTANTS } from './GanttChartConstants';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useIssuesData } from '@/hooks/useIssues';
import { filterInProgressIssues } from '@/utils/issueFilters';

const D3GanttChart: React.FC = () => {
  const status = 'En curso';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useIssuesData(status);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [chartWidth, setChartWidth] = useState(0); 
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const allIssuesFlattened = useMemo(() => {
    return data?.pages.flatMap(page => page.data[status].issues) || [];
  }, [data]);

  const inProgressIssues = useMemo(() => filterInProgressIssues(allIssuesFlattened), [allIssuesFlattened]);

  useEffect(() => {
    console.log('In-progress issues updated:', inProgressIssues);
  }, [inProgressIssues]);

  const loadMoreIssues = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const sentinelRef = useInfiniteScroll(loadMoreIssues, isFetchingNextPage || isLoading, hasNextPage);

  const today = useMemo(() => d3.utcDay.floor(new Date()), []); 

  const [visibleStartDate, setVisibleStartDate] = useState<Date>(() => {
    return d3.utcDay.offset(today, -3);
  });

  const handlePrevWeek = useCallback(() => {
    setVisibleStartDate(prevDate => d3.utcDay.offset(prevDate, -7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setVisibleStartDate(prevDate => d3.utcDay.offset(prevDate, 7));
  }, []);

  const visibleEndDate = d3.utcDay.offset(visibleStartDate, 7);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { contentRect } = entries[0];
      if (contentRect.width > 0 && contentRect.width !== chartWidth) {
        setChartWidth(contentRect.width);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
      resizeObserver.disconnect();
    };
  }, [chartWidth]); 


  useEffect(() => {
    if (!svgRef.current || chartWidth === 0 || inProgressIssues.length === 0) {
      if (!isLoading && !isFetchingNextPage && svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
      }
      return;
    }
    
    const parsedIssues: ParsedJiraIssue[] = parseJiraIssuesForGantt(inProgressIssues);

    drawGanttChart({
      svgElement: svgRef.current,
      issues: parsedIssues,
      rawIssues: inProgressIssues,
      dimensions: { width: chartWidth, height: 0 }, 
      visibleStartDate,
      visibleEndDate,
      today,
      getProjectColor,
    });

  }, [inProgressIssues, chartWidth, visibleStartDate, visibleEndDate, today]); 

  const projectList = useMemo(() => {
    const uniqueProjects = new Map<string, string>();
    inProgressIssues.forEach(issue => {
      const projectName = issue.project || 'Sin proyecto';
      if (!uniqueProjects.has(projectName)) {
        uniqueProjects.set(projectName, getProjectColor(projectName));
      }
    });
    return Array.from(uniqueProjects.entries()).map(([name, color]) => ({ name, color }));
  }, [inProgressIssues]);

  const calculatedSvgHeight = useMemo(() => {
    const defaultChartHeight = 300;
    if (inProgressIssues.length === 0 && (isLoading || isFetchingNextPage)) {
        return defaultChartHeight; 
    }
    return inProgressIssues.length > 0 
      ? inProgressIssues.length * (CHART_CONSTANTS.barHeight + CHART_CONSTANTS.barPadding) + CHART_CONSTANTS.margin.top + CHART_CONSTANTS.margin.bottom
      : defaultChartHeight;
  }, [inProgressIssues.length, isLoading, isFetchingNextPage]);

  if (isError) {
    return (
        <div style={{ padding: '1rem', textAlign: 'center', color: 'red' }}>
            Error al cargar la gráfica de Gantt: {error?.message || 'Error desconocido'}
        </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '20px',
          justifyContent: 'center'
        }}>
          {projectList.map((project) => (
            <div key={project.name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: 'rgb(242 241 246)',
              borderRadius: '4px',
              boxShadow: '1px 1px 4px #2a263330'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: project.color
              }} />
              <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{project.name}</span>
            </div>
          ))}
        </div>

        <div style={{
          top: '1rem',
          right: '1rem',
          zIndex: 10,
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={handlePrevWeek}
            style={{
              padding: '8px',
              backgroundColor: '#b4adbe',
              height: '2.4rem',
              width: '2.4rem',
              borderRadius: '2rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
            title="Semana Anterior"
          >
            <IconChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextWeek}
            style={{
              padding: '8px',
              backgroundColor: '#b4adbe',
              height: '2.4rem',
              width: '2.4rem',
              borderRadius: '2rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
            title="Semana Siguiente"
          >
            <IconChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={chartContainerRef}
        style={{ 
          width: '98%', 
          overflowX: 'hidden', 
          position: 'relative',
        }}
      >
        {isLoading && inProgressIssues.length === 0 ? (
          <div style={{
              height: calculatedSvgHeight, 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fdfdfd', 
              borderRadius: '8px',
              border: '1px dashed #e0e0e0', 
              color: '#888',
              fontSize: '1.2rem',
              textAlign: 'center',
              padding: '20px',
              boxSizing: 'border-box',
              margin: '3rem 1rem'
          }}>
              Cargando gráfica de Gantt...
          </div>
        ) : inProgressIssues.length === 0 ? (
          <div style={{
            height: calculatedSvgHeight, 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fdfdfd', 
            borderRadius: '8px',
            border: '1px dashed #e0e0e0', 
            color: '#888',
            fontSize: '1.2rem',
            textAlign: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            margin: '3rem 1rem'
          }}>
            No hay incidencias para mostrar con los filtros aplicados.
          </div>
        ) : (
          <>
            <svg ref={svgRef} width={chartWidth} height={calculatedSvgHeight}> 
            </svg>
            {(isLoading || hasNextPage) && (
                <div style={{
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    padding: '20px', 
                    color: '#888',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                }}>
                    Cargando más incidencias...
                </div>
            )}
            {hasNextPage && (
                <div ref={sentinelRef} style={{ height: '1px' }} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default D3GanttChart;