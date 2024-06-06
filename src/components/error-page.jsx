import React, { useEffect, useState } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Box, Button, Text, VStack } from '@chakra-ui/react';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      navigate('/inicio');
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="#E5F2FA"
      textAlign="center"
      p={6}
    >
      <VStack spacing={4}>
        <Text fontSize="4xl" fontWeight="bold" color="red.500">Oops!</Text>
        <Text fontSize="xl">Lo sentimos, ha ocurrido un error inesperado.</Text>
        <Text fontSize="lg" color="gray.500">
          <i>{error.statusText || error.message}</i>
        </Text>
        <Text fontSize="lg">Serás redirigido a la página principal en <b>{countdown}</b> segundos.</Text>
        <Button colorScheme="teal" onClick={() => navigate('/inicio')}>
          Ir a la página principal ahora
        </Button>
      </VStack>
    </Box>
  );
}
