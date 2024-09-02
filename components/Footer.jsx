import React from 'react'
import { Flex, Box, Image, VStack, Text, useMediaQuery, Spacer, HStack } from '@chakra-ui/react'
import REV3L from '../assets/locker.png';
import WEBSITE from '../assets/site.png';
import TWITTER from '../assets/twitter.png';
// import DISCORD from '../assets/discord.png';

import Link from 'next/link';

const Footer = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const currentYear = new Date().getFullYear();

  return (
    <Flex
      direction={isMobile ? 'column' : 'row'}
      bgGradient='linear(to-r, #4A1D87, #D15A52)'
      px='10'
      py='3'
      align='center'
      justify={isMobile ? 'center' : 'space-between'}
    >
      <VStack align={isMobile ? 'center' : 'start'} spacing='4'>
        <Link href='/'><Image src={REV3L.src} /></Link>
        {/* <Image src={REV3L.src} /> */}
        <Text color='white' ml='3'>
          All Rights Reserved | {currentYear}
        </Text>
      </VStack>
      {isMobile ? null : <Spacer />}
      {isMobile && <br />}
      <Box>
        <HStack>
          <Link href='https://www.rev3al.com/' target='_blank'><Image src={WEBSITE.src} /></Link>
          <Link href='https://twitter.com/Rev3alTech' target='_blank'><Image src={TWITTER.src} /></Link>
          {/* <Link href='/' target='_blank'><Image src={DISCORD.src} /></Link> */}
        </HStack>
      </Box>
    </Flex>
  )
}

export default Footer
