import React from "react";
import i1 from "../assets/avatar/1.png";
import i2 from "../assets/avatar/2.png";
import i3 from "../assets/avatar/3.png";
import i4 from "../assets/avatar/4.png";
import i5 from "../assets/avatar/5.png";
import i6 from "../assets/avatar/6.png";
import i7 from "../assets/avatar/7.png";
import i8 from "../assets/avatar/8.png";
import i9 from "../assets/avatar/9.png";
import i10 from "../assets/avatar/10.png";
import i11 from "../assets/avatar/11.png";
import i12 from "../assets/avatar/12.png";
import i13 from "../assets/avatar/13.png";
import i14 from "../assets/avatar/14.png";
import i15 from "../assets/avatar/15.png";
import i16 from "../assets/avatar/16.png";
import i17 from "../assets/avatar/17.png";
import RoundedBox from "./shared/RoundedBox";
import { Image, Button, Center } from "@chakra-ui/react";

interface AvatarSelectorProps {
  onSelected: (id: number) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onSelected }) => {
  const images = [
    i1,
    i2,
    i3,
    i4,
    i5,
    i6,
    i7,
    i8,
    i9,
    i10,
    i11,
    i12,
    i13,
    i14,
    i15,
    i16,
    i17,
  ].map((src, index) => (
    <Button
      key={index}
      p="10px"
      w="140px"
      h="140px"
      borderRadius="0"
      onClick={() => onSelected(index + 1)}
    >
      <Image height="120px" src={src} />
    </Button>
  ));

  return (
    <Center>
      <RoundedBox w="800px">{images}</RoundedBox>
    </Center>
  );
};

export default AvatarSelector;
