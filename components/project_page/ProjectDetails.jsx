import React, {useState} from 'react'

import { Spinner, Grid, GridItem, Center, Text, VStack, Box, useToast, Button } from '@chakra-ui/react'
import { useContractRead } from 'wagmi'
import { OWNABLE_ABI, LOCKER_ABI, LOCKER_ADDRESS, TOKEN_ABI } from '../../settings';
import { ethers, lock } from 'ethers';
import { CopyIcon } from '@chakra-ui/icons';

const ProjectDetails = ({tokenAddress, lockOwner}) => {
    const toast = useToast();

    const gradient = 'linear(to-br, rgba(74, 29, 135, 0.4) 0%, rgba(209, 90, 82, 0.4) 90%)';
    const hoverGradient = 'linear(to-r, rgba(107, 35, 166, 0.8), rgba(225, 107, 100, 0.8))';

    const [owner, setOwner] = useState('');
    const [totalLocked, setTotalLocked] = useState(0);
    const [decimals, setDecimals] = useState(0);
    const [loading, setLoading] = useState(true);

    useContractRead({
      address: tokenAddress,
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

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          render: () => (
              <Box color="white" p={5} bgGradient={'linear(to-r, #DB00FF, #FF0099)'} borderRadius={'10px'}>
                  <Text as='b'>Notification!</Text>
                  <Text>Address copied to clipboard!</Text>
              </Box>
          ),
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'bottom-right'
          });
      }, (err) => {
        // console.error('Could not copy text: ', err);
      });
    };
    

    useContractRead({
      address: tokenAddress,
      abi: OWNABLE_ABI,
      functionName: 'owner',
      // enabled: userConnected,
      watch: true,
      onSuccess(data) {
          if (data) {
              // setTokenName(data);
              setOwner(data);
              // console.log("Token Owner ", data);
          } else {
              // console.log("No Owner");
              setOwner('Unable to fetch owner');
          }
      },
      onError(error) {
          // console.error('Error: ', error);
      }
      });

      useContractRead({
        address: LOCKER_ADDRESS,
        abi: LOCKER_ABI,
        functionName: 'totalLocked',
        // enabled: userConnected,
        args: [tokenAddress],
        watch: true,
        onSuccess: async(data) => {
            if (data) {
                // setTokenName(data);
                let price = decimals === 0 ? 0 : data
                const formattedAmount = await ethers.formatUnits(price, decimals);
                setTotalLocked(formattedAmount);
                // console.log("Total Locked ", data);

                if (formattedAmount > "0") {
                  setLoading(false);
                } 


                // setTimeout(() => {
                //   setLoading(false);
                // }, 2000);
                
                  
            } else {
                // console.log("No Owner");
                setLoading(false);
                setTotalLocked(0);
            }
        },
        onError(error) {
            // console.error('Error: ', error);
        }
        });

    // Function to shorten the address
    function shortenAddress(address) {
        return address.slice(0, 6) + '...' + address.slice(address.length - 4, address.length);
    }

  return (
    <>
    <Box width='100%'>
    <Text mt='10' mb='5' ml='7' color='white' fontSize='3xl'>
        <Text as='b' color='white'>Projet Details</Text>
    </Text>
    <Center>
    <Grid templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)', ]} gap={6} width={'100%'}>
        <GridItem bgGradient={gradient} _hover={
        {
          bgGradient: hoverGradient,
        //   transform: 'scale(1.05)',
          transition: 'all 0.5s ease',
        }
      } w='100%' p='10' borderRadius={'20'}>
            <VStack>
                <Text fontSize={'xl'} color='white' as='b'>Address</Text>
                <Text fontSize={'xl'} color='white' as='b'>{shortenAddress(tokenAddress)}</Text>
                <Button onClick={() => copyToClipboard(tokenAddress)} size="sm" leftIcon={<CopyIcon />}>Copy</Button>
            </VStack>
        </GridItem>
            
        <GridItem bgGradient={gradient} _hover={
        {
          bgGradient: hoverGradient,
        //   transform: 'scale(1.05)',
          transition: 'all 0.5s ease',
        }
      } w='100%' p='10' borderRadius={'20'}>
        <VStack>
                <Text fontSize={'xl'} color='white' as='b'>Token Owner</Text>
                <Text fontSize={'xl'} color='white' as='b'>{shortenAddress(owner)}</Text>
                <Button onClick={() => copyToClipboard(owner)} size="sm" leftIcon={<CopyIcon />}>Copy</Button>
            </VStack>
        </GridItem>


        <GridItem bgGradient={gradient} _hover={
        {
          bgGradient: hoverGradient,
        //   transform: 'scale(1.05)',
          transition: 'all 0.5s ease',
        }
      } w='100%' p='10' borderRadius={'20'}>
        <VStack>
                <Text fontSize={'xl'} color='white' as='b'>Lock Owner</Text>
                <Text fontSize={'xl'} color='white' as='b'>{shortenAddress(lockOwner)}</Text>
                <Button onClick={() => copyToClipboard(lockOwner)} size="sm" leftIcon={<CopyIcon />}>Copy</Button>
            </VStack>
        </GridItem>


        <GridItem bgGradient={gradient} _hover={
        {
          bgGradient: hoverGradient,
        //   transform: 'scale(1.05)',
          transition: 'all 0.5s ease',
        }
      } w='100%' p='10' borderRadius={'20'}>
        <VStack>
                <Text fontSize={'xl'} color='white' as='b'>Total Tokens Locked</Text>
                <Text fontSize={'xl'} color='white' as='b'>{loading ? <Spinner /> : totalLocked}</Text>
            </VStack>
        </GridItem>
    </Grid>
    </Center>
    </Box>
    </>
  )
}

export default ProjectDetails