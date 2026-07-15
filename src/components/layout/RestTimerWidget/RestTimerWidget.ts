import { computed, ref, watch, type CSSProperties } from 'vue';
import { storeToRefs } from 'pinia';
import { useRestTimerStore, type RestCorner } from 'src/modules/training/stores/restTimer.store';

const EDGE_OFFSET_PX = 16;
const SNAP_DURATION_MS = 250;
const HEADER_SELECTOR = '.q-header';
const FOOTER_SELECTOR = '.q-footer';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useRestTimerWidget() {
  const store = useRestTimerStore();
  const { running, label, corner } = storeToRefs(store);

  const dragging = ref(false);
  const snapping = ref(false);
  const dragPos = ref<{ x: number; y: number } | null>(null);
  const headerHeight = ref(0);
  const footerHeight = ref(0);

  let activePointer: number | null = null;
  let grabOffsetX = 0;
  let grabOffsetY = 0;
  let elementWidth = 0;
  let elementHeight = 0;

  function measureChrome(): void {
    headerHeight.value = document.querySelector(HEADER_SELECTOR)?.getBoundingClientRect().height ?? 0;
    footerHeight.value = document.querySelector(FOOTER_SELECTOR)?.getBoundingClientRect().height ?? 0;
  }

  watch(running, (value) => {
    if (value) measureChrome();
  });

  const style = computed<CSSProperties>(() => {
    if (dragPos.value) {
      return {
        left: `${dragPos.value.x}px`,
        top: `${dragPos.value.y}px`,
        right: 'auto',
        bottom: 'auto',
      };
    }
    const vertical = corner.value.startsWith('top')
      ? { top: `${headerHeight.value + EDGE_OFFSET_PX}px` }
      : { bottom: `${footerHeight.value + EDGE_OFFSET_PX}px` };
    const horizontal = corner.value.endsWith('left')
      ? { left: `${EDGE_OFFSET_PX}px` }
      : { right: `${EDGE_OFFSET_PX}px` };
    return { ...vertical, ...horizontal };
  });

  function verticalBounds(): { top: number; bottom: number } {
    return {
      top: headerHeight.value + EDGE_OFFSET_PX,
      bottom: window.innerHeight - footerHeight.value - elementHeight - EDGE_OFFSET_PX,
    };
  }

  function horizontalBounds(): { left: number; right: number } {
    return { left: EDGE_OFFSET_PX, right: window.innerWidth - elementWidth - EDGE_OFFSET_PX };
  }

  function cornerPosition(target: RestCorner): { x: number; y: number } {
    const v = verticalBounds();
    const h = horizontalBounds();
    return {
      x: target.endsWith('left') ? h.left : h.right,
      y: target.startsWith('top') ? v.top : v.bottom,
    };
  }

  function onPointerDown(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    elementWidth = rect.width;
    elementHeight = rect.height;
    grabOffsetX = event.clientX - rect.left;
    grabOffsetY = event.clientY - rect.top;
    activePointer = event.pointerId;
    el.setPointerCapture(event.pointerId);
    measureChrome();
    snapping.value = false;
    dragging.value = true;
  }

  function onPointerMove(event: PointerEvent): void {
    if (!dragging.value || event.pointerId !== activePointer) return;
    const v = verticalBounds();
    const h = horizontalBounds();
    dragPos.value = {
      x: clamp(event.clientX - grabOffsetX, h.left, h.right),
      y: clamp(event.clientY - grabOffsetY, v.top, v.bottom),
    };
  }

  function onPointerUp(event: PointerEvent): void {
    if (!dragging.value || event.pointerId !== activePointer) return;
    dragging.value = false;
    activePointer = null;
    const pos = dragPos.value;
    if (!pos) return;

    const centerX = pos.x + elementWidth / 2;
    const centerY = pos.y + elementHeight / 2;
    const horizontal = centerX < window.innerWidth / 2 ? 'left' : 'right';
    const vertical = centerY < window.innerHeight / 2 ? 'top' : 'bottom';
    const target = `${vertical}-${horizontal}` satisfies RestCorner;

    snapping.value = true;
    dragPos.value = cornerPosition(target);
    window.setTimeout(() => {
      void store.setCorner(target);
      dragPos.value = null;
      snapping.value = false;
    }, SNAP_DURATION_MS);
  }

  function onCancel(): void {
    void store.stopRest();
  }

  return {
    running,
    label,
    style,
    dragging,
    snapping,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onCancel,
  };
}
