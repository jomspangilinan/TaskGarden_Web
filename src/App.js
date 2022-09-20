import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

import * as THREE from 'three';

import SceneInit from './lib/SceneInit';



function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

   
  }, []);


  return (
    <div>test
      <canvas id='myThreeJsCanvas'/>
    </div>
  );
}

export default App;
