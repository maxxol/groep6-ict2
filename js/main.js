import * as THREE from 'three';

import controls, {loadPlayer, getPlayer,updateControls } from "./controls"
import {placeLightPosts} from "./lightPost";
import { SpinningCube, LightPoint, spinTheCubes } from "./orbitingCubes";
import { Skybox, Ground,Tree } from './environment';
import {loadModels,modelGlobal} from "./modelLoader";
import  {Foodstand} from './Foodstand'
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

loadPlayer(scene,camera); //loads player from controls.js
const player = getPlayer();
//console.log("(main)player loaded in at "+player.position.x+" "+player.position.z) //debug

//---------------------------------------------------------------------------------------------------------------
//lighting

const lightD = new THREE.DirectionalLight(0xA0A0A0, 1)
scene.add(lightD)
lightD.position.set(0,1,0)

//------------------------------------------------------------------------------------------------------------------------------------
//environment

const skybox = new Skybox(scene, 'assets/textures/skybox/skyboxspace.png', 10000); // Adjust the radius as needed
const ground = new Ground(scene, 'assets/textures/ground/groundtext.jpg', new THREE.Vector3(1000, 1, 1000));

//-----------------------------------------------------------------------------------------------------------------
//lightposts

placeLightPosts(scene);

//----------------------------------------------------------------------------------------------------------------
//spinning cube

const spinningcube1 = new SpinningCube(scene, 55, 5, -3, 0xF0ff00, 2, "MeshBasicMaterial");
const spinningcube2 = new SpinningCube(scene, 55, 5, -2.8, 0xFF8080, 1, "MeshPhongMaterial");
const spinningcube3 = new SpinningCube(scene, 55, 5, -2.8, 0x00FFFF, 1, "MeshPhongMaterial");
const lightP = new LightPoint(scene, spinningcube1.mesh.position.x, spinningcube1.mesh.position.y, spinningcube1.mesh.position.z, 0xFFFFFF, 100);

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

// loading tree models
loadModels(scene) //load the skull model
const treePosition1 = new THREE.Vector3(87, 0, 54); // Set the position for the tree
const tree1 = new Tree('assets/3d_models/low_poly_tree.glb',treePosition1);
const treePosition2 = new THREE.Vector3(87, 0, 28); // Set the position for the tree
const tree2 = new Tree('assets/3d_models/low_poly_tree.glb',treePosition2);
const treePosition3 = new THREE.Vector3(47, 0, -10); // Set the position for the tree
const tree3 = new Tree('assets/3d_models/low_poly_tree.glb',treePosition3);
const treePosition4 = new THREE.Vector3(47, 0, 54); // Set the position for the tree
const tree4 = new Tree('assets/3d_models/low_poly_tree.glb',treePosition4);
scene.add(tree1.object,tree2.object,tree3.object,tree4.object); // Add the tree Object3D to the Three.js scene.


// loading ramen foodstand
const modelPath = 'assets/3d_models/ramen_shop.glb';
const textMessage = 'Added ramen!';
const foodstand = new Foodstand(modelPath, textMessage, scene, camera, renderer);


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
function enterRollerCoaster(){
if(player.position.x >92 && player.position.x<130 && player.position.z>20 && player.position.z<60){
    camera.position.set(CoasterCart.position.x,CoasterCart.position.y+2,CoasterCart.position.z+2)

    camera.lookAt(115,5,40)
    camera.rotation.y += 90;
}}
//----------------------------------------------------------------------------------------------------------------

console.log("(main pre animate)player loaded in at "+player.position.x+" "+player.position.z)
// Animation loop
const animate = () => {
    requestAnimationFrame(animate); //rendering a frame
    renderer.render(scene, camera);

    const time = performance.now();
    const delta = (time - controls.prevTime) / 1000;

    updateControls(camera,time,delta);
    camera.position.set(player.position.x,player.position.y+4.6,player.position.z)

    // Rotate the majestic cube of death
    spinTheCubes(scene, performance.now(), spinningcube1, spinningcube2, spinningcube3);

    moveCoaster(time);
    enterRollerCoaster()

    modelGlobal.rotation.y += 0.04; //rotate skull model
    renderer.setSize(window.innerWidth,window.innerHeight); //changes main.js module to fit in window every frame

};

animate();
