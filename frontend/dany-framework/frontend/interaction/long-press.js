// ============================================================
// LONG PRESS
// ============================================================

export function bindLongPress(element, {
  delay = 500,
  shouldStart,
  onTouchStart,
  onTouchMove,
  onLongPress
}) {
  let pressTimer = null;

  const cancel = () => {
    clearTimeout(pressTimer);
    pressTimer = null;
  };

  const handleTouchStart = event => {
    onTouchStart?.(event);

    if (shouldStart && !shouldStart(event)) {
      return;
    }

    pressTimer = setTimeout(() => {
      pressTimer = null;
      onLongPress?.(event);
    }, delay);
  };

  const handleTouchMove = event => {
    onTouchMove?.(event);
    cancel();
  };

  element.addEventListener("touchstart", handleTouchStart, { passive: false });
  element.addEventListener("touchmove", handleTouchMove);
  element.addEventListener("touchend", cancel);

  return () => {
    cancel();
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchmove", handleTouchMove);
    element.removeEventListener("touchend", cancel);
  };
}
