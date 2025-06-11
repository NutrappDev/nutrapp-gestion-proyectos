import React from 'react';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import 'react-calendar-timeline/dist/style.css';
import type {JiraIssue } from '../../types/jira';

interface GanttTimelineProps {
  issues: JiraIssue[];
  assignees: String[];
}

const GanttTimeline: React.FC<GanttTimelineProps> = ({ issues, assignees }) => {

  const groups = assignees.map((user, index) => ({
    id: index + 1, 
    title: user.toLowerCase(),
  }));
    const items = issues.map((issue) => {
        const groupId = groups.find(
        (group) => group.title === (issue.assignee?.name.toLowerCase() || 'Sin Asignar')
        )?.id;

        return {
        id: issue.id,
        group: groupId || 0,
        title: issue.summary,
        start_time: moment(issue.created),
        end_time: moment(issue.duedate || issue.updated), // fallback si no tiene duedate
        };
    });

  return (
    <div style={{ height: '600px', width: '90%' }}>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().startOf('day').valueOf()}
        defaultTimeEnd={moment().add(7, 'days').valueOf()}
      />
    </div>
  );
};

export default GanttTimeline;