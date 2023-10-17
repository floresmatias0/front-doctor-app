import PropTypes from 'prop-types'
import { Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

const TabsConsult = ({
    tabsHeading = [],
    tabContents = [],
    activeTab = 0,
    setActiveTab
}) => {
    return (
        <Tabs isFitted w={["280px", "100%"]} h="100%" bg="#FCFEFF" position="relative" variant="unstyled" borderRadius="xl" index={activeTab} boxShadow="md" display="flex" flexDirection="column">
            <TabList p={[0, 2]} overflowX={["scroll", "scroll", "auto"]} flex="0 0 auto">
                {tabsHeading?.map((head, index) =>
                    <Tab
                        key={index}
                        _selected={{ fontWeight: 'bold' }}
                        onClick={() => setActiveTab(index)}
                        color="#205583"
                        fontSize={["sm", "md"]}
                        isDisabled={head.isDisabled}
                        p={1}
                        minW={["130px", "130px", "140px", "auto"]}
                    >
                        {`0${index + 1} ${head.title}`}
                    </Tab>
                )}
            </TabList>
            <TabIndicator
                mt={2}
                h="3px"
                bg="#F7D84C"
                borderRadius="1px"
                display={["none", "block"]}
                flex="0 0 auto"
                top={10}
            />
            <TabPanels flex={1} overflow={["auto", "auto"]}>
                {tabContents?.map((content, index) => <TabPanel h="100%" px={0} py={[0, 4]} key={index}>{content}</TabPanel>)}
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