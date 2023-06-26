import { useEffect, useRef, useState } from "react";
import { HStack, Icon, IconButton, Skeleton } from '@chakra-ui/react'
import { RxPlay, RxStop, RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";


const PlayButton = () => {
  return <Icon as={RxPlay} />
}
const StopButton = () => {
  return <Icon as={RxStop} />
}

const RewindButton = () => {
  return <Icon as={RxDoubleArrowLeft} />
}

const ForwardButton = () => {
  return <Icon as={RxDoubleArrowRight} />
}


const Video = () => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let t = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(t);
    }
  }, []);

  


  const handlePlay = () => {
    if(videoRef.current){
      console.log(typeof videoRef.current.currentTime);
      if(!isPlaying){
        videoRef.current.play();
      }else{
        videoRef.current.pause();
      }
    }
  }

  const handleRewind = () => {
    if(videoRef.current){
      videoRef.current.currentTime -= 15;
    }
  }
  const handleForward = () => {
    if(videoRef.current){
      videoRef.current.currentTime += 15;
    }
  }


  return (
    <>
    {isLoading ? <Skeleton width='full' aspectRatio={'1.77'} /> :
    <video 
    width="1920"
    height="1080"
    ref={videoRef}
    onPlay={() => setIsPlaying(true)}
    onPause={() => setIsPlaying(false)}
    >
      <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
    </video>
    }
    <HStack mt='3'>
    <IconButton aria-label="Rewind" onClick={handleRewind} icon={<RewindButton />} />
    {!isPlaying ? 
    <IconButton aria-label="Play" onClick={handlePlay} icon={<PlayButton />} />
    :
    <IconButton aria-label="Pause" onClick={handlePlay} icon={<StopButton />} />
    }
    <IconButton aria-label="Forward" onClick={handleForward} icon={<ForwardButton />} />
    </HStack>
    </>
  )
}

export default Video
