import classes from './IssueSkeleton.module.scss';

export const IssueSkeleton = () => (
  <div className={classes.skeletonContainer}>
    <div className={classes.skeletonLine} style={{ width: '70%' }} />
    <div className={classes.skeletonLine} style={{ width: '50%' }} />
    <div className={classes.skeletonLine} style={{ width: '30%' }} />
  </div>
);
