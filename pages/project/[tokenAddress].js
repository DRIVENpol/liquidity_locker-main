import React, {useState} from 'react';
import { Box, Center } from '@chakra-ui/react';
import ProjectHeader from '../../components/project_page/ProjectHeader';
import ProjectDetails from '../../components/project_page/ProjectDetails';
import LocksIndexer from '../../components/project_page/LocksIndexer';

// Web3
import { useContractRead, useContractReads, useAccount } from 'wagmi';
import { LOCKER_ABI, LOCKER_ADDRESS } from '../../settings';

const Project = ({ tokenAddress }) => {
  // console.log(`Rendering project page for token ${tokenAddress}`);

  const { isConnected } = useAccount();

  const [activeLocks, setActiveLocks] = useState([]);
  const [completedLocks, setCompletedLocks] = useState([]);
  const [inactiveLocks, setInactiveLocks] = useState([]);
  const [locksArray, setLocksArray] = useState([]);

  const [activeLockIndexes, setActiveLockIndexes] = useState([]);
  const [completedLockIndexes, setCompletedLockIndexes] = useState([]);
  const [inactiveLockIndexes, setInactiveLockIndexes] = useState([]);

  const [lockOwner, setLockOwner] = useState('');

  // console.log("Completed Locks: ", completedLocks);
  useContractRead({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'getTokenLocks',
    args: [tokenAddress],
    // enabled: isConnected,
    watch: true,
    onSuccess(data) {
      if (data) {
        setLocksArray(data.reverse());
        // console.log('Locks Array: ', data.reverse());
      }
    },
    onError(error) {
      // console.error('Error: ', error);
    },
  });

  const locks = locksArray.map(lockId => ({
    address: LOCKER_ADDRESS,
    abi: LOCKER_ABI,
    functionName: 'lockInfo',
    args: [lockId],
    watch: true,
  }));

  const { data, isError, isLoading } = useContractReads({
    contracts: locks,
    onSettled(data) {
      // console.log('Data: ', data);
      if (data) {
        const activeLocksTemp = [];
        const completedLocksTemp = [];
        const inactiveLocksTemp = [];
  
        const activeIndexesTemp = [];
        const completedIndexesTemp = [];
        const inactiveIndexesTemp = [];
  
        data.forEach((lock, index) => {
          const currentTime = Date.now() / 1000; 
          const lockTime = Number(lock.result.lockTime);
          const isLocked = Number(lock.result.locked) == 1;
          setLockOwner(lock.result.owner);
          // console.log("Is Locked: ", Number(lock.result.locked));
          // console.log("Type: ", typeof lock.result.locked);

          // console.table(lock);
  
          if (isLocked) {
            if (lockTime >= currentTime) {
              activeLocksTemp.push(lock);
              activeIndexesTemp.push(String(lock.result.lockId));
            } else {
              completedLocksTemp.push(lock);
              completedIndexesTemp.push(String(lock.result.lockId));
            }
          } else {
            inactiveLocksTemp.push(lock);
            inactiveIndexesTemp.push(String(lock.result.lockId));
          }
        });
  
        setActiveLocks(activeLocksTemp);
        setCompletedLocks(completedLocksTemp);
        setInactiveLocks(inactiveLocksTemp);
  
        setActiveLockIndexes(activeIndexesTemp);
        setCompletedLockIndexes(completedIndexesTemp);
        setInactiveLockIndexes(inactiveIndexesTemp);
      }
    },
    onError(error) {
      // console.error('Error: ', error);
    },
  });
  // console.log("Data: ", data);

  return (
    <>
      <Center>
        <Box width='96%'>
          <ProjectHeader tokenAddress={tokenAddress} />
          <ProjectDetails tokenAddress={tokenAddress} lockOwner={lockOwner} />
          <LocksIndexer 
          tokenAddress={tokenAddress}
          activeLocks={activeLocks}
          completedLocks={completedLocks}
          inactiveLocks={inactiveLocks}
          activeLockIndexes={activeLockIndexes}
          completedLockIndexes={completedLockIndexes}
          inactiveLockIndexes={inactiveLockIndexes}
          />
        </Box>
      </Center>
    </>
  );
};

export async function getServerSideProps(context) {
  const { tokenAddress } = context.params;
  return { props: { tokenAddress } };
}

export default Project;
