import { Box } from "@chakra-ui/react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import firebase from "firebase";
import { wrapPromise } from "../utils/promise";
import { ModelPixelData, ModelRegions, ModelValues, Pixel } from "../types";
import regionsClassifications from "../region-classification.json";
import { zeroPadding } from "../utils/formating";

export interface FamousImageProps {
  imageIndex: number;
  setModelValues: React.Dispatch<React.SetStateAction<ModelValues>>;
}

const width = "178px";
const height = "218px";

const bySum = ([sR, sG, sB]: Pixel, [r, g, b]: Pixel): Pixel => [
  sR + r,
  sG + g,
  sB + b,
];

const mean = (sequence: Pixel[]): Pixel =>
  sequence
    .reduce(bySum, [0, 0, 0])
    .map((color) => color / sequence.length) as Pixel;

const FamousImage: React.FC<FamousImageProps> = ({
  imageIndex,
  setModelValues,
}) => {
  const filePath = `images/${zeroPadding(imageIndex, 6)}.png`;

  const url = wrapPromise(`url ${filePath}`, () =>
    firebase.storage().ref(filePath).getDownloadURL()
  ).read();
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  let [image] = useState(() => new Image());

  image = wrapPromise(
    `image ${filePath}`,
    () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        image.crossOrigin = "anonymous";
        image.src = url;
        image.onload = () => {
          resolve(image);
        };
        image.onerror = reject;
      })
  ).read();

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");

    if (context) {
      context.drawImage(image, 0, 0);

      setImmediate(() => {
        const matrix: Pixel[][] = [];

        for (let y = 0; y < image.height; y++) {
          const row: Pixel[] = [];

          for (let x = 0; x < image.width; x++) {
            const pixel = context.getImageData(x, y, 1, 1);
            if (pixel) {
              const { data } = pixel;
              row.push([data[0], data[1], data[2]]);
            } else {
              row.push([0, 0, 0]);
            }
          }

          matrix.push(row);
        }

        setImmediate(() => {
          const modelPixelData: ModelPixelData = {
            background: [],
            face: [],
            hair: [],
            mouth: [],
            eye: [],
          };

          for (let y = 0; y < image.height; y++) {
            for (let x = 0; x < image.width; x++) {
              const region: ModelRegions = regionsClassifications[y][x];
              const pixel = matrix[y][x];

              switch (region) {
                case ModelRegions.FACE:
                  modelPixelData.face.push(pixel);
                  break;
                case ModelRegions.HAIR:
                  modelPixelData.hair.push(pixel);
                  break;
                case ModelRegions.MOUTH:
                  modelPixelData.mouth.push(pixel);
                  break;
                case ModelRegions.EYE:
                  modelPixelData.eye.push(pixel);
                  break;
                default:
                  modelPixelData.background.push(pixel);
              }
            }
          }

          setModelValues({
            background: mean(modelPixelData.background),
            face: mean(modelPixelData.face),
            hair: mean(modelPixelData.hair),
            mouth: mean(modelPixelData.mouth),
            eye: mean(modelPixelData.eye),
          });
        });
      });
    }
  }, [canvasRef, image, setModelValues, imageIndex]);

  return (
    <Box>
      <Suspense fallback={<h3>Carregando...</h3>}>
        <canvas
          id="canvas"
          ref={canvasRef}
          width={width}
          height={height}
        ></canvas>
      </Suspense>
    </Box>
  );
};

export default React.memo(FamousImage);
