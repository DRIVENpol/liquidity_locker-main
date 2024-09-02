import React, { useState } from 'react';

import { Box, Flex, Text, Button, Center, VStack } from '@chakra-ui/react';
import Link from 'next/link';

import LocksMini from './LocksMini';

import BG_HERO from '../assets/bg-header.jpeg';

// Web3
import {useAccount, useContractRead} from 'wagmi'
import { LOCKER_ABI, LOCKER_ADDRESS } from '../settings';

const HeroSection = () => {
  const account = useAccount();
  // const [lastLockId, setLastLockId] = useState(0);
  const [last3LockIds, setLast3LockIds] = useState([]);
  // console.log("Last 3 Locks: ", last3LockIds);

  useContractRead({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'getLockId',
    watch: true,
    onSuccess(data) {
      if (data) {

        const lastLockId = Number(data) - 1; 
        const startId = Math.max(0, lastLockId - 2);
  
        setLast3LockIds(Array.from({ length: Math.min(lastLockId + 1, 3) }, (_, index) => startId + index).reverse());
      } else {
        // console.log("No Locks");
      }
    },
    onError(error) {
      // console.error('Error: ', error);
    }
  });
  

  return (
    <Center>
      <Flex
        width={'95%'}
        mt='10'
        bgImage={BG_HERO.src}
        borderRadius={'10px'}
        bgSize='cover'
        align='center' 
        justify='center'
        direction={['column', 'column', 'row']}
      >

        <Box flex={1} px={[4, 8]} color='white' py='10' minH={'500px'}> 
          <Text fontSize='xl' mb={10} mt='20'>Welcome to Rev3al Locker!</Text>
          <Text fontSize='4xl' fontWeight='bold' mb={10}>Lock ERC20 tokens or LP Tokens on Binance Smart Chain</Text>
          <Button
            bgGradient='linear(to-r, #4A1D87, #D15A52)'
            color='white'
            mr={2}
            _hover={{
                bgGradient: 'linear(to-r, #6B23A6, #E16B64)',
                transform: 'scale(1.05)',
                transition: 'all 0.5s ease'
            }}
            >
            Read Documentation
          </Button>

          <Link href='/create'>
          <Button 
          bgGradient={'linear(to-r, #4A1D87, #D15A52)'} 
          color='white' ml={2}
          _hover={{
            bgGradient: 'linear(to-r, #6B23A6, #E16B64)',
            transform: 'scale(1.05)',
            transition: 'all 0.5s ease',
            }}
          >
            Create a Lock
          </Button>
          </Link>
        </Box>
        

        <Box flex={1} p={[4, 8]} width='100%'>
            <Center >
                <VStack>
         <Text color='white' as='b'>
            Recent locks
         </Text>

         {last3LockIds.map((lockId) => (
          <LocksMini key={lockId} index={lockId} />
        ))}
         </VStack>
         </Center>
        </Box>
      </Flex>
    </Center>
  )
}

export default HeroSection;
