import React, { Suspense, useState } from "react";
import RoundedBox from "./shared/RoundedBox";
import { ModelValues, Pixel } from "../types";
import { Table, TableCaption, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { Box, Center, Skeleton, Tbody } from "@chakra-ui/react";
import AvatarSelector from "./AvatarSelector";

const FamousImage = React.lazy(() => import("./FamousImage"));

const imageIndexLocalStorageKey = "imageIndex";

let storedImageIndex = parseInt(
  localStorage.getItem(imageIndexLocalStorageKey) ?? ""
);
if (!storedImageIndex) {
  storedImageIndex = 1;
}

const toRgb = (pixel?: Pixel) =>
  pixel
    ? `rgba(${Math.round(pixel[0])}, ${Math.round(pixel[1])}, ${Math.round(
        pixel[2]
      )}, 1.0)`
    : "rgba(0, 0, 0, 1.0)";

const Classification: React.FC = () => {
  const [imageIndex, setImageIndex] = useState(storedImageIndex);
  const [modelValues, setModelValues] = useState<ModelValues | null>(null);

  const incrementImageIndex = () => {
    setImageIndex((lastIndex) => lastIndex + 1);
    localStorage.setItem(
      imageIndexLocalStorageKey,
      (imageIndex + 1).toString()
    );
  };

  const onAvatarSelect = (avatarId: number): void => {
    console.log(avatarId);
    incrementImageIndex();
  };

  const color = (pixel?: Pixel) => (
    <Box
      h="20px"
      w="60px"
      border="solid 1px #F0F0F0"
      backgroundColor={toRgb(pixel)}
    />
  );

  return (
    <>
      <RoundedBox>
        <Center my="60px">
          <Suspense
            fallback={<Skeleton h="218px" w="178px" isLoaded={false} />}
          >
            <FamousImage
              imageIndex={imageIndex}
              setModelValues={setModelValues}
            />
          </Suspense>
        </Center>

        <AvatarSelector onSelected={onAvatarSelect} />
      </RoundedBox>

      <RoundedBox>
        <Table width="600px">
          <TableCaption>Tabela 1: Atributos e valores</TableCaption>
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Cor</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Fundo</Td>
              <Td>{color(modelValues?.background)}</Td>
            </Tr>
            <Tr>
              <Td>Face</Td>
              <Td>{color(modelValues?.face)}</Td>
            </Tr>
            <Tr>
              <Td>Cabelo</Td>
              <Td>{color(modelValues?.hair)}</Td>
            </Tr>
            <Tr>
              <Td>Boca</Td>
              <Td>{color(modelValues?.mouth)}</Td>
            </Tr>
            <Tr>
              <Td>Olhos</Td>
              <Td>{color(modelValues?.eye)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </RoundedBox>
    </>
  );
};

export default Classification;
