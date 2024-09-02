// NEXT
import Link from 'next/link';

import { Web3Button } from '@web3modal/react'

// CHAKRA UI
import { 
  Flex, 
  Image, 
  Text, 
  Box, 
  useMediaQuery, 
  HStack,
  Spacer
} from '@chakra-ui/react';

// IMAGES
import REV3L from '../assets/locker.png';

const Navbar = () => {
    const [isMobile] = useMediaQuery('(max-width: 1020px)');

    return(
        <>
        <Box w='100%' px={10} py='6' color='white' bgColor={'black'}>
             <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'center' : 'none'}>
                <Box>
                    <Link href='/'><Image src={REV3L.src} /></Link>
                    <HStack ml={isMobile ? '10' : '3'} mt='5' gap='6' textAlign={'center'}>
                        <Link href='/'><Text>Home</Text></Link>
                        <Link href='/explore'><Text>Explore</Text></Link>
                        <Link href='/create'><Text>Create</Text></Link>
                        <Link href='/mylocks'><Text>My Locks</Text></Link>
                    </HStack>
                </Box>
                <Spacer />
                <Box mt='5'>
                    <Web3Button />
                </Box>
            </Flex>
        </Box>
        </>
    )
};

export default Navbar;