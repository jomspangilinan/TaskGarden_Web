
import './App.css';
import { useEffect, useState  } from 'react';

import SceneInit from './lib/SceneInit';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactAudioPlayer from 'react-audio-player';
import { Fab } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import myInitObject from './GlobalVars.js';
import myModelClicked from './ModelVars.js';


function App() {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let foo = params.get('query');

  let headless = params.get('headless');

  const useAudio = url => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);
  
    const toggle = () => setPlaying(!playing);
  
    useEffect(() => {
        playing ? audio.play() : audio.pause();
      },
      [playing]
    );
  
    useEffect(() => {
      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
    }, []);
  
    return [playing, toggle];
  };
  
  const [show, setShow] = useState(false);

  const handleClose = () =>{
    setShow(false);
    myInitObject.someProp = 'false';
  };
  const handleShow = () => {
    setShow(true);
    myInitObject.someProp = 'true';
  };
  //const [playing, toggle] = useAudio('/assets/campsound.mp3');

  useEffect(() => {
    if(headless===null)headless = 'false';
    const test = new SceneInit('myThreeJsCanvas', headless);
    test.initialize();
    test.animate();

  }, []);


const Buttonstyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
};

const Playerstyle = {
  margin: 0,
  top: 'auto',
  right: 'auto',
  bottom: 20,
  left: 20,
  position: 'fixed',
};

const imageClick = (e) => {
  myModelClicked.someProps = e.item.img.replace('.png','').replace('/pics/','');
  console.log(myModelClicked.someProps);
} 
  return (
    <div>
      <ReactAudioPlayer
  src="/assets/campsound.mp3"
  preload="none"
  autoPlay
  loop
  controls
  style={Playerstyle}
/>
      <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        You received: {foo}!
        <ImageList sx={{ height: 450 }} cols={3} rowHeight={164}>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
            onClick={() => {
              imageClick({item});
              handleClose();
          }}
          />
        </ImageListItem>
      ))}
    </ImageList>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Collect Reward
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    <Fab color="primary" style={Buttonstyle} onClick={handleShow}>
    <HelpIcon />
  </Fab>
      <canvas id='myThreeJsCanvas'/>

    </div>
  );
}

export default App;
const itemData = [
  {
    img:  '/pics/cactus_tall.png',
    title: 'Tall Cactus',
  },
  {
    img: '/pics/crops_cornStageD.png',
    title: 'Corn',
  },
  {
    img: '/pics/crops_wheatStageA.png',
    title: 'Wheat',
  },
  {
    img: '/pics/flower_purpleA.png',
    title: 'Purple Flower A',
  },
  {
    img: '/pics/flower_purpleC.png',
    title: 'Purple Flower B',
  },
  {
    img: '/pics/flower_redA.png',
    title: 'Red Flower',
  },
  {
    img: '/pics/flower_yellowC.png',
    title: 'Yellow Flower',
  },
  {
    img: '/pics/stone_tallD.png',
    title: 'Tall stone',
  },
  {
    img: '/pics/stump_oldTall.png',
    title: 'Old Tall Stump',
  },
  {
    img: '/pics/tree_palm.png',
    title: 'Palm Tree',
  },
  {
    img: '/pics/tree_pineRoundE.png',
    title: 'Round Pine Tree',
  },
  {
    img: '/pics/tree_pineTallD.png',
    title: 'Tall Pine Tree',
  },
  {
    img: '/pics/tree_simple.png',
    title: 'Simple Tree',
  },
  {
    img: '/pics/tree_thin_fall.png',
    title: 'Fall Thin Tree',
  },
];
