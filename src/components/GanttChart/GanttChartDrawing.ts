import * as d3 from 'd3';
import { CHART_CONSTANTS } from './GanttChartConstants';
import type { ParsedJiraIssue, JiraIssue } from '../../types/jira';

export interface Dimensions {
  width: number;
  height: number;
}

interface DrawGanttChartParams {
  svgElement: SVGSVGElement;
  issues: ParsedJiraIssue[];
  rawIssues: JiraIssue[];
  dimensions: Dimensions;
  visibleStartDate: Date;
  visibleEndDate: Date;
  today: Date;
  getProjectColor: (project: string) => string;
}

export const drawGanttChart = ({
  svgElement,
  issues,
  rawIssues,
  dimensions,
  visibleStartDate,
  visibleEndDate,
  today,
  getProjectColor
}: DrawGanttChartParams) => {
  const svg = d3.select(svgElement);
  svg.selectAll('*').remove();

  const { margin, barHeight, barPadding, avatarSize, borderRadius, xScalePadding } = CHART_CONSTANTS;

  // ==================== ORDENAMIENTO DE ISSUES ====================
  const sortedIssues = [...issues].sort((a, b) => {
    const assigneeA = a.assignee?.name || 'Sin Asignado';
    const assigneeB = b.assignee?.name || 'Sin Asignado';

    if (assigneeA === 'Sin Asignado' && assigneeB !== 'Sin Asignado') return 1;
    if (assigneeB === 'Sin Asignado' && assigneeA !== 'Sin Asignado') return -1;

    const assigneeCompare = assigneeA.localeCompare(assigneeB);
    if (assigneeCompare !== 0) {
      return assigneeCompare;
    }
    return a.created.getTime() - b.created.getTime();
  });


  const chartWidth = dimensions.width - margin.left - margin.right;
  const effectiveChartHeight = sortedIssues.length * (barHeight + barPadding);

  svg.attr("height", effectiveChartHeight + margin.top + margin.bottom);

  // ==================== ESCALAS ====================
  const xScale: d3.ScaleTime<number, number> = d3.scaleUtc()
    .domain([visibleStartDate, visibleEndDate])
    .range([xScalePadding, chartWidth - xScalePadding]);

  // El dominio de yScale ahora usa los IDs de las issues ya ordenadas.
  const yScale = d3.scaleBand<string>()
    .domain(sortedIssues.map(d => d.id))
    .range([0, effectiveChartHeight])

  // ==================== CONFIGURACIÓN DEL ZOOM/PAN ====================
  const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 8])
    .extent([[0, 0], [chartWidth, effectiveChartHeight]])
    .wheelDelta(event => -event.deltaY * 0.0005)
    .on('zoom', (event) => {
      const newXScale = event.transform.rescaleX(d3.scaleUtc()
        .domain([visibleStartDate, visibleEndDate])
        .range([xScalePadding, chartWidth - xScalePadding]));

      g.select<SVGGElement>('.x-axis')
        .call(d3.axisTop(newXScale)
          .tickFormat((d: d3.AxisDomain) => d3.utcFormat('%b %d')(d as Date)) as d3.Axis<Date>);

      g.selectAll<SVGRectElement, ParsedJiraIssue>('.gantt-bar')
        .attr('x', d => newXScale(d.created))
        .attr('width', d => {
          const start = d.created;
          const end = d.duedate || d.updated;
          return Math.max(0, newXScale(end) - newXScale(start));
        });

      g.select<SVGLineElement>('.today-line')
        .attr('x1', newXScale(today))
        .attr('x2', newXScale(today));

      g.selectAll<SVGLineElement, Date>('.grid-line-x')
        .attr('x1', d => newXScale(d))
        .attr('x2', d => newXScale(d));
    });

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .call(zoomBehavior as any);


  g.append("clipPath")
    .attr("id", "chart-area-clip")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", chartWidth)
    .attr("height", effectiveChartHeight);

  // Rectángulo para capturar eventos de zoom/pan
  g.append("rect")
    .attr("width", chartWidth)
    .attr("height", effectiveChartHeight)
    .style("fill", "none")
    .style("pointer-events", "all");

  // ==================== CUADRÍCULA Y FILAS INTERCALADAS ====================
  g.selectAll<SVGRectElement, ParsedJiraIssue>('.row-background')
    .data(sortedIssues, d => d.id) 
    .enter()
    .append('rect')
    .attr('class', 'row-background')
    .attr('x', -margin.left) 
    .attr('y', d => yScale(d.id) || 0)
    .attr('width', chartWidth + margin.left) 
    .attr('height', yScale.bandwidth() + barPadding) 
    .attr('fill', (d, i) => i % 2 === 0 ? CHART_CONSTANTS.rowEvenColor : CHART_CONSTANTS.rowOddColor);

  // Líneas de la cuadrícula vertical
  g.append('g')
    .attr('class', 'grid-x')
    .selectAll<SVGLineElement, Date>('line')
    .data(xScale.ticks(d3.utcDay.every(1) as d3.TimeInterval))
    .enter()
    .append('line')
    .attr('class', 'grid-line-x')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', effectiveChartHeight)
    .attr('stroke', CHART_CONSTANTS.gridLineColor)
    .attr('stroke-width', CHART_CONSTANTS.gridLineStrokeWidth)
    .attr('stroke-dasharray', CHART_CONSTANTS.gridLineDashArray)
    .attr("clip-path", "url(#chart-area-clip)");

  // ==================== EJES ====================
  g.append('g')
    .attr('class', 'x-axis')
    .call(d3.axisTop(xScale)
      .tickFormat((d: d3.AxisDomain) => d3.utcFormat('%b %d')(d as Date)) as d3.Axis<Date>);

  // Línea de borde entre las etiquetas y la cuadrícula
  g.append('line')
    .attr('class', 'y-axis-border-line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', effectiveChartHeight)
    .attr('stroke', CHART_CONSTANTS.yAxisBorderColor)
    .attr('stroke-width', CHART_CONSTANTS.yAxisBorderWidth);

  // ==================== BARRAS DEL GANTT ====================
  const bars = g.selectAll<SVGRectElement, ParsedJiraIssue>('.gantt-bar')
    .data(sortedIssues, d => d.id) // Usa sortedIssues
    .enter()
    .append('rect')
    .attr('class', 'gantt-bar')
    .attr('x', d => xScale(d.created))
    .attr('y', d => (yScale(d.id) || 0) + (yScale.bandwidth() - barHeight) / 2)
    .attr('width', d => {
      const start = d.created;
      const end = d.duedate || d.updated;
      return Math.max(0, xScale(end) - xScale(start));
    })
    .attr('height', barHeight)
    .attr('fill', d => getProjectColor(d.project || 'Sin proyecto'))
    .attr('rx', borderRadius)
    .attr('ry', borderRadius)
    .attr("clip-path", "url(#chart-area-clip)");

  // ==================== LÍNEA DEL DÍA ACTUAL ====================
  g.append('line')
    .attr('class', 'today-line')
    .attr('x1', xScale(today))
    .attr('x2', xScale(today))
    .attr('y1', 0)
    .attr('y2', effectiveChartHeight)
    .attr('stroke', CHART_CONSTANTS.todayLineColor)
    .attr('stroke-width', CHART_CONSTANTS.todayLineStrokeWidth)
    .attr('stroke-dasharray', CHART_CONSTANTS.todayLineDashArray)
    .attr("clip-path", "url(#chart-area-clip)");

  // ==================== LABELS DEL EJE Y (con foreignObject) ====================
  g.selectAll<SVGForeignObjectElement, ParsedJiraIssue>('.y-label-group')
    .data(sortedIssues, d => d.id) 
    .enter()
    .append('foreignObject')
    .attr('class', 'y-label-group')
    .attr('x', -margin.left)
    .attr('y', d => (yScale(d.id) || 0) + (yScale.bandwidth() - barHeight) / 2)
    .attr('width', margin.left - 10)
    .attr('height', barHeight)
    .style('pointer-events', 'none')
    .each(function (d, i) {
      const issue = d as ParsedJiraIssue;
      const div = d3.select(this).append('xhtml:div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'flex-start')
        .style('width', '100%')
        .style('height', '100%')
        .style('padding-left', '8px')
        .style('font-size', CHART_CONSTANTS.yLabelFontSize)
        .style('color', CHART_CONSTANTS.yLabelFontColor)
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .style('white-space', 'wrap');


      if (issue.assignee?.avatar) {
        div.append('img')
          .attr('src', issue.assignee.avatar)
          .attr('alt', issue.assignee.name || 'Asignado')
          .style('max-width', `${avatarSize}px`)
          .style('max-height', `${avatarSize}px`)
          .style('width', 'auto')
          .style('height', 'auto')
          .style('border-radius', '50%')
          .style('object-fit', 'cover')
          .style('margin-right', '8px')
          .on('error', function () {
            d3.select(this).attr('src', 'https://via.placeholder.com/28x28.png?text=NA');
          });
      }

      div.append('span')
        .text(issue.summary.length > 20 ? issue.summary.substring(0, 18) + '...' : issue.summary)
        .attr('title', issue.summary);
    });

  // ==================== TOOLTIP ====================
  let tooltip = d3.select('body').select<HTMLDivElement>('.d3-tooltip-gantt');
  if (tooltip.empty()) {
    tooltip = d3.select('body').append<HTMLDivElement>('div')
      .attr('class', 'd3-tooltip-gantt')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background', CHART_CONSTANTS.tooltipBgColor)
      .style('color', CHART_CONSTANTS.tooltipTextColor)
      .style('padding', CHART_CONSTANTS.tooltipPadding)
      .style('border-radius', CHART_CONSTANTS.tooltipBorderRadius)
      .style('pointer-events', 'none')
      .style('z-index', CHART_CONSTANTS.tooltipZIndex);
  }

  bars.on('mouseover', function (event, d) {
    const parsedIssue = d as ParsedJiraIssue; 
    
    const originalIssue = rawIssues.find(
        (iss) => iss.key === parsedIssue.key && iss.id === parsedIssue.id
    );
    
    let originalCreatedDate: Date | undefined;
    let originalUpdatedDate: Date | undefined;
    let originalDuedateDate: Date | undefined;
    
    if (originalIssue) {
        originalCreatedDate = new Date(originalIssue.created);
        originalUpdatedDate = new Date(originalIssue.updated);
        originalDuedateDate = originalIssue.duedate ? new Date(originalIssue.duedate) : undefined;
    } else {
        originalCreatedDate = parsedIssue.created;
        originalUpdatedDate = parsedIssue.updated;
        originalDuedateDate = parsedIssue.duedate;
    }

    const utcDateFormatter = d3.utcFormat('%Y-%m-%d');
    
    const startDateString = originalCreatedDate ? utcDateFormatter(originalCreatedDate) : 'N/A';
    const endDateToDisplay = originalDuedateDate || originalUpdatedDate;
    const endDateString = endDateToDisplay ? utcDateFormatter(endDateToDisplay) : 'N/A';
    
    const assigneeName = parsedIssue.assignee?.name || 'Sin Asignado'; 

    tooltip.transition()
      .duration(200)
      .style('opacity', .9);
    tooltip.html(`
      <strong>${parsedIssue.summary}</strong><br/>
      Asignado: ${assigneeName}<br/>
      ${startDateString} &rarr; ${endDateString}<br/>
      Proyecto: ${parsedIssue.project || 'N/A'}
    `);

    const tooltipNode = tooltip.node();
    if (tooltipNode) {
      const tooltipWidth = tooltipNode.offsetWidth;
      const tooltipHeight = tooltipNode.offsetHeight;

      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      const clientX = event.clientX;
      const clientY = event.clientY;

      const padding = 10;

      let finalLeft = clientX + 10;
      let finalTop = clientY - 28;
      if (finalLeft + tooltipWidth + padding > window.innerWidth) {
        finalLeft = clientX - tooltipWidth - 10;
      }
      if (finalLeft < padding) {
        finalLeft = padding;
      }

      if (finalTop + tooltipHeight + padding > window.innerHeight) {
        finalTop = clientY - tooltipHeight - 10;
      }

      if (finalTop < padding) {
        finalTop = padding;
      }

      tooltip.style('left', (finalLeft + scrollX) + 'px')
        .style('top', (finalTop + scrollY) + 'px');
    }
  })
    .on('mouseout', function () {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });

    return () => {
        if (!tooltip.empty() && tooltip.classed('d3-tooltip-gantt')) {
        tooltip.remove();
        }
    };
};