import { Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

const TabsConsult = ({ tabsTitles, tabContents, activeTab, setActiveTab }) => {

    return (
        <Tabs isFitted w="100%" h="100%" bg="#FCFEFF" position="relative" variant="unstyled" borderRadius="xl" index={activeTab}>
            <TabList p={2}>
                {tabsTitles.map((title, index) => <Tab _selected={{ fontWeight: 'bold' }} onClick={() => setActiveTab(index)} color="#205583" fontSize="sm" key={index}>{`0${index + 1} ${title}`}</Tab>)}
            </TabList>
            <TabIndicator
                mt="2px"
                height="3px"
                bg="#F7D84C"
                borderRadius="1px"
            />
            <TabPanels>
                {tabContents.map((content, index) => <TabPanel key={index}>{content}</TabPanel>)}
            </TabPanels>
        </Tabs>
    )
}

export default TabsConsult