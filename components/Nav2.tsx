import React, { useCallback } from 'react'
import {debounce} from 'lodash-es';
import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';

const Nav2 = ({setSearchInput, setLoadingState}:{setSearchInput:(arg:string) => void, setLoadingState:any}) => {


  const changeHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
    setLoadingState(true);
    setSearchInput(event.target.value);
  };

  const debouncedChangeHandler = useCallback(
    debounce(changeHandler, 300)
  , []);

  return (
    <Box 
      w={'100'} 
      py={'3'} 
      borderBottom={'1px'} 
      borderColor={'gray.200'} 
      position={'sticky'} 
      top={'0'} 
      zIndex={'2'}
      bgGradient='linear(to-r, gray.300, yellow.400, pink.200)'>
      <nav>
        <Input bg={'white'} type="text" placeholder='Search' onChange={debouncedChangeHandler} w={'4xl'} margin={'auto'}/>
      </nav>
    </Box>
  )
}

export default Nav2
