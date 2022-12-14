import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import myInitObject from '../GlobalVars.js';
import myModelClicked from '../ModelVars.js';

import * as YUKA from 'yuka';
import { Vehicle, Trigger } from 'yuka';
/*
import firebase from 'firebase';
  
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
    
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

console.log(db);
db.collection("data").add({
    Nane: 'nani',
    Age: '12',
    CourseEnrolled: 'course'
})
.then((docRef) => {
    alert("Data Successfully Submitted");
})

db.collection("rewards").get().then((querySnapshot) => {
         
    // Loop through the data and store
    // it in array to display
    querySnapshot.forEach(element => {
        var data = element.data();
        console.log(data);
          
    });
})
*/

/*



const app = initializeApp(firebaseConfig);
const db = getDatabase();*/
/*
const starCountRef = ref(db, 'rewards/');
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});*/



/*


const movieCollectionRef = collection(db, 'rewards')
getDocs(movieCollectionRef).then(
    response => {
        console.log(response)
    }
).catch(error => console.log(error.message));
*/
export default class SceneInit {

    
  constructor(canvasId, headless) {


    this.TestClass = class CustomTrigger extends Trigger {

        constructor( triggerRegion) {
            
            super( triggerRegion );
            this.puke = false;
    
        }
    
        execute( entity ) {
            
            super.execute();
            //let object = Object.getPrototypeOf(entity);
            if(entity.name === 'Character')
            {
                this.fuckFest();
            }
        }

        fuckFest()
        {
          if(!this.puke)
          {
              this.puke = true;
          }
        }

    
    
    }
    
    // NOTE: Core components to initialize Three.js app.
    this.headless = headless;
    
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
    this.objs = [];

    this.mixer= [];
    this.actions = undefined;

    this.characteranim = undefined;

    this.IdleClip = undefined;
    this.IdleAction = undefined;

    this.WaveClip = undefined;
    this.WaveAction =undefined;

    this.PunchClip =undefined;
    this.PunchAction = undefined;

    this.WalkClip = undefined;
    this.WalkAction = undefined;
    
    this.newPos = new THREE.Vector3(0,0,0);

    this.yukaChar = new YUKA.Vehicle();
    this.yukaChar.name = 'Character';
    this.target = new YUKA.GameEntity();
    this.target.name = 'Game';

    this.time = new YUKA.Time();
    this.entityManager = new YUKA.EntityManager();
    this.target.position.set(-0.2,1.2,-0.2);
    this.target.boundingRadius = 0.25;
    this.arriveBehavior = new YUKA.ArriveBehavior(this.target.position);

    this.eventListen = new YUKA.EventDispatcher();

    this.radius = 0.2;

    this.sphericalTriggerRegion = new YUKA.SphericalTriggerRegion( this.radius );

    this.trigger1 = new this.TestClass( this.sphericalTriggerRegion);
    
    this.trigger1.position.set(-0.2,1.2,-0.2);
    this.sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(this.radius, 16, 16),
        new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xFFEA00
        })
    );  
    this.sphereMesh.position.set(-0.2,1.2,-0.2);
    this.touching = false;

    this.walkNow = false;

    this.initialOpen = false;
    this.tanim = true;
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
      //gammaOutput: true,
    });

    this.renderer.gammaOutput = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
    //this.renderer.setClearColor( 0xaabbaa, 1 ); 
    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(-5.5, 5.5, -5.5);
    
    this.controls.update();
    this.controls.enabled = true;
    this.controls.maxPolarAngle = Math.PI/2; 
    const lights = new THREE.PointLight( 0xffffff, 1, 0 );
    lights.position.set( 0, 50, -100 );
    this.scene.add( lights );

    const lights2 = new THREE.PointLight( 0xffffff, 1, 0 );
    lights2.position.set( 0, 200, -100 );
    this.scene.add( lights2 );

    const lights3 = new THREE.PointLight( 0xffffff, 1, 0 );
    lights3.position.set( 0, -50, 100 );
    this.scene.add( lights3 );
    // ambient light which is for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    //this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    // directional light - parallel sun rays
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0, 16, -64);
    this.scene.add(this.directionalLight);

    let planeMesh_model;
    const glftLoader = new GLTFLoader();
    
    glftLoader.load('/assets/world_final.glb', (gltfScene) => {
        planeMesh_model = gltfScene;    
        //gltfScene.scene.scale.set(6, 6, 6);
        gltfScene.scene.position.set(0, offset, 0);
        
        this.scene.add(gltfScene.scene);

    });

    glftLoader.load('/assets/Character.gltf', (gltfScene) => {
        this.characteranim = gltfScene;

        gltfScene.scene.scale.set(0.1,0.1,0.1);
        gltfScene.scene.rotation.set(0,3.5,0);
        gltfScene.scene.position.set(-0.2, offset, -0.2);
        

        this.scene.add(gltfScene.scene);
        

        this.objs.push({gltfScene});
        

        if(this.headless === 'false')
        {
            gltfScene.scene.matrixAutoUpdate = false;
            this.mixer = new THREE.AnimationMixer(gltfScene.scene);
            const clip = gltfScene.animations;

            this.IdleClip = THREE.AnimationClip.findByName(clip, 'Idle');
            this.IdleAction = this.mixer.clipAction(this.IdleClip);

            this.WalkClip = THREE.AnimationClip.findByName(clip, 'Walk');
            this.WalkAction = this.mixer.clipAction(this.WalkClip);

            this.WaveClip = THREE.AnimationClip.findByName(clip, 'Wave');
            this.WaveAction = this.mixer.clipAction(this.WaveClip);

            this.PunchClip = THREE.AnimationClip.findByName(clip, 'Punch');
            this.PunchAction = this.mixer.clipAction(this.PunchClip);


            this.WaveAction.loop = THREE.LoopOnce;
            this.IdleAction.loop = THREE.LoopOnce;
            this.PunchAction.loop = THREE.LoopOnce;
            this.WalkAction.loop = THREE.LoopOnce;

            this.IdleAction.play();


            
            this.mixer.addEventListener('finished', (e)=>
            {
                if(e.action._clip.name === 'Idle')
                {
                    //alert('test');
                    if(this.trigger1.puke)
                    {
                        this.IdleAction.reset();
                        this.IdleAction.play();
                    }
                    else
                    {
                        this.WalkAction.reset();
                        this.WalkAction.play();
                    }
                }
                else if (e.action._clip.name === 'Punch'){
                    this.WaveAction.reset();
                    this.WaveAction.play();
                }
                else if (e.action._clip.name === 'Wave'){
                    this.IdleAction.reset();
                    this.IdleAction.play();
                }
                else if (e.action._clip.name === 'Walk'){
                    if(this.trigger1.puke)
                    {
                        this.IdleAction.reset();
                        this.IdleAction.play();
                    }
                    else
                    {
                        this.WalkAction.reset();
                        this.WalkAction.play();
                    }
                }
            });
            
            this.yukaChar.setRenderComponent(this.characteranim.scene, this.sync);
            this.yukaChar.scale.set(0.1,0.1,0.1);
            this.yukaChar.rotation.set(0,0.9845570641660515,0,-0.1750639523166482);
            this.yukaChar.position.set(-0.2, offset, -0.2);
            this.sphereMesh.matrixAutoUpdate = false;
            this.yukaChar.steering.add(this.arriveBehavior);
            this.yukaChar.maxSpeed = 1;
            this.entityManager.add(this.yukaChar);
            this.entityManager.add( this.trigger1 );
            this.entityManager.add(this.target);
            this.trigger1.setRenderComponent(this.sphereMesh, this.sync );
        }


    });
    
    
    const grid = new THREE.GridHelper(6, 6);
    //this.scene.add(grid);
    grid.position.y = offset;


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
        planeMesh.position.set(0, offset, 0);

        const testMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                transparent: true
            })
        );

        testMesh.rotateX(-Math.PI / 2);
        testMesh.material.color.setHex(0xaabbaa);
        testMesh.material.opacity = 0.2;

        testMesh.position.set(0.5,offset, 0.5);
        this.scene.add(testMesh);
        
        let intersects;
        const objects = [];
        
        

        var loaded_model = [];
        
        let folder = "/assets/";
        let model = [
            "cactus_tall",
            "crops_wheatStageA",
            "flower_purpleA",
            "flower_purpleC",
            "flower_redA",
            "flower_yellowC",
            "stone_tallD",
            "stump_oldTall",
            "tree_palm",
            "tree_pineRoundE",
            "tree_pineTallD",
            "tree_simple",
            "tree_thin_fall",
            "crops_cornStageD",
        ]

        const object_names = [];
        
        for (let i = 0; i < model.length; i++) {
            glftLoader.load(folder + model[i] + '.glb', (gltfScene) => {
                loaded_model.push(gltfScene);
                //gltfScene.scene.scale.set(1.0, 1.0, 1.0);
                const model_index_pair = {};
                model_index_pair.index = i;
                model_index_pair.file = model[i];
                model_index_pair.model = gltfScene;
                object_names.push(model_index_pair)
            });
        }
    
    
        /*
        
        window.addEventListener('mousemove',(e) => {
            //console.log(object_names);
            console.log(myModelClicked.someProps);
        });
        /*
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
        });*/

        const touch_position = new THREE.Vector2();
        const touch_raycaster = new THREE.Raycaster();
        
        window.addEventListener('pointerdown', (e) => {
            //console.log(e.touches[0]);
            //console.log(e.pointerType);

            //console.log(this.yukaChar.rotation);
            
            
            if(myInitObject.someProp ==='true' || this.headless ==='true') return;
            touch_position.x = (e.clientX / window.innerWidth) * 2 - 1;
            touch_position.y = -(e.clientY / window.innerHeight) * 2 + 1;
            touch_raycaster.setFromCamera(touch_position, this.camera);
            
            
            intersects = touch_raycaster.intersectObjects(this.scene.children);
            intersects.forEach((intersect) =>{
                if(intersect.object.name === 'ground') {
                    
                    const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
                    this.newPos = new THREE.Vector3().copy(intersect.point);

                    
                    this.target.position.copy(this.newPos);

                    this.trigger1.position.copy(this.newPos);
                    this.sphereMesh.position.copy(this.newPos);
                    this.triggerOnce = true;
                    this.trigger1.puke = false;
                    this.touching = false;
                    //console.log(newPos);
                    testMesh.position.set(highlightPos.x, offset + 0.01, highlightPos.z);
                    //Character_model.scene.position.x = this.newPos.x + 0.2;
                    //Character_model.scene.position.z = this.newPos.z + 0.2;
                    //Character_model.scene.position.y = offset + 0.01;
                    
                    
                    

                    
                    const objectExist = objects.find(function(object) {
                        return (object.position.x === testMesh.position.x)
                        && (object.position.z === testMesh.position.z)
                    });
                    if(!myModelClicked.someProps)return;
                    object_names.forEach((obj)=> {
                        

                        //console.log(myModelClicked.someProps);
                        if(obj.file === myModelClicked.someProps)
                        {
                            const sphereClone = obj.model.scene.clone();
                            sphereClone.position.x = this.newPos.x;//(testMesh.position);
                            sphereClone.position.y = offset + 0.01;
                            sphereClone.position.z = this.newPos.z;//
                            
            
                            this.scene.add(sphereClone);
                            objects.push(sphereClone);
                            this.tanim = false;
                        }
                    });

                    
                    
                    if(!objectExist)
                    {
                        /*const sphereClone = loaded_model[modelNum].scene.clone();
                        sphereClone.position.copy(testMesh.position);
                        this.scene.add(sphereClone);
                        objects.push(sphereClone);*/
                        testMesh.material.color.setHex(0xaabbaa);//0x022D36);
                    }
                    else
                        testMesh.material.color.setHex(0xFF0000);
                }
            });
        
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
  
  sync(entity, renderComponent)
  {
    renderComponent.matrix.copy(entity.worldMatrix);
    
  }
  playAction(index){
    const action = this.actions[index];
    this.mixer.stopAllAction();
    action.reset();
    action.fadeIn(0.5);
    action.play();
  }
  testAction()
  {
    console.log('Hello!');
  }
  animate() {
    //console.log(document.getElementById(this.canvasId).innerHTML);
    
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    
    
    if(this.headless === 'false')
    {
        const delta = this.time.update().getDelta();
        this.entityManager.update(delta);
        this.objs.forEach(() => {
            this.mixer.update(this.clock.getDelta());
            
        });
        try
        {
            if(!this.touching)
            {
                if(this.trigger1.puke)
                {
                    if(!this.initialOpen)
                    {
                        this.mixer.stopAllAction();
                        this.WaveAction.reset();
                        this.WaveAction.fadeIn(0.5);
                        this.WaveAction.play();
                        this.initialOpen = true;
                    }
                    if(myModelClicked.someProps && !this.tanim)
                    {
                        this.mixer.stopAllAction();
                        this.PunchAction.reset();
                        this.PunchAction.fadeIn(0.5);
                        this.PunchAction.play();
                        this.touching = true;
                        this.walkNow = false;
                        this.tanim = true;
                    }
                }
                else
                {
                    if(!this.walkNow)
                    {
                        this.mixer.stopAllAction();
                        this.WalkAction.reset();
                        this.WalkAction.fadeIn(0.5);
                        this.WalkAction.play();
                        this.walkNow = true;
                    }
                }
                
            }
        }
        catch
        {

        }
    }
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