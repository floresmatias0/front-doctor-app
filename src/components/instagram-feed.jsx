import React, { useEffect, useState, useRef } from 'react';
import { Box, Image, Link, Spinner, Flex, IconButton } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaInstagram } from 'react-icons/fa';

const CustomLeftArrow = ({ onClick, isMobile }) => (
  <IconButton
    color="white"
    fontSize={32}
    aria-label="left-arrow"
    variant="solid"
    position="absolute"
    left={isMobile ? "10px" : "-6"}
    top="50%"
    transform="translate(0, -118%)"
    zIndex="2"
    size="lg"
    icon={<FaChevronLeft />}
    borderRadius="50%"
    bg="blackAlpha.600"
    _hover={{ bg: "blackAlpha.800" }}
    _focus={{ boxShadow: "none" }}
    onClick={onClick}
    paddingLeft={isMobile ? "5px" : "20px"}
    paddingRight={isMobile ? "8px" : "7px"}
    paddingY={isMobile ? "5px" : "34px"}
  />
);

const CustomRightArrow = ({ onClick, isMobile }) => (
  <IconButton
    color="white"
    fontSize={32}
    aria-label="right-arrow"
    variant="solid"
    position="absolute"
    right={isMobile ? "10px" : "-6"} 
    top="50%"
    transform="translate(0, -118%)"
    zIndex="2"
    size="lg"
    icon={<FaChevronRight />}
    borderRadius="50%"
    bg="blackAlpha.600"
    _hover={{ bg: "blackAlpha.800" }}
    _focus={{ boxShadow: "none" }}
    onClick={onClick}
    paddingLeft={isMobile ? "8px" : "7px"}
    paddingRight={isMobile ? "5px" : "20px"}
    paddingY={isMobile ? "5px" : "34px"}
  />
);

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const mobileContainerRef = useRef(null);

  const accessToken = import.meta.env.VITE_IG_ACCESS_TOKEN;
  const userId = import.meta.env.VITE_IG_USER_ID;
  const urlBase = 'https://graph.instagram.com/v21.0';

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await fetch(`${urlBase}/${userId}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`);
        const data = await response.json();
        setPosts(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        setLoading(false);
      }
    }

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

  const handleLeftClickMobile = () => {
    if (mobileContainerRef.current) {
      mobileContainerRef.current.scrollLeft -= mobileContainerRef.current.offsetWidth;
    }
  };

  const handleRightClickMobile = () => {
    if (mobileContainerRef.current) {
      mobileContainerRef.current.scrollLeft += mobileContainerRef.current.offsetWidth;
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const mobileGroups = [];
  for (let i = 0; i < posts.length; i += 4) {
    mobileGroups.push(posts.slice(i, i + 4));
  }

  return (
    <Box width="100vw" maxWidth="100%" position="relative" overflow="hidden">
      {/* Carrusel para escritorio */}
      <Box
        ref={containerRef}
        id="carousel-container"
        display={{ base: "none", lg: "flex" }}
        flexWrap="nowrap"
        overflow="hidden"
        scrollBehavior="smooth"
        width="100.1vw"
      >
        {posts.map((post) => (
          <Box
            key={post.id}
            overflow="hidden"
            minWidth={{ lg: "25%", xl: "20%" }}
            height={{ lg: "285px", xl: "350px" }}   
            bg="white"
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
          >
            <Link href={post.permalink} isExternal>
              {post.media_type === 'VIDEO' ? (
                <video src={post.media_url} controls style={{ width: '100%', height: '100%' }} />
              ) : (
                    <Image src={post.media_url} alt={post.caption} style={{ width: '100%', height: '100%' }} />
                  )}
                </Link>
              </Box>
            ))}
      </Box>

      {/* Carrusel para móviles */}
      <Box
        ref={mobileContainerRef}
        id="carousel-container-mobile"
        display={{ base: "flex", lg: "none" }}
        flexWrap="nowrap"
        overflow="hidden"
        scrollBehavior="smooth"
        width="100vw"
      >
        {mobileGroups.map((group, index) => (
          <Box key={index} display="grid" gridTemplateColumns="repeat(2, 1fr)" gridTemplateRows="repeat(2, 1fr)" gap={0} minWidth="100%" px={0}>
            {group.map((post) => (
              <Box
                key={post.id}
                overflow="hidden"
                minWidth="100%"
                height="200px"    
                bg="white"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
              >
                <Link href={post.permalink} isExternal>
                  {post.media_type === 'VIDEO' ? (
                    <video src={post.media_url} controls style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Image src={post.media_url} alt={post.caption} style={{ width: '100%', height: '100%' }} />
                  )}
                </Link>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Flex alignItems="center" justifyContent="center" mt={{ base: 4, lg: 8, xl: 8 }} mb={{ base: 0, lg: 2, xl: 2 }}>
        <IconButton
          as="a"
          href="https://www.instagram.com/zonamed_salud"
          target="_blank"
          color="#104DBA"
          fontSize={{ base: 40, lg: 50, xl: 60 }}
          aria-label="Instagram"
          variant="solid"
          size="lg"
          icon={<FaInstagram />}
          bg="transparent"
          _hover={{ bg: "transparent", color: "#083b87" }}
          _focus={{ boxShadow: "none" }}
        />
      </Flex>

      {/* Flechas para escritorio */}
      <Box display={{ base: "none", lg: "block" }}>
        <CustomLeftArrow onClick={handleLeftClick} isMobile={false} />
        <CustomRightArrow onClick={handleRightClick} isMobile={false} />
      </Box>

      {/* Flechas para móviles */}
      <Box display={{ base: "flex", lg: "none" }} justifyContent="space-between" position="absolute" top="50%" transform="translateY(-50%)" width="100%">
        <CustomLeftArrow onClick={handleLeftClickMobile} isMobile={true} />
        <CustomRightArrow onClick={handleRightClickMobile} isMobile={true} />
      </Box>
    </Box>
  );
};

export default InstagramFeed;
