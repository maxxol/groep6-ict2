import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import controls, {loadplayer, getPlayer,updatecontrols } from "./controls"
import {placeLightPosts} from "./LightPost";

//import {Reflector} from 'three/examples/jsm/objects/Reflector'
//------------------------------------------------------------------------------------------------------------------------------------

//scene
const scene = new THREE.Scene();



//camera
const camera = new THREE.PerspectiveCamera(75,16/9,0.1,20000);
camera.position.set(1, 1, 6);

export {camera,scene}; //export


//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

loadplayer(scene,camera); //loads player from controls.js
const player = getPlayer();
//console.log("(main)player loaded in at "+player.position.x+" "+player.position.z) //debug

//---------------------------------------------------------------------------------------------------------------
//lighting

// const lightA = new THREE.AmbientLight( 0xFFFFFF,10 ); // soft white ambient light for debug
// scene.add( lightA );

//directional light to simulate sun
const lightD = new THREE.DirectionalLight(0xA0A0A0, 1)
scene.add(lightD)
lightD.position.set(0,1,0)



//------------------------------------------------------------------------------------------------------------------------------------
//environment
//skybox sphere
// Load the equirectangular (panorama) texture
const loadersphere = new THREE.TextureLoader();
const skyboxTexture = loadersphere.load('assets/textures/skybox/skyboxspace.png');

// Create a sphere geometry for the skybox
const geometrySky = new THREE.SphereGeometry(10000, 32, 32); // Adjust the radius as needed
const materialSky = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide }); // Define the material for the skybox
const skybox = new THREE.Mesh(geometrySky, materialSky); // Create the skybox mesh
scene.add(skybox); // Add the skybox to your scene

//ground
const loaderground = new THREE.TextureLoader();
const groundtexture = loaderground.load('assets/textures/ground/groundtext.jpg');

groundtexture.wrapS = THREE.RepeatWrapping; //wraps x axis
groundtexture.wrapT = THREE.RepeatWrapping; //wraps z axis
groundtexture.repeat.set(100, 100); // amount of tiles per axis x,z

const geometryground = new THREE.BoxGeometry(1000, 1, 1000);
const materialground = new THREE.MeshLambertMaterial({ map: groundtexture });
const ground = new THREE.Mesh(geometryground, materialground);

scene.add(ground);
ground.scale.set(1,1,1);
ground.position.set(0,0,0);

//-----------------------------------------------------------------------------------------------------------------
//lightposts

placeLightPosts(scene);


//----------------------------------------------------------------------------------------------------------------
//spinning cube

const geometryspin = new THREE.BoxGeometry( 2, 2, 2 );
const materialspin = new THREE.MeshBasicMaterial( { color: 0xF0ff00 } );
const spinningcube1 = new THREE.Mesh(geometryspin, materialspin);
scene.add( spinningcube1 );
spinningcube1.position.set(55,5,-3)

const geometryspin2 = new THREE.BoxGeometry( 1, 1, 1 );
const materialspin2 = new THREE.MeshPhongMaterial( { color: 0xFF8080 } );
const spinningcube2 = new THREE.Mesh(geometryspin2, materialspin2);
scene.add( spinningcube2 );
spinningcube2.position.set(55,5,-2.8)

const geometryspin3 = new THREE.BoxGeometry( 1, 1, 1 );
const materialspin3 = new THREE.MeshPhongMaterial( { color: 0x00FFFF } );
const spinningcube3 = new THREE.Mesh(geometryspin3, materialspin3);
scene.add( spinningcube3 );
spinningcube3.position.set(55,5,-2.8)

const lightP = new THREE.PointLight( 0xFFFFFF, 100  );
lightP.position.set( spinningcube1.position.x,spinningcube1.position.y,spinningcube1.position.z );
scene.add( lightP );

//variables for cube movement and rotation
const radius = 5; // Adjust the radius of the circular motion
const angularSpeed = 0.004; // Adjust the speed of rotation
//cube movement and rotation function
function spinthecubes(time) {
    // Calculate the current angle based on time and angular speed
    const angle = time * angularSpeed;

    // Calculate the positions of spinningcube2 and spinningcube3
    const cube2X = spinningcube1.position.x + radius * Math.cos(angle); //center of procesion(spinningcube)
    const cube2Z = spinningcube1.position.z + radius * Math.sin(angle);

    const cube3X = spinningcube1.position.x + radius * Math.cos(angle + Math.PI); // 180 degrees out of phase
    const cube3Z = spinningcube1.position.z + radius * Math.sin(angle + Math.PI); // 180 degrees out of phase

    // cube2 and cube3 rotate
    spinningcube2.position.set(cube2X, spinningcube2.position.y, cube2Z);
    spinningcube3.position.set(cube3X, spinningcube3.position.y, cube3Z);

    spinningcube1.rotation.x += 0.09;
    spinningcube1.rotation.y += 0.09;

    spinningcube2.rotation.x -= 0.09;
    spinningcube2.rotation.y -= 0.09;

    spinningcube3.rotation.x -= 0.09;
    spinningcube3.rotation.y -= 0.09;
}

//------------------------------------------------------------------------------------------------------------------------------------
//pathways
function addPath(x,z,width,depth){
    const geometry = new THREE.BoxGeometry( width, 1, depth );
    const material = new THREE.MeshPhongMaterial( { color: 0xF0F0F0 } );
    const path = new THREE.Mesh(geometry, material);
    scene.add(path);
    path.position.set(x,0.1,z)
}
addPath(25,-3,50,6)
addPath(47,25,6,50)
addPath(70,40,50,6)
addPath(115,40,40,40)

//------------------------------------------------------------------------------------------------------------------------------------
//3d models

const loader = new GLTFLoader();//loader

let modelglobal; //global variable for the skull model, so it can be called in the animate function
async function loadModels() {
    try {
        const skullModelFile = await loader.loadAsync('assets/3d_models/human_skull_free.glb'); //loads skull model
        const model = skullModelFile.scene;
        scene.add(model); //adds skull to the scene
        //model.scale.set(2,2,2); //make skull bigger
        model.position.set(47,6,54)
        modelglobal=model; //makes it possible for animate function to call the model

    } catch (error) {
        console.error('An error occurred while loading the model:', error); //oh shit oh fuck
    }
}
loadModels() //load the skull model
//--------------------------------------------------------------------------------------------------------------
//mirror test
// const mirror:Reflector = new Reflector(
//     new THREE.PlaneGeometry(2,2),{
//         color:new THREE.color(0xFFFFFF),
//         textureWidth:window.innerWidth*window.devicePixelRatio,
//         textureHeight:window.innerHeight*window.devicePixelRatio,
//     }
// )
//----------------------------------------------------------------------------------------------------------------
//coaster test
const geometryCoasterCart = new THREE.BoxGeometry( 2, 2, 2 );
const materialCoasterCart = new THREE.MeshPhongMaterial( { color: 0xFF8080 } );
const CoasterCart = new THREE.Mesh(geometryCoasterCart, materialCoasterCart);
scene.add( CoasterCart );
CoasterCart.position.set(115,3,40)

const radiusCoaster = 15; // Adjust the radius of the circular motion
const angularSpeedCoaster = 0.004; // Adjust the speed of rotation
function moveCoaster(time) {
    // Calculate the current angle based on time and angular speed
    const angle = time * angularSpeedCoaster;

    // Calculate the positions of spinningcube2 and spinningcube3
    const coasterCartX = 115 + radiusCoaster * Math.cos(angle); //center of procesion(spinningcube)
    const coasterCartZ = 40 + radiusCoaster * Math.sin(angle);
    CoasterCart.lookAt(115,3,40)
    CoasterCart.position.set(coasterCartX, 4, coasterCartZ);
}
//----------------------------------------------------------------------------------------------------------------

console.log("(main pre animate)player loaded in at "+player.position.x+" "+player.position.z)
// Animation loop
const animate = () => {
    requestAnimationFrame(animate); //rendering a frame
    renderer.render(scene, camera);

    const time = performance.now();
    const delta = (time - controls.prevTime) / 1000;


    updatecontrols(camera,time,delta);
    camera.position.set(player.position.x,player.position.y+4.6,player.position.z)

    // Rotate the majestic cube of death
    spinthecubes(time);
    moveCoaster(time);

    if(player.position.x >92 && player.position.x<130 && player.position.z>20 && player.position.z<60){
        camera.position.set(CoasterCart.position.x,CoasterCart.position.y+2,CoasterCart.position.z)

        camera.lookAt(115,5,40)
        camera.rotation.y += 90;
    }


    modelglobal.rotation.y += 0.04; //rotate skull model

    renderer.setSize(window.innerWidth,window.innerHeight); //changes main.js module to fit in window every frame


    //console.log(camera.rotation); //camera rotation debug
    console.log("(main in animate)player loaded in at "+player.position.x+" "+player.position.z)    //debug
    //console.log("(main in animate)camera rotation "+camera.rotation.x+" "+camera.rotation.y+" "+camera.rotation.z)    //debug

};

animate();
