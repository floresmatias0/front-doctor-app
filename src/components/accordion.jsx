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
      <AccordionItem>
        <h2>
          <AccordionButton bg='#104DBA' borderRadius={5} h="23px">
            <Box flex="1" textAlign="left" color="white" fontSize={['xs']} textTransform="uppercase" fontWeight={700} style={{ fontFamily: 'Roboto' }}>
              {title}
            </Box>
            <AccordionIcon color='white'/>
          </AccordionButton>
        </h2>
        <AccordionPanel
            pb={4}
            dangerouslySetInnerHTML={{ __html: description }}
            fontSize={['sm']}
            fontWeight="400"
            color="#104DBA"
            style={{
                lineHeight: "15.23px",
                fontFamily: "Roboto"
            }}
        />
      </AccordionItem>
    </Accordion>
  );
};
