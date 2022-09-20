import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
function randomNumberInRange(min, max) {
    // 👇️ get number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


export default class SceneInit {

    
  constructor(canvasId) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    // NOTE: Camera params;
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 500;
    this.canvasId = canvasId;

    this.controls = undefined;

    // NOTE: Lighting is basically required.
    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );
    
    let offset = 1.2;


    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      // NOTE: Anti-aliasing smooths out the edges.
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
    //this.renderer.setClearColor( 0xaabbaa, 1 ); 

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(5.5, 5.5, 5.5);
    this.controls.update();
    this.controls.enabled = false;

    const lights = new THREE.PointLight( 0xffffff, 1, 0 );
    lights.position.set( 0, 50, 100 );
    this.scene.add( lights );

    const lights2 = new THREE.PointLight( 0xffffff, 1, 0 );
    lights2.position.set( 0, 200, 100 );
    this.scene.add( lights2 );

    // ambient light which is for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    // directional light - parallel sun rays
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.castShadow = true;
    this.directionalLight.position.set(0, 16, 64);
    this.scene.add(this.directionalLight);

    let planeMesh_model;
    const glftLoader = new GLTFLoader();
    
    glftLoader.load('/assets/cliff_blockQuarter_rock.glb', (gltfScene) => {
        planeMesh_model = gltfScene;    
        gltfScene.scene.scale.set(6, 6, 6);
        gltfScene.scene.position.set(0, 0, 0);
        this.scene.add(gltfScene.scene);

    });
    
    //const grid = new THREE.GridHelper(6, 6);
    //this.scene.add(grid);
    //grid.position.y = offset;

    const planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            visible: false
        })
    );
    planeMesh.rotateX(-Math.PI / 2);
    this.scene.add(planeMesh);
    planeMesh.name = 'ground';
    planeMesh.position.set(0.5, 1.45, 0.5);
    planeMesh.material.color.setHex(0xFF0000);


    const testMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true
        })
    );

    testMesh.rotateX(-Math.PI / 2);
    //highlightMesh.position.set(0.5, offset, 0.5);
    
    testMesh.position.set(0.5,offset, 0.5)

    this.scene.add(testMesh);
    
    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let intersects;
    const objects = [];
    
    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 4, 2),
        new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xFFEA00
        })
    );

    var loaded_model = [];
    
    let folder = "/assets/";
    let model = [
        "cactus_tall.glb",
        "crops_wheatStageA.glb",
        "flower_purpleA.glb",
        "flower_purpleC.glb",
        "flower_redA.glb",
        "flower_yellowC.glb",
        "stone_tallD.glb",
        "stump_oldTall.glb",
        "tree_palm.glb",
        "tree_pineRoundE.glb",
        "tree_pineTallD.glb",
        "tree_simple.glb",
        "tree_thin_fall.glb",
        "crops_cornStageD.glb",
    ]
    for (let i = 0; i < model.length; i++) {
        glftLoader.load(folder + model[i], (gltfScene) => {
            loaded_model.push(gltfScene);
            gltfScene.scene.scale.set(1.0, 1.0, 1.0);
  
          });
    }
    glftLoader.load('/assets/crops_cornStageD.glb', (gltfScene) => { 
        gltfScene.scene.scale.set(0.75, 0.75, 0.75);
        gltfScene.scene.position.set(1.5, 0 + offset, 1.5);
        objects.push(gltfScene.scene);
        this.scene.add(gltfScene.scene);


        const cornClone = gltfScene.scene.clone();
        cornClone.position.set(-0.5, 0 + offset, 1.5);

        objects.push(cornClone);
        this.scene.add(cornClone);

        //this.scene.add(sphereClone);
    });

    glftLoader.load('/assets/fence_corner.glb', (gltfScene) => { 
        gltfScene.scene.scale.set(1.0, 1.0, 1.0);
        gltfScene.scene.position.set(2.5, 0 + offset, 1.5);
        objects.push(gltfScene.scene);
        this.scene.add(gltfScene.scene);


        const fenceClone = gltfScene.scene.clone();
        fenceClone.rotation.y = 1.5;
        fenceClone.position.set(-2.5, 0 + offset, 1.5);
        objects.push(fenceClone);
        this.scene.add(fenceClone);
        //this.scene.add(sphereClone);
    });

    glftLoader.load('/assets/stone_smallB.glb', (gltfScene) => { 
        gltfScene.scene.scale.set(1.0, 1.0, 1.0);
        gltfScene.scene.position.set(-1.5, 0 + offset, 1.5);
        objects.push(gltfScene.scene);
        this.scene.add(gltfScene.scene);

        const stoneClone = gltfScene.scene.clone();
        stoneClone.position.set(-2.0, 0 + offset, 1.5);
        this.scene.add(stoneClone);
        
        const stoneClone1 = gltfScene.scene.clone();
        stoneClone1.position.set(2.0, 0 + offset, 1.5);
        this.scene.add(stoneClone1);

        //this.scene.add(sphereClone);
    });
    glftLoader.load('/assets/tent_detailedOpen.glb', (gltfScene) => {
        planeMesh_model = gltfScene;    
        gltfScene.scene.scale.set(2.0, 2.0, 2.0);
        gltfScene.scene.position.set(0.5, 0 + offset, 1.5);

        gltfScene.scene.rotation.y = 135;
        objects.push(gltfScene.scene);
        this.scene.add(gltfScene.scene);
    });

    glftLoader.load('/assets/crops_wheatStageA.glb', (gltfScene) => {
        planeMesh_model = gltfScene;    
        gltfScene.scene.position.set(1.5, 0 + offset, 1.5);
        this.scene.add(gltfScene.scene);

        const wheatClone = gltfScene.scene.clone();
        wheatClone.position.set(2.5, 0 + offset, 1.5);
        this.scene.add(wheatClone);

        const wheatClone1 = gltfScene.scene.clone();
        wheatClone1.position.set(-2.5, 0 + offset, 1.5);
        this.scene.add(wheatClone1);
    });

    glftLoader.load('/assets/crops_wheatStageB.glb', (gltfScene) => {
        planeMesh_model = gltfScene;    
        gltfScene.scene.position.set(-1.5, 0 + offset, 1.5);
        this.scene.add(gltfScene.scene);

        const wheatClone = gltfScene.scene.clone();
        wheatClone.position.set(-0.5, 0 + offset, 1.5);
        this.scene.add(wheatClone);

    });
    window.addEventListener('keydown',(e) => {
        let modelNum = randomNumberInRange(0, model.length - 1);

        console.log(modelNum);
        if(e.key  === 'ArrowLeft')
        {
            if(testMesh.position.x > -2.5)
            {
                testMesh.position.x -= 1;
            }
            
            //mouse_offset_x -= 0.25;
        }
        if(e.key  === 'ArrowRight')
        {
            if(testMesh.position.x < 2.5)
            {
                testMesh.position.x += 1;
            }
            //mouse_offset_x += 0.25;
        }
        if(e.key  === 'ArrowUp')
        {
            if(testMesh.position.z > -2.5)
            {
                testMesh.position.z -= 1;
            }
            //mouse_offset_y += 0.25;
        }
        if(e.key  === 'ArrowDown')
        {
            if(testMesh.position.z < 2.5)
            {
                testMesh.position.z += 1;
            }
            //mouse_offset_y -= 0.25;
        }
        mousePosition.x = testMesh.position.x;
        mousePosition.y = testMesh.position.z;

        const objectExist = objects.find(function(object) {
            return (object.position.x === testMesh.position.x)
            && (object.position.z === testMesh.position.z)
        });
        if(!objectExist)
            testMesh.material.color.setHex(0x00FFFF);
        else
            testMesh.material.color.setHex(0xFF0000);
        if(e.key==='Enter')
        {
            if(!objectExist)
            {
                const sphereClone = loaded_model[modelNum].scene.clone();
                sphereClone.position.copy(testMesh.position);
                this.scene.add(sphereClone);
                objects.push(sphereClone);
            }
        }
    });
    window.addEventListener('touchstart', (e) => {
        console.log(e.position);
    });
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // NOTE: Load space background.
    // this.loader = new THREE.TextureLoader();
    // this.scene.background = this.loader.load('./pics/space.jpeg');

    // NOTE: Declare uniforms to pass into glsl shaders.
    // this.uniforms = {
    //   u_time: { type: 'f', value: 1.0 },
    //   colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
    //   colorA: { type: 'vec3', value: new THREE.Color(0xffffff) },
    // };
  }

  animate() {
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
  }

  render() {
    // NOTE: Update uniform data on each render.
    // this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}