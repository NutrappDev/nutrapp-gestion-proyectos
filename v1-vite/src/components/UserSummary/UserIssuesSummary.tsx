import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Box, Group, ActionIcon, Skeleton, rem } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useAssigneesWithStats } from '@hooks/useIssues';
import { getUserIssueCounts } from '@/utils/issueUtils';
import { getTeamIssueCounts } from '@/utils/teamIssueUtils';
import { SummaryCard } from './summaryCard';
import { useFiltersContext } from '@/context/FiltersContext';
import { ALL_ASSIGNEES, TEAMS } from '@/constants/team';

import classes from './userIssuesSummary.module.scss';

const CARD_WIDTH_PX = 136;
const CARD_GAP_PX = 4;
const SIDE_PADDING_PX = (CARD_WIDTH_PX + CARD_GAP_PX) / 2;

const SUMMARY_CARD_INNER_HEIGHT_PX = 136;
const SKELETON_CARD_MARGIN_PX = 8;

export const UserIssuesSummary: React.FC = () => {

  const { filters } = useFiltersContext();
  const isShowingTeams = useMemo(() => !filters.teamId && !filters.assignee, [filters.teamId, filters.assignee]);

  const assigneesToFetch = useMemo(() => {
    if (isShowingTeams) {
      return ALL_ASSIGNEES;
    } else {
      const selectedTeam = TEAMS.find(team => team.id === filters.teamId);
      return selectedTeam ? selectedTeam.members : filters.assignee ? [filters.assignee] : [];
    }
  }, [isShowingTeams, filters.teamId, filters.assignee]);

  const { data: assigneesStats, isLoading } = useAssigneesWithStats(assigneesToFetch);

  const summaryData = useMemo(() => {
    if (!assigneesStats) return [];
    return isShowingTeams
      ? getTeamIssueCounts(assigneesStats)
      : getUserIssueCounts(assigneesStats);
  }, [assigneesStats, isShowingTeams]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [justifyContent, setJustifyContent] = useState<'center' | 'flex-start'>('center');

  const cardFullWidthWithMargin = CARD_WIDTH_PX + (2 * SKELETON_CARD_MARGIN_PX) + CARD_GAP_PX;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const { scrollWidth, clientWidth, scrollLeft } = containerRef.current;
    let newScroll = scrollLeft;

    if (direction === 'left') {
      newScroll = Math.max(0, scrollLeft - cardFullWidthWithMargin);
    } else {
      newScroll = Math.min(scrollWidth - clientWidth, scrollLeft + cardFullWidthWithMargin);
    }

    containerRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    setScrollPosition(newScroll);
  };

  const handleContainerScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current;
      const contentOverflows = scrollWidth > clientWidth;
      setShowArrows(contentOverflows);
      setJustifyContent(contentOverflows ? 'flex-start' : 'center');
      containerRef.current.scrollTo({ left: 0, behavior: 'auto' });
      setScrollPosition(0);
    }
  }, [summaryData, isLoading]);

  const skeletonCount = 3;

  return (
    <Box
      className={classes.summaryContainerWrapper}
      style={{
        padding: `0 ${rem(SIDE_PADDING_PX)}`,
      }}
    >
      {/* Skeleton Loader */}
      {isLoading && (
        <Group
          wrap="nowrap"
          gap={rem(CARD_GAP_PX)}
          className={classes.scrollGroup}
        >
          {Array.from(new Array(skeletonCount)).map((_, index) => (
            <Box
              key={index}
              className={classes.skeletonCardContainer}
              style={{
                marginBottom: rem(SKELETON_CARD_MARGIN_PX),
                '--card-width-px': rem(CARD_WIDTH_PX),
                '--summary-card-inner-height-px': rem(SUMMARY_CARD_INNER_HEIGHT_PX),
              } as React.CSSProperties}
            >
              <Skeleton height={rem(20)} width="80%" radius="xl" mb={rem(4)} />
              <Skeleton height={rem(43.2)} width={rem(43.2)} radius="50%" style={{ flexShrink: 0 }} />
              <Group
                justify="center"
                gap={rem(4)}
                className={classes.skeletonCountsRow}
              >
                <Skeleton height={rem(24)} width={rem(24)} radius="50%" />
                <Skeleton height={rem(24)} width={rem(24)} radius="50%" />
                <Skeleton height={rem(24)} width={rem(24)} radius="50%" />
              </Group>
            </Box>
          ))}
        </Group>
      )}

      {/* Contenido principal */}
      {!isLoading && (
        <>
          {showArrows && (
            <ActionIcon
              unstyled
              size="lg"
              onClick={() => handleScroll('left')}
              disabled={scrollPosition === 0}
              className={`${classes.scrollButton} ${classes.scrollButtonLeft}`}
              style={{ '--mantine-size-lg': rem(24)} as React.CSSProperties}
            >
              <IconChevronLeft size={20} />
            </ActionIcon>
          )}

          <Group
            ref={containerRef}
            wrap="nowrap"
            gap={rem(CARD_GAP_PX)}
            onScroll={handleContainerScroll}
            className={classes.scrollGroup}
            data-justify-content={justifyContent}
            style={{ '--card-gap-px': rem(CARD_GAP_PX)} as React.CSSProperties}
          >
            {summaryData.map(item => (
              <SummaryCard
                key={'id' in item ? item.id : item.name}
                name={item.name}
                avatarUrl={'avatar' in item ? item.avatar : undefined}
                initials={item.initials}
                counts={item.counts}
                selected={filters.assignee?.toLocaleLowerCase() === item.name.toLocaleLowerCase()}
              />
            ))}
          </Group>

          {showArrows && (
            <ActionIcon
              unstyled
              size="lg"
              onClick={() => handleScroll('right')}
              disabled={
                !containerRef.current ||
                scrollPosition >= containerRef.current.scrollWidth - containerRef.current.clientWidth
              }
              className={`${classes.scrollButton} ${classes.scrollButtonRight}`}
              style={{ '--mantine-size-lg': rem(24)} as React.CSSProperties}
            >
              <IconChevronRight  size={20}/>
            </ActionIcon>
          )}
        </>
      )}
    </Box>
  );
};