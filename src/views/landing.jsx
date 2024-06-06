import {
  Flex,
  Text,
  Grid,
  GridItem,
  Box,
  Container,
  Link,
  Heading,
  VStack,
  Image,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import ok from "../assets/ok.png";
import clock from "../assets/clock.png";
import credential from "../assets/credential.png";
import handHeart from "../assets/hand-heart.png";
import Slider from "react-slick";

import { BiLogoLinkedin } from "react-icons/bi";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { CustomAccordion } from "../components/accordion";
import { MdOutlineMenu } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";

const principalServices = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="1.25em" viewBox="0 0 384 512"><path d="M16 64C16 28.7 44.7 0 80 0H304c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zM224 448a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM304 64H80V384H304V64z"/></svg>',
    title: "Consultas Médicas  y Especialistas a tu Alcance",
    description: "Consulta a especialistas en salud infantil desde cualquier lugar y mantén una comunicación directa con nuestros médicos.",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="1.25em" viewBox="0 0 576 512"><path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l44.9 74.7c-16.1 17.6-28.6 38.5-36.6 61.5c-1.9-1.8-3.5-3.9-4.9-6.3L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152zm136 16a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm211.3-43.3c-6.2-6.2-16.4-6.2-22.6 0L416 385.4l-28.7-28.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l40 40c6.2 6.2 16.4 6.2 22.6 0l72-72c6.2-6.2 6.2-16.4 0-22.6z"/></svg>',
    title: "HISTORIAL MÉDICO DIGITAL SEGURO",
    description: "Almacena, accede y realiza un seguimiento seguro del historial y los antecedentes médicos de tus hijos.",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="1.25em" viewBox="0 0 640 512"><path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/></svg>',
    title: "RECURSOS EDUCATIVOS PARA PADRES",
    description: "Descubre información y consejos prácticos sobre la salud infantil.",
    url: "https://comunidad.sap.org.ar/",
  },
  {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="1.25em" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>',
      title: 'CALIDAD DE ATENCIÓN',
      description: 'Evalúa la calidad del servicio y disfruta de una atención de alta calidad.'
  }
];

const steps = [
  {
    position: "01",
    title: "REGÍSTRATE",
    description: 'Crea tu cuenta en minutos y accede a nuestros servicios de atención pediátrica online de manera segura.',
  },
  {
    position: "02",
    title: "CUESTIONARIO DETALLADO",
    description: 'Responde nuestro breve cuestionario para informar al médico sobre tu situación. Cuanta más información proporciones, mejor podremos ayudarte.',
  },
  {
    position: "03",
    title: "CONSULTA PERSONALIZADA",
    description: 'Inicia la videollamada o chat con nuestro pediatra certificado. Recibe atención médica detallada y respuestas a todas tus preguntas.',
  }
];

const Card = ({ index, icon, title, description, url }) => {
  if (url) {
    return (
      <Link
        href={url}
        key={index}
        background="white"
        w="233px"
        h="auto"
        rounded="xl"
        _hover={{ background: "gray.200" }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={5}
        px={6}
        pb={5}
        pt={8}
        position="relative"
        style={{
          "boxShadow": "0px 2px 2px 0px #0000001A"
        }}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: icon }}
          style={{ 
            position: "absolute",
            top: "-21px",
            background: "#104DBA",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        />
        <Text
            color="#104DBA"
            fontWeight="700"
            textAlign="center"
            fontSize={["sm"]}
            textTransform='uppercase'
            style={{
                lineHeight: "15.23px",
                fontFamily: "Roboto"
            }}
        >
          {title}
        </Text>
        <Text
            fontWeight="400"
            textAlign="center"
            fontSize={["sm"]}
            style={{
                lineHeight: "15.23px",
                fontFamily: "Roboto"
            }}
        >
          {description}
        </Text>
      </Link>
    );
  }

  return (
    <Flex
      key={index}
      background="white"
      w="233px"
      h="auto"
      rounded="xl"
      boxShadow="xl"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={5}
      px={6}
      pb={5}
      pt={8}
      position="relative"
      style={{
        "boxShadow": "0px 2px 2px 0px #0000001A"
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: icon }}
        style={{ 
          position: "absolute",
          top: "-21px",
          background: "#104DBA",
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      />
      <Text
            color="#104DBA"
            fontWeight="700"
            textAlign="center"
            fontSize={["sm"]}
            textTransform='uppercase'
            style={{
                lineHeight: "15.23px",
                fontFamily: "Roboto"
            }}
        >
          {title}
        </Text>
        <Text
            fontWeight="400"
            textAlign="center"
            fontSize={["sm"]}
            style={{
                lineHeight: "15.23px",
                fontFamily: "Roboto"
            }}
        >
          {description}
        </Text>
    </Flex>
  );
};

const LandingHome = () => {
  const refServices = useRef(null);
  const refHowWork = useRef(null);
  const refWhoUs = useRef(null);
  const refQuestions = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    // Modificar el overflow del body cuando el menú está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Limpiar el efecto al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleRefFocus = (ref) => {
    setIsOpen(false)
    ref.current.scrollIntoView({ behavior: 'smooth', alignToTop: false })
  }

  return (
    <VStack style={isOpen ? { overflow: "hidden" } : { overflow: "scroll"} }>
      {/* Menu mobile */}
      {isOpen && (
        <Flex w="full" h="100vh" zIndex={2} bgColor="white" flexDirection="column" >
          <Box w="full" boxShadow='0px 2.85px 2.85px 0px #00000014'>
            <Button bgColor='transparent' onClick={() => setIsOpen(false)} float="right">
              <Box bgColor="#104DBA" borderRadius="50%">
                <FaXmark style={{ color: "#FFF", width: "18px", height: "18px", padding: "2px" }}/>
              </Box>
            </Button>
            <Flex alignItems="center" gap={3} ml={10} w="full" mb={6}>
              <Box w={["74px"]} h={["42px"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 462 276"
                  fill="none"
                >
                  <path
                    d="M410.743 102.043C410.743 192.059 337.77 265.032 247.754 265.032C157.738 265.032 84.7654 192.059 84.7654 102.043"
                    stroke="#104DBA"
                    stroke-width="20"
                  />
                  <path
                    d="M141.071 53.1461C141.071 84.2426 115.862 109.451 84.7654 109.451C53.6689 109.451 28.4602 84.2426 28.4602 53.1461"
                    stroke="#104DBA"
                    stroke-width="20"
                  />
                  <path
                    d="M452 51.9794C452 74.6004 433.463 93.0984 410.399 93.0984C387.334 93.0984 368.797 74.6004 368.797 51.9794C368.797 29.3583 387.334 10.8604 410.399 10.8604C433.463 10.8604 452 29.3583 452 51.9794Z"
                    stroke="#104DBA"
                    stroke-width="20"
                  />
                  <circle
                    cx="28.9353"
                    cy="29.7956"
                    r="18.9353"
                    stroke="#104DBA"
                    stroke-width="20"
                  />
                  <circle
                    cx="140.818"
                    cy="29.7956"
                    r="18.9353"
                    stroke="#104DBA"
                    stroke-width="20"
                  />
                </svg>
              </Box>
              <Heading
                as="h1"
                fontSize={["sm"]}
                color="#104DBA"
                textAlign="left"
                w="78px"
                style={{ lineHeight: "18.75px", fontFamily: "Roboto" }}
              >
                Zona Pediatrica
              </Heading>
            </Flex>
          </Box>
          <Flex flexDirection="column" gap={3} px={8} py={6}>
            <Link
              href="/iniciar-sesion"
              fontWeight="500"
              border="1px"
              borderColor="#104DBA"
              color="#104DBA"
              bgColor="white"
              px={2}
              py={1}
              borderRadius={7}
              fontSize={['xs']}
              style={{
                lineHeight: "14px",
                fontFamily: "Roboto"
              }}
              w="120px"
              h="24px"
              textAlign="center"
            >
              INICIAR SESION
            </Link>
            <Link
              href="/iniciar-sesion"
              fontWeight="500"
              color="#FFF"
              bgColor="#104DBA"
              px={2}
              py={1}
              borderRadius={7}
              fontSize={['xs']}
              style={{
                lineHeight: "14px",
                fontFamily: "Roboto"
              }}
              w="120px"
              h="24px"
              textAlign="center"
            >
              REGISTRARSE
            </Link>
            <Divider/>
          </Flex>
          <Flex flexDirection="column" gap={3} px={8}>
            <Box bgColor='transparent' onClick={() => handleRefFocus(refServices)}>
              <Text fontSize="14px" textAlign="left">Servicios</Text>
            </Box>
            <Box bgColor='transparent' onClick={() => handleRefFocus(refHowWork)}>
              <Text fontSize="14px">¿Cómo funciona?</Text>
            </Box>
            <Box bgColor='transparent' onClick={() => handleRefFocus(refWhoUs)}>
              <Text fontSize="14px">¿Quienes somos?</Text>
            </Box>
            <Box bgColor='transparent' onClick={() => handleRefFocus(refQuestions)}>
              <Text fontSize="14px">Preguntas frecuentes</Text>
            </Box>
          </Flex>
        </Flex>
      )}
      {/* Navbar */}
      <Box w="full" h={['54px']} boxShadow='0px 2.85px 2.85px 0px #00000014'>
        <Flex justifyContent="space-between" alignItems="center" h="full" px={6}>
          <Flex alignItems="center" gap={3}>
            <Box w={["33px"]} h={["19px"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 462 276"
                fill="none"
              >
                <path
                  d="M410.743 102.043C410.743 192.059 337.77 265.032 247.754 265.032C157.738 265.032 84.7654 192.059 84.7654 102.043"
                  stroke="#104DBA"
                  stroke-width="20"
                />
                <path
                  d="M141.071 53.1461C141.071 84.2426 115.862 109.451 84.7654 109.451C53.6689 109.451 28.4602 84.2426 28.4602 53.1461"
                  stroke="#104DBA"
                  stroke-width="20"
                />
                <path
                  d="M452 51.9794C452 74.6004 433.463 93.0984 410.399 93.0984C387.334 93.0984 368.797 74.6004 368.797 51.9794C368.797 29.3583 387.334 10.8604 410.399 10.8604C433.463 10.8604 452 29.3583 452 51.9794Z"
                  stroke="#104DBA"
                  stroke-width="20"
                />
                <circle
                  cx="28.9353"
                  cy="29.7956"
                  r="18.9353"
                  stroke="#104DBA"
                  stroke-width="20"
                />
                <circle
                  cx="140.818"
                  cy="29.7956"
                  r="18.9353"
                  stroke="#104DBA"
                  stroke-width="20"
                />
              </svg>
            </Box>
            <Heading
              as="h1"
              fontSize={["xs"]}
              color="#104DBA"
              textAlign="left"
              w="55px"
              style={{ lineHeight: "12.3px", fontFamily: "Roboto" }}
            >
              Zona Pediatrica
            </Heading>
            <Box display={['none', 'inline-block']} bgColor='transparent' onClick={() => handleRefFocus(refServices)}>
              <Text fontSize="14px" textAlign="left">Servicios</Text>
            </Box>
            <Box display={['none', 'inline-block']} bgColor='transparent' onClick={() => handleRefFocus(refHowWork)}>
              <Text fontSize="14px">¿Cómo funciona?</Text>
            </Box>
            <Box display={['none', 'inline-block']} bgColor='transparent' onClick={() => handleRefFocus(refWhoUs)}>
              <Text fontSize="14px">¿Quienes somos?</Text>
            </Box>
            <Box display={['none', 'inline-block']} bgColor='transparent' onClick={() => handleRefFocus(refQuestions)}>
              <Text fontSize="14px">Preguntas frecuentes</Text>
            </Box>
          </Flex>
          <Flex display={['none', 'flex']} alignItems="flex-end" gap={3}>
            <Link
              href="/iniciar-sesion"
              fontWeight="500"
              border="1px"
              borderColor="#104DBA"
              color="#104DBA"
              bgColor="white"
              px={2}
              py={1}
              borderRadius={7}
              fontSize={['xs']}
              style={{
                lineHeight: "14px",
                fontFamily: "Roboto"
              }}
              minW="120px"
              h="24px"
              textAlign="center"
            >
              INICIAR SESION
            </Link>
            <Link
              href="/iniciar-sesion"
              fontWeight="500"
              color="#FFF"
              bgColor="#104DBA"
              px={2}
              py={1}
              borderRadius={7}
              fontSize={['xs']}
              style={{
                lineHeight: "14px",
                fontFamily: "Roboto"
              }}
              minW="120px"
              h="24px"
              textAlign="center"
            >
              REGISTRARSE
            </Link>
            <Divider/>
          </Flex>
          <Button bgColor='transparent' onClick={() => setIsOpen(true)} display={['inline-block', 'none']}>
            <MdOutlineMenu style={{ color: "#104DBA", width: "24px", height: "24px" }}/>
          </Button>
        </Flex>
      </Box>
      {/* Inicio */}
      <Box w="full" h="auto" ref={refServices}>
        <Container maxW={["container.xl", 'full']} mx="auto" position="relative" m={0} p={0}>
          <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={[5, 2]} alignContent="center">
              <Flex justifyContent="center" alignItems="center">
                <Box w={["120px", "500px"]} mb={3} mt={5}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 462 276"
                    fill="none"
                  >
                    <path
                      d="M410.743 102.043C410.743 192.059 337.77 265.032 247.754 265.032C157.738 265.032 84.7654 192.059 84.7654 102.043"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                    <path
                      d="M141.071 53.1461C141.071 84.2426 115.862 109.451 84.7654 109.451C53.6689 109.451 28.4602 84.2426 28.4602 53.1461"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                    <path
                      d="M452 51.9794C452 74.6004 433.463 93.0984 410.399 93.0984C387.334 93.0984 368.797 74.6004 368.797 51.9794C368.797 29.3583 387.334 10.8604 410.399 10.8604C433.463 10.8604 452 29.3583 452 51.9794Z"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                    <circle
                      cx="28.9353"
                      cy="29.7956"
                      r="18.9353"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                    <circle
                      cx="140.818"
                      cy="29.7956"
                      r="18.9353"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                  </svg>

                  <Heading
                    as="h1"
                    fontSize={["sm"]}
                    color="#104DBA"
                    textAlign="center"
                    mt={3}
                    style={{ lineHeight: "17.41px", fontFamily: "Roboto" }}
                  >
                    Zona Pediatrica
                  </Heading>
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              colSpan={[5, 3]}
              alignContent="center"
              bgGradient="linear-gradient(61.63deg, #104DBA 26.71%, #88A6DD 85.17%, #FFFFFF 134.61%)"
            >
              <Box px={10} pt={5} pb={20}>
                <Heading
                  as="h2"
                  size={["lg", "2xl", "2xl"]}
                  color="white"
                  fontWeight="700"
                  w={["247px", "auto", "auto", "494px"]}
                  lineHeight={['28.13px', '56.25px']}
                  style={{
                    fontFamily: "Roboto",
                  }}
                >
                  Bienestar y seguridad para tus pequeños desde casa.
                </Heading>
                <Flex
                  justifyContent="space-around"
                  flexDirection="column"
                  alignItems="center"
                  gap={5}
                  py={6}
                  px={2}
                  w={["267px", "auto", "auto", '540px']}
                >
                  <Flex gap={4} alignItems="center">
                    <Image src={ok} w={[5, 8]} h={[5, 8]} />
                    <Text
                      color="white"
                      fontWeight="400"
                      fontSize={['sm', 'xl']}
                      lineHeight={['15.23px','23.44px']}
                      style={{
                        fontFamily: "Roboto",
                      }}
                    >
                      Nuestra plataforma cuenta con una red de médicos
                      especializados en pediatría y otras áreas de la salud
                      infantiles.
                    </Text>
                  </Flex>
                  <Flex gap={4} alignItems="center">
                    <Image src={clock} w={[5, 8]} h={[5, 8]} />
                    <Text
                      color="white"
                      fontWeight="400"
                      fontSize={['sm', 'xl']}
                      lineHeight={['15.23px','23.44px']}
                      style={{
                        fontFamily: "Roboto"
                      }}
                    >
                      Ahorra tiempo con consultas médicas eficientes y de
                      calidad.
                    </Text>
                  </Flex>
                  <Flex gap={4} alignItems="center">
                    <Image src={credential} w={[5, 8]} h={[5, 8]} />
                    <Text
                      color="white"
                      fontWeight="400"
                      fontSize={['sm', 'xl']}
                      lineHeight={['15.23px','23.44px']}
                      style={{
                        fontFamily: "Roboto"
                      }}
                    >
                      Recuerda que nuestra plataforma es un recurso extra, ¡tu
                      médico de confianza sigue siendo clave!
                    </Text>
                  </Flex>
                </Flex>

                <Text
                  color="white"
                  fontWeight="600"
                  fontSize={['sm', 'xl']}
                  lineHeight={['15.23px','23.44px']}
                  style={{
                    fontFamily: "Roboto"
                  }}
                  my={4}
                >
                  Solicita una consulta médica online en un instante y obtén
                  atención médica especializada desde la comodidad de tu hogar.
                </Text>

                <Link
                  href="/iniciar-sesion"
                  fontWeight="500"
                  color="#104DBA"
                  bg="white"
                  px={2}
                  py={1}
                  borderRadius={7}
                  fontSize={['xs', 'md']}
                  lineHeight={['14px','18.75px']}
                  style={{
                    fontFamily: "Roboto"
                  }}
                  h="24px"
                >
                  SOLICITA TURNO
                </Link>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      {/* Servicios */}
      <Box w="full" py={10} ref={refHowWork}>
        <Container maxW="container.xl">
          <Flex flexDirection="column">
            <Text ml={4} color="#104DBA" fontSize={['sm']} textAlign="center" border='1px' borderColor='#104DBA' w='90px' h='24px' borderRadius={14} fontWeight="700" my={5}>
              Servicios
            </Text>
            
            <Text 
                fontSize={['sm']}
                fontWeight="400"
                color="#104DBA"
                style={{
                    lineHeight: "15.23px",
                    fontFamily: "Roboto"
                }}
                mt={2}
                mb={12}
                ml={4}
            >
                Mejoramos el acceso y la experiencia en la atención médica con consultas rápidas y especializadas, tecnología innovadora y enfoque en la calidad.
            </Text>
          </Flex>
          <Flex
            flexDirection={["column", "row"]}
            justifyContent="space-between"
            alignItems="center"
            gap={10}
            mb={5}
          >
            {principalServices?.length > 0 &&
              principalServices?.map((item, key) => (
                <Card
                  index={key}
                  icon={item?.icon}
                  title={item?.title}
                  description={item?.description}
                  url={item?.url}
                />
              ))}
          </Flex>
        </Container>
      </Box>
      {/* Como funciona */}
      <Box w="full" bgGradient="linear-gradient(61.63deg, #104DBA 26.71%, #88A6DD 85.17%, #FFFFFF 134.61%)" ref={refWhoUs}>
        <Container maxW="container.xl" py={5}>
          <Text ml={4} color="#104DBA" fontSize={['sm']} textAlign="center" w={['140px']} h='24px' borderRadius={14} fontWeight="700" my={5} bg="#FFF">
            ¿Cómo funciona?
          </Text>
          <Flex
            px={5}
            minH="486px"
            alignItems="stretch"
            justifyContent="center"
            pb={5}
            pt={2}
          >
            <Flex flexDirection="column">
              {steps?.length > 0 &&
                  steps?.map((item, key) => (
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="stretch" h="100%" gap={2} my={2}>
                      <Text
                        color="#104DBA"
                        fontWeight="700"
                        style={{
                          lineHeight: "23.44px",
                          fontFamily: "Roboto"
                        }}
                        bgColor='white'
                        borderRadius='50%'
                        w="30px"
                        h="30px"
                        textAlign="center"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        fontSize={["xl"]}
                        position="relative"
                        left="-13px"
                      >
                        <Box border="1px" borderColor="#104DBA" w="28px" h="28px" position="absolute" borderRadius='50%'></Box>
                        {item?.position.substring(1, 2)}
                      </Text>
                      <Box flex="1" display="flex" justifyContent="center" alignItems="center" h="100%" gap={5}>
                        <Box border="1px" w="1px" borderColor="white" flex="1" alignSelf="stretch" m="0 auto"></Box>
                        <Box key={key} w='190px'>
                          <Text
                              color="#FFF"
                              fontWeight="700"
                              textAlign="left"
                              fontSize={["sm"]}
                              textTransform='uppercase'
                              style={{
                                  lineHeight: "15.23px",
                                  fontFamily: "Roboto"
                              }}
                              mb={1}
                          >
                            {item?.title}
                          </Text>
                          <Text
                              color="#FFF"
                              fontWeight="400"
                              textAlign="left"
                              fontSize={["sm"]}
                              style={{
                                  lineHeight: "15.23px",
                                  fontFamily: "Roboto"
                              }}
                          >
                            {item?.description}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
              ))}
            </Flex>
            {/* <Box display="flex" flexDirection={['column']} flex={1}>
              {steps?.length > 0 &&
                steps?.map((item, key) => (
                  <Box key={key} w='175px' mt={10}>
                    <Text
                        color="#FFF"
                        fontWeight="700"
                        textAlign="left"
                        fontSize={["sm"]}
                        textTransform='uppercase'
                        style={{
                            lineHeight: "15.23px",
                            fontFamily: "Roboto"
                        }}
                    >
                      {item?.title}
                    </Text>
                    <Text
                        color="#FFF"
                        fontWeight="400"
                        textAlign="left"
                        fontSize={["sm"]}
                        style={{
                            lineHeight: "15.23px",
                            fontFamily: "Roboto"
                        }}
                    >
                      {item?.description}
                    </Text>
                  </Box>
                ))}
            </Box> */}
          </Flex>
        </Container>
      </Box>
      {/* Quienes somos */}
      <Box w="full" py={10} ref={refQuestions}>
        <Container maxW="container.xl">
          <Flex flexDirection="column">
            <Text ml={4} color="#104DBA" fontSize={['sm']} textAlign="center" border='1px' borderColor='#104DBA' w='134px' h='24px' borderRadius={14} fontWeight="700" my={5}>
              ¿Quienes somos?
            </Text>

            <Text 
                fontSize={['sm']}
                fontWeight="400"
                color="#104DBA"
                style={{
                    lineHeight: "15.23px",
                    fontFamily: "Roboto"
                }}
                mt={2}
                mb={12}
                ml={4}
            >
              Somos un equipo de médicos pediatras comprometidos en ampliar el acceso a la atención médica infantil. Esta plataforma fue creada por médicos especializados para ofrecer apoyo y cuidado conveniente y confiable. 
            </Text>


            <div className="slider-container">
              <Slider {...settings}>
                <div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto" }}>
                    <Box 
                      w="209px"
                      h="305px"
                      bgImage="url('https://s3-alpha-sig.figma.com/img/5613/453c/f02fe5a9edf5f865b3249c8c07f8a1e5?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OI0T-tQiEoc2KHlZVbwdMthY0DmtygEciKu-g4SGzrxkKEOIYqbtk~niXpdvFOx8GYFXRg5jeJFnAXouS2XrhE6dSSZLAqKMZX3NaxVVGbLRAnLpnrNRnhfsbelLqWDFOwK7lT4qG7y6IPYmfcR5D-NfbkIQWxVsoYGhboIw4WbpGmIbnOW-1URzwKGyTbm2cm8CAxpqpDAejo-KstVaJbMktf1PCL16QOP-inKdQjqTaO~YcMco7wAAsh9SGBhtbAqRbU~JNOmkzb2IwvNXCopKi06e5~35HWLMuJCO6gvJBrGGJh5kwh79xgjmlpY0RrWuRVNcKsZc3hs-qvV3vQ__')"
                      rounded="md"
                      bgPosition='center'
                      bgSize='cover'
                      bgRepeat='no-repeat'
                      position="relative"
                      boxShadow="0px 4px 4px 0px #00000026"
                    >
                      <Box 
                        bgColor='white'
                        rounded='md'
                        px={2}
                        pb={2}
                        pt={4}
                        position="absolute"
                        bottom="0"
                        left="0"
                        w="209px"
                      >
                        <Heading as="h3" color='black' fontSize="md">Dr. Rodríguez</Heading>
                        <Text color='black' fontSize="xs">Pediatra especialista en desarrollo</Text>
                      </Box>
                    </Box>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto" }}>
                    <Box 
                      w="209px"
                      h="305px"
                      bgImage="url('https://s3-alpha-sig.figma.com/img/5613/453c/f02fe5a9edf5f865b3249c8c07f8a1e5?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OI0T-tQiEoc2KHlZVbwdMthY0DmtygEciKu-g4SGzrxkKEOIYqbtk~niXpdvFOx8GYFXRg5jeJFnAXouS2XrhE6dSSZLAqKMZX3NaxVVGbLRAnLpnrNRnhfsbelLqWDFOwK7lT4qG7y6IPYmfcR5D-NfbkIQWxVsoYGhboIw4WbpGmIbnOW-1URzwKGyTbm2cm8CAxpqpDAejo-KstVaJbMktf1PCL16QOP-inKdQjqTaO~YcMco7wAAsh9SGBhtbAqRbU~JNOmkzb2IwvNXCopKi06e5~35HWLMuJCO6gvJBrGGJh5kwh79xgjmlpY0RrWuRVNcKsZc3hs-qvV3vQ__')"
                      rounded="md"
                      bgPosition='center'
                      bgSize='cover'
                      bgRepeat='no-repeat'
                      position="relative"
                      boxShadow="0px 4px 4px 0px #00000026"
                    >
                      <Box 
                        bgColor='white'
                        rounded='md'
                        px={2}
                        pb={2}
                        pt={4}
                        position="absolute"
                        bottom="0"
                        left="0"
                        w="209px"
                      >
                        <Heading as="h3" color='black' fontSize="md">Dr. Rodríguez</Heading>
                        <Text color='black' fontSize="xs">Pediatra especialista en desarrollo</Text>
                      </Box>
                    </Box>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto" }}>
                    <Box 
                      w="209px"
                      h="305px"
                      bgImage="url('https://s3-alpha-sig.figma.com/img/5613/453c/f02fe5a9edf5f865b3249c8c07f8a1e5?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OI0T-tQiEoc2KHlZVbwdMthY0DmtygEciKu-g4SGzrxkKEOIYqbtk~niXpdvFOx8GYFXRg5jeJFnAXouS2XrhE6dSSZLAqKMZX3NaxVVGbLRAnLpnrNRnhfsbelLqWDFOwK7lT4qG7y6IPYmfcR5D-NfbkIQWxVsoYGhboIw4WbpGmIbnOW-1URzwKGyTbm2cm8CAxpqpDAejo-KstVaJbMktf1PCL16QOP-inKdQjqTaO~YcMco7wAAsh9SGBhtbAqRbU~JNOmkzb2IwvNXCopKi06e5~35HWLMuJCO6gvJBrGGJh5kwh79xgjmlpY0RrWuRVNcKsZc3hs-qvV3vQ__')"
                      rounded="md"
                      bgPosition='center'
                      bgSize='cover'
                      bgRepeat='no-repeat'
                      position="relative"
                      boxShadow="0px 4px 4px 0px #00000026"
                    >
                      <Box 
                        bgColor='white'
                        rounded='md'
                        px={2}
                        pb={2}
                        pt={4}
                        position="absolute"
                        bottom="0"
                        left="0"
                        w="209px"
                      >
                        <Heading as="h3" color='black' fontSize="md">Dr. Rodríguez</Heading>
                        <Text color='black' fontSize="xs">Pediatra especialista en desarrollo</Text>
                      </Box>
                    </Box>
                  </div>
                </div>
              </Slider>
            </div>

            <Flex
              justifyContent="center"
              alignItems="center"
              border='1px'
              borderColor='#104DBA'
              borderRadius={25}
              ml={4}
              mt={10}
              p={2}
              w="214px"
            >
              <Image
                src={handHeart}
                h={15}
                w={15}
              />
              <Text
                color="#104DBA"
                fontSize={['xs']}
                textAlign="center"
                fontWeight="400"
                style={{
                  lineHeight: "11.72px",
                  fontFamily: "Roboto"
                }}
              >
                Estamos aquí para garantizar la salud y el bienestar de tus hijos.
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" mt={10}>
            <Text ml={4} color="#104DBA" fontSize={['sm']} textAlign="center" border='1px' borderColor='#104DBA' w='161px' h='24px' borderRadius={14} fontWeight="700" my={5}>
              Preguntas frecuentes
            </Text>

            <Flex flexDirection="column" px={4} gap={5} w="full">
              <CustomAccordion
                title="Pregunta 1"
                description="Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen."
              />

              <CustomAccordion
                title="Pregunta 2"
                description="Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen."
              />

              <CustomAccordion
                title="Pregunta 3"
                description="Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen."
              />

              <CustomAccordion
                title="Pregunta 4"
                description="Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen."
              />
            </Flex>
          </Flex>
        </Container>
      </Box>
      {/* Footer */}
      <Flex w="full" py={3} mt={10} bgGradient="linear-gradient(60.5deg, #104DBA -12.14%, #88A6DD 55.27%, #FFFFFF 134.94%)">
        <Container maxW="container.xl" flexDirection="column" gap={4}>
          <Flex alignItems="center" gap={3}>
            <Box w={["33px"]} h={["19px"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 462 276"
                fill="none"
              >
                <path
                  d="M410.743 102.043C410.743 192.059 337.77 265.032 247.754 265.032C157.738 265.032 84.7654 192.059 84.7654 102.043"
                  stroke="#FFF"
                  stroke-width="20"
                />
                <path
                  d="M141.071 53.1461C141.071 84.2426 115.862 109.451 84.7654 109.451C53.6689 109.451 28.4602 84.2426 28.4602 53.1461"
                  stroke="#FFF"
                  stroke-width="20"
                />
                <path
                  d="M452 51.9794C452 74.6004 433.463 93.0984 410.399 93.0984C387.334 93.0984 368.797 74.6004 368.797 51.9794C368.797 29.3583 387.334 10.8604 410.399 10.8604C433.463 10.8604 452 29.3583 452 51.9794Z"
                  stroke="#FFF"
                  stroke-width="20"
                />
                <circle
                  cx="28.9353"
                  cy="29.7956"
                  r="18.9353"
                  stroke="#FFF"
                  stroke-width="20"
                />
                <circle
                  cx="140.818"
                  cy="29.7956"
                  r="18.9353"
                  stroke="#FFF"
                  stroke-width="20"
                />
              </svg>
            </Box>
            <Heading
              as="h1"
              fontSize={["xs"]}
              color="#FFF"
              textAlign="left"
              w="55px"
              style={{ lineHeight: "12.3px", fontFamily: "Roboto" }}
            >
              Zona Pediatrica
            </Heading>
          </Flex>
          
          <Flex gap={2} mt={5}>
            <Link href="https://facebook.com">
              <Box w="15px" h="15px" borderRadius="50%" bgColor='white' display="flex" justifyContent="center" alignItems="center">
                <FaFacebookF style={{ width: '9px', height: '9px', color: "#88A6DD" }} />
              </Box>
            </Link>
            <Link href="https://linkedin.com">
              <Box w="15px" h="15px" borderRadius="50%" bgColor='white' display="flex" justifyContent="center" alignItems="center">
                <BiLogoLinkedin style={{ width: '10px', height: '10px', color: "#88A6DD" }} />
              </Box>
            </Link>
            <Link href="https://instagram.com">
              <Box w="15px" h="15px" borderRadius="50%" bgColor='white' display="flex" justifyContent="center" alignItems="center">
                <FaInstagram style={{ width: '10px', height: '10px', color: "#88A6DD" }} />
              </Box>
            </Link>
          </Flex>

          <Text
            fontSize="xs"
            align="left"
            color="white"
            fontWeight="400"
            style={{ 
              lineHeight: "11.72px",
              fontFamily: "Roboto"
            }}
            mt={3}
          >
            ayuda@zonapediatrica.com.ar
          </Text>
          <Link
            href="/condiciones-del-servicio"
          >
            <Text
              fontSize="xs"
              align="left"
              color="white"
              fontWeight="400"
              style={{ 
                lineHeight: "11.72px",
                fontFamily: "Roboto"
              }}
              mt={2}
            >
              Términos y Condiciones
            </Text>
          </Link>
          <Text
            fontSize="xs"
            align="left"
            color="white"
            fontWeight="400"
            style={{ 
              lineHeight: "11.72px",
              fontFamily: "Roboto"
            }}
            mt={4}
          >
            © 2024 ZonaPediatrica – Todos los derechos reservados
          </Text>
        </Container>
      </Flex>
    </VStack>
  );
};

export default LandingHome;
