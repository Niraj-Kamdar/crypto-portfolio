import React from 'react';
import { Flex, Button, useColorMode, Image } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Logo from './polywrap.png';

export const Nav: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex p='1.5rem 2rem 1.5rem 2rem' justify='space-between'>
      <Image boxSize='65px' objectFit='cover' src={Logo} />
      <Button onClick={toggleColorMode}>
        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Flex>
  );
};
