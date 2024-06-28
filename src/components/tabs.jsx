import PropTypes from "prop-types";
import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

const TabsConsult = ({
  tabsHeading = [],
  tabContents = [],
  activeTab = 0,
  setActiveTab,
}) => {
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
      borderRadius="xl"
      border="2px"
      borderColor="#104DBA80"
      index={activeTab}
      boxShadow="md"
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
      <TabPanels flex={1} display="flex">
        {tabContents?.map((content, index) => (
          <TabPanel
            overflowY="auto"
            minH="full"
            maxH="full"
            minW="full"
            maxW="full"
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
