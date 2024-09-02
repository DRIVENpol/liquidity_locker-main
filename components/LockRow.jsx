import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Spinner, Flex, Text, Button, Avatar } from '@chakra-ui/react';

import YourLogoImage from '../assets/dummyToken.svg';

import { useContractRead } from 'wagmi'
import { LOCKER_ABI, LOCKER_ADDRESS, TOKEN_ABI } from '../settings';

import Link from 'next/link';
import Router from 'next/router';

const LockRow = ({ lockIndex, isMobile }) => {
  // Convert hex colors to RGBA and apply the opacity to the color
  const bgGradient = `linear(to-r, rgba(74, 29, 135, 0.6), rgba(209, 90, 82, 0.6))`;
  const hoverBgGradient = `linear(to-r, rgba(107, 35, 166, 0.6), rgba(225, 107, 100, 0.6))`;
  
  const [token, setToken] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [amount, setAmount] = useState(0);
  const [unlockDate, setUnlockDate] = useState(0);
  const [decimals, setDecimals] = useState(0);
  const [tokenLogo, setTokenLogo] = useState(YourLogoImage.src);
  const [owner, setOwner] = useState('');

  const truncateAddress = (address) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

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

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const cachedLogo = localStorage.getItem(token);
        if (cachedLogo) {
          setTokenLogo(cachedLogo);
        } else {
          const response = await fetch(`/api/getTokenDetails?address=${token}`);
          if (!response.ok) {
            throw new Error('Failed to fetch token data');
          }
          const data = await response.json();
          const logo = data.logo || YourLogoImage;

          localStorage.setItem(token, logo);
          setTokenLogo(logo);
        }
      } catch (error) {
        // console.error('Error fetching token data:', error);
      }
    };
    if (token) {
      fetchTokenData();
    }
  }, [token]);

  useContractRead({
    address: token,
    abi: TOKEN_ABI,
    functionName: 'name',
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
      address: token,
      abi: TOKEN_ABI,
      functionName: 'symbol',
      enabled: token,
      watch: true,
      onSuccess(data) {
          if (data) {
              setTokenSymbol(data);
            //   console.log(data);
          } else {
            //   console.log("No Symbol");
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
    args: [lockIndex],
    watch: true,
    onSuccess(data) {
        if (data) {
            setToken(data.token);
            let price = decimals === 0 ? 0 : data.amount
            const formattedAmount = ethers.formatUnits(price, decimals);
            setAmount(formattedAmount);

            const unlockDateTimestamp = parseInt(data.lockTime, 10);
            const unlockDate = new Date(unlockDateTimestamp * 1000);
      
            // Format the date as mm/dd/yyyy
            const formattedDate = `${(unlockDate.getMonth() + 1).toString().padStart(2, '0')}/${unlockDate.getDate().toString().padStart(2, '0')}/${unlockDate.getFullYear()}`;
      
            setUnlockDate(formattedDate);

            setOwner(truncateAddress(data.owner));

            // console.log(data.owner);
        } else {
            // console.log("No Locks");
        }
    },
    onError(error) {
        // console.error('Error: ', error);
    }
    });

  return (
    <Flex
      width='100%'
      bgGradient={bgGradient}
      borderRadius='20px'
      px='6'
      py='4'
      my='2'
      _hover={{ bgGradient: hoverBgGradient }}
      justifyContent="space-between"
      alignItems="center"
      overflowX={'auto'}
      gap={isMobile ? '20' : '0'}
    >
      <Avatar size='md' src={tokenLogo} bgColor='white' p='0.5' mr='2' />
      <Text color='white' flex="1">{tokenName} ({tokenSymbol})</Text>
      <Text color='white' flex="1"> Locked By: {owner}</Text>
      <Text color='white' flex="1">{amount == "0" ? <Spinner/> : amount}</Text>
      <Text color='white' flex="1">{unlockDate}</Text>
      {/* <Text color='white' flex="1">100M</Text> */}

      {/* <Link href={`/project/${token}`}> */}
      <Button 
        onClick={() => {
          Router.push(`/project/${token}`);
        }}
        color='white'
        size='sm' px={isMobile ? '10' : null} colorScheme='whiteAlpha'>See Lock</Button>
      {/* </Link> */}
    </Flex>
  );
};

export default LockRow;
