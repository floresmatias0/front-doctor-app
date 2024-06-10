import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

export const CustomAccordion = ({ title, description }) => {
  return (
    <Accordion allowToggle>
      <AccordionItem border='none' boxShadow='0px 4px 4px 0px #00000040' borderEndEndRadius='xl' borderEndStartRadius='xl'>
        <h2>
          <AccordionButton bg='#104DBA' _hover={{ backgroundColor: '#104DBA' }} borderRadius={['md', 'xl']} h={['auto', '46px']}>
            <Box flex="1" textAlign="left" color="white" fontSize={['xs', 'xl']} textTransform="uppercase" fontWeight={700} style={{ fontFamily: 'Roboto' }} >
              {title}
            </Box>
            <AccordionIcon color='white' w={['30px', '40px']} h={['30px', '40px']}/>
          </AccordionButton>
        </h2>
        <AccordionPanel
            py={6}
            dangerouslySetInnerHTML={{ __html: description }}
            fontSize={['sm', 'lg']}
            fontWeight="400"
            color="#000000"
            textTransform='uppercase'
            lineHeight={['15px', '24px']}
        />
      </AccordionItem>
    </Accordion>
  );
};
