import * as React from "react";
import styles from "./video_display.module.scss";

interface SwipeEventHandlers extends Partial<GlobalEventHandlers> {
  onTouchStart: React.TouchEventHandler;
  onTouchEnd: React.TouchEventHandler;
}

function useSwipe(
  onSwipeLeft: () => void, onSwipeRight: () => void,
  distanceThreshold = 50, timeThresholdMs = 500
): SwipeEventHandlers {
  const startX = React.useRef(0);
  const startTime = React.useRef(0);

  const onTouchStart: React.TouchEventHandler = React.useCallback(
    (e) => {
      startX.current = e.touches[0].clientX;
      startTime.current = Date.now();
    }, [startX, startTime]);

  const onTouchEnd: React.TouchEventHandler = React.useCallback(
    (e) => {
      const dist = startX.current - e.changedTouches[0].clientX;
      const duration = Date.now() - startTime.current;
      if (Math.abs(dist) > distanceThreshold && duration < timeThresholdMs) {
        if (dist > 0) onSwipeLeft(); else onSwipeRight();
      }
    }, [onSwipeLeft, onSwipeRight, startX, startTime]);
  return { onTouchStart, onTouchEnd };
};

type ElementSize = { width?: number; height?: number };
export function useElementSize<T extends HTMLElement>(): [ElementSize, React.RefObject<T>] {
  const ref = React.useRef<T | null>(null);
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const bbox = ref.current?.getBoundingClientRect();
  const size = React.useMemo( // Return the same object if size hasn't changed
    () => ({ width: bbox?.width, height: bbox?.height } as ElementSize),
    [bbox?.width, bbox?.height]);

  const observer = React.useMemo(
    () => new ResizeObserver(forceUpdate), [forceUpdate]);

  React.useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      observer.observe(element);
      return () => observer.unobserve(element);
    }
  }, [observer, ref.current]);
  return [size, ref];
}


export function Crop(props: React.PropsWithChildren<{
  top?: number | string; left?: number | string;
  width?: number | string; height?: number | string;
  style?: React.CSSProperties;
}>) {
  let { top, left, width, height } = props;
  const _s = (v: any) => typeof (v) === "number" ? `${v}px` : v
  top = top && `calc(-1 * (${_s(top)}))`;
  left = left && `calc(-1 * (${_s(left)}))`;
  return <div className={styles.crop_container}
    style={{ ...props.style, width, height }}>
    <div style={{ top, left }}> {props.children} </div>
  </div>;
}

function NavButton(props: { direction: "left" | "right", onClick?: () => void }) {
  return <div className={styles.video_slider_nav_button}
    onClick={props.onClick}>
    <img src="static/arrow_forward_icon.svg"
      className={props.direction === "left" ? styles.video_slider_nav_button_invert : ""} />
  </div>

}

export function Carousel(props: {
  items: number;
  renderMain: (idx: number, visible: boolean) => React.ReactNode;
  renderThumb: (idx: number) => React.ReactNode;
  className?: string;
  onVideoChanged?: (index: number) => void;
}) {
  const { items } = props;
  const [vidIdx, updIdx] = React.useReducer(
    (x: number, action: { offset: number, is_absolute: boolean }) =>
      action.is_absolute ? action.offset : (x + action.offset + items) % items, 0);
  const navNextVideo = React.useCallback(() => updIdx({ offset: 1, is_absolute: false }), [updIdx]);
  const navPrevVideo = React.useCallback(() => updIdx({ offset: -1, is_absolute: false }), [updIdx]);

  React.useEffect(() => {
    if (props.onVideoChanged) props.onVideoChanged(vidIdx);
  }, [props.onVideoChanged, vidIdx]);

  const navGridCss: React.CSSProperties = {
    gridTemplateColumns: `auto repeat(${items}, 1fr) auto`
  };
  const thumbs = [...Array(items).keys()].map((idx: number) =>
    <div className={styles.video_slider_thumb} key={idx}>
      <div className={styles.tight_container}>
        {props.renderThumb(idx)}
        <div className={styles.video_slider_thumb_overlay} data-selected={idx === vidIdx}
          onClick={() => updIdx({ offset: idx, is_absolute: true })} />
      </div>
    </div>);

  const mainElems = [...Array(items).keys()].map((idx: number) => {
    const visible = idx == vidIdx;
    return <div className={styles.video_slider_main} key={idx}
      style={{ visibility: visible ? "visible" : "hidden" }}>
      {props.renderMain(idx, visible)}
    </div>;
  });

  const swipeEvents = useSwipe(navNextVideo, navPrevVideo);

  return (
    <div className={styles.video_slider + " " + (props.className || "")} {...swipeEvents} >
      {mainElems}
      <div style={navGridCss} className={styles.video_slider_nav}>
        <NavButton direction="left" onClick={navPrevVideo} />
        {thumbs}
        <NavButton direction="right" onClick={navNextVideo} />
      </div>
    </div>
  );
}
