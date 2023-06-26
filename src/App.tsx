import { NavLink, Outlet } from 'react-router-dom';
import './App.css';
import { Flex } from '@chakra-ui/react';


function App() {
  
  return (
    <>
    <Flex h='50px' px='3' alignItems={'center'} borderBottom={'1px'} borderColor={'gray.100'} mb={'50px'}>
      <nav>
      <NavLink 
        className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
      to="/video">Video Player</NavLink>
      <NavLink 
        className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
      to="/meme">Meme Generator</NavLink>
            </nav>
    </Flex>
    <main>
    <Outlet />
    </main>
    </>
  );
}

export default App;
