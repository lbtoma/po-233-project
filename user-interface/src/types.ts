export type Pixel = [number, number, number];

export enum ModelRegions {
  BACKGROUND,
  FACE,
  HAIR,
  MOUTH,
  EYE,
}

export type ModelFeatures = "background" | "face" | "hair" | "mouth" | "eye";

export type ModelPixelData = Record<ModelFeatures, Pixel[]>;

export type ModelValues = Record<ModelFeatures, Pixel>;
