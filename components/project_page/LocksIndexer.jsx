import React from 'react'
import ActiveLocks from './ActiveLocks'

import Link from 'next/link'

import { Grid, GridItem, HStack, Text, Button } from '@chakra-ui/react'
import ToBeWithdrawn from './ToBeWithdrawn'
import InactiveLocks from './InactiveLocks'
import LocksTable from '../LocksTable'

const LocksIndexer = (props) => {
    // console.log("Active Locks: ", props.activeLocks);
    // console.log("Completed Locks: ", props.completedLocks);
    // console.log("Inactive Locks: ", props.inactiveLocks);
    // console.log(props.activeLockIndexes)
  return (
   <> <br /> <br />
{/* ACTIVE LOCKS */}
{props.activeLocks.length > 0 && (
    <>
<HStack>
    <Text mt='10' mb='5' ml='7' color='white' fontSize='3xl'>
        <Text as='b' color='white'>Active Locks</Text>
    </Text>

    <Link href='/create'>
    <Button
            mt='6'
            size={'sm'}
            bgGradient='linear(to-r, #4A1D87, #D15A52)'
            color='white'
            mr={2}
            _hover={{
                bgGradient: 'linear(to-r, #6B23A6, #E16B64)',
                transform: 'scale(1.05)',
                transition: 'all 0.5s ease'
            }}
            >
            Create new lock
          </Button>
          </Link>
    </HStack>

    <Grid templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)','repeat(4, 1fr)', 'repeat(5, 1fr)']} gap={6} mb='10'>
    {props.activeLocks.slice().reverse().map((lock, i) => (
          <GridItem key={i} colSpan={1}>
            <ActiveLocks activeLocks={lock} tokenAddress={props.tokenAddress} />
          </GridItem>
        ))}
    </Grid>
    </>
    )}

{/* TO BE WITHDRAWN */}
{props.completedLocks.length > 0 && (<>
<HStack>
    <Text mt='10' mb='5' ml='7' color='white' fontSize='3xl'>
        <Text as='b' color='white'>To Be Withdrawn</Text>
    </Text>
    </HStack>
    <Grid templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)','repeat(4, 1fr)', 'repeat(5, 1fr)']} gap={6} mb='10'>
    {props.completedLocks.slice().reverse().map((lock, i) => (
          <GridItem key={i} colSpan={1}>
            <ToBeWithdrawn index={props.activeLockIndexes} toBeWithdrawn={lock} tokenAddress={props.tokenAddress} />
          </GridItem>
        ))}
    </Grid>
    </>)}


{/* INACTIVE */}
{props.inactiveLocks.length > 0 && (
    <>
<HStack>
    <Text mt='10' mb='5' ml='7' color='white' fontSize='3xl'>
        <Text as='b' color='white'>Inactive Locks</Text>
    </Text>
    </HStack>
    <Grid templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)', 'repeat(5, 1fr)']} gap={6} mb='10'>
    {props.inactiveLocks.slice().reverse().map((lock, i) => (
    // {[1, 2, 3].slice().reverse().map((lock, i) => (
        <GridItem key={i} colSpan={1}>
        <InactiveLocks inactiveLocks={lock} tokenAddress={props.tokenAddress} />
        </GridItem>
    ))}
    </Grid>
    </>
    )} 

    <LocksTable />

   </>
  )
}

export default LocksIndexer