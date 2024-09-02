import React, { useState } from 'react';
import { Button, Text, Flex, Box, Center, useMediaQuery, Stack } from '@chakra-ui/react';
import LockRow from './LockRow'; // Import the LockRow component

// Web3
import { useContractRead } from 'wagmi';
import { LOCKER_ABI, LOCKER_ADDRESS } from '../settings';

const LocksTable = () => {
  const itemsPerPage = 4;
  const maxLocksToShow = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const [lastLockId, setLastLockId] = useState(0);

  useContractRead({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'getLockId',
    watch: true,
    onSuccess(data) {
      if (data) {
        // console.log("Log down page count: ", data);
        setLastLockId(Number(data));
      } else {
        // console.log("No Locks");
      }
    },
    onError(error) {
      // console.error('Error: ', error);
    }
  });

  const startIndexOfLastLocks = Math.max(0, lastLockId - maxLocksToShow);

  const lockIdArray = Array.from(
    { length: Math.min(lastLockId, maxLocksToShow) },
    (_, i) => i + startIndexOfLastLocks
  );

  const reversedLockIdArray = lockIdArray.slice().reverse();

  const pageCount = Math.ceil(lockIdArray.length / itemsPerPage);

  const currentItems = reversedLockIdArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // console.log("Current items:", currentItems); // Debug: Check the order before reversing
  // console.log("Reversed current items:", reversedCurrentItems);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
    <Text fontSize='3xl' color='white' ml='10' fontWeight='bold' mb={5} mt='10'> Recent Locks</Text>
    <Center pb='10'>
      <Box overflowX="auto" width='96%'>
        <Flex
          direction="column"
          width='100%'
          borderRadius='20px'
          overflow='hidden'
        >
      {currentItems.map((index) => (
        <LockRow key={index} lockIndex={index} isMobile={isMobile} />
      ))}
        </Flex>
        <Stack spacing={4} direction="row" align="center" justify="center" mt={4}>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              onClick={() => handlePageClick(page)}
              colorScheme="whiteAlpha"
              color={'white'}
              variant={currentPage === page ? 'solid' : 'ghost'}
            >
              {page}
            </Button>
          ))}
        </Stack>
      </Box>
    </Center>
    </>
  );
};

export default LocksTable;
