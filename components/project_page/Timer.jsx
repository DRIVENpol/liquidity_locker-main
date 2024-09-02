import React, { useState, useEffect } from 'react';
import { HStack, Box, VStack, Text } from '@chakra-ui/react';

const Timer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({});

    // console.log("End Time: ", endTime);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(endTime * 1000) - +new Date();
            let timeLeft = {};

            if (difference > 0) {
                timeLeft = {
                    years: Math.floor(difference / (1000 * 60 * 60 * 24 * 365)),
                    weeks: Math.floor((difference / (1000 * 60 * 60 * 24 * 7)) % 52),
                    days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 7),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                };
            }

            return timeLeft;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    const timerBoxStyle = {
        bg: 'black',
        color: 'white',
        borderRadius: '10px',
        px: '4',
        py: '2',
    };

    return (
        <><Text mt='10'>Unlocks In</Text>
            <HStack spacing={4} px='1' align='end' mb='10'>
                {Object.entries(timeLeft).map(([unit, value]) => (
                    <VStack key={unit}>
                        <Box {...timerBoxStyle}>
                            <Text fontSize='xl'>{value}</Text>
                        </Box>
                        <Text fontSize='sm'>{unit.charAt(0).toUpperCase() + unit.slice(1)}</Text>
                    </VStack>
                ))}
            </HStack>
        </>
    );
};

export default Timer;
