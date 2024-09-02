import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  VStack,
  IconButton,
  Text,
  useToast,
  Select
} from '@chakra-ui/react';

import { CalendarIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import Router from 'next/router';

// Web3
import { 
    useAccount, 
    useContractRead, 
    usePrepareContractWrite, 
    useContractWrite, 
    useWaitForTransaction,
    useNetwork
} from 'wagmi';
import { LOCKER_ADDRESS, LOCKER_ABI, CHAIN_ID, TOKEN_ABI, CHAINBASE_API_KEY } from '../../settings';

const Create = () => {
    // console.log("INITIAL SETTINGS ** /Create.jsx: " + LOCKER_ADDRESS)
    const gradient = 'linear(to-br, rgba(74, 29, 135, 0.4) 0%, rgba(209, 90, 82, 0.4) 90%)';

    const [userConnected, setUserConnected] = useState(false);

    const [tokenAddress, setTokenAddress] = useState('');
    const [amountToDisplay, setAmountToDisplay] = useState('');
    const [amount, setAmount] = useState('');

    const [balanceToDisplay, setBalanceToDisplay] = useState('');

    const [lowBalance, setLowBalance] = useState(false);

    const [decimals, setDecimals] = useState();

    const [allowance, setAllowance] = useState('');
    const [needAllowance, setNeedAllowance] = useState(true);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [daysToLock, setDaysToLock] = useState(0);

    const [tokens, setTokens] = useState([]);

    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    
    const toast = useToast();

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <IconButton
            icon={<CalendarIcon />}
            onClick={onClick}
            ref={ref}
            variant="outline"
            colorScheme="white"
            aria-label="Select Date"
        >
            {value}
        </IconButton>
    ));

    CustomInput.displayName = "CustomInput";

    async function checkIfBalanceIsLowerThanAmount() {
        if (BigInt(balanceToDisplay) < BigInt(amountToDisplay)) {
            setLowBalance(true);
            // console.log("Low balance: ", lowBalance);
        } else {
            setLowBalance(false);
            // console.log("Low balance: ", lowBalance);
        }
    }

    // WEB3 FUNCTIONS 
    useContractRead({
        address: tokenAddress,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: [String(address)],
        enabled: userConnected && address,
        watch: true,
        onSuccess(data) {
            if (data) {
                setBalanceToDisplay(String(BigInt(data) / BigInt(10 ** decimals)));
                // console.log("Balance: ", balanceToDisplay);
            } else {
                setBalanceToDisplay('0');
            }
        },
        onError(error) {
            setBalanceToDisplay('0');
        }
    });

    useContractRead({
        address: tokenAddress,
        abi: TOKEN_ABI,
        functionName: 'allowance',
        args: [String(address), String(LOCKER_ADDRESS)],
        enabled: userConnected && address,
        watch: true,
        onSuccess(data) {
            if (data) {
                setAllowance(String(data));
            } else {
                setAllowance('0');
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
        enabled: userConnected && address,
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


    const { 
        config: lockConfig,
      } = usePrepareContractWrite(
        {
          address: LOCKER_ADDRESS,
          abi: LOCKER_ABI,
          functionName: 'lock',
          args: [tokenAddress, amount, daysToLock],
          enabled: userConnected && address && tokenAddress,
          value: 0,
          onSettled(data) {
            // console.log("Data locking: ", data);
          },
          onError(error) {
            // console.log("Error locking: ", error);
        }
        },
      )
      const { data: _dataLocking, write: _lock  } = useContractWrite(lockConfig)
    
     
      const { isLoading: _lockIsLoading, isSuccess: _successLock } = useWaitForTransaction({
        hash: _dataLocking?.hash,
        onSettled(data, error) {
            setNeedAllowance(true)
            toast({
              render: () => (
                <Box color="white" p={5} bgGradient={'linear(to-r, #DB00FF, #FF0099)'} borderRadius={'10px'}>
                  <Text as='b'>Notification!</Text>
                  <Text> You locked {amountToDisplay} tokens!</Text>
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
            Router.push('/mylocks');
        }
      });

      const { 
        config: allowanceConfig,
      } = usePrepareContractWrite(
        {
          address: tokenAddress,
          abi: TOKEN_ABI,
          functionName: 'approve',
          args: [LOCKER_ADDRESS, amount],
          enabled: userConnected && address && needAllowance,
          onSettled(data, error) {
            // console.log("Data approve: ", data, error);
          }
        },
      )
      const { data: _data, write: _setAllowance  } = useContractWrite(allowanceConfig)
    
     
      const { isLoading: _loadAllowance, isSuccess: _successAllowance } = useWaitForTransaction({
        hash: _data?.hash,
        onSettled(data, error) {
            toast({
                render: () => (
                    <Box color="white" p={5} bgGradient={'linear(to-r, #DB00FF, #FF0099)'} borderRadius={'10px'}>
                        <Text as='b'>Notification!</Text>
                        <Text>You approved tokens for lock!</Text>
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
      });

    const handleTokenSelect = (e) => {
        // console.log(e.target.value);
        setTokenAddress(e.target.value);
    };

    const handleAmountChange = (e) => {
        // console.log(e.target.value);
        // console.log(String(BigInt(e.target.value) * BigInt(10 ** 18)));

        if(e.target.value < 0) {
            alert('Amount cannot be less than 0');
            return;
        }

        setAmountToDisplay(Number(e.target.value));
        setAmount(String(BigInt(e.target.value * 10 ** decimals).toString()));

        if (BigInt(allowance) < String(BigInt(e.target.value * 10 ** decimals).toString())) {
            setNeedAllowance(true);
        } else {
            setNeedAllowance(false);
        }

        // console.log("Need allowance: ", needAllowance);
        // console.log("Allowance: ", BigInt(allowance))
        // console.log("Amount: ", BigInt(e.target.value * 10 ** 18))
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const currentDate = new Date();
        const differenceInDays = Math.ceil((date - currentDate) / (1000 * 60 * 60 * 24));
        setDaysToLock(differenceInDays);

        // console.log(differenceInDays);
      };

      const fetchOwnedTokens = () => {
        const options = {
            url: `https://api.chainbase.online/v1/account/tokens?chain_id=${CHAIN_ID}&address=${address}&limit=5&page=1`,
            method: 'GET',
            headers: {
                'x-api-key': CHAINBASE_API_KEY,
                'accept': 'application/json'
            }
        };
        axios(options)
            .then(response => {
                setTokens(response.data.data);
            })
            // .catch(error => console.log(error));
    }

      // Use effects
      useEffect(() => {
        if (isConnected && chain?.id === CHAIN_ID) {
            // console.log('Connected to: ', chain.id);
            setUserConnected(true);
            fetchOwnedTokens();
        } else {
            setUserConnected(false);
        }
    }
    , [isConnected, chain?.id]);

    useEffect(() => {
      if(chain?.id !== CHAIN_ID) {
        toast({
          render: () => (
              <Box color="white" p={5} bgGradient={'linear(to-r, #DB00FF, #FF0099)'} borderRadius={'10px'}>
                  <Text as='b'>Notification!</Text>
                  <Text>Wrong network OR not connected. Please connect to {CHAIN_ID == 56 ? "BSC Mainnet" : "BSC Testnet"} network!</Text>
              </Box>
          ),
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'bottom-right'
          });
      } 
  }, [isConnected, chain?.id]);

    useEffect(() => {
        checkIfBalanceIsLowerThanAmount();
    }  
    , [amountToDisplay, balanceToDisplay, tokenAddress, amount]);

    return (
        <Center height="100vh" p={4}>
            <Box
                bgGradient={gradient}
                borderRadius='lg'
                p={8}
                color='white'
                boxShadow='2xl'
                maxWidth='lg'
                w='full'
            >
                <VStack spacing={6}>
                <Text fontSize={'3xl'} mb='10'>
                    <Text as='b'>
                    Create a new ERC20 / LP lock 
                        </Text></Text>


                    {/* <FormControl id="token-address">
                        <FormLabel>Token Address</FormLabel>
                        <Input
                            type="text"
                            value={tokenAddress}
                            placeholder="Enter token address"
                            size="lg"
                            // variant="filled"
                            onChange={handleAddressChange}
                        />
                    </FormControl> */}

                    <FormControl id="token-address">
                                <FormLabel>Token Address</FormLabel>
                                <Select
                                    placeholder="Select token"
                                    size="lg"
                                    onChange={handleTokenSelect}
                                >
                                    {tokens.map((token) => (
                                        <option key={token.contract_address} value={token.contract_address}>
                                            {`${token.name} (${token.contract_address.slice(0, 6)}...${token.contract_address.slice(-4)})`}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                    <FormControl id="amount">
                        <FormLabel>Amount</FormLabel>
                        <Input
                            type="number"
                            // value={amountToDisplay}
                            min={0}
                            placeholder="Enter amount"
                            size="lg"
                            // variant="filled"
                            onChange={handleAmountChange}
                        />
                    </FormControl>

                    {lowBalance && (
                        <>
                        <Box p={5} bgColor={'blackAlpha.700'} color='white' borderRadius={'10px'} width={'100%'}>
                            <Text as='b'>Notification!</Text>
                            <Text>Insufficient balance!</Text>
                        </Box>
                        </>
                    )}

                    {!needAllowance ? (
                        <>
                    <FormControl id="date-picker">
                        <FormLabel>Days To Lock {daysToLock == 0 ? `` : `: ${daysToLock}` }</FormLabel>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => handleDateChange(date)}
                            customInput={<CustomInput />}
                            dateFormat="MMMM d, yyyy"
                        />
                    </FormControl>
                        </>
                    ) : null}



                    {needAllowance ? (
                        <Button
                            size="lg"
                            colorScheme="blackAlpha"
                            // _hover={{ boxShadow: 'lg' }}
                            onClick={_setAllowance}
                            color='white'
                            mt='10'
                        >
                            {_loadAllowance ? 'Approving...' : 'Approve'}
                        </Button>
                    ) : (
                        <Button
                        size="lg"
                        colorScheme="blackAlpha"
                        // _hover={{ boxShadow: 'lg' }}
                        onClick={_lock}
                        mt='10'
                    >
                        {_lockIsLoading ? 'Locking...' : 'Lock'}
                    </Button>
                    )    
                    }


                </VStack>
            </Box>
        </Center>
    );
};

export default Create;
