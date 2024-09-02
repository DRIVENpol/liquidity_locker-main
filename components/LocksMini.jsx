import React, {useState, useEffect} from 'react'
import { Spinner, Box, HStack, Avatar, Text, Button } from '@chakra-ui/react'
import { ethers } from 'ethers';
import Router from 'next/router';

import YourLogoImage from "../assets/dummyToken.svg";

import {useAccount, useContractRead} from 'wagmi'
import { LOCKER_ABI, LOCKER_ADDRESS, TOKEN_ABI } from '../settings';



const LocksMini = ({ index }) => {
  const [token, setToken] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [amount, setAmount] = useState(null);
  const [decimals, setDecimals] = useState(0);
  const [loading, setLoading] = useState(true);

  const {isConnected: userConnected} = useAccount();
  const [tokenLogo, setTokenLogo] = useState(YourLogoImage.src);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const cachedLogo = localStorage.getItem(token);
        if (cachedLogo) {
          setTokenLogo(cachedLogo);
          return;

        } else {
          const response = await fetch(`/api/getTokenDetails?address=${token}`);;
          if (!response.ok) {
            setTokenLogo(YourLogoImage.src);
            return;
          }
          const data = await response.json();
          const logo = data.logo || YourLogoImage.src;
          localStorage.setItem(token, logo);
          setTokenLogo(logo);
          return;
        }
      } catch (error) {
        setTokenLogo(YourLogoImage.src);
        return;
      }
    };
    if (token) {
      fetchTokenData();
    }
  }, [token]);

  useContractRead({
    address: token,
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
  

  useContractRead({
    address: token,
    abi: TOKEN_ABI,
    functionName: 'symbol',
    enabled: token,
    watch: true,
    onSuccess(data) {
        if (data) {
            setTokenName(data);
            // console.log(data);
        } else {
            // console.log("No Name");
        }
    },
    onError(error) {
        // console.error('Error: ', error);
    }
    });

  useContractRead({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'lockInfo',
    args: [index],
    watch: true,
    onSuccess: async (data) => {
        if (data) {
            let price = decimals === 0 ? 0 : data.amount
            setToken(data.token);
            
            const formattedAmount = await ethers.formatUnits(price, decimals);
            setAmount(formattedAmount);
            // console.log("Type of amount: ", typeof(formattedAmount));
            if (formattedAmount != "0") {
            setLoading(false);
            }
        } else {
            // console.log("No Locks");
        }
    },
    onError(error) {
       
    }
    });

    return (
      <Box
        bgGradient='linear(to-r, #4A1D87, #D15A52)' 
        opacity='0.9'
        borderRadius='20px'
        px='6'
        py='2'
        mt='5'
        ml={{ base: '0', md: index % 2 === 0 ? '0' : '20' }} 
        w='full'
        _hover={{
            bgGradient: 'linear(to-r, #6B23A6, #E16B64)',
            transform: 'scale(1.05)',
            transition: 'all 0.5s ease',
        }}
      >
        <HStack justifyContent='center'>
          <Avatar size='md' src={tokenLogo} bgColor='white' p='0.5' ignoreFallback />
          <Text as='b' color='white'>{tokenName}</Text>
          <Text color='white'>
          {loading ? <Spinner size='sm' /> : amount}
          </Text>

          {/* <Link href={`/project/${token}`}> */}
          <Button size='sm' ml='10'
            onClick={() => {
              Router.push(`/project/${token}`);
            }
          }
          >See Lock</Button>
          {/* </Link> */}
        </HStack>
      </Box>
    );
  }

export default LocksMini