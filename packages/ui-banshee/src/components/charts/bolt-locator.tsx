'use client';

import { useState } from 'react';
import { ActiveBoltLocator } from '../svg/active-bolt-locator';

export const BoltLocator = () => {
  const [activeBolt, setActiveBolt] = useState<number | null>(null);

  const angles = [
    { x: 4, y: 30 },
    { x: 20, y: 10 },
    { x: 50, y: 0 },
    { x: 80, y: 10 },
    { x: 96, y: 30 },
  ]; // Curved top portion (bolt IDs 3-7)

  // Vertical sides
  const leftSidePoints = [100, 77, 55]; // Left side (bolt IDs 0-2)
  const rightSidePoints = [55, 77, 100]; // Right side (bolt IDs 12-14)

  // Internal bolts
  const centerPoints = [
    { x: 40, y: 77 },
    { x: 40, y: 55 },
    { x: 60, y: 55 },
    { x: 60, y: 77 },
  ]; // Center points (bolt IDs 8-11)

  const toggleBolt = (
    side: 'left' | 'right' | 'curve' | 'center',
    index: number,
  ) => {
    let boltId: number;
    if (side === 'left') {
      boltId = index; // IDs: 0, 1, 2
    } else if (side === 'curve') {
      boltId = index + 3; // IDs: 3, 4, 5, 6, 7
    } else if (side === 'center') {
      boltId = index + 8; // IDs: 8, 9, 10, 11
    } else {
      boltId = index + 12; // IDs: 12, 13, 14
    }

    // Only one bolt active at a time - toggle off if clicking same bolt
    setActiveBolt((prev) => (prev === boltId ? null : boltId));
  };

  const isBoltActive = (
    side: 'left' | 'right' | 'curve' | 'center',
    index: number,
  ) => {
    let boltId: number;
    if (side === 'left') {
      boltId = index; // IDs: 0, 1, 2
    } else if (side === 'curve') {
      boltId = index + 3; // IDs: 3, 4, 5, 6, 7
    } else if (side === 'center') {
      boltId = index + 8; // IDs: 8, 9, 10, 11
    } else {
      boltId = index + 12; // IDs: 12, 13, 14
    }
    return activeBolt === boltId;
  };

  return (
    <div className="ui-banshee-relative md:ui-banshee-w-[60vw] md:ui-banshee-h-[42vh] lg:ui-banshee-w-[25vw] lg:ui-banshee-h-[42vh] ui-banshee-border-4 ui-banshee-border-blue-primary ui-banshee-rounded-t-[50%]">
      {/* Curved top portion */}
      {angles.map(({ x, y }, index) => {
        // Only show points above the center line
        return (
          <div
            key={`curve-${index}`}
            className="ui-banshee-absolute ui-banshee-cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            role="button"
            tabIndex={0}
            onClick={() => {
              toggleBolt('curve', index);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleBolt('curve', index);
              }
            }}
          >
            <ActiveBoltLocator active={isBoltActive('curve', index)} />
          </div>
        );
      })}
      {/* Center points */}
      {centerPoints.map(({ x, y }, index) => (
        <div
          key={`center-${index}`}
          className="ui-banshee-absolute ui-banshee-cursor-pointer"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            toggleBolt('center', index);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleBolt('center', index);
            }
          }}
        >
          <ActiveBoltLocator active={isBoltActive('center', index)} />
        </div>
      ))}

      {/* Left side */}
      {leftSidePoints.map((y, index) => (
        <div
          key={`left-${index}`}
          className="ui-banshee-absolute ui-banshee-cursor-pointer"
          style={{
            left: '0%',
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            toggleBolt('left', index);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleBolt('left', index);
            }
          }}
        >
          <ActiveBoltLocator active={isBoltActive('left', index)} />
        </div>
      ))}

      {/* Right side */}
      {rightSidePoints.map((y, index) => (
        <div
          key={`right-${index}`}
          className="ui-banshee-absolute ui-banshee-cursor-pointer"
          style={{
            left: '100%',
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            toggleBolt('right', index);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleBolt('right', index);
            }
          }}
        >
          <ActiveBoltLocator active={isBoltActive('right', index)} />
        </div>
      ))}
    </div>
  );
};
