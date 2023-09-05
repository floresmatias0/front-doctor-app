import {
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton,
    AlertDialogBody,
    AlertDialogFooter,
    Spinner,
    Center,
    Box,
    Flex
} from "@chakra-ui/react"
import { useRef } from "react"
import { Wallet } from "@mercadopago/sdk-react"

export const TransitionExample = ({
    alertHeader,
    alertBody,
    textButtonCancel,
    textButtonConfirm,
    onClose,
    onConfirm,
    isOpen,
    isLoading,
    onConfirmPay,
    preferenceId
}) => {
    const cancelRef = useRef()

    return (
        <AlertDialog
          motionPreset='slideInBottom'
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />
  
          <AlertDialogContent>
            <AlertDialogHeader>{alertHeader}</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              {alertBody}
            </AlertDialogBody>
                {isLoading ? (
                    <AlertDialogFooter>
                        <Center>
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />
                        </Center>
                    </AlertDialogFooter>
                    ) : (
                        <AlertDialogFooter justifyContent='center'>
                            <Flex minWidth='max-content' gap='2' direction='column' w='100%'>
                                <Box w='100%'>
                                    <Flex minWidth='max-content' alignItems='center' justifyContent='flex-end' gap='2'>
                                        <Button ref={cancelRef} onClick={onClose}>
                                            {textButtonCancel}
                                        </Button>
                                        <Button colorScheme='red' ml={3} isDisabled={preferenceId} onClick={onConfirmPay}>
                                            {textButtonConfirm}
                                        </Button>
                                    </Flex>
                                </Box>
                                {preferenceId && (
                                    <Wallet
                                        initialization={{ preferenceId }}
                                    />
                                )}
                            </Flex>
                        </AlertDialogFooter>
                    )
                }
          </AlertDialogContent>
        </AlertDialog>
    )
  }