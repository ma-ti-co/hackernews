import './App.css';
import Nav2 from '../components/Nav2';
import { memo, useEffect, useRef, useState } from 'react';
import { VStack, StackDivider, Box, Text, Stack, Link, Heading, Flex } from '@chakra-ui/layout';
import { Alert, AlertIcon, Button, ButtonGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, useDisclosure } from '@chakra-ui/react'
import DOMPurify from 'dompurify';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'





interface Story {
  objectID:number,
  title:string,
  author:string,
  text:string | null,
  url:string,
  points:number,
  num_comments:number
}

interface Comment {
  author:string,
  created_at:number,
  comment_text:string,
  comment_text_pure:string
}



function App() {
  
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState<Story[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [loadingState, setLoadingState] = useState(true);
  const [error, setError] = useState({isError:false, errorMsg:''});
  const [resultCount, setResultCount] = useState(0);
  const skeleton = useRef(Array(10).fill(null))


  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    getData(searchInput);
  }, []);

  useEffect(() => {
    getData(searchInput);
    setPage(1);
    //console.log(data);
  }, [searchInput])

  useEffect(() => {
    getData(searchInput);
  }, [page])

  const getData = async (q:string) => {
    let s;
    if(!q){ s = 'react'}else{s=q}; 
    setError({isError:false, errorMsg:''})
    try{
    const f = await fetch(`http://hn.algolia.com/api/v1/search?query=${s}&hitsPerPage=10&page=${page}`);
    const json = await f.json();
    setData(json.hits);
    setResultCount(json.nbHits);
    if(json.nbHits === 0){
      setError({isError:true, errorMsg:'No results'})
    }

    setTimeout(() => {
      setLoadingState(false);
    }, 1000)
 
    }catch(err){
      setLoadingState(false);
      setError({isError:true, errorMsg:'Something went wrong. Try again'})
    }
  }

  const getCommentData = async (id:string) => {
    try{
      const f = await fetch(`https://hn.algolia.com/api/v1/search?tags=comment,story_${id}`);
      const json = await f.json();
      const sanitizedArray = json.hits.map((node:Comment) => {
        const comment_text_pure = DOMPurify.sanitize(node.comment_text);
        return { ...node, comment_text_pure };
      });
      setComments(sanitizedArray);
      // setComments(json.hits);
      onOpen();
      // if(json.nbHits === 0){
      //   setError({isError:true, errorMsg:'No results'})
      // }
    }
    catch(err){
      console.log(err)
    }
  }

  const handlePager = async (to:string) => {
    if(to==='up'){
      setPage(page+1);
    }else{
      setPage(page-1);
    }
  }
  
  return (
    <>
    <Nav2 setSearchInput={setSearchInput} setLoadingState={setLoadingState}/>
    <main>
    
    <VStack
  divider={<StackDivider borderColor='gray.200' />}
  spacing={4}
  align='stretch'
  marginTop={'20'}
>
  {!loadingState && error.isError  ?
    <Alert status='error'>
    <AlertIcon />
    {error.errorMsg}
  </Alert>
  : ''}
    {!loadingState && !error.isError  ?   <Flex justifyContent={'space-between'} alignItems={'center'} position={'sticky'} top={'65px'} bg={'white'} pt={'1rem'}>
      <Heading fontSize={'lg'}>{resultCount.toLocaleString("en-US")} Results</Heading>
      {data.length>0 ?   
    <ButtonGroup>
      {page > 1 ? 
        <Button aria-label={`Get results ${10 * page + 1} to ${(10 * page) + 10}`} leftIcon={<ChevronLeftIcon />} isLoading={loadingState} onClick={() => handlePager('down')}>{(10 * page) - 19} - {(10 * page) - 10}</Button>
    :''
      }
    <Button aria-label={`Get results ${10 * page + 1} to ${(10 * page) + 10}`} rightIcon={<ChevronRightIcon />} isLoading={loadingState} onClick={() => handlePager('up')}>{10 * page + 1} - {(10 * page) + 10}</Button>
    </ButtonGroup>  
    :''}
    </Flex>:''}
    {loadingState ? 
    <Stack mt={'8'}>
      {skeleton.current.map((_) => (
        <Skeleton height='80px' />
      ))}
    </Stack>
  :''}
      {!loadingState && data.length ? 
       data.map((node) => (
          <>
          <Box key={node.objectID} p={'6'} borderWidth='1px' borderRadius='lg' overflow='hidden' textAlign={'start'}>
          <Link  href={node.url} isExternal>
            <Text fontSize='xl'>
            {node.title}
            </Text>
          </Link>  
          <Text fontSize={'xs'}>
            {node.points} points by {node.author} 6 hours ago | hide | <Button size={'xs'} onClick={() => getCommentData(node.objectID.toString())}>{node.num_comments} comment{node.num_comments>1?'s':''} </Button>
          </Text>
          </Box>
          </>
       ))
        :''
      }
    </VStack>



      <Modal onClose={onClose} size={'xl'} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={4}
            align='stretch'
            marginTop={'20'}
          >
          {comments.map((node, index) => (
            <Box key={index} p={'6'} borderWidth='1px' borderRadius='lg' overflow='hidden' textAlign={'start'}>
              <Text dangerouslySetInnerHTML={{ __html: node.comment_text_pure }}  />
              <Text fontSize={'xs'} mt={'3'} fontWeight={'semibold'}>
                by {node.author}
              </Text>
            </Box>
          ))}
          </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </main>
    </>
  );
}

export default memo(App);
