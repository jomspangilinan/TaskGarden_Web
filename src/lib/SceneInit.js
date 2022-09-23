import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import myInitObject from '../GlobalVars.js';
import myModelClicked from '../ModelVars.js';

import * as YUKA from 'yuka';
import { Vehicle, Trigger } from 'yuka';
function randomNumberInRange(min, max) {
    // 👇️ get number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



export default class SceneInit {

    
  constructor(canvasId) {


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
    this.target.position.set(0,1.2,0);
    this.target.boundingRadius = 0.25;
    this.arriveBehavior = new YUKA.ArriveBehavior(this.target.position);

    this.eventListen = new YUKA.EventDispatcher();

    this.radius = 0.2;

    this.sphericalTriggerRegion = new YUKA.SphericalTriggerRegion( this.radius );

    this.trigger1 = new this.TestClass( this.sphericalTriggerRegion);
    
    this.trigger1.position.set(0,1.2,0);
    this.sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(this.radius, 16, 16),
        new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xFFEA00
        })
    );  
    this.sphereMesh.position.set(0,1.2,0);
    this.touching = false;

    this.walkNow = false;

    this.initialOpen = false;

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

    let Character_model;
    glftLoader.load('/assets/Character.gltf', (gltfScene) => {
        this.characteranim = gltfScene;
        gltfScene.scene.matrixAutoUpdate = false;
        this.scene.add(gltfScene.scene);
        


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
        

        /*this.mixer = new THREE.AnimationMixer(gltfScene.scene);
        // animations is a list of THREE.AnimationClip
        /*for (const anim of gltfScene.animations) {
            //if(anim.name ==='Idle')mixer.clipAction(anim).play();
            if(anim.name ==='Wave')
            {
                mixer.clipAction(anim).play();
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
                action.play();
            }
        }*/
        /*
        const action = mixer.clipAction(gltfScene.animations[1 ]);
        action.play();
        */

        this.objs.push({gltfScene});

        this.yukaChar.setRenderComponent(this.characteranim.scene, this.sync);

        this.yukaChar.scale.set(0.1,0.1,0.1);
        this.yukaChar.rotation.set(0,0.9845570641660515,0,-0.1750639523166482);
         //Quaternion {x: 0, y: 0.9845570641660515, z: 0, w: -0.1750639523166482}
        /*const path = new YUKA.Path();
        path.add( new YUKA.Vector3(-4,offset,4));
        path.add( new YUKA.Vector3(-6,offset,0));
        path.add( new YUKA.Vector3(-4,offset,-4));
        path.add( new YUKA.Vector3(0,offset,0));
        path.add( new YUKA.Vector3(4,offset,-4));
        path.add( new YUKA.Vector3(6,offset,0));
        path.add( new YUKA.Vector3(4,offset,4));
        path.add( new YUKA.Vector3(0,offset,6));


        this.yukaChar.position.copy(path.current());
        
        const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
        this.yukaChar.steering.add(followPathBehavior);*/

        this.yukaChar.position.set(0, offset, 0);
        this.yukaChar.steering.add(this.arriveBehavior);
        this.yukaChar.maxSpeed = 1;

        //this.scene.add( this.sphereMesh );

        
        this.sphereMesh.matrixAutoUpdate = false;

        this.entityManager.add(this.yukaChar);
        this.entityManager.add( this.trigger1 );
        this.entityManager.add(this.target);

        this.trigger1.setRenderComponent(this.sphereMesh, this.sync );

        
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
        
        
        if(myInitObject.someProp ==='true') return;
        let modelNum = randomNumberInRange(0, model.length - 1);
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
                this.yukaChar.active = true;
                this.trigger1.puke = false;
                this.touching = false;
                //console.log(newPos);
                testMesh.position.set(highlightPos.x, offset + 0.01, highlightPos.z);
                //Character_model.scene.position.x = this.newPos.x + 0.2;
                //Character_model.scene.position.z = this.newPos.z + 0.2;
                //Character_model.scene.position.y = offset + 0.01;
                
                
                if(!myModelClicked.someProps)return;

                
                const objectExist = objects.find(function(object) {
                    return (object.position.x === testMesh.position.x)
                    && (object.position.z === testMesh.position.z)
                });

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
    const delta = this.time.update().getDelta();
    this.entityManager.update(delta);
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.objs.forEach(() => {
        this.mixer.update(this.clock.getDelta());
        
    });
    try
    {
        if(!this.touching)
        {
            if(this.trigger1.puke)
            {
                if(myModelClicked.someProps || this.initialOpen)
                {
                    this.mixer.stopAllAction();
                    this.PunchAction.reset();
                    this.PunchAction.fadeIn(0.5);
                    this.PunchAction.play();
                    this.touching = true;
                    this.walkNow = false;
                    this.this.initialOpen = true;
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
  onLoad()
        {
            console.log('FUCKENING SHIT!')
        }
}