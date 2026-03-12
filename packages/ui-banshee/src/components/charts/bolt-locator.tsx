'use client';

import { useState } from 'react';
import { ActiveBoltLocator } from '../svg/active-bolt-locator';

export const BoltLocator = () => {
  const [activeBolts, setActiveBolts] = useState<number[]>([]);
  const radius = 250;
  const centerX = 246;
  const centerY = 246;

  const numPoints = 9;
  const angleOffset = 0.3;
  const angles = Array.from(
    { length: numPoints },
    (_, i) =>
      Math.PI +
      angleOffset +
      (i * (Math.PI - 2 * angleOffset)) / (numPoints - 1),
  );

  // Add straight sides
  const leftSidePoints = [474, 400, 330, 260]; // Y positions for left side (bolt IDs 0-3, bottom to top)
  const rightSidePoints = [260, 330, 400, 474]; // Y positions for right side (bolt IDs 13-16, top to bottom)

  const toggleBolt = (side: 'left' | 'right' | 'curve', index: number) => {
    let boltId: number;
    if (side === 'left') {
      boltId = index;
    } else if (side === 'curve') {
      boltId = index + 4;
    } else {
      boltId = index + 13;
    }
    setActiveBolts((prev) =>
      prev.includes(boltId)
        ? prev.filter((i) => i !== boltId)
        : [...prev, boltId],
    );
  };

  const isBoltActive = (side: 'left' | 'right' | 'curve', index: number) => {
    let boltId: number;
    if (side === 'left') {
      boltId = index;
    } else if (side === 'curve') {
      boltId = index + 4;
    } else {
      boltId = index + 13;
    }
    return activeBolts.includes(boltId);
  };

  return (
    <div className="ui-banshee-relative ui-banshee-w-[500px] ui-banshee-h-[500px] ui-banshee-border-4 ui-banshee-border-blue-primary ui-banshee-rounded-t-[50%]">
      {/* Curved top portion */}
      {angles.map((angle, index) => {
        const x = centerX + (radius - 23) * Math.cos(angle);
        const y = centerY + (radius - 23) * Math.sin(angle);

        // Only show points above the center line
        if (y < centerY) {
          return (
            <div
              key={`curve-${index}`}
              className="ui-banshee-absolute ui-banshee-cursor-pointer"
              style={{
                left: `${x}px`,
                top: `${y}px`,
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
        }
        return null;
      })}

      {/* Left side */}
      {leftSidePoints.map((y, index) => (
        <div
          key={`left-${index}`}
          className="ui-banshee-absolute ui-banshee-cursor-pointer"
          style={{
            left: '19px',
            top: `${y}px`,
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
            left: '473px',
            top: `${y}px`,
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
