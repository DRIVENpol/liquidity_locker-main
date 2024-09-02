import { Grid, Box, Text, GridItem, Center } from '@chakra-ui/react';

const FeatureSection = () => {
  const gradient = 'linear(to-br, rgba(74, 29, 135, 0.4) 0%, rgba(209, 90, 82, 0.4) 90%)';
  const hoverGradient = 'linear(to-r, rgba(107, 35, 166, 0.8), rgba(225, 107, 100, 0.8))';

  return (
    <Center>
    <Box p={5} color="white" borderRadius="lg" mt='10' ml='5' mr='10' width='96%'>
      <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="left">
        Why Should I Use Rev3al Locker Instead Of Other Lockers?
      </Text>
      <Grid
        templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={6}
      >
        {/* Security Box */}
        <GridItem>
          <Box 
            p={5} 
            borderRadius="lg" 
            bgGradient={gradient} 
            boxShadow="xl" 
            height="100%" 
            _hover={
              {
                bgGradient: hoverGradient,
                transform: 'scale(1.05)',
                transition: 'all 0.5s ease',
              }
            }
          >
            <Text fontSize="xl" mb={2} fontWeight="bold">Security</Text>
            <Text fontSize="md">
              We set up separate vaults for each project, avoiding the storage of all project tokens in a single smart contract (V2).
            </Text>
          </Box>
        </GridItem>
        {/* Not expensive Box */}
        <GridItem>
          <Box 
            p={5} 
            borderRadius="lg" 
            bgGradient={gradient} 
            boxShadow="xl" 
            height="100%" 
            _hover={
              {
                bgGradient: hoverGradient,
                transform: 'scale(1.05)',
                transition: 'all 0.5s ease',
              }
            }
          >
            <Text fontSize="xl" mb={2} fontWeight="bold">Free To Use</Text>
            <Text fontSize="md">
            We offer free-of-charge security for all DeFi projects. Secure your tokens/liquidity on BSC without any cost.
            </Text>
          </Box>
        </GridItem>
        {/* Support Box */}
        <GridItem>
          <Box 
            p={5} 
            borderRadius="lg" 
            bgGradient={gradient} 
            boxShadow="xl" 
            height="100%" 
            _hover={
              {
                bgGradient: hoverGradient,
                transform: 'scale(1.05)',
                transition: 'all 0.5s ease',
              }
            }
          >
            <Text fontSize="xl" mb={2} fontWeight="bold">Support</Text>
            <Text fontSize="md">
              If you&apos;re planning a migration and need to withdraw liquidity, we&apos;re here to assist. We ensure safe token removal, but only after you&apos;ve made an announcement to your holders at least 3 days prior.
            </Text>
          </Box>
        </GridItem>
        {/* Documentation Box */}
        <GridItem>
          <Box 
            p={5} 
            borderRadius="lg" 
            bgGradient={gradient} 
            boxShadow="xl" 
            height="100%" 
            _hover={
              {
                bgGradient: hoverGradient,
                transform: 'scale(1.05)',
                transition: 'all 0.5s ease',
              }
            }
          >
            <Text fontSize="3xl" fontWeight="bold">Read Our Documentation &gt;</Text>
            {/* <Icon as={ChevronRightIcon} w={10} h={10} alignSelf="flex-end" /> */}
            <Text color='white' fontSize={'sm'}>(Under construction)</Text>
          </Box>
        </GridItem>
      </Grid>
    </Box>
    </Center>
  );
};

export default FeatureSection;
