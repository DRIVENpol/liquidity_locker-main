import React, { useState, useEffect } from 'react';

import { ethers } from 'ethers';

import { Box, VStack, Text, Button, Image } from '@chakra-ui/react';
import {useAccount, useContractRead} from 'wagmi'
import Router from 'next/router';

import YourLogoImage from '../assets/dummyToken.svg';
import { TOKEN_ABI } from '../settings';

// import Link from 'next/link';

const ProjectBox = ({ locksData }) => {
  // console.log("Locks Data: ", locksData.result.token);

  const [tokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setDecimals] = useState(18);
  const [tokenLogo, setTokenLogo] = useState(YourLogoImage.src);

  useContractRead({
    address: locksData.result.token,
    abi: TOKEN_ABI,
    functionName: 'decimals',
    // enabled: userConnected && address,
    watch: true,
    onSuccess(data) {
        if (data) {
            setDecimals(Number(data));
        } else {
            setDecimals(18);
        }
    },
    onError(error) {
        // console.error('Error: ', error);
    }
});

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const cachedLogo = localStorage.getItem(locksData.result.token);
        if (cachedLogo) {
          setTokenLogo(cachedLogo);
        } else {
          const response = await fetch(`/api/getTokenDetails?address=${locksData.result.token}`);
          if (!response.ok) {
            throw new Error('Failed to fetch token data');
          }
          const data = await response.json();
          const logo = data.logo || YourLogoImage;

          localStorage.setItem(locksData.result.token, logo);
          setTokenLogo(logo);
        }
      } catch (error) {
        // console.error('Error fetching token data:', error);
      }
    };
    if (locksData.result.token) {
      fetchTokenData();
    }
  }, [locksData.result.token]);


    useContractRead({
      address: locksData.result.token,
      abi: TOKEN_ABI,
      functionName: 'symbol',
      // enabled: token,
      watch: true,
      onSuccess(data) {
          if (data) {
              setTokenSymbol(data);
              // console.log("Symbol: ", data);
          } else {
              // console.log("No Symbol");
          }
      },
      onError(error) {
          // console.error('Error: ', error);
      }
      });

  const gradient = 'linear(to-br, rgba(74, 29, 135, 0.4) 0%, rgba(209, 90, 82, 0.4) 90%)';
  const hoverGradient = 'linear(to-r, rgba(107, 35, 166, 0.8), rgba(225, 107, 100, 0.8))';

  return (
    <Box
      bgGradient={gradient}
      borderRadius='20px'
      p='4'
      color='white'
      maxW='sm'
      boxShadow='xl'
      mt='2'
      textAlign='center'
      _hover={
        {
          bgGradient: hoverGradient,
          transform: 'scale(1.05)',
          transition: 'all 0.5s ease',
        }
      }
    >
      <VStack spacing={4}>
        <Image src={tokenLogo} boxSize='70px' mt='4' bgColor='white' p='0.5' borderRadius={'full'} /> 
        <Text fontSize='3xl' fontWeight='bold'>
          {tokenSymbol}
        </Text>
        <Text fontSize='xl'>{ethers.formatUnits(locksData.result.amount, decimals)} <br />Tokens Locked</Text>

        {/* <Link href={`/project/${locksData.result.token}`}> */}
        <Button
          onClick={() => Router.push(`/project/${locksData.result.token}`)}
          colorScheme='purple'
          bgGradient='linear(to-r, #6B23A6, #E16B64)'
          _hover={{
            bgGradient: 'linear(to-r, #7D2AE8, #E76364)',
          }}
          borderRadius='full'
          size='md'
          mt='4'
          mb='8'
        >
          See Project
        </Button>
        {/* </Link> */}
        
      </VStack>
    </Box>
  );
};

export default ProjectBox;
