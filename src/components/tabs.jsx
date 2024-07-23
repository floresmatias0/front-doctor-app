import Slider from 'react-slick';
import PropTypes from "prop-types";
import {
  Flex,
  Box,
  Heading,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const settings = {
  dots: false,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: false,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
}

const TabsConsult = ({
  tabsHeading = [],
  tabContents = [],
  activeTab = 0,
  setActiveTab,
  slider,
  setSlider
}) => {
  const handleBackSlider = () => {
    slider?.slickPrev()
    setActiveTab(prevActiveTabBack => activeTab > 0 && prevActiveTabBack - 1)
  }

  const handleForwardSlider = () => {
    slider?.slickNext()
    setActiveTab(prevActiveTabForward => activeTab >= 0 && activeTab < 4 && prevActiveTabForward + 1)
  }

  const isPrevDisabled = activeTab === 0 || tabsHeading[activeTab]?.isDisabled;
  const isNextDisabled = activeTab === tabsHeading.length - 1 || tabsHeading[activeTab + 1]?.isDisabled;

  return (
    <Tabs
      isFitted
      w={["full", "full", "full", "662px"]}
      h={["full", "auto"]}
      minH={["full", "468px"]}
      overflowY="auto"
      overflowX="auto"
      bg="#FFF"
      position="relative"
      variant="unstyled"
      borderRadius={["none", "xl"]}
      border={["none", "2px"]}
      borderColor="#104DBA80"
      index={activeTab}
      boxShadow={["none", "md"]}
      display="flex"
      flexDirection="column"
    >
      <TabList
        p={[0, 2]}
        overflowX={["scroll", "scroll", "auto"]}
        flex="0 0 auto"
        backgroundColor="#FFF"
        borderBottom="2px"
        borderColor="#104DBA80"
        display={["none", "flex"]}
      >
        {tabsHeading?.map((head, index) => (
          <Tab
            key={index}
            _selected={{ fontWeight: "bold" }}
            onClick={() => setActiveTab(index)}
            isDisabled={head.isDisabled}
            px={1}
            py={2}
            minW={["130px", "130px", "140px", "auto"]}
          >
            <Flex justifyContent="center" alignItems="center" gap={2}>
              <Text
                color="#FFF"
                bgColor="#104DBA"
                fontWeight="900"
                rounded="full"
                minW="30px"
                h="30px"
                textAlign="center"
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="xl"
                lineHeight="24px"
                mx="auto"
              >
                {index + 1}
              </Text>
              <Text
                fontSize="xs"
                lineHeight="11.72px"
                textTransform="uppercase"
                color="#104DBA"
                fontWeight={400}
              >
                {head?.title}
              </Text>
            </Flex>
          </Tab>
        ))}
      </TabList>
      {/* Slider mobile */}
      <Box borderBottom="1px" borderColor="#104DBA"pb={1} display={["block", "none"]}>
        {/* Left Icon */}
        <IconButton
          aria-label="left-arrow"
          variant="ghost"
          position="absolute"
          left={0}
          top={0}
          zIndex={2}
          size="xs"
          alignContent="center"
          onClick={handleBackSlider}
          isDisabled={isPrevDisabled}
        >
          <MdArrowBackIos size="15px" color="#104DBA"/>
        </IconButton>
        {/* Right Icon */}
        <IconButton
          aria-label="right-arrow"
          variant="ghost"
          position="absolute"
          right={0}
          top={0}
          zIndex={2}
          size="xs"
          alignContent="center"
          onClick={handleForwardSlider}
          isDisabled={isNextDisabled}
        >
          <MdArrowForwardIos size="15px" color="#104DBA"/>
        </IconButton>
        {/* Slider */}
        <Slider {...settings} ref={(slider) => setSlider(slider)}>
          {tabsHeading.map((head, index) => (
            <Box
              key={index}
              position="relative"
            >
              <Heading
                fontSize={["15px", "25px"]}
                fontWeight={700}
                lineHeight={["17.58px", "29.3px"]}
                color="#104DBA"
                px={[4, 0]}
                py={[0.5, 0]}
                textAlign="center"
              >
                {head?.title}
              </Heading>
            </Box>
          ))}
        </Slider>
      </Box>
      <TabPanels flex={1} display="flex">
        {tabContents?.map((content, index) => (
          <TabPanel
            overflowY="auto"
            h="full"
            w="full"
            px={0}
            py={0}
            key={index}
          >
            {content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

TabsConsult.propTypes = {
  tabsHeading: PropTypes.array.isRequired,
  tabContents: PropTypes.array.isRequired,
  activeTab: PropTypes.number,
  setActiveTab: PropTypes.func,
};

export default TabsConsult;
