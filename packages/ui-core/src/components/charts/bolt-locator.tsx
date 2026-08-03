'use client';

import { ActiveBoltLocator } from '../svg/active-bolt-locator';

export const BoltLocator = ({
  onChange,
  activeBolt,
}: {
  onChange: (key: string | null) => void;
  activeBolt: string | null;
}) => {
  const angles = [
    { x: 4, y: 30, key: 'LH_SHOULDER' },
    { x: 20, y: 10, key: 'LH_BACKS' },
    { x: 50, y: 0, key: 'CENTER_BACKS' },
    { x: 80, y: 10, key: 'RH_BACKS' },
    { x: 96, y: 30, key: 'RH_SHOULDER' },
  ]; // Curved top portion (bolt IDs 3-7)

  // Vertical sides
  const leftSidePoints = [
    { coordinate: 100, key: 'LH_WALL_LOWER' },
    { coordinate: 77, key: 'LH_WALL_CENTER' },
    { coordinate: 55, key: 'LH_WALL_UPPER' },
  ]; // Left side (bolt IDs 0-2)

  const rightSidePoints = [
    { coordinate: 55, key: 'RH_WALL_UPPER' },
    { coordinate: 77, key: 'RH_WALL_CENTER' },
    { coordinate: 100, key: 'RH_WALL_LOWER' },
  ]; // Right side (bolt IDs 12-14)

  // Internal bolts
  const centerPoints = [
    { x: 40, y: 77, key: 'LH_FACE_HIGH' },
    { x: 40, y: 55, key: 'LH_FACE_LOW' },
    { x: 60, y: 55, key: 'RH_FACE_HIGH' },
    { x: 60, y: 77, key: 'RH_FACE_LOW' },
  ]; // Center points (bolt IDs 8-11)

  const toggleBolt = (key: string) => {
    // Only one bolt active at a time - toggle off if clicking same bolt
    onChange(activeBolt === key ? null : key);
  };

  const isBoltActive = (key: string) => {
    return activeBolt === key;
  };

  return (
    <div className="ds-relative md:ds-w-[60vw] md:ds-h-[42vh] xl:ds-w-[25vw] xl:ds-h-[42vh] ds-border-4 ds-border-blue-primary ds-rounded-t-[50%]">
      {/* Curved top portion */}
      {angles.map(({ x, y, key }) => {
        // Only show points above the center line
        return (
          <div
            key={key}
            className="ds-absolute ds-cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            role="button"
            tabIndex={0}
            onClick={() => {
              toggleBolt(key);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleBolt(key);
              }
            }}
          >
            <ActiveBoltLocator active={isBoltActive(key)} />
          </div>
        );
      })}
      {/* Center points */}
      {centerPoints.map(({ x, y, key }) => (
        <div
          key={key}
          className="ds-absolute ds-cursor-pointer"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            toggleBolt(key);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleBolt(key);
            }
          }}
        >
          <ActiveBoltLocator active={isBoltActive(key)} />
        </div>
      ))}

      {/* Left side */}
      {leftSidePoints.map((point) => (
        <div
          key={`left-${point.coordinate}`}
          className="ds-absolute ds-cursor-pointer"
          style={{
            left: '0%',
            top: `${point.coordinate}%`,
            transform: 'translate(-50%, -50%)',
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            toggleBolt(point.key);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleBolt(point.key);
            }
          }}
        >
          <ActiveBoltLocator active={isBoltActive(point.key)} />
        </div>
      ))}

      {/* Right side */}
      {rightSidePoints.map((point) => (
        <div
          key={`right-${point.key}`}
          className="ds-absolute ds-cursor-pointer"
          style={{
            left: '100%',
            top: `${point.coordinate}%`,
            transform: 'translate(-50%, -50%)',
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            toggleBolt(point.key);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleBolt(point.key);
            }
          }}
        >
          <ActiveBoltLocator active={isBoltActive(point.key)} />
        </div>
      ))}
    </div>
  );
};
