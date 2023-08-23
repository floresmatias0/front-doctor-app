"use client";

import {
  Button,
  Flex,
  Text,
  Heading,
  Stack,
  Image,
  Center,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

export default function Login({ handleLogin }) {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Empieza ahora</Heading>
          <Text fontSize={"lg"} color={"gray.600"} w="100%">
            y disfruta de todas nuestras geniales características ✌️
          </Text>
          <Stack spacing={6}>
            <Center p={8}>
              <Button
                w={"full"}
                maxW={"md"}
                variant={"outline"}
                leftIcon={<FcGoogle />}
                onClick={handleLogin}
              >
                <Center>
                  <Text>Iniciar sesion con google</Text>
                </Center>
              </Button>
            </Center>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          }
        />
      </Flex>
    </Stack>
  );
}
