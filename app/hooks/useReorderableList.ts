"use client";

import {
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface ReorderableItem {
  slug: string;
  name: string;
}

// Drag-and-drop + keyboard reordering for a list of <li> items, with FLIP-style
// reorder animation and a screen-reader announcement. Has no domain knowledge of
// what the items represent beyond a slug/name pair.
export function useReorderableList<T extends ReorderableItem>(
  items: T[],
  onReorder: (slug: string, targetSlug: string) => void
) {
  const instructionsId = useId();
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const previousRects = useRef(new Map<string, DOMRect>());
  const draggedSlugRef = useRef<string | null>(null);
  const reorderAnimations = useRef(new Map<string, Animation>());
  const justDragged = useRef(false);
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  useLayoutEffect(() => {
    if (previousRects.current.size === 0) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    for (const item of items) {
      const element = itemRefs.current.get(item.slug);
      const previousRect = previousRects.current.get(item.slug);

      if (!element || !previousRect || item.slug === draggedSlugRef.current) {
        continue;
      }

      const nextRect = element.getBoundingClientRect();
      const deltaY = previousRect.top - nextRect.top;

      if (Math.abs(deltaY) < 1 || reduceMotion) {
        continue;
      }

      reorderAnimations.current.get(item.slug)?.cancel();
      reorderAnimations.current.set(
        item.slug,
        element.animate(
          [
            { transform: `translateY(${deltaY}px)` },
            { transform: "translateY(0)" },
          ],
          {
            duration: 320,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        )
      );
    }

    previousRects.current.clear();
  }, [items]);

  function capturePositions() {
    previousRects.current = new Map(
      [...itemRefs.current].map(([slug, element]) => [
        slug,
        element.getBoundingClientRect(),
      ])
    );
  }

  function reorderItem(slug: string, targetSlug: string) {
    capturePositions();
    onReorder(slug, targetSlug);
  }

  function handleDragStart(event: DragEvent<HTMLLIElement>, slug: string) {
    draggedSlugRef.current = slug;
    setDraggedSlug(slug);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", slug);
  }

  function handleDragOver(event: DragEvent<HTMLLIElement>, targetSlug: string) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const activeSlug = draggedSlugRef.current;

    if (!activeSlug || activeSlug === targetSlug) {
      return;
    }

    const activeIndex = items.findIndex(({ slug }) => slug === activeSlug);
    const targetIndex = items.findIndex(({ slug }) => slug === targetSlug);
    const targetRect = event.currentTarget.getBoundingClientRect();
    const pointerIsPastMiddle =
      event.clientY > targetRect.top + targetRect.height / 2;

    if (
      (activeIndex < targetIndex && !pointerIsPastMiddle) ||
      (activeIndex > targetIndex && pointerIsPastMiddle)
    ) {
      return;
    }

    reorderItem(activeSlug, targetSlug);
  }

  function finishDragging() {
    const activeSlug = draggedSlugRef.current;

    if (activeSlug) {
      const item = items.find(({ slug }) => slug === activeSlug);
      const position = items.findIndex(({ slug }) => slug === activeSlug);

      if (item && position !== -1) {
        setAnnouncement(
          `${item.name} moved to position ${position + 1} of ${items.length}.`
        );
      }
    }

    justDragged.current = true;
    draggedSlugRef.current = null;
    setDraggedSlug(null);
    window.setTimeout(() => {
      justDragged.current = false;
    }, 0);
  }

  function handleReorderKeyDown(
    event: KeyboardEvent<HTMLLIElement>,
    slug: string,
    index: number
  ) {
    if (event.target !== event.currentTarget || !event.altKey) {
      return;
    }

    const direction = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    const targetItem = items[index + direction];

    if (direction === 0 || !targetItem) {
      return;
    }

    event.preventDefault();
    reorderItem(slug, targetItem.slug);
    setAnnouncement(
      `${items[index].name} moved to position ${index + direction + 1} of ${items.length}.`
    );
  }

  // Props to spread onto the <li> for a given item; owns all drag/keyboard/ref wiring.
  function getItemProps(slug: string, index: number) {
    return {
      ref: (element: HTMLLIElement | null) => {
        if (element) itemRefs.current.set(slug, element);
        else itemRefs.current.delete(slug);
      },
      draggable: true,
      tabIndex: 0,
      "aria-roledescription": "sortable item",
      "aria-describedby": instructionsId,
      onDragStart: (event: DragEvent<HTMLLIElement>) => handleDragStart(event, slug),
      onDragOver: (event: DragEvent<HTMLLIElement>) => handleDragOver(event, slug),
      onDrop: (event: DragEvent<HTMLLIElement>) => {
        event.preventDefault();
        finishDragging();
      },
      onDragEnd: finishDragging,
      onKeyDown: (event: KeyboardEvent<HTMLLIElement>) =>
        handleReorderKeyDown(event, slug, index),
      onClickCapture: (event: MouseEvent<HTMLLIElement>) => {
        if (justDragged.current) event.preventDefault();
      },
      "data-dragging": draggedSlug === slug || undefined,
    };
  }

  return {
    draggedSlug,
    announcement,
    instructionsId,
    getItemProps,
  };
}
