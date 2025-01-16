import React, { useEffect, useState, useRef } from 'react';
import { Box, Image, Link, Spinner, Flex, Heading, Stack, IconButton, Button, Text } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaInstagram } from 'react-icons/fa';

const CustomLeftArrow = ({ onClick }) => (
  <IconButton
    color="white"
    fontSize={24}
    aria-label="left-arrow"
    variant="solid"
    position="absolute"
    left="2"
    top="50%"
    transform="translate(0, -50%)"
    zIndex="2"
    size="lg"
    icon={<FaChevronLeft />}
    borderRadius="50%"
    bg="blackAlpha.600"
    _hover={{ bg: "blackAlpha.800" }}
    _focus={{ boxShadow: "none" }}
    onClick={onClick}
  />
);

const CustomRightArrow = ({ onClick }) => (
  <IconButton
    color="white"
    fontSize={24}
    aria-label="right-arrow"
    variant="solid"
    position="absolute"
    right="2"
    top="50%"
    transform="translate(0, -50%)"
    zIndex="2"
    size="lg"
    icon={<FaChevronRight />}
    borderRadius="50%"
    bg="blackAlpha.600"
    _hover={{ bg: "blackAlpha.800" }}
    _focus={{ boxShadow: "none" }}
    onClick={onClick}
  />
);

const InstagramFeed = () => {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const accessToken = import.meta.env.VITE_IG_ACCESS_TOKEN;
  const urlBase = 'https://graph.instagram.com';

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${urlBase}/me?fields=id,username,account_type,media_count,profile_picture_url,biography,followers_count,follows_count,name&access_token=${accessToken}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching Instagram profile:', error);
      }
    }

    async function fetchMedia() {
      try {
        const response = await fetch(`${urlBase}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`);
        const data = await response.json();
        setPosts(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        setLoading(false);
      }
    }

    fetchProfile();
    fetchMedia();
  }, [accessToken, urlBase]);

  const handleLeftClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= containerRef.current.offsetWidth;
    }
  };

  const handleRightClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += containerRef.current.offsetWidth;
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const profileUrl = "https://www.instagram.com/zonamed_salud"; // Reemplaza [usuario] con el nombre de usuario de Instagram

  // Distribuir las publicaciones de forma alternada entre las dos filas
  const firstRow = posts.filter((_, index) => index % 2 === 0);
  const secondRow = posts.filter((_, index) => index % 2 !== 0);

  return (
    <Box width="100vw" maxWidth="100%" position="relative" overflow="hidden">
      <Flex id="profileInfo" mb={6} alignItems="center" justifyContent="center" gap={6}>
        <Link href={profileUrl} isExternal>
          <Image
            borderRadius="full"
            boxSize="70px"
            src={profile.profile_picture_url}
            alt={profile.username}
          />
        </Link>
        <Stack spacing={0}>
          <Link href={profileUrl} isExternal>
            <Heading as="h1" fontSize="20px">{profile.name}</Heading>
          </Link>
          <Link href={profileUrl} isExternal>
            <Text fontSize="md" color="gray.500">@{profile.username}</Text>
          </Link>
        </Stack>
        <Flex gap={8} ml={12}>
          <Box textAlign="center">
            <Text fontSize="lg" fontWeight="bold">{profile.media_count}</Text>
            <Text>Posts</Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="lg" fontWeight="bold">{profile.followers_count}</Text>
            <Text>Seguidores</Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="lg" fontWeight="bold">{profile.follows_count}</Text>
            <Text>Seguidos</Text>
          </Box>
        </Flex>
        <Button ml={4} colorScheme="blue" leftIcon={<FaInstagram color="white" />}>
          Seguir
        </Button>
      </Flex>

      <Box position="relative">
        <Box
          ref={containerRef}
          id="carousel-container"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          scrollBehavior="smooth"
          width="100vw"
        >
          <Flex>
            {firstRow.map((post) => (
              <Box
                key={post.id}
                overflow="hidden"
                minWidth={{ sm: "50%", lg: "25%", xl: "20%" }}
                height={{ lg: "320px", xl: "380px" }}
                bg="white"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
              >
                <Link href={post.permalink} isExternal>
                  {post.media_type === 'VIDEO' ? (
                    <video src={post.media_url} controls style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Image src={post.media_url} alt={post.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </Link>
              </Box>
            ))}
          </Flex>
          <Flex>
            {secondRow.map((post) => (
              <Box
                key={post.id}
                overflow="hidden"
                minWidth={{ sm: "50%", lg: "25%", xl: "20%" }}
                height={{ lg: "320px", xl: "380px" }}
                bg="white"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
              >
                <Link href={post.permalink} isExternal>
                  {post.media_type === 'VIDEO' ? (
                    <video src={post.media_url} controls style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Image src={post.media_url} alt={post.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </Link>
              </Box>
            ))}
          </Flex>
        </Box>
        <CustomLeftArrow onClick={handleLeftClick} />
        <CustomRightArrow onClick={handleRightClick} />
      </Box>
    </Box>
  );
};

export default InstagramFeed;




