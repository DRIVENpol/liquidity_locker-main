import React, { useState } from 'react';
import { Spinner, Box, VStack, Text, Button, useMediaQuery, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import {useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { TOKEN_ABI, LOCKER_ADDRESS, LOCKER_ABI, CHAIN_ID } from '../../settings';

const ToBeWithdrawn = (props) => {
    const gradient = 'linear(to-br, rgba(74, 29, 135, 0.4) 0%, rgba(209, 90, 82, 0.4) 90%)';
    const hoverGradient = 'linear(to-r, rgba(107, 35, 166, 0.8), rgba(225, 107, 100, 0.8))';
    const [isMobile] = useMediaQuery("(max-width: 768px)");
    const [tokenSymbol, setTokenSymbol] = useState('');
    const {isConnected: userConnected, address} = useAccount();
    const [decimals, setDecimals] = useState(0);
    const [amount, setAmount] = useState(0);
    const toast = useToast();

    // console.log("To Be Withdrawn Index: ", props.inactiveLocks);

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

      useContractRead({
        address: props.tokenAddress,
        abi: TOKEN_ABI,
        functionName: 'decimals',
        watch: true,
        onSuccess: async (data) => {
            if (data) {
              setDecimals(data);
              let _price = decimals === 0 ? 0 : props.toBeWithdrawn.result.amount
              const formattedAmount = await ethers.formatUnits(_price, decimals);
              setAmount(formattedAmount);
            } else {
                // console.log("No Name");
                setTokenSymbol('-');
            }
        },
        onError(error) {
            // console.error('Error: ', error);
        }
        });

      const { 
        config: unlockConfig,
      } = usePrepareContractWrite(
        {
          address: LOCKER_ADDRESS,
          abi: LOCKER_ABI,
          functionName: 'unlock',
          args: [String(props.index)],
          enabled: userConnected && props.toBeWithdrawn.result?.owner == address,
          onSettled(data, error) {
            // console.log("Data unlock: ", data, error);
          }
        },
      )
      const { data: _data, write: _unlock } = useContractWrite(unlockConfig)
    
     
      const { isLoading: _loadUnlock, isSuccess: _successUnlock } = useWaitForTransaction({
        hash: _data?.hash,
        onSettled(data, error) {
            toast({
                render: () => (
                    <Box color="white" p={5} bgGradient={'linear(to-r, #DB00FF, #FF0099)'} borderRadius={'10px'}>
                        <Text as='b'>Notification!</Text>
                        <Text>You succesfully unlocked tokens!</Text>
                        <Text as='u'>
                        <a href={`https://${CHAIN_ID == 56 ? `bscscan.com` : `testnet.bscscan.com`}/tx/${data.transactionHash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'yellow.200' }}>
                      See transaction on BSCScan
                    </a>
                        </Text>
                    </Box>
                ),
                status: 'success',
                duration: 10000,
                isClosable: true,
                position: 'bottom-right'
                });

                setNeedAllowance(false);
        },
        onError(error) {
          // console.log("Error: ", error);
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
  
    // console.log("Lock's Owner: ", props.toBeWithdrawn.result?.owner)
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
          {props.toBeWithdrawn.result.amount && props.toBeWithdrawn.result.amount > BigInt(0) && (
            <>
            {amount == 0 ? <Spinner /> : amount} {tokenSymbol}
            </>)}
        </Text>
      

        {props.toBeWithdrawn.result?.owner == address ? (
        <Button my='10' colorScheme='blackAlpha' onClick={_unlock} >
            {_loadUnlock ? "Unlocking..." : "Unlock"}
          </Button>
        ) :(
          <>
          <Button mt='10' colorScheme='blackAlpha' isDisabled={true} >
            Unlock
          </Button>
          <Text mb='10'>
            Only Lock&apos;s Owner
          </Text>
          </>
        )}

          <Text fontSize={'xl'} px='5'>
          Available To Be Withdrawn By Owner
          </Text>
      </VStack>
    </Box>
  );
};

export default ToBeWithdrawn;
