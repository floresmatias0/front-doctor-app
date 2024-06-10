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
  Fade
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
import { LinkCustom } from "../components/buttons";
import { LogoCustom, TitleCustom } from "../components/extras";

const principalServices = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" class="icon-responsive" viewBox="0 0 640 512"><path d="M128 32C92.7 32 64 60.7 64 96V352h64V96H512V352h64V96c0-35.3-28.7-64-64-64H128zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480H563.2c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2H19.2z"/></svg>',
    title: "Consultas Médicas  y Especialistas a tu Alcance",
    description:
      "Consulta a especialistas en salud infantil desde cualquier lugar y mantén una comunicación directa con nuestros médicos.",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" class="icon-responsive" viewBox="0 0 384 512"><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>',
    title: "HISTORIAL MÉDICO DIGITAL SEGURO",
    description:
      "Almacena, accede y realiza un seguimiento seguro del historial y los antecedentes médicos de tus hijos.",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" class="icon-responsive" viewBox="0 0 640 512"><path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/></svg>',
    title: "RECURSOS EDUCATIVOS PARA PADRES",
    description:
      "Descubre información y consejos prácticos sobre la salud infantil.",
    url: "https://comunidad.sap.org.ar/",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" class="icon-responsive" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>',
    title: "CALIDAD DE ATENCIÓN",
    description:
      "Evalúa la calidad del servicio y disfruta de una atención de alta calidad.",
  },
];

const steps = [
  {
    position: "01",
    title: "REGÍSTRATE",
    description:
      "Crea tu cuenta en minutos y accede a nuestros servicios de atención pediátrica online de manera segura.",
  },
  {
    position: "02",
    title: "CUESTIONARIO DETALLADO",
    description:
      "Responde nuestro breve cuestionario para informar al médico sobre tu situación.",
  },
  {
    position: "03",
    title: "CONSULTA PERSONALIZADA",
    description:
      "Inicia la videollamada o chat con nuestro pediatra certificado. Recibe atención médica detallada y respuestas a todas tus preguntas.",
  },
];

const docs = new Array(
  {
    title: 'Dr. Rodríguez',
    image: 'https://s3-alpha-sig.figma.com/img/5613/453c/f02fe5a9edf5f865b3249c8c07f8a1e5?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OI0T-tQiEoc2KHlZVbwdMthY0DmtygEciKu-g4SGzrxkKEOIYqbtk~niXpdvFOx8GYFXRg5jeJFnAXouS2XrhE6dSSZLAqKMZX3NaxVVGbLRAnLpnrNRnhfsbelLqWDFOwK7lT4qG7y6IPYmfcR5D-NfbkIQWxVsoYGhboIw4WbpGmIbnOW-1URzwKGyTbm2cm8CAxpqpDAejo-KstVaJbMktf1PCL16QOP-inKdQjqTaO~YcMco7wAAsh9SGBhtbAqRbU~JNOmkzb2IwvNXCopKi06e5~35HWLMuJCO6gvJBrGGJh5kwh79xgjmlpY0RrWuRVNcKsZc3hs-qvV3vQ__',
    description: 'Pediatra especialista en desarrollo',
    enrollment: 'Lorem ipsum dolor sit amet consectetur. Platea non mi sagittis dignissim. Habitant malesuada quis auctor varius lorem ut. Id id tellus sed id sit eleifend a pretium. Luctus velit varius viverra cursus integer arcu. Turpis turpis pretium congue sit. Ut mi morbi mauris a massa pretium eget semper. Massa etiam nisi sit commodo. Velit orci odio lectus eget ultricies luctus ac morbi nec. Quam ornare senectus gravida sit nibh sed quam etiam. Semper pretium eu scelerisque sit diam sit non malesuada. Neque sit viverra tincidunt porttitor facilisi nullam. In.'
  },
  {
    title: 'Dr. Rodríguez',
    image: 'https://s3-alpha-sig.figma.com/img/5613/453c/f02fe5a9edf5f865b3249c8c07f8a1e5?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OI0T-tQiEoc2KHlZVbwdMthY0DmtygEciKu-g4SGzrxkKEOIYqbtk~niXpdvFOx8GYFXRg5jeJFnAXouS2XrhE6dSSZLAqKMZX3NaxVVGbLRAnLpnrNRnhfsbelLqWDFOwK7lT4qG7y6IPYmfcR5D-NfbkIQWxVsoYGhboIw4WbpGmIbnOW-1URzwKGyTbm2cm8CAxpqpDAejo-KstVaJbMktf1PCL16QOP-inKdQjqTaO~YcMco7wAAsh9SGBhtbAqRbU~JNOmkzb2IwvNXCopKi06e5~35HWLMuJCO6gvJBrGGJh5kwh79xgjmlpY0RrWuRVNcKsZc3hs-qvV3vQ__',
    description: 'Pediatra especialista en desarrollo',
    enrollment: 'Lorem ipsum dolor sit amet consectetur. Platea non mi sagittis dignissim. Habitant malesuada quis auctor varius lorem ut. Id id tellus sed id sit eleifend a pretium. Luctus velit varius viverra cursus integer arcu. Turpis turpis pretium congue sit. Ut mi morbi mauris a massa pretium eget semper. Massa etiam nisi sit commodo. Velit orci odio lectus eget ultricies luctus ac morbi nec. Quam ornare senectus gravida sit nibh sed quam etiam. Semper pretium eu scelerisque sit diam sit non malesuada. Neque sit viverra tincidunt porttitor facilisi nullam. In.'
  },
  {
    title: 'Dr. Rodríguez',
    image: 'https://s3-alpha-sig.figma.com/img/5613/453c/f02fe5a9edf5f865b3249c8c07f8a1e5?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OI0T-tQiEoc2KHlZVbwdMthY0DmtygEciKu-g4SGzrxkKEOIYqbtk~niXpdvFOx8GYFXRg5jeJFnAXouS2XrhE6dSSZLAqKMZX3NaxVVGbLRAnLpnrNRnhfsbelLqWDFOwK7lT4qG7y6IPYmfcR5D-NfbkIQWxVsoYGhboIw4WbpGmIbnOW-1URzwKGyTbm2cm8CAxpqpDAejo-KstVaJbMktf1PCL16QOP-inKdQjqTaO~YcMco7wAAsh9SGBhtbAqRbU~JNOmkzb2IwvNXCopKi06e5~35HWLMuJCO6gvJBrGGJh5kwh79xgjmlpY0RrWuRVNcKsZc3hs-qvV3vQ__',
    description: 'Pediatra especialista en desarrollo',
    enrollment: 'Lorem ipsum dolor sit amet consectetur. Platea non mi sagittis dignissim. Habitant malesuada quis auctor varius lorem ut. Id id tellus sed id sit eleifend a pretium. Luctus velit varius viverra cursus integer arcu. Turpis turpis pretium congue sit. Ut mi morbi mauris a massa pretium eget semper. Massa etiam nisi sit commodo. Velit orci odio lectus eget ultricies luctus ac morbi nec. Quam ornare senectus gravida sit nibh sed quam etiam. Semper pretium eu scelerisque sit diam sit non malesuada. Neque sit viverra tincidunt porttitor facilisi nullam. In.'
  }
)

const Card = ({ index, icon, title, description, url }) => {
  if (url) {
    return (
      <Link
        href={url}
        key={index}
        background="white"
        w={["233px", "272px"]}
        minH={["auto", "300px"]}
        rounded="xl"
        _hover={{ background: "gray.200" }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={5}
        px={4}
        pb={5}
        pt={10}
        position="relative"
        boxShadow="0px 4px 4px 0px #0000001A"
        border="0.5px"
        borderColor="#104DBA80"
      >
        <Box
          dangerouslySetInnerHTML={{ __html: icon }}
          w={["42px", "64px"]}
          h={["42px", "64px"]}
          rounded="full"
          bgColor="#104DBA"
          alignContent="center"
          position="absolute"
          top={["-22px", "-36px"]}
          display="flex"
          justifyContent="center"
          alignItems="center"
        />
        <Text
          color="#104DBA"
          fontWeight="700"
          textAlign="center"
          fontSize={["13px", "xl"]}
          textTransform="uppercase"
          lineHeight={["15px", "24px"]}
        >
          {title}
        </Text>
        <Text
          fontWeight="400"
          textAlign="center"
          fontSize={["13px", "xl"]}
          lineHeight={["15px", "24px"]}
          title={description}
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
      w={["233px", "272px"]}
      minH={["auto", "300px"]}
      rounded="xl"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={5}
      px={4}
      pb={5}
      pt={10}
      position="relative"
      boxShadow="0px 4px 4px 0px #0000001A"
      border="0.5px"
      borderColor="#104DBA80"
    >
      <Box
        dangerouslySetInnerHTML={{ __html: icon }}
        w={["42px", "64px"]}
        h={["42px", "64px"]}
        rounded="full"
        bgColor="#104DBA"
        alignContent="center"
        position="absolute"
        top={["-22px", "-36px"]}
        display="flex"
        justifyContent="center"
        alignItems="center"
      />
      <Text
        color="#104DBA"
        fontWeight="700"
        textAlign="center"
        fontSize={["13px", "xl"]}
        textTransform="uppercase"
        lineHeight={["15px", "24px"]}
      >
        {title}
      </Text>
      <Text
        fontWeight="400"
        textAlign="center"
        fontSize={["13px", "xl"]}
        lineHeight={["15px", "24px"]}
        noOfLines={5}
        title={description}
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
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(null);

  const handleDoctorSelect = (idx) => {
    setSelectedDoctorIndex(idx);
  };

  const handleClose = () => {
    setSelectedDoctorIndex(null);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleRefFocus = (ref) => {
    setIsOpen(false);
    ref.current.scrollIntoView({ behavior: "smooth", alignToTop: false });
  };

  return (
    <VStack gap={0}>
      {/* Menu mobile */}
      {isOpen && (
        <Flex
          w="full"
          h="100vh"
          zIndex={2}
          bgColor="white"
          flexDirection="column"
          display={["inline-block", "inline-block", "inline-block", "none"]}
        >
          <Box w="full" boxShadow="0px 2.85px 2.85px 0px #00000014">
            <Button
              bgColor="transparent"
              onClick={() => setIsOpen(false)}
              float="right"
              _active={{ backgroundColor: 'transparent' }}
              _hover={{ backgroundColor: 'transparent' }}
            >
              <Box bgColor="#104DBA" borderRadius='full'>
                <FaXmark
                  style={{
                    color: "#FFF",
                    width: "18px",
                    height: "18px",
                    padding: "2px",
                  }}
                />
              </Box>
            </Button>
            <Box display="inline-block" w="full" mx={10} mb={6}>
              <LogoCustom
                theme="light"
                svgWidth="74px"
                svgHeight="42px"
                titleWidth="78px"
                titleLineHeight="18px"
                titleSize="sm"
              />
            </Box>
          </Box>
          <Flex flexDirection="column" gap={3} px={8} py={6}>
            <LinkCustom url="/iniciar-sesion" theme="light">
              INICIAR SESION
            </LinkCustom>
            <LinkCustom url="/iniciar-sesion" theme="dark">
              REGISTRARSE
            </LinkCustom>
            <Divider />
          </Flex>
          <Flex flexDirection="column" gap={3} px={8}>
            <Box
              bgColor="transparent"
              onClick={() => handleRefFocus(refServices)}
            >
              <Text fontSize="14px" color="#474747">
                Servicios
              </Text>
            </Box>
            <Box
              bgColor="transparent"
              onClick={() => handleRefFocus(refHowWork)}
            >
              <Text fontSize="14px" color="#474747">
                ¿Cómo funciona?
              </Text>
            </Box>
            <Box bgColor="transparent" onClick={() => handleRefFocus(refWhoUs)}>
              <Text fontSize="14px" color="#474747">
                ¿Quienes somos?
              </Text>
            </Box>
            <Box
              bgColor="transparent"
              onClick={() => handleRefFocus(refQuestions)}
            >
              <Text fontSize="14px" color="#474747">
                Preguntas frecuentes
              </Text>
            </Box>
          </Flex>
        </Flex>
      )}
      {/* Navbar */}
      <Box
        w="full"
        h={["54px", "80px"]}
        boxShadow="0px 6px 6px 0px #00000014"
        alignContent="center"
      >
        <Container maxW="8xl" centerContent>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            h="full"
            w="full"
            px={6}
          >
            <Flex alignItems="center" gap={10}>
              <LogoCustom theme="light" />
              <Box
                display={["none", "none", "none", "inline-block"]}
                bgColor="transparent"
                onClick={() => handleRefFocus(refServices)}
                cursor='pointer'
                _hover={{ textDecoration: 'underline' }}
              >
                <Text fontSize="14px" color="#474747">
                  Servicios
                </Text>
              </Box>
              <Box
                display={["none", "none", "none", "inline-block"]}
                bgColor="transparent"
                onClick={() => handleRefFocus(refHowWork)}
                cursor='pointer'
                _hover={{ textDecoration: 'underline' }}
              >
                <Text fontSize="14px" color="#474747">
                  ¿Cómo funciona?
                </Text>
              </Box>
              <Box
                display={["none", "none", "none", "inline-block"]}
                bgColor="transparent"
                onClick={() => handleRefFocus(refWhoUs)}
                cursor='pointer'
                _hover={{ textDecoration: 'underline' }}
              >
                <Text fontSize="14px" color="#474747">
                  ¿Quienes somos?
                </Text>
              </Box>
              <Box
                display={["none", "none", "none", "inline-block"]}
                bgColor="transparent"
                onClick={() => handleRefFocus(refQuestions)}
                cursor='pointer'
                _hover={{ textDecoration: 'underline' }}
              >
                <Text fontSize="14px" color="#474747">
                  Preguntas frecuentes
                </Text>
              </Box>
            </Flex>
            <Flex
              display={["none", "none", "none", "flex"]}
              alignItems="flex-end"
              gap={3}
            >
              <LinkCustom url="/iniciar-sesion" theme="light">
                <Text noOfLines={1}>INICIAR SESION</Text>
              </LinkCustom>
              <LinkCustom url="/iniciar-sesion" theme="dark">
                <Text noOfLines={1}>REGISTRARSE</Text>
              </LinkCustom>
              <Divider />
            </Flex>
            <Button
              bgColor="transparent"
              onClick={() => setIsOpen(true)}
              display={["inline-block", "inline-block", "inline-block", "none"]}
              _active={{ backgroundColor: 'transparent' }}
              _hover={{ backgroundColor: 'transparent' }}
            >
              <MdOutlineMenu
                style={{ color: "#104DBA", width: "24px", height: "24px" }}
              />
            </Button>
          </Flex>
        </Container>
      </Box>
      {/* Inicio */}
      <Box
        w="full"
        h={["auto", 'auto', "888px", "838px", "838px"]}
        boxShadow="0px 6px 22px 0px #D9D9D94D"
      >
        <Container
          maxW={["8xl", "full"]}
          mx="auto"
          h="full"
          position="relative"
          m={0}
          p={0}
        >
          <Grid templateColumns="repeat(12, 1fr)" h="full">
            <GridItem colSpan={[12, 12, 5, 6]} alignContent="center">
              <Flex justifyContent="center" alignItems="center">
                <Box w={["120px", "120px", "500px", "500px"]} mb={3} mt={5}>
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
                    color="#104DBA"
                    textAlign="center"
                    fontWeight={700}
                    mt={[3, 10]}
                    fontSize={["sm", "sm", "6xl", "6xl"]}
                    lineHeight={["18px", "70px"]}
                  >
                    Zona Pediatrica
                  </Heading>
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              colSpan={[12, 12, 7, 6]}
              bgGradient="linear-gradient(61.63deg, #104DBA 26.71%, #88A6DD 85.17%, #FFFFFF 134.61%)"
            >
              <Box px={[10, 14]} pt={[5, 5, 20, 20]} h={["540px", "auto"]}>
                <Heading
                  as="h2"
                  size={["lg", "lg", "2xl", "2xl"]}
                  color="white"
                  fontWeight="900"
                  w={["247px", "auto", "auto", "494px"]}
                  lineHeight={["28.13px", "28.13px", "56.25px", "56.25px"]}
                  fontFamily="Roboto"
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
                  w={["267px", "auto", "auto", "auto", "540px"]}
                >
                  <Flex gap={3} alignItems="center">
                    <Image src={ok} w={[5, 5, 8, 8]} h={[5, 5, 8, 8]} />
                    <Text
                      color="white"
                      fontWeight="400"
                      fontSize={["sm", "sm", "xl", "xl"]}
                      lineHeight={["15.23px", "23.44px"]}
                    >
                      Nuestra plataforma cuenta con una red de médicos
                      especializados en pediatría y otras áreas de la salud
                      infantiles.
                    </Text>
                  </Flex>
                  <Flex gap={4} alignItems="center">
                    <Image src={clock} w={[5, 5, 8, 8]} h={[5, 5, 8, 8]} />
                    <Text
                      color="white"
                      fontWeight="400"
                      fontSize={["sm", "sm", "xl", "xl"]}
                      lineHeight={["15.23px", "23.44px"]}
                      w="full"
                    >
                      Ahorra tiempo con consultas médicas eficientes y de
                      calidad.
                    </Text>
                  </Flex>
                  <Flex gap={4} alignItems="center">
                    <Image src={credential} w={[5, 5, 8, 8]} h={[5, 5, 8, 8]} />
                    <Text
                      color="white"
                      fontWeight="400"
                      fontSize={["sm", "sm", "xl", "xl"]}
                      lineHeight={["15.23px", "23.44px"]}
                      style={{}}
                    >
                      Recuerda que nuestra plataforma es un recurso extra, ¡tu
                      médico de confianza sigue siendo clave!
                    </Text>
                  </Flex>
                </Flex>

                <Text
                  color="white"
                  fontWeight="600"
                  fontSize={["sm", "sm", "xl", "xl"]}
                  lineHeight={["15.23px", "23.44px"]}
                  w={["auto", "auto", "auto", "auto", "495px"]}
                  my={4}
                >
                  Solicita una consulta médica online en un instante y obtén
                  atención médica especializada desde la comodidad de tu hogar.
                </Text>

                <Box mt={10}>
                  <LinkCustom url="/iniciar-sesion" theme="light">
                    SOLICITA TURNO
                  </LinkCustom>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      {/* Servicios */}
      <Box w="full" py={10} ref={refServices}>
        <Container maxW="container.xl">
          <Flex flexDirection="column">
            <Box ml={4}>
              <TitleCustom text="Servicios" theme="light" />
            </Box>

            <Text
              fontSize={["sm", "xl"]}
              fontWeight="400"
              color="#104DBA"
              mt={2}
              mb={12}
              ml={4}
              lineHeight={["15px", "24px"]}
              w={["auto", "auto", "auto", "725px"]}
            >
              Mejoramos el acceso y la experiencia en la atención médica con
              consultas rápidas y especializadas, tecnología innovadora y
              enfoque en la calidad.
            </Text>
          </Flex>
          <Flex
            flexDirection={["column", "column", "row", "row"]}
            justifyContent="space-between"
            alignItems="center"
            gap={10}
            my={[5, 20]}
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
      <Box
        w="full"
        bgGradient="linear-gradient(61.63deg, #104DBA 26.71%, #88A6DD 85.17%, #FFFFFF 134.61%)"
      >
        <Container maxW="container.xl" py={5}>
          <Box ml={4} ref={refHowWork}>
            <TitleCustom
              text="¿Cómo funciona?"
              theme="light"
              withBorder={false}
              wMobile={140}
              wDesktop={280}
            />
          </Box>
          <Flex
            minH={["486px", "400px"]}
            alignItems="stretch"
            justifyContent="center"
            pb={10}
            pt={2}
          >
            <Flex
              flexDirection="column"
              display={["flex", "flex", "none", "none"]}
            >
              {steps?.length > 0 &&
                steps?.map((item, key) => (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="stretch"
                    h="100%"
                    gap={2}
                    my={2}
                  >
                    <Text
                      color="#104DBA"
                      bgColor="#FFFFFF"
                      fontWeight="900"
                      rounded="full"
                      w="30px"
                      h="30px"
                      textAlign="center"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      fontSize="xl"
                      position="relative"
                      left="-13px"
                      lineHeight="24px"
                    >
                      <Box
                        border="1px"
                        borderColor="#104DBA"
                        w="28px"
                        h="28px"
                        position="absolute"
                        rounded="full"
                      ></Box>
                      {item?.position.substring(1, 2)}
                    </Text>
                    <Box
                      flex="1"
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      alignItems="center"
                      h="100%"
                      gap={5}
                    >
                      <Box
                        border="1px"
                        w="1px"
                        borderColor="#FFFFFF"
                        flex="1"
                        alignSelf="stretch"
                        m="0 auto"
                      ></Box>
                      <Box key={key} w="190px">
                        <Text
                          color="#FFF"
                          fontWeight="700"
                          textAlign="left"
                          fontSize="sm"
                          textTransform="uppercase"
                          lineHeight="15px"
                          mb={1}
                        >
                          {item?.title}
                        </Text>
                        <Text
                          color="#FFF"
                          fontWeight="400"
                          textAlign="left"
                          fontSize="sm"
                          lineHeight="15px"
                        >
                          {item?.description}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Flex>

            <Flex
              flexDirection={["column", "row"]}
              display={["none", "none", "flex", "flex"]}
            >
              {steps?.length > 0 &&
                steps?.map((item, key) => (
                  <Box
                    display="flex"
                    flexDirection={["column", "row"]}
                    justifyContent="space-between"
                    alignItems="center"
                    w="full"
                    h="full"
                    gap={2}
                    my={2}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text
                        color={["#104DBA", "#FFFFFF"]}
                        bgColor={["#FFFFFF", "#104DBA"]}
                        fontWeight="900"
                        rounded="full"
                        w={["30px", "61px"]}
                        h={["30px", "61px"]}
                        textAlign="center"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        fontSize={["xl", "3xl"]}
                        lineHeight={["24px", "46px"]}
                        mb={6}
                        position='relative'
                        _after={{
                          content: '""',
                          position: "absolute",
                          width: ["50px", "100px", "140px", "220px", "300px"],
                          height: "4px",
                          backgroundColor: "#104DBA",
                          bottom: "50%",
                          right: ["-50px", "-100px", "-165px", "-245px", "-325px"],
                          display: key === 2 ? "none" : "block"
                        }}
                      >
                        <Box
                          border="1px"
                          borderColor={["#104DBA", "#FFFFFF"]}
                          w={["28px", "57px"]}
                          h={["28px", "57px"]}
                          position="absolute"
                          rounded="full"
                        ></Box>
                        {item?.position.substring(1, 2)}
                      </Text>
                      <Box
                        flex="1"
                        display="flex"
                        flexDirection={["row", "column"]}
                        justifyContent="center"
                        alignItems="center"
                        h="100%"
                        gap={5}
                      >
                        <Box key={key} w="auto">
                          <Text
                            color="#FFF"
                            fontWeight="700"
                            textAlign={["left", "center"]}
                            fontSize={["sm", "xl"]}
                            textTransform="uppercase"
                            lineHeight={["15px", "24px"]}
                            minH={['auto', 'auto', '48px', 'auto','auto']}
                            mb={2}
                          >
                            {item?.title}
                          </Text>
                          <Text
                            color="#FFF"
                            fontWeight="400"
                            textAlign={["left", "center"]}
                            fontSize={["sm", "xl"]}
                            lineHeight={["15px", "24px"]}
                            minH={['auto', 'auto', '312px', '144px','120px']}
                            px={14}
                          >
                            {item?.description}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Flex>
          </Flex>
        </Container>
      </Box>
      {/* Quienes somos */}
      <Box w="full" py={10}>
        <Container maxW="container.xl">
          <Flex flexDirection="column">
            <Box ml={4} ref={refWhoUs}>
              <TitleCustom
                text="¿Quienes somos?"
                theme="light"
                wMobile={140}
                wDesktop={280}
              />
            </Box>

            <Text
              fontSize={["sm", "xl"]}
              fontWeight="400"
              color="#104DBA"
              lineHeight={["15px", "24px"]}
              w={["auto", "auto", "auto", "auto", "800px"]}
              mt={2}
              mb={12}
              ml={4}
            >
              Somos un equipo de médicos pediatras comprometidos en ampliar el
              acceso a la atención médica infantil. Esta plataforma fue creada
              por médicos especializados para ofrecer apoyo y cuidado
              conveniente y confiable.
            </Text>

            {/* Doctores */}
            <div className="slider-container">
              <Slider {...settings}>
                {docs?.length > 0 && docs.map((dr, idx) => (
                  <div key={idx} onClick={selectedDoctorIndex === idx ? () => handleClose() : () => handleDoctorSelect(idx)}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        cursor: "pointer"
                      }}
                    >
                      <Box
                        w={["240px", "335px"]}
                        h={["420px", "489px"]}
                        bgImage={`url(${dr.image})`}
                        rounded="xl"
                        bgPosition="center"
                        bgSize="cover"
                        bgRepeat="no-repeat"
                        position="relative"
                        boxShadow="0px 4px 4px 0px #00000026"
                      >
                        <Box
                          bgColor="white"
                          rounded="xl"
                          px={[2, 4]}
                          pb={2}
                          pt={4}
                          position="absolute"
                          bottom="0"
                          left="0"
                          w={["240px", "335px"]}
                        >
                          <Heading as="h3" color="black" fontSize={["md", "2xl"]}>
                            {dr.title}
                          </Heading>
                          <Text color="black" fontSize={["xs", "lg"]}>
                            {dr.description}
                          </Text>
                        </Box>
                        {selectedDoctorIndex === idx && (
                          <Fade initialScale={0.9} in={selectedDoctorIndex === idx}>
                            <Button
                              bgColor="transparent"
                              position='absolute'
                              top='0'
                              right='0'
                              zIndex={4}
                              _active={{ backgroundColor: 'transparent' }}
                              _hover={{ backgroundColor: 'transparent' }}
                            >
                              <Box bgColor="#FFFFFF" borderRadius='full'>
                                <FaXmark
                                  style={{
                                    color: "#000000",
                                    width: "20px",
                                    height: "20px",
                                    padding: "2px",
                                  }}
                                />
                              </Box>
                            </Button>
                            <Box
                              rounded="xl"
                              position='absolute'
                              top='0'
                              left='0'
                              backgroundColor='#104DBA'
                              zIndex={2}
                              px={4}
                              pt={6}
                              minH='100%'
                            >
                              <Text
                                color='#FFFFFF'
                                fontSize={['md', '2xl']}
                                fontWeight={900}
                                lineHeight={['', '28px']}
                                mt={[2, 4]}
                              >
                                {dr.title}
                              </Text>
                              <Text
                                color='#FFFFFF'
                                fontSize={['sm', 'lg']}
                                lineHeight={['15px', '18px']}
                              >
                                {dr.description}
                              </Text>
                              <Text 
                                color='#FFFFFF'
                                fontSize={['sm', 'lg']}
                                lineHeight={['15px', '18px']}
                                py={2}
                              >
                                Matrícula:
                              </Text>
                              <Text
                                color='#FFFFFF'
                                fontSize={['sm', 'lg']}
                                fontWeight={300}
                                lineHeight={['15px', '18px']}
                                pt={[2, 8]}
                              >
                                {dr.enrollment}
                              </Text>
                            </Box>
                          </Fade>
                        )}
                      </Box>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            <Flex
              justifyContent="center"
              alignItems="center"
              border="1px"
              borderColor="#104DBA"
              borderRadius="full"
              ml={4}
              mt={10}
              p={2}
              gap={2}
              w={["214px", "auto", "auto", "580px"]}
            >
              <Image src={handHeart} h={[15, 30]} w={[15, 30]} />
              <Text
                color="#104DBA"
                fontSize={["xs", "lg"]}
                textAlign="center"
                fontWeight="400"
                lineHeight={["12px", "18px"]}
              >
                Estamos aquí para garantizar la salud y el bienestar de tus
                hijos.
              </Text>
            </Flex>
          </Flex>
          {/* Preguntas Frecuentes */}
          <Flex flexDirection="column" mt={10}>
            <Box ml={4}>
              <TitleCustom
                text="Preguntas frecuentes"
                theme="light"
                wMobile={160}
                wDesktop={320}
              />
            </Box>

            <Flex
              flexDirection="column"
              px={4}
              gap={5}
              my={6}
              w={["full", "auto", "auto", "600px"]}
              ref={refQuestions}
            >
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
      <Flex
        w="full"
        py={3}
        mt={20}
        bgGradient="linear-gradient(60.5deg, #104DBA -12.14%, #88A6DD 55.27%, #FFFFFF 134.94%)"
      >
        <Container maxW="container.xl">
          <Flex
            flexDirection={["column", "column", "column", "row"]}
            justifyContent="space-between"
          >
            <Box alignContent='center'>
              <Box maxH={['auto', '42px']}>
                <LogoCustom
                  theme="white"
                />
              </Box>
            </Box>

            <Box>
              <Flex gap={2} mt={5} justifyContent={["start", "end"]}>
                <Link href="https://facebook.com">
                  <Box
                    w={["15px", "15px", "20px", "20px"]}
                    h={["15px", "15px", "20px", "20px"]}
                    borderRadius="50%"
                    bgColor="white"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    _hover={{ backgroundColor: '#F5F5F5' }}
                  >
                    <FaFacebookF className='icon-responsive-v2'/>
                  </Box>
                </Link>
                <Link href="https://linkedin.com">
                  <Box
                    w={["15px", "15px", "20px", "20px"]}
                    h={["15px", "15px", "20px", "20px"]}
                    borderRadius="50%"
                    bgColor="white"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    _hover={{ backgroundColor: '#F5F5F5' }}
                  >
                    <BiLogoLinkedin className='icon-responsive-v2'/>
                  </Box>
                </Link>
                <Link href="https://instagram.com">
                  <Box
                    w={["15px", "15px", "20px", "20px"]}
                    h={["15px", "15px", "20px", "20px"]}
                    borderRadius="50%"
                    bgColor="white"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    _hover={{ backgroundColor: '#F5F5F5' }}
                  >
                    <FaInstagram className='icon-responsive-v2'/>
                  </Box>
                </Link>
              </Flex>

              <Text
                fontSize={['xs', 'sm']}
                align={['left', 'right']}
                color="white"
                fontWeight="400"
                lineHeight={['12px', '16px']}
                mt={3}
              >
                ayuda@zonapediatrica.com.ar
              </Text>
              <Text
                fontSize={['xs', 'sm']}
                align={['left', 'right']}
                color="white"
                fontWeight="400"
                lineHeight={['12px', '16px']}
                mt={4}
              >
                © 2024 ZonaPediatrica – Todos los derechos reservados
              </Text>
            </Box>
          </Flex>
        </Container>
      </Flex>
    </VStack>
  );
};

export default LandingHome;
