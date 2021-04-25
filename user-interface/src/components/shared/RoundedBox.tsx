import { Box } from "@chakra-ui/layout";
import { ChakraProps } from "@chakra-ui/system";
import React from "react";

const RoundedBox: React.FC<ChakraProps> = ({ children, ...otherProps }) => (
  <Box {...otherProps} m="30px" p="30px" borderWidth="1px" borderRadius="lg">
    {children}
  </Box>
);

export default RoundedBox;
