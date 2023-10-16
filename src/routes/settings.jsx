import { Box, Flex, Text } from "@chakra-ui/react";
import { AppContext } from "../components/context";
import { useContext } from "react";

export default function Settings() {
    const { user } = useContext(AppContext)
    
    return (
        <Flex w="100%" h="100%" px={[0, 2]} flexDirection="column">
            <Flex w="100%" justifyContent="space-between" alignItems="center" flexDirection={["column", "row"]} my={2}>
                <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold">Ajustes</Text>
            </Flex>
            <Box bg="#FFFFFF" w={["280px", "100%"]} h="100%" borderRadius="xl" boxShadow="md">
            </Box>
        </Flex>
    )
}