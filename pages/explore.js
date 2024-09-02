import React, { useState } from 'react'
import ProjectBox from '../components/ProjectBox'

import { Spacer, Button, Grid, GridItem, Box, Center, useMediaQuery, Flex, Text, InputGroup, Input, InputLeftElement, Image } from '@chakra-ui/react'
import LocksTable from '../components/LocksTable'

import Loupe from '../assets/loupe.png';

// Web3
import { useContractRead, useContractReads, useAccount } from 'wagmi';
import { LOCKER_ABI, LOCKER_ADDRESS } from '../settings';

const Explore = () => {
  const ITEMS_PER_PAGE = 8;
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const [myLocks, setMyLocks] = useState([]);
  const [locksArray, setLocksArray] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem).reverse();

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useContractRead({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'getLockId',
    // args: [address],
    watch: true,
    onSuccess(data) {
      if (data) {
        // console.log('Last Lock Id: ', data);

        const myLocksArray = Array.from(Array(Number(data)).keys());
        const reversedMyLocksArray = [...myLocksArray].reverse(); 

        // setSearchResults(reversedMyLocksArray);
        setMyLocks(reversedMyLocksArray);
        // console.log('Updated myLocks:', reversedMyLocksArray);
        
      } else {
        // console.log('No Locks');
      }
    },
    onError(error) {
      // console.error('Error: ', error);
    },
  });

  const setQuerryResults = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    // console.log('Search Query:', searchQuery);
  
    if (searchQuery === '') {
      setSearchResults(locksArray);
    } else {
      const newSearchResults = locksArray.filter((lock) =>
        lock.result.token.toLowerCase().includes(searchQuery)
      );
      // console.log('Filtered Search Results:', newSearchResults);
      setSearchResults(newSearchResults);
    }
  };

  const locks = myLocks.map(lockId => ({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'lockInfo',
    args: [lockId],
    watch: true,
    onSettled(data) {
      // console.log('useContractReads onSettled:', data);
    },
    onError(error) {
      // console.error('Error: ', error);
    },
    onSuccess(data) {
      // console.log('useContractRead onSuccess:', data);
    }
  }));

  const { data, isError, isLoading } = useContractReads({
    contracts: locks,
    onError(error) {
      // console.error('Error: ', error);
    },
    onSettled(data) {
      // console.log('useContractReads onSettled:', data);
      setLocksArray(data);
      // console.log('Updated locksArray:', data);
      setSearchResults(data);
      // console.log('Updated searchResults:', data);
    }
  });


  return (
    <>
      <Center>
        <Box width={'90%'}>

        <Center>
            <Flex
              direction={isMobile ? 'column' : 'row'}
              align="center"
              p="4"
              mt='10'
              wrap="wrap"
              width='100%'
            >
              <Box flex={isMobile ? '100%' : 'auto'} mb={isMobile ? '4' : '0'}>
                <Text color="white" fontSize="4xl" textAlign={isMobile ? 'center' : 'left'}>Search Projects</Text>
              </Box>
              {isMobile && <Spacer />}
              <Box flex="1" maxW={isMobile ? '100%' : 'lg'} mt={isMobile ? '4' : '0'}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Image src={Loupe.src} boxSize="5" />
              </InputLeftElement>
              <Input
              placeholder="Search Project..."
              width={["100%", "100%", "100%", "100%", "100%", "100%"]}
              borderWidth="0px"
              bg='whiteAlpha.200'
              borderRadius={'full'}
              _focus={{ borderWidth: '1px' }}
              _placeholder={{ color: 'gray.500' }}
              color='gray.500'
              onChange={setQuerryResults}
              />
              </InputGroup>
              </Box>
              </Flex>
              </Center>


              <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)', 'repeat(6, 1fr)', ]} gap={6} px='10' pb='20'>
              {currentItems.map((lock, index) => (
                <GridItem key={lock.result.token + index}>
                  <ProjectBox locksData={lock} />
                </GridItem>
              ))}
            </Grid>


          <Flex justify="center" mt="4" gap='3'>
          <Button onClick={() => paginate(currentPage - 1)} isDisabled={currentPage === 1}>Previous</Button>
          {Array.from({ length: totalPages }, (_, i) => (
        <Button key={i + 1} onClick={() => paginate(i + 1)} isActive={i + 1 === currentPage}>
          {i + 1}
        </Button>
      ))}
      <Button isDisabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} >Next</Button>

          </Flex>
          <LocksTable />
        </Box>
      </Center>
    </>
  );
};

export default Explore;