import React, { useState, useEffect } from 'react';
import { Link as ChakraLink, Flex, Spacer, Text, Avatar, HStack, Image, useMediaQuery } from '@chakra-ui/react';

import DiscordIcon from '../../assets/discord.png';
import SiteIcon from '../../assets/site.png'; 
import TwitterIcon from '../../assets/twitter.png'; 

import YourLogoImage from '../../assets/dummyToken.svg';
import BSC_Logo from '../../assets/bscLogo.svg';

import { useContractRead } from 'wagmi';
import { TOKEN_ABI } from '../../settings';

import Link from 'next/link';

const ProjectHeader = ({ tokenAddress }) => {
    const bgGradient = `linear(to-r, rgba(74, 29, 135, 0.6), rgba(209, 90, 82, 0.6))`;
    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [tokenLogo, setTokenLogo] = useState(YourLogoImage.src);
    const [discord, setDiscord] = useState(DiscordIcon);
    const [website, setWebsite] = useState(SiteIcon);
    const [twitter, setTwitter] = useState(TwitterIcon);

    useEffect(() => {
        const fetchTokenData = async () => {
          try {
            const cachedLogo = localStorage.getItem(tokenAddress);
            if (cachedLogo) {
              setTokenLogo(cachedLogo);
              return;
    
            } else {
              const response = await fetch(`/api/getTokenDetails?address=${tokenAddress}`);;
              if (!response.ok) {
                setTokenLogo(YourLogoImage.src);
                return;
              }
              const data = await response.json();
              const logo = data.logo || YourLogoImage.src;
              localStorage.setItem(tokenAddress, logo);
              setTokenLogo(logo);
              return;
            }
          } catch (error) {
            setTokenLogo(YourLogoImage.src);
            return;
          }
        };
        if (tokenAddress) {
          fetchTokenData();
        }
      }, [tokenAddress]);

    useEffect(() => {
        
        const fetchTokenData = async () => {
            // console.log("Trying to fetch tokenAddress data")
            try {
                
                const response = await fetch(`/api/getTokenDetails?address=${tokenAddress}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tokenAddress data');
                }
                const data = await response.json();
                // console.log("API Data: " , data)
                setDiscord(data.discord);
                setWebsite(data.website);
                setTwitter(`https://twitter.com/${data.twitter}`);
                // console.table("Discord: ", data.discord, "Website: ", data.website, "Twitter: ", data.twitter);
                } catch (error) {
                // console.error('Error fetching tokenAddress data:', error);
                }
                };
                fetchTokenData();
    }, []);
            
            useContractRead({
                address: tokenAddress,
                abi: TOKEN_ABI,
                functionName: 'name',
                watch: true,
                onSuccess(data) {
                    if (data) {
                        setTokenName(data);
                    }
                },
                onError(error) {
                    // console.error('Error: ', error);
                }
            });
            
            useContractRead({
                address: tokenAddress,
                abi: TOKEN_ABI,
                functionName: 'symbol',
                watch: true,
                onSuccess(data) {
                    if (data) {
                        setTokenSymbol(data);
                    }
                },
                onError(error) {
                    // console.error('Error: ', error);
                }
            });
            
            return (
                <>
                    <Flex mt='10' bgGradient={bgGradient} py='7' borderRadius='25'>
                        <HStack>
                            <Avatar src={tokenLogo} bg='white' p='0.5' size='lg' ml='10' />
                            <Flex flexDirection={isMobile ? 'column' : 'row'}>
                                <Text as='b' color='white'>{tokenName}</Text>
                                <Text color='white' ml='1'>({tokenSymbol})</Text>
                            </Flex>
                        </HStack>
                        <Spacer />
                        <HStack mr='10'>
                            {discord && <Link href={discord} target='_blank'><Image src={DiscordIcon.src} boxSize='7' /></Link>}
                            {website && <Link href={website} target='_blank'><Image src={SiteIcon.src} boxSize='6' /></Link>}
                            {twitter && <Link href={twitter} target='_blank'><Image src={TwitterIcon.src} boxSize='6' /></Link>}
                            <Link href={`https://bscscan.com/address/${tokenAddress}`} target='_blank'><Image src={BSC_Logo.src} boxSize='6' /></Link>
                        </HStack>
                    </Flex>
                </>
            );
        }; 
        
export default ProjectHeader;