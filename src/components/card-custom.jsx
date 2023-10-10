import { Avatar, Box, Card, CardHeader, Flex, Heading, Text } from "@chakra-ui/react"

const CardCustom = ({
    heading,
    handleSelect,
    name,
    picture,
    description,
    avatarSize
}) => {
    return (
        <Card
            onClick={handleSelect}
            cursor="pointer"
            _hover={{ bg: '#ebedf0' }}
            _active={{
                bg: '#dddfe2',
                transform: 'scale(0.98)',
                borderColor: '#bec3c9',
            }}
            w="100%"
        >
            <CardHeader>
                <Flex>
                    <Flex flex={1} gap={2} alignItems='center'>
                        <Avatar size={avatarSize} name={name} src={picture}/>

                        <Box>
                            <Heading size='sm' textTransform="uppercase" color="#205583" fontSize={["xs", "sm"]}>{heading}</Heading>
                            <Text color="#205583" fontSize="xs">{description}</Text>
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
        </Card>
    )
}

export default CardCustom