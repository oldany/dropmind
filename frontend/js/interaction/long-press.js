/* =================================
   LONG PRESS
================================= */

export function bindLongPress(element, {
  delay = 500,
  shouldStart,
  onTouchStart,
  onTouchMove,
  onLongPress
}) {

  let pressTimer = null;

  function cancelLongPress() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  }

  function handleTouchStart(event) {
    onTouchStart?.(event);

    if (shouldStart && !shouldStart(event)) {
      return;
    }

    pressTimer = setTimeout(() => {
      pressTimer = null;
      onLongPress?.(event);
    }, delay);
  }

  function handleTouchMove(event) {
    onTouchMove?.(event);
    cancelLongPress();
  }

  element.addEventListener("touchstart", handleTouchStart, { passive: false });
  element.addEventListener("touchmove", handleTouchMove);
  element.addEventListener("touchend", cancelLongPress);

  return function cleanup() {
    cancelLongPress();
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchmove", handleTouchMove);
    element.removeEventListener("touchend", cancelLongPress);
  };
}
