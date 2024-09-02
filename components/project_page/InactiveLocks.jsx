import { Box, VStack, Text, Button, useMediaQuery } from '@chakra-ui/react';
import React, {useState} from 'react';

import Link from 'next/link';

import { useContractRead}  from 'wagmi'
import { TOKEN_ABI } from '../../settings';

const InactiveLocks = (props) => {
  // console.log("Inactive Locks: ", props.inactiveLocks);
    const gradient = 'linear(to-br, rgba(74, 29, 135, 0.4) 0%, rgba(209, 90, 82, 0.4) 90%)';
    const hoverGradient = 'linear(to-r, rgba(107, 35, 166, 0.8), rgba(225, 107, 100, 0.8))';
    const [isMobile] = useMediaQuery("(max-width: 768px)");
    const [owner, setOwner] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');

    // console.log("Inactive Lock Props: ", props.inactiveLocks.result.owner);

    useContractRead({
      address: props.tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'symbol',
      watch: true,
      onSuccess(data) {
          if (data) {
            setTokenSymbol(data);
              // console.log("Token Name: ", data);
          } else {
              // console.log("No Name");
              setTokenSymbol('-');
          }
      },
      onError(error) {
          // console.error('Error: ', error);
      }
      });

    const hoverStyles = isMobile ? {
      bgGradient: hoverGradient,
      transition: 'all 0.5s ease'
    } : {
        bgGradient: hoverGradient,
        transform: 'scale(1.05)',
        transition: 'all 0.5s ease'
    };

  return (
    <Box
      bgGradient={gradient}
      borderRadius='20px'
      color='white'
    //   maxW='sm'
      boxShadow='xl'
      mt='2'
      textAlign='center'
      py='10'
      // width='98%'
      _hover={
          hoverStyles
      } 
    >
      <VStack spacing={4}> 
        <Text fontSize='3xl' fontWeight='bold'>
        0 {tokenSymbol}
        </Text>
      
        <Text fontSize={'2xl'} mt='10'>
          Withdrawn By Lock&apos;s Owner
          </Text>

          <Link href={`https://www.bscscan.com/address/${props.inactiveLocks.result?.owner}`} target="_blank">
            <Button my='10' colorScheme='blackAlpha'>
                See Owner Wallet
            </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default InactiveLocks;
