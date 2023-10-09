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

export const AlertModal = ({
    alertHeader,
    alertBody,
    textButtonCancel,
    textButtonConfirm,
    onClose,
    onConfirm,
    isOpen,
    isLoading,
    preferenceId,
    withCancelButton,
    withConfirmButton,
    customButtonCancel,
    customButtonConfirm
}) => {
    const cancelRef = useRef()

    return (
        <AlertDialog
          motionPreset='slideInBottom'
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
          closeOnOverlayClick={false}
        >
          <AlertDialogOverlay />
  
          <AlertDialogContent>
            <AlertDialogHeader color="#205583">{alertHeader}</AlertDialogHeader>
            {onClose && <AlertDialogCloseButton />}
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
                                    <Flex minWidth='max-content' alignItems='center' justifyContent='space-between' gap='2'>
                                        {withCancelButton && <Button ref={cancelRef} onClick={onClose}>{textButtonCancel}</Button>}
                                        {withConfirmButton && <Button colorScheme='red' ml={3} isDisabled={preferenceId} onClick={onConfirm}>{textButtonConfirm}</Button>}
                                        {customButtonCancel}
                                        {customButtonConfirm}
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