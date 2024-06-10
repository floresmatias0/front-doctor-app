import { Button, Link } from '@chakra-ui/react'

export const ButtonCustom = ({ children, handleAction, theme = 'light' }) => (
    <Button
        onClick={handleAction}
        bgColor={theme === 'light' ? '#FFFFFF' : '#104DBA'}
        borderRadius="0.5em"
        border={1}
        borderColor={theme === 'light' ? '#104DBA' : 'transparent'}
        px={10}
        py={5}
        color={theme === 'light' ? '#104DBA' : '#FFFFFF'}
        textAlign='center'
        fontWeight={500}
        fontSize={['12px', '16px']}
        lineHeight={['14px', '18px']}
        _hover={{ bg: theme === 'light' ? '#FDFDFD' : '#0D3A91' }}
    >
        {children}
    </Button>
)

export const LinkCustom = ({ children, url, theme = 'light' }) => (
    <Link
        href={url}
        bgColor={theme === 'light' ? '#FFFFFF' : '#104DBA'}
        borderRadius="0.5em"
        border="1px"
        borderColor={theme === 'light' ? '#104DBA' : 'transparent'}
        px={3}
        py={1.5}
        color={theme === 'light' ? '#104DBA' : '#FFFFFF'}
        textAlign='center'
        textDecoration='none'
        fontWeight={500}
        fontSize={['xs', 'md']}
        lineHeight={['14px', '18px']}
        _hover={{ bg: theme === 'light' ? '#F5F5F5' : '#104DBA99' }}
        minW={160}
    >
        {children}
    </Link>
)