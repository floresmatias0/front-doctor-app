import { Flex, Text, Grid, GridItem, Box, Container, Link, Heading, VStack, Img, List, UnorderedList, ListItem, Divider } from "@chakra-ui/react";
import banner from '../assets/test-img.webp';
import { useRef } from "react";

const principalServices = [
    {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#205583" height="2em" viewBox="0 0 384 512"><path d="M16 64C16 28.7 44.7 0 80 0H304c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zM224 448a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM304 64H80V384H304V64z"/></svg>',
        title: 'CONSULTAS MÉDICAS ONLINE',
        description: 'Accede a consultas médicas rápidas y especializadas desde cualquier lugar.'
    },
    {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#205583" height="2em" viewBox="0 0 576 512"><path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l44.9 74.7c-16.1 17.6-28.6 38.5-36.6 61.5c-1.9-1.8-3.5-3.9-4.9-6.3L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152zm136 16a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm211.3-43.3c-6.2-6.2-16.4-6.2-22.6 0L416 385.4l-28.7-28.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l40 40c6.2 6.2 16.4 6.2 22.6 0l72-72c6.2-6.2 6.2-16.4 0-22.6z"/></svg>',
        title: 'SEGUIMIENTO DE ANTECEDENTES',
        description: 'Mantén un registro digital de los antecedentes médicos de tus hijos.'
    },
    {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#205583" height="2em" viewBox="0 0 640 512"><path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/></svg>',
        title: 'RECURSOS EDUCATIVOS PARA PADRES',
        description: 'Descubre información y consejos prácticos sobre la salud infantil.',
        url: "https://comunidad.sap.org.ar/"
    }
    // {
    //     icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#205583" height="2em" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>',
    //     title: 'CONSULTA POR WHATSAPP',
    //     description: 'Envía un mensaje y recibe asesoramiento médico rápido y conveniente.'
    // }
]

const secondaryServices = [
    {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#205583" height="2em" viewBox="0 0 512 512"><path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96v32V480H384V128 96 56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM96 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H96V96zM416 480h32c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H416V480zM224 208c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v48h48c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H288v48c0 8.8-7.2 16-16 16H240c-8.8 0-16-7.2-16-16V320H176c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h48V208z"/></svg>',
        title: 'CONSULTAS CON ESPECIALISTAS',
        description: 'Accede a consultas con especialistas en diversas áreas de la salud infantil.'
    },
    {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="#205583"><mask id="mask0_17_518" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="44" height="44"><rect x="0.25" y="0.5" width="43.5" height="43.5" fill="#D9D9D9"/></mask><g mask="url(#mask0_17_518)"><path d="M15.8375 41.2812L12.3938 35.4813L5.86875 34.0312L6.50313 27.325L2.0625 22.25L6.50313 17.175L5.86875 10.4688L12.3938 9.01875L15.8375 3.21875L22 5.84688L28.1625 3.21875L31.6063 9.01875L38.1312 10.4688L37.4969 17.175L41.9375 22.25L37.4969 27.325L38.1312 34.0312L31.6063 35.4813L28.1625 41.2812L22 38.6531L15.8375 41.2812ZM17.3781 36.6594L22 34.6656L26.7125 36.6594L29.25 32.3094L34.2344 31.1313L33.7812 26.0563L37.1344 22.25L33.7812 18.3531L34.2344 13.2781L29.25 12.1906L26.6219 7.84062L22 9.83438L17.2875 7.84062L14.75 12.1906L9.76562 13.2781L10.2188 18.3531L6.86563 22.25L10.2188 26.0563L9.76562 31.2219L14.75 32.3094L17.3781 36.6594ZM20.0969 28.6844L30.3375 18.4438L27.8 15.8156L20.0969 23.5187L16.2 19.7125L13.6625 22.25L20.0969 28.6844Z" fill="#205583"/></g></svg>`,
        title: 'CALIDAD DE ATENCIÓN',
        description: 'Evalúa la calidad del servicio y disfruta de una atención de alta calidad.'
    },
    {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><mask id="mask0_17_511" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="44" height="44"><rect x="0.25" width="43.5" height="43.5" fill="#D9D9D9"/></mask><g mask="url(#mask0_17_511)"><path d="M22 41.6875V38.0625H34.6875V36.25H27.4375V21.75H34.6875V19.9375C34.6875 16.4333 33.449 13.4427 30.9719 10.9656C28.4948 8.48854 25.5042 7.25 22 7.25C18.4958 7.25 15.5052 8.48854 13.0281 10.9656C10.551 13.4427 9.3125 16.4333 9.3125 19.9375V21.75H16.5625V36.25H9.3125C8.31562 36.25 7.46224 35.8951 6.75234 35.1852C6.04245 34.4753 5.6875 33.6219 5.6875 32.625V19.9375C5.6875 17.7021 6.11797 15.5951 6.97891 13.6164C7.83984 11.6378 9.01042 9.90833 10.4906 8.42813C11.9708 6.94792 13.7003 5.77734 15.6789 4.91641C17.6576 4.05547 19.7646 3.625 22 3.625C24.2354 3.625 26.3424 4.05547 28.3211 4.91641C30.2997 5.77734 32.0292 6.94792 33.5094 8.42813C34.9896 9.90833 36.1602 11.6378 37.0211 13.6164C37.882 15.5951 38.3125 17.7021 38.3125 19.9375V38.0625C38.3125 39.0594 37.9576 39.9128 37.2477 40.6227C36.5378 41.3326 35.6844 41.6875 34.6875 41.6875H22ZM9.3125 32.625H12.9375V25.375H9.3125V32.625ZM31.0625 32.625H34.6875V25.375H31.0625V32.625Z" fill="#205583"/></g></svg>`,
        title: 'COMUNICACIÓN CON MÉDICOS',
        description: 'Mantén una comunicación eficiente y directa con nuestros médicos.'
    },
    {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><mask id="mask0_17_504" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="44" height="44"><rect x="0.25" y="0.5" width="43.5" height="43.5" fill="#D9D9D9"/></mask><g mask="url(#mask0_17_504)"><path d="M9.3125 38.5625C8.31562 38.5625 7.46224 38.2076 6.75234 37.4977C6.04245 36.7878 5.6875 35.9344 5.6875 34.9375V9.5625C5.6875 8.56563 6.04245 7.71224 6.75234 7.00234C7.46224 6.29245 8.31562 5.9375 9.3125 5.9375H16.8797C17.212 4.88021 17.8615 4.01172 18.8281 3.33203C19.7948 2.65234 20.8521 2.3125 22 2.3125C23.2083 2.3125 24.2883 2.65234 25.2398 3.33203C26.1914 4.01172 26.8333 4.88021 27.1656 5.9375H34.6875C35.6844 5.9375 36.5378 6.29245 37.2477 7.00234C37.9576 7.71224 38.3125 8.56563 38.3125 9.5625V34.9375C38.3125 35.9344 37.9576 36.7878 37.2477 37.4977C36.5378 38.2076 35.6844 38.5625 34.6875 38.5625H9.3125ZM9.3125 34.9375H34.6875V9.5625H31.0625V15H12.9375V9.5625H9.3125V34.9375ZM22 9.5625C22.5135 9.5625 22.944 9.3888 23.2914 9.04141C23.6388 8.69401 23.8125 8.26354 23.8125 7.75C23.8125 7.23646 23.6388 6.80599 23.2914 6.45859C22.944 6.1112 22.5135 5.9375 22 5.9375C21.4865 5.9375 21.056 6.1112 20.7086 6.45859C20.3612 6.80599 20.1875 7.23646 20.1875 7.75C20.1875 8.26354 20.3612 8.69401 20.7086 9.04141C21.056 9.3888 21.4865 9.5625 22 9.5625Z" fill="#205583"/></g></svg>`,
        title: 'HISTORIAL MÉDICO DIGITAL SEGURO',
        description: 'Almacena y accede de manera segura al historial médico de tus hijos.'
    }
]

const steps = [
    {
        position: '01',
        title: 'REGÍSTRATE EN NUESTRA PLATAFORMA',
        description: '<p className="font-thin">Crea tu cuenta en nuestra plataforma de atención pediátrica online. Proporciona la información necesaria y crea un perfil para ti y tu hijo. <b>El registro es rápido y seguro, y te permitirá acceder a nuestros servicios de consulta médica online.</b></p>'
    },
    {
        position: '02',
        title: 'Responde un Cuestionario Detallado',
        description: '<p className="font-thin">Para brindarte <b>la mejor atención posible</b>, responde nuestro cuestionario detallado. Este breve conjunto de preguntas nos ayudará a informar al médico sobre tu consulta específica antes de la atención. Cuanta más información proporciones, más precisa será nuestra evaluación para abordar tus necesidades médicas de manera efectiva.</p>'
    },
    {
        position: '03',
        title: 'COMIENZA TU CONSULTA Personalizada',
        description: '<p className="font-thin">Una vez que hayas completado el cuestionario, <b>progresa a la videollamada o chat con nuestro pediatra certificado.</b> Disfruta de una atención médica personalizada y detallada, donde el médico te brindará <b>el mejor cuidado y responderá todas tus preguntas.</b> Nuestro equipo está aquí para cuidar de la salud de tus seres queridos <b>y brindar tranquilidad a tu familia.</b></p>'
    }
]

const Card = ({ index, icon, title, description, url }) => {
    if(url) {
        return (
            <Link href={url} key={index} background='white' w='296px' h='auto' rounded='xl' _hover={{ background: 'gray.200' }} boxShadow='xl' display='flex' flexDirection='column' justifyContent='center' alignItems='center' gap={4} p={6}>
                <div dangerouslySetInnerHTML={{__html: icon}}/>
                <Text fontWeight='700' textAlign='center' fontSize='lg'>{title}</Text>
                <Text fontWeight='700' textAlign='center' fontSize='lg'>{description}</Text>
            </Link>
        )
    }

    return (
        <Flex key={index} background='white' w='296px' h='auto' rounded='xl' boxShadow='xl' flexDirection='column' justifyContent='center' alignItems='center' gap={4} p={6}>
            <div dangerouslySetInnerHTML={{__html: icon}}/>
            <Text fontWeight='700' textAlign='center' fontSize='lg'>{title}</Text>
            <Text fontWeight='700' textAlign='center' fontSize='lg'>{description}</Text>
        </Flex>
    )
}

const Step = ({ index, position, title, description }) => (
    <Flex key={index} background='white' w='296px' h='auto' rounded='xl' boxShadow='xl' flexDirection='column' justifyContent='flex-start' gap={4} p={6}>
        <Text fontWeight='700' textAlign='left' fontSize='lg'>{position}</Text>
        <Text fontWeight='700' textAlign='left' fontSize='lg'>{title}</Text>
        <div dangerouslySetInnerHTML={{__html: description}}/>
    </Flex>
)

const LandingHome = () => {
    const refWhoUs = useRef(null)

    return (
        <VStack>
            <Box w='full' h={['750px', '500px', '500px', '600px']} bgGradient='linear(to-r, green.200, pink.500)'>
                <Container maxW='container.xl' position='relative'>
                    <Grid templateColumns='repeat(5, 1fr)'>
                        <GridItem colSpan={[3, 2]} h='20' alignContent='center'>
                            <Text fontSize={['2xl', '4xl']} align='left' color='white' fontWeight='700'>
                                Zona Pediatrica
                            </Text>
                        </GridItem>
                        <GridItem colSpan={[2, 3]} h='20' alignContent='center'>
                            <Text color='white' fontWeight='500' fontSize={['sm', 'md', 'xl']} noOfLines={1} textAlign='end' onClick={() => refWhoUs.current.scrollIntoView({ behavior: 'smooth' })}>
                                ¿Quiénes somos?
                            </Text>
                        </GridItem>
                    </Grid>
                    <Grid templateColumns='repeat(5, 1fr)'>
                        <GridItem colSpan={[5, 3, 3, 2]} alignContent='center'>
                            <Heading as="h1" size="xl" visibility='hidden' position='absolute'>Servicios de Atención Médica Infantil</Heading>
                            <Heading as='h2' size={['xl', '2xl', '2xl', '4xl']} color='white' fontWeight='700'>
                                Brindando bienestar y seguridad a tus pequeños
                            </Heading>
                            <Text color='white' fontSize='xl' pt={['0','20px']}>
                                Obtén consultas especializadas de calidad desde casa. Ahorra tiempo y disfruta de una comunicación eficiente con nuestros médicos en consultas sencillas. <Text as='b'>Recuerda que nuestra plataforma es un recurso extra, ¡tu médico de confianza sigue siendo clave! </Text>
                            </Text>
                        </GridItem>
                        <GridItem colSpan={[5, 2, 2, 3]} alignContent='center'>
                            <Flex justifyContent={['center', 'end']} alignItems='center'>
                                <Box w={['300px','full','400px','500px']} my={5}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 462 276" fill="none">
                                        <path d="M410.743 102.043C410.743 192.059 337.77 265.032 247.754 265.032C157.738 265.032 84.7654 192.059 84.7654 102.043" stroke="#FCFEFF" stroke-width="20"/>
                                        <path d="M141.071 53.1461C141.071 84.2426 115.862 109.451 84.7654 109.451C53.6689 109.451 28.4602 84.2426 28.4602 53.1461" stroke="#FCFEFF" stroke-width="20"/>
                                        <path d="M452 51.9794C452 74.6004 433.463 93.0984 410.399 93.0984C387.334 93.0984 368.797 74.6004 368.797 51.9794C368.797 29.3583 387.334 10.8604 410.399 10.8604C433.463 10.8604 452 29.3583 452 51.9794Z" stroke="#FCFEFF" stroke-width="20"/>
                                        <circle cx="28.9353" cy="29.7956" r="18.9353" stroke="#FCFEFF" stroke-width="20"/>
                                        <circle cx="140.818" cy="29.7956" r="18.9353" stroke="#FCFEFF" stroke-width="20"/>
                                    </svg>
                                </Box>
                            </Flex>
                        </GridItem>
                    </Grid>
                    <Box w={['300px', '600px']} backgroundColor='#fff' boxShadow='2xl' p='6' rounded='md' position='absolute' bottom={['-150px','-150px']} left='50%' transform='translateX(-50%)'>
                        <Text textAlign='center' fontSize='xl'>Solicita una consulta médica online en un instante</Text>
                        <Flex mt='2' justifyContent='center' alignItems='center'>
                            <Link href='/iniciar-sesion' background='brand.700' py='2' px='4' rounded='md' color='white' fontWeight='600' fontSize={['md', 'xl']}>INICIAR SESION</Link>
                        </Flex>
                    </Box>
                </Container>
            </Box>
            <Box w='full' py='20'>
                <Container maxW='container.xl'>
                    <Flex justifyContent='end' flexDirection='column'>
                        <Text color='brand.900' textAlign='right'>SERVICIOS</Text>
                        <Heading as="h2" size="lg" color='brand.900' textAlign='right' textTransform='uppercase'>Acceso rápido y conveniente</Heading>
                    </Flex>
                    <Flex flexDirection={['column', 'row']} justifyContent='space-between' alignItems='center' my={10} gap={4}>
                        {principalServices?.length > 0 && principalServices?.map((item, key) => (
                            <Card index={key} icon={item?.icon} title={item?.title} description={item?.description} url={item?.url}/>
                        ))}
                    </Flex>
                    <Text fontSize={['xl', '2xl']} textAlign='center'>
                        Transformamos el acceso a la atención médica con <Text as='b'>una plataforma fácil de usar y accesible.</Text> Mejoramos la <Text as='b'>comodidad y eficiencia</Text> con consultas rápidas y especializadas. Con <Text as='b'>tecnologías innovadoras</Text> y enfoque en calidad, <Text as='b'>mejoramos la experiencia en el cuidado de la salud.</Text>
                    </Text>
                </Container>
            </Box>
            <Box w='full'>
                <Container maxW='container.xl'>
                    <Flex justifyContent='end' flexDirection='column'>
                        <Heading as="h2" size="lg" color='brand.900' textAlign='left' textTransform='uppercase'>¿Cómo Funciona?</Heading>
                    </Flex>
                    <Flex flexDirection={['column', 'row']} justifyContent='space-between' alignItems='center' my={10} gap={4}>
                        {steps?.length > 0 && steps?.map((item, key) => (
                            <Step index={key} position={item?.position} title={item?.title} description={item?.description} />
                        ))}
                    </Flex>
                </Container>
            </Box>
            <Box w='full'>
                <Container maxW='container.xl'>
                    <Flex justifyContent='start' flexDirection='column'>
                        <Text color='brand.900' textAlign='left'>SERVICIOS</Text>
                        <Text color='brand.900' fontWeight='700' fontSize={['lg','xl','xl', '2xl']} textAlign='left'>¿POR QUE ELEGIRNOS?</Text>
                    </Flex>
                    <Flex flexDirection={['column', 'row']} justifyContent='space-between' alignItems='center' my={10} gap={4}>
                        {secondaryServices?.length > 0 && secondaryServices?.map((item, key) => (
                            <Card index={key} icon={item?.icon} title={item?.title} description={item?.description} url={item?.url}/>
                        ))}
                    </Flex>
                </Container>
            </Box>
            <Box w='full' ref={refWhoUs}>
                <Container maxW='container.xl'>
                    <Img src={banner} alt="Consulta médica online con pediatras" w='full' maxH='250px' objectFit='cover' objectPosition='top' boxShadow='xl' loading="lazy"/>
                    <Flex justifyContent='end' flexDirection='column' mt='10'>
                        <Text color='brand.900' fontWeight='700' fontSize={['lg','xl','xl', '2xl']} textAlign='left'>Quiénes somos</Text>
                    </Flex>
                    <Text fontSize={['xl', '2xl']} textAlign='left'>
                        Somos un equipo de médicos pediatras <Text as='b'>comprometidos en ampliar acceso a atención médica infantil.</Text> Esta plataforma fue creada por <Text as='b'>médicos especializados para brindar apoyo</Text> y cuidado conveniente y confiable. Estamos aquí para <Text as='b'>asegurar salud y bienestar de sus hijos.</Text>
                    </Text>
                </Container>
            </Box>
            <Box w='full' py='20'>
                <Container maxW='container.xl'>
                    <Flex justifyContent='start' flexDirection='column'>
                        <Text color='brand.900' textAlign='left'>SERVICIOS</Text>
                        <Text color='brand.900' fontWeight='700' fontSize={['lg','xl','xl', '2xl']} textAlign='left'>Atención médica especializada</Text>
                        <Text color='brand.900' fontSize='xl' textAlign='left'>La plataforma cuenta con una red de médicos especializados en pediatría y otras áreas de la salud infantil. Los padres pueden recibir consultas y asesoramiento médico de profesionales altamente capacitados, lo que garantiza una atención de calidad y respuestas precisas a sus preguntas y preocupaciones.</Text>
                        <UnorderedList my='5' fontSize='xl'>
                            <ListItem>Médicos especializados</ListItem>
                            <ListItem>Asesoramiento profesional</ListItem>
                        </UnorderedList>
                    </Flex>
                </Container>
            </Box>
            <Box w='full' py='10' bgGradient='linear(to-r, green.200, pink.500)'>
                <Container maxW='container.xl'>
                    <Text fontSize={['xl', '2xl']} align='left' color='white' fontWeight='700'>
                        Zona Pediatrica
                    </Text>
                    <Divider orientation='horizontal' my='2'/>
                    <Text fontSize='md' align='right' color='white' fontWeight='700'>
                        © 2024 ZonaPediatrica – Todos los derechos reservados
                    </Text>
                </Container>
            </Box>
        </VStack>
    )
}

export default LandingHome;