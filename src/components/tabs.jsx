import PropTypes from 'prop-types'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

const TabsConsult = ({
    tabsHeading = [],
    tabContents = [],
    activeTab = 0,
    setActiveTab
}) => {
    return (
        <Tabs isFitted w={["280px", "480px", "620px", "940px", "1080px", "100%"]} h="100%" overflowY="auto" bg="#FCFEFF" position="relative" variant="unstyled" borderRadius="xl" index={activeTab} boxShadow="md" display="flex" flexDirection="column">
            <TabList p={[0, 2]} overflowX={["scroll", "scroll", "auto"]} flex="0 0 auto">
                {tabsHeading?.map((head, index) =>
                    <Tab
                        key={index}
                        _selected={{ fontWeight: 'bold' }}
                        onClick={() => setActiveTab(index)}
                        color="#205583"
                        fontSize={["xs", "sm", "sm", "sm", "md"]}
                        isDisabled={head.isDisabled}
                        p={1}
                        minW={["130px", "130px", "140px", "auto"]}
                    >
                        {`0${index + 1} ${head.title}`}
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