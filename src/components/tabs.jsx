import PropTypes from 'prop-types'
import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'

const TabsConsult = ({
    tabsHeading = [],
    tabContents = [],
    activeTab = 0,
    setActiveTab
}) => {
    return (
        <Tabs isFitted w={["100%", "920px"]} h={['100%', '468px']} overflowY="auto" bg="#FCFEFF" position="relative" variant="unstyled" borderRadius="xl" index={activeTab} boxShadow="md" display="flex" flexDirection="column">
            <TabList p={[0, 2]} overflowX={["scroll", "scroll", "auto"]} flex="0 0 auto" backgroundColor="#104DBA" boxShadow="0px 4px 4px 0px #00000040">
                {tabsHeading?.map((head, index) =>
                    <Tab
                        key={index}
                        _selected={{ fontWeight: 'bold' }}
                        onClick={() => setActiveTab(index)}
                        isDisabled={head.isDisabled}
                        p={1}
                        minW={["130px", "130px", "140px", "auto"]}
                    >
                        <Flex flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
                            <Text
                                color="#104DBA"
                                bgColor="#FFFFFF"
                                fontWeight="900"
                                rounded="full"
                                w="30px"
                                h="30px"
                                textAlign="center"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                fontSize="xl"
                                lineHeight="24px"
                                mx="auto"
                            >
                                <Box
                                    border="1px"
                                    borderColor="#104DBA"
                                    w="27px"
                                    h="27px"
                                    position="absolute"
                                    rounded="full"
                                />
                                {index + 1}
                            </Text>
                            <Text fontSize="xs" lineHeight="11.72px" textTransform="uppercase" color="#FFF" fontWeight={400}>{head?.title}</Text>
                        </Flex>
                    </Tab>
                )}
            </TabList>
            <TabPanels flex={1}>
                {tabContents?.map((content, index) => <TabPanel overflowY="auto" h="100%" maxH="100%" px={0} py={[0, 2]} key={index}>{content}</TabPanel>)}
            </TabPanels>
        </Tabs>
    )
}

TabsConsult.propTypes = {
    tabsHeading: PropTypes.array.isRequired,
    tabContents: PropTypes.array.isRequired,
    activeTab: PropTypes.number,
    setActiveTab: PropTypes.func,
}

export default TabsConsult