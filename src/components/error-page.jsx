import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useRouteError } from 'react-router-dom';
import { Box, Button, Text, VStack } from '@chakra-ui/react';

export default function ErrorPage() {
  const location = useLocation();
  const error = useRouteError();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Si estamos en /robots.txt, no hacemos nada
    if (location.pathname === '/robots.txt') {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          navigate('/inicio'); // Redirige a la página principal
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpiar el intervalo al desmontar
  }, [location.pathname, navigate]);

  if (location.pathname === '/robots.txt') {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="#FFF"
      textAlign="center"
      p={6}
    >
      <VStack spacing={4}>
        <Text fontSize="4xl" fontWeight="bold" color="red.500" fontFamily="Roboto">Oops!</Text>
        <Text fontSize="xl" fontFamily="Roboto">Lo sentimos, ha ocurrido un error inesperado.</Text>
        <Text fontSize="lg" color="gray.500" fontFamily="Roboto">
          <i>{error.statusText || error.message}</i>
        </Text>
        <Text fontSize="lg" fontFamily="Roboto">Serás redirigido a la página principal en <b>{countdown}</b> segundos.</Text>
        <Button colorScheme="teal" onClick={() => navigate('/inicio')}>
          Ir a la página principal ahora
        </Button>
      </VStack>
    </Box>
  );
}
