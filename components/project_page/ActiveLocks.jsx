import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Box, VStack, Text, useMediaQuery } from '@chakra-ui/react';

import Timer from './Timer';

import { useContractRead } from 'wagmi'
import { TOKEN_ABI } from '../../settings';

const ActiveLockBox = ({ activeLocks, tokenAddress }) => {
  // console.log("Active Locks: ", activeLocks);
    const gradient = 'linear(to-br, rgba(74, 29, 135, 0.4) 0%, rgba(209, 90, 82, 0.4) 90%)';
    const hoverGradient = 'linear(to-r, rgba(107, 35, 166, 0.8), rgba(225, 107, 100, 0.8))';
    const [isMobile] = useMediaQuery("(max-width: 768px)");
    const [decimals, setDecimals] = useState(0);
    const [tokenName, setTokenName] = useState('');
    const [amount, setAmount] = useState(0);

    // const getPrice = async (price) => {
    //   let _price = decimals === 0 ? 0 : price
    //   const formattedAmount = await ethers.formatUnits(_price, decimals);
    //   setAmount(formattedAmount);
    // }

    useContractRead({
        address: tokenAddress,
        abi: TOKEN_ABI,
        functionName: 'symbol',
        watch: true,
        onSuccess(data) {
            if (data) {
                setTokenName(data);
                // console.log("Token Name: ", data);
            } else {
                // console.log("No Name");
            }
        },
        onError(error) {
            // console.error('Error: ', error);
        }
        });

        useContractRead({
          address: tokenAddress,
          abi: TOKEN_ABI,
          functionName: 'decimals',
          watch: true,
          onSuccess: async (data) => {
              if (data) {
                  setDecimals(Number(data));
                  let _price = decimals === 0 ? 0 : activeLocks.result.amount
                  const formattedAmount = await ethers.formatUnits(_price, decimals);
                  setAmount(formattedAmount);
                  
              } else {
                  // console.log("No Name");
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
          boxShadow='xl'
          mt='2'
          textAlign='center'
          py='10'
          _hover={hoverStyles}
        >
          <VStack spacing={4}> 
            <Text fontSize='3xl' fontWeight='bold'>
              {tokenName} 
            </Text>
            <Text fontSize='xl'>{amount == 0 ? "Loading..." : amount} Tokens Locked</Text>
            <Timer endTime={Number(activeLocks.result.lockTime)} /> {/* Timer to show lock expiration */}
          </VStack>
        </Box>
      );
    };

export default ActiveLockBox;
