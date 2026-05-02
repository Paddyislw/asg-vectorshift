import { useState, useCallback, useRef, useEffect } from 'react';

const MIN_WIDTH = 280;
const MAX_WIDTH = 500;
const MIN_HEIGHT = 60;
const CHAR_WIDTH = 7.2;
const LINE_HEIGHT = 18;
const PADDING_X = 24;
const PADDING_Y = 12;

/**
 * Hook that calculates dynamic dimensions for a textarea
 * based on its text content.
 */
export function useAutoResize(text) {
  const [dimensions, setDimensions] = useState({
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
  });

  const measureRef = useRef(null);

  const recalculate = useCallback((content) => {
    if (!content) {
      setDimensions({ width: MIN_WIDTH, height: MIN_HEIGHT });
      return;
    }

    const lines = content.split('\n');
    const longestLine = Math.max(...lines.map((l) => l.length));

    const contentWidth = longestLine * CHAR_WIDTH + PADDING_X;
    const contentHeight = lines.length * LINE_HEIGHT + PADDING_Y;

    setDimensions({
      width: Math.min(Math.max(contentWidth, MIN_WIDTH), MAX_WIDTH),
      height: Math.max(contentHeight, MIN_HEIGHT),
    });
  }, []);

  useEffect(() => {
    recalculate(text);
  }, [text, recalculate]);

  return { dimensions, measureRef };
}
