import React, { useState, useEffect } from 'react';
import {
  Modal, Flex, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, Text, Textarea, useToast, HStack, Icon, Image, Box
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { instance } from "../utils/axios";

const MAX_COMMENT_LENGTH = 200; // Límite de caracteres

const RatingPopup = ({ isOpen, onClose, appointment, organizer, fetchBookings }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (appointment) {
      if (appointment.rating) {
        setRating(appointment.rating);
      }
      if (appointment.comment) {
        setComment(appointment.comment);
      }
    }
  }, [appointment]);

  const handleStarClick = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleCommentChange = (e) => {
    if (e.target.value.length <= MAX_COMMENT_LENGTH) {
      setComment(e.target.value);
    }
  };

  const handleSubmit = async () => {
    try {
      if (organizer && appointment) {
        const validObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

        console.log('Doctor ID:', organizer._id); 
        console.log('Patient ID:', appointment.patientId);
        console.log('Booking ID:', appointment.bookingId);

        if (!validObjectId(organizer._id) || !validObjectId(appointment.patientId)) {
          return toast({
            title: "Error en los datos.",
            description: "Uno o más identificadores no son válidos.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }

        const response = await instance.post('/rating', {
          doctorId: organizer._id,
          patientId: appointment.patientId,
          bookingId: appointment.bookingId,
          rating,
          comment
        });

        if (response.data.success) {
          toast({
            title: "Calificación enviada.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          fetchBookings();
          onClose();
        } else {
          toast({
            title: "Error al enviar la calificación.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Falta información para enviar la calificación.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error al enviar la calificación.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!appointment) {
    return null; // Retorna null si appointment es null para evitar errores.
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>¡Gracias por confiar en Zona Med!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {organizer ? (
            <>
              <Flex alignItems="center">
                <Image 
                  borderRadius="full"
                  boxSize="70px"
                  src={organizer.picture}
                  alt={`Foto del Dr./Dra. ${organizer.name}`}
                  mr={4}
                  ml={4}
                />
                <Text>¿Cómo fue tu experiencia con Dr./Dra. {organizer.name}?</Text>
              </Flex>
              <HStack justifyContent="center" mt={4}>
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <Icon
                      as={FaStar}
                      key={index}
                      color={ratingValue <= rating ? "#FFD700" : "#ddd"}
                      onClick={() => handleStarClick(ratingValue)}
                      cursor="pointer"
                      boxSize={12}
                      marginBottom={2}
                    />
                  );
                })}
              </HStack>
              <Textarea
                placeholder={`Escribe un comentario... (opcional)`}
                value={comment}
                onChange={handleCommentChange}
                mt={4}
                minHeight={130}
              />
              <Text color="gray" fontSize="sm">
                {comment.length} / {MAX_COMMENT_LENGTH} caracteres
              </Text>
            </>
          ) : (
            <Text>Información del doctor no disponible.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} bgColor="#104DBA" color="#ffffff" isDisabled={!organizer || !appointment}>
            Enviar
          </Button>
          <Button variant="ghost" onClick={onClose}>Omitir</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RatingPopup;
