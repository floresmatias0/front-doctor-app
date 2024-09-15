import PropTypes from "prop-types";
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
  Flex,
} from "@chakra-ui/react";
import { useRef } from "react";

export const AlertModal = ({
  alertHeader,
  alertBody,
  textButtonCancel,
  textButtonConfirm,
  onClose,
  onConfirm,
  isOpen,
  isLoading,
  withCancelButton,
  withConfirmButton,
  customButtonCancel,
  customButtonConfirm,
  customWidth = "auto",
}) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      closeOnOverlayClick={false}
    >
      <AlertDialogOverlay />

      <AlertDialogContent w={customWidth} borderRadius="10px">
        <AlertDialogHeader
          color="#104DBA"
          fontSize="26px"
          fontWeight={900}
          lineHeight="30.47px"
          pb={2}
          px={3}
        >
          {alertHeader}
        </AlertDialogHeader>
        {onClose && (
          <AlertDialogCloseButton
            color="#FFFFFF"
            bg="#104DBA"
            rounded="full"
            size="sm"
            fontWeight={900}
          />
        )}
        <AlertDialogBody p={1}>{alertBody}</AlertDialogBody>
        {isLoading ? (
          <AlertDialogFooter>
            <Center>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Center>
          </AlertDialogFooter>
        ) : (
          <AlertDialogFooter justifyContent="center">
            <Flex minWidth="max-content" gap="2" direction="column" w="100%">
              <Box w="100%">
                <Flex
                  minWidth="max-content"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="2"
                >
                  {withCancelButton && (
                    <Button ref={cancelRef} onClick={onClose}>
                      {textButtonCancel}
                    </Button>
                  )}
                  {withConfirmButton && (
                    <Button
                      colorScheme="red"
                      ml={3}
                      // isDisabled={preferenceId}
                      onClick={onConfirm}
                    >
                      {textButtonConfirm}
                    </Button>
                  )}
                  {customButtonCancel}
                  {customButtonConfirm}
                </Flex>
              </Box>
            </Flex>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

AlertModal.propTypes = {
  alertHeader: PropTypes.string,
  alertBody: PropTypes.any,
  textButtonCancel: PropTypes.string,
  textButtonConfirm: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  isOpen: PropTypes.bool,
  isLoading: PropTypes.bool,
  preferenceId: PropTypes.string,
  withCancelButton: PropTypes.bool,
  withConfirmButton: PropTypes.bool,
  customButtonCancel: PropTypes.any,
  customButtonConfirm: PropTypes.any,
};
