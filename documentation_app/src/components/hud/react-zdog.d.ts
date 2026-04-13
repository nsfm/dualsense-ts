declare module "react-zdog" {
  import React from "react";
  import zdog from "zdog";

  export type ZdogContext = {
    illu: zdog.Illustration;
    scene: zdog.Anchor;
    size: DOMRectReadOnly;
  };

  export function useZdog(): ZdogContext;

  export function useRender(cb: (time: number) => unknown): unknown;

  export const Illustration: React.FunctionComponent<
    React.PropsWithChildren<{
      scene?: zdog.Anchor;
      illu?: zdog.Illustration;
      rotate?: { x?: number; y?: number; z?: number };
      size?: unknown;
      element: "svg" | "canvas";
      zoom?: number;
    }>
  >;

  export const Anchor: React.forwardRef<zdog.Anchor>;
  export const Shape: React.forwardRef<zdog.Shape>;
  export const Group: React.forwardRef<zdog.Group>;
  export const Rect: React.forwardRef<zdog.Rect>;
  export const RoundedRect: React.forwardRef<zdog.RoundedRect>;
  export const Ellipse: React.forwardRef<zdog.Ellipse>;
  export const Polygon: React.forwardRef<zdog.Polygon>;
  export const Hemisphere: React.forwardRef<zdog.Hemisphere>;
  export const Cylinder: React.forwardRef<zdog.Cylinder>;
  export const Cone: React.forwardRef<zdog.Cone>;
  export const Box: React.forwardRef<zdog.Box>;
}
