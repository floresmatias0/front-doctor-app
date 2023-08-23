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
    Center
} from "@chakra-ui/react"

import { useRef } from "react"

export const TransitionExample = ({alertHeader, alertBody, textButtonCancel, textButtonConfirm, onClose, onConfirm, isOpen, isLoading}) => {
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
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                {textButtonCancel}
                            </Button>
                            <Button colorScheme='red' ml={3} onClick={onConfirm}>
                                {textButtonConfirm}
                            </Button>
                        </AlertDialogFooter>
                    )
                }
          </AlertDialogContent>
        </AlertDialog>
    )
  }