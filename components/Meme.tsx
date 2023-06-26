import { Box, Button, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

const Meme = () => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState<any>(null);
  const [BoxCount, setBoxCount] = useState<number[]>([]);
  const boxRefs = useRef<any>([]);
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState(0);
  const [editableBox, setEditableBox] = useState<null | number>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [previewImg, setPreviewImg] = useState<null | string>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    getImage();
  }, [])

  const getImage = async () => {
    const response = await fetch('https://api.imgflip.com/get_memes');
    const json = await response.json();
    const rand = Math.random() * 100;
    const id = Math.floor(rand);
    setImage(json.data.memes[id]);
    setBoxes(json.data.memes[id].box_count);
  }

  const setBoxes = async (count:number) => {
    let arr = [];
    for(let i = 0; i < count; i++){
      arr.push(i);
      boxRefs.current[i] = React.createRef();
    }
    setBoxCount(arr);
  }

  const addBox = () => {
    let idx = BoxCount.length
    setBoxCount(current => [...current, idx]);
    boxRefs.current[idx] = React.createRef();
  }

  const handelFontSizeChange = (direction:string) => {
    if(direction === 'plus'){
      let newFontsize = fontSize + 2;
      setFontSize(newFontsize);
    }else{
      let newFontsize = fontSize - 2;
      setFontSize(newFontsize);
    }
  }


  const handleDragStart = (event:any, node:any) => {
    event.dataTransfer.setData('text/plain', node);
    //setDragIndex(idx)
  }

  const handleDragOver = (event:any) => {
    event.preventDefault();
  }

  const handleDrop = (event:any) => {
    event.preventDefault();
    const canvas = document.getElementById('meme-app');
    const el_index = event.dataTransfer.getData('text/plain');
    const el = boxRefs.current[el_index];
    let x = event.clientX;
    let y = event.clientY;
    el.current.style.left = `${x - (0.5 * el.current.offsetWidth) - canvas!.offsetLeft}px`;
    el.current.style.top = `${y - (0.5 * el.current.offsetHeight) - canvas!.offsetTop}px`;

  };


  const handleUpload = (event:any) => {
    const file = event.currentTarget.files[0]
    //console.log(event.currentTarget.files)
    console.log(file);
    const img = {url:URL.createObjectURL(file)};
    //console.log(img);
    setImage(img);
  }


  const handlePreview = () => {
    const meme = document.getElementById('meme-app');
    setEditMode(false);
    if(meme){
      domtoimage.toBlob(meme)
      .then(function (blob) {
        setBlob(blob);
        //console.log(URL.createObjectURL(blob));
        setPreviewImg(URL.createObjectURL(blob));
        //saveAs(blob, "image.jpg");
        onOpen();
      });
    }
  }

  const handleDownload = () => {
    if(blob){
      saveAs(blob, "image.jpg");
    }
  }


  return (
    <HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Image 
            src={previewImg ? previewImg : ''} 
          />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleDownload}>
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack alignSelf={'flex-start'}>
          <Input type='file'  onChange={(event) => handleUpload(event)} />
          <Box>
          <Text textAlign={'start'} fontSize={'md'}>Font Size</Text>
          <HStack>
            <Button onClick={() => handelFontSizeChange('minus')}>-</Button>
            <Box>{fontSize}</Box>
            <Button onClick={() => handelFontSizeChange('plus')}>+</Button>
          </HStack>
          </Box>
          <Box>
            <Text textAlign={'start'} fontSize={'md'}>Text Color</Text>
          <HStack>
            <Box onClick={() => setColor(0)} height={'25px'} aspectRatio={'1'} border={'2px'} borderColor={color === 0 ? 'green':'black'} background={'black'}></Box>
            <Box onClick={() => setColor(1)} height={'25px'} aspectRatio={'1'} border={'2px'} borderColor={color === 1 ? 'green':'black'}></Box>
          </HStack>
          </Box>
          <Button onClick={() => handlePreview()}>Download</Button>
          <Button onClick={() => addBox()}>Add TextBox</Button>
      </Stack>
      {image ? 
      <Box
      id="meme-app"
      ref={canvasRef} 
      position={'relative'}
      maxW={'100%'}
      maxH={'100%'}
      w={image.width}
      h={image.height}
      onDragOver={(event) => handleDragOver(event)}
      onDrop={(event) => handleDrop(event)}
      border={'2px'}
      >
      <Image 
      src={image.url} 
      onClick={() => setEditableBox(null)}
      />
      {BoxCount.map((node, idx) => (
        <Box
        style={{'fontFamily':'Impact'}}
        ref={boxRefs.current[idx]}
        fontSize={`${fontSize}px`}
        minW={'100px'} 
        minH={'1.5em'}
        key={idx} 
        background={editMode ? 'rgba(0, 0, 0, 0.22)':''}
        position={'absolute'}
        top={`${idx}00px`}
        contentEditable={editableBox === idx}
        color={color ? 'white':'black'}
        onDragStart={(event) => handleDragStart(event, node)}
        onClick={() => setEditableBox(idx)}
        draggable
        /
        >
      ))}
      </Box>
      :
      ''
      }
    </HStack>
  )
}

export default Meme
