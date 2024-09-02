import React, { useState } from 'react';
import ProjectBox from '../components/ProjectBox';

import { Button, Grid, GridItem, Box, Center, useMediaQuery, Flex, InputGroup, Input, InputLeftElement, Image, Text, Spacer } from '@chakra-ui/react';
import LocksTable from '../components/LocksTable';

import Loupe from '../assets/loupe.png';

// Web3
import { useContractRead, useContractReads, useAccount } from 'wagmi';
import { LOCKER_ABI, LOCKER_ADDRESS } from '../settings';

const MyLocks = () => {
  const ITEMS_PER_PAGE = 8;
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { address } = useAccount();

  const [myLocks, setMyLocks] = useState([]);
  const [locksArray, setLocksArray] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useContractRead({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'getMyLocks',
    args: [address],
    watch: true,
    onSuccess(data) {
      if (data) {
        setMyLocks(data.reverse());
      }
    },
    onError(error) {
      // console.error('Error: ', error);
    },
  });

  const setQuerryResults = (e) => {
    const searchQuery = e.target.value.toLowerCase();
  
    if (searchQuery === '') {
      setSearchResults(locksArray);
    } else {
      const newSearchResults = locksArray.filter((lock) =>
        lock.result.token.toLowerCase().includes(searchQuery)
      );
      setSearchResults(newSearchResults);
    }
  };

  const locks = myLocks.map(lockId => ({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'lockInfo',
    args: [lockId],
    watch: true,
  }));

  const { data, isError, isLoading } = useContractReads({
    contracts: locks,
    onSettled(data) {
      setLocksArray(data);
      setSearchResults(data);
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
      <Center>
        <Box width='90%'>
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

      {address &&
      <Flex justify="center" mt="4" gap='3'>
        <Button onClick={() => paginate(currentPage - 1)} isDisabled={currentPage === 1}>Previous</Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button key={i + 1} onClick={() => paginate(i + 1)} isActive={i + 1 === currentPage}>
            {i + 1}
          </Button>
        ))}

         <Button onClick={() => paginate(currentPage + 1)} isDisabled={currentPage === totalPages}>Next</Button>
        
      </Flex>}

      <LocksTable />
    </Box>
  </Center>
</>
);
};

export default MyLocks
