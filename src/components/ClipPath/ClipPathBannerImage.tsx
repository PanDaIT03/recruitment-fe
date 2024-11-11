import React, { useState, useEffect } from 'react';

export interface ClipPaths {
  logo: string;
  width?: number;
}

interface ImageNotificationsProps {
  clipPaths: ClipPaths[];
}

const ClipPathImageShowcase: React.FC<ImageNotificationsProps> = ({
  clipPaths,
}) => {
  const [visibleClipPaths, setVisibleClipPaths] = useState<ClipPaths[]>([]);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setVisibleClipPaths((prev) => [...prev, clipPaths[index]]);

      index = (index + 1) % clipPaths.length;

      if (index === 0) {
        setVisibleClipPaths([]);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [clipPaths]);

  return (
    <div>
      {visibleClipPaths.map((clipPath, index) => (
        <div key={index} className="flex items-end justify-end animate-fadeIn">
          <img
            src={clipPath.logo}
            alt="logo"
            width={clipPath.width}
            style={{ width: clipPath.width }}
          />
        </div>
      ))}
    </div>
  );
};

export default ClipPathImageShowcase;
