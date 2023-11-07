import PropTypes from 'prop-types'
import { Avatar, Box, Card, CardHeader, Flex, Heading, Text } from "@chakra-ui/react"

const CardCustom = ({
    heading = "",
    handleSelect,
    picture = "",
    description = "",
    avatarSize = "sm",
    width = ["100%", "300px"],
    headingAlign = "left",
    isSelected,
    height = "100%"
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
            w={width}
            h={height}
            borderWidth={isSelected ? '2px' : '1px'}
            borderColor={isSelected ? '#205583' : 'transparent'}
        >
            <CardHeader p={[2, 6]}>
                <Flex>
                    <Flex flex={1} gap={2} alignItems='center'>
                        {picture && <Avatar size={avatarSize} name={heading} src={picture}/>}

                        <Box w="100%" h="100%">
                            <Heading size='sm' textTransform="uppercase" color="#205583" fontSize={["xs", "sm"]} textAlign={headingAlign}>{heading}</Heading>
                            <Text color="#205583" fontSize="xs">{description}</Text>
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
        </Card>
    )
}

CardCustom.propTypes = {
    heading: PropTypes.string,
    handleSelect: PropTypes.func,
    picture: PropTypes.string,
    description: PropTypes.string,
    avatarSize: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    headingAlign: PropTypes.string,
    isSelected: PropTypes.bool
}

export default CardCustom