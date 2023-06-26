import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Video from '../components/Video'
import Meme from '../components/Meme.tsx'
import SearchApp from '../components/Search'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route path="search" element={<SearchApp />} />
    <Route path="video" element={<Video />} />
    <Route path="meme" element={<Meme />} />
  </Route>
));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
    <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)
