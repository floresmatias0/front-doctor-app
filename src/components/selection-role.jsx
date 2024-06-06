// src/views/LoginSelectRole.jsx
import React from 'react';
import { Button, VStack, Text } from '@chakra-ui/react';

const LoginSelectRole = ({ handleLogin }) => {
  return (
    <VStack spacing={4}>
      <Text fontSize="2xl">Seleccione su rol para iniciar sesión</Text>
      <Button colorScheme="teal" onClick={() => handleLogin('PATIENT')}>Paciente</Button>
      <Button colorScheme="blue" onClick={() => handleLogin('DOCTOR')}>Doctor</Button>
    </VStack>
  );
};

export default LoginSelectRole;
