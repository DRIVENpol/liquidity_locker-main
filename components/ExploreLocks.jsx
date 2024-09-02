import React from 'react';
import { Center, Spacer, Flex, Box, Text, Input, InputGroup, InputLeftElement, Image, useMediaQuery } from '@chakra-ui/react';

import Loupe from '../assets/loupe.png';

const ExploreLocks = () => {
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    return (
      <Center>
      <Flex
        direction={isMobile ? 'column' : 'row'}
        align="center"
        p="4"
        mt='10'
        wrap="wrap"
        width='100%'
      >
        <Box flex={isMobile ? '100%' : 'auto'} mb={isMobile ? '4' : '0'}>
          <Text color="white" fontSize="4xl" textAlign={isMobile ? 'center' : 'left'}>Search Projects</Text>
        </Box>
        {isMobile && <Spacer />}
        <Box flex="1" maxW={isMobile ? '100%' : 'lg'} mt={isMobile ? '4' : '0'}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Image src={Loupe.src} boxSize="5" />
            </InputLeftElement>
            <Input
              placeholder="Search Project..."
              width={["100%", "100%", "100%", "100%", "100%", "100%"]}
              borderWidth="0px"
              bg='whiteAlpha.200'
              borderRadius={'full'}
              _focus={{ borderWidth: '1px' }}
              _placeholder={{ color: 'gray.500' }}
              color='gray.500'
            />
          </InputGroup>
        </Box>
      </Flex>
      </Center>
    );
  };
  
export default ExploreLocks;
