import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const LogoCustom = ({
  svgWidth = "33px",
  maxSvgWidth = "65px",
  svgHeight = "19px",
  maxSvgWeight = "38px",
  titleWidth = "58px",
  maxTitleWidth = "74px",
  titleLineHeight = "12px",
  titleSize = "xs",
  theme = "light",
  flexDirection = 'row',
  displayText = 'inline-block'
}) => (
  <Flex gap={2} flexDirection={flexDirection}>
    <Box w={[svgWidth, maxSvgWidth]} h={[svgHeight, maxSvgWeight]}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 462 276"
        fill="none"
        style={{ position: "relative", top: "-2px" }}
      >
        <path
          d="M410.743 102.043C410.743 192.059 337.77 265.032 247.754 265.032C157.738 265.032 84.7654 192.059 84.7654 102.043"
          stroke={theme === "light" ? "#104DBA" : "#FFFFFF"}
          strokeWidth="20"
        />
        <path
          d="M141.071 53.1461C141.071 84.2426 115.862 109.451 84.7654 109.451C53.6689 109.451 28.4602 84.2426 28.4602 53.1461"
          stroke={theme === "light" ? "#104DBA" : "#FFFFFF"}
          strokeWidth="20"
        />
        <path
          d="M452 51.9794C452 74.6004 433.463 93.0984 410.399 93.0984C387.334 93.0984 368.797 74.6004 368.797 51.9794C368.797 29.3583 387.334 10.8604 410.399 10.8604C433.463 10.8604 452 29.3583 452 51.9794Z"
          stroke={theme === "light" ? "#104DBA" : "#FFFFFF"}
          strokeWidth="20"
        />
        <circle
          cx="28.9353"
          cy="29.7956"
          r="18.9353"
          stroke={theme === "light" ? "#104DBA" : "#FFFFFF"}
          strokeWidth="20"
        />
        <circle
          cx="140.818"
          cy="29.7956"
          r="18.9353"
          stroke={theme === "light" ? "#104DBA" : "#FFFFFF"}
          strokeWidth="20"
        />
      </svg>
    </Box>
    <Heading
      as="h1"
      fontSize={[titleSize, "sm"]}
      color={theme === "light" ? "#104DBA" : "#FFFFFF"}
      textAlign="left"
      w={[titleWidth, maxTitleWidth]}
      lineHeight={[titleLineHeight, "16px"]}
      alignContent="end"
      display={displayText}
    >
      Zona Pediatrica
    </Heading>
  </Flex>
);

export const TitleCustom = ({
  theme = "light",
  text,
  withBorder = true,
  wMobile = 90,
  wDesktop = 180,
}) => (
  <Text
    color={theme === "light" ? "#104DBA" : "#474747"}
    fontSize={["sm", "1.8rem"]}
    textAlign="center"
    border={withBorder && "1px"}
    borderColor={theme === "light" ? "#104DBA" : "#474747"}
    w={[wMobile, wDesktop]}
    h={[25, 45]}
    borderRadius={[14, 28]}
    fontWeight="700"
    my={5}
    lineHeight={["16px", "32px"]}
    alignContent="center"
    bgColor={theme === "light" ? "#FFFFFF" : "#104DBA"}
  >
    {text}
  </Text>
);
