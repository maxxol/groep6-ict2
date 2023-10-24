import * as THREE from 'three';

import controls, {loadPlayer, getPlayer,updateControls } from "./controls"
import {placeLightPosts} from "./lightPost";
import { SpinningCube, LightPoint, spinTheCubes } from "./orbitingCubes";
import { Skybox, Ground, Pond } from './environment';
import {loadModels,modelGlobal} from "./modelLoader";
import{Carousel,carouselCart,moveCarousel,carouselPole,tryToEnterCarousel} from "./Carousel";
import {enterRollerCoaster} from "./rollerCoaster";
import {callCoordinateConversion} from "./rollerCoaster";
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

const lightD = new THREE.DirectionalLight(0xA0A0A0, 200)
scene.add(lightD)
lightD.position.set(100,1,100)

const lightAmbient = new THREE.AmbientLight(0xFFFFFF,0.5)
scene.add(lightAmbient)

//------------------------------------------------------------------------------------------------------------------------------------
//environment.js

const skybox = new Skybox(scene, 'assets/textures/skybox/skyBoxDay.jpg', 10000); // Adjust the radius as needed
const ground = new Ground(scene, 'assets/textures/ground/grass.jpg', new THREE.Vector3(1000, 1, 1000));
const pond = new Pond(scene,15,5,0.5,32,70,70)
//----------------------------------------------------------------------------------------------------------------
//walls.js
import {buildWalls} from "./walls";

buildWalls(scene);

//-----------------------------------------------------------------------------------------------------------------
//lightPost.js

placeLightPosts(scene);

//-----------------------------------------------------------------------------------------------------------------
//Carousel.js
const carousel1 = new Carousel(scene,115,40);
const carouselCart1 = carouselCart(scene);
const carouselPole1 = carouselPole(scene);
//------------------------------------------------------------------------------------------------------------------
//OrbitingCubes.js

const spinningcube1 = new SpinningCube(scene, 55, 5, -3, 0xF0ff00, 2, "MeshBasicMaterial");
const spinningcube2 = new SpinningCube(scene, 55, 5, -2.8, 0xFF8080, 1, "MeshPhongMaterial");
const spinningcube3 = new SpinningCube(scene, 55, 5, -2.8, 0x00FFFF, 1, "MeshPhongMaterial");
const lightP = new LightPoint(scene, spinningcube1.mesh.position.x, spinningcube1.mesh.position.y, spinningcube1.mesh.position.z, 0xFFFFFF, 100);

//------------------------------------------------------------------------------------------------------------------------------------
//pathways
function addPath(x,z,width,depth){
    const geometry = new THREE.BoxGeometry( width, 1, depth );
    const material = new THREE.MeshLambertMaterial( { color: 0xF0F0F0 } );
    const path = new THREE.Mesh(geometry, material);
    scene.add(path);
    path.position.set(x,0.1,z)
}
addPath(25,-3,50,6)
addPath(47,25,6,50)
addPath(70,40,50,6)
addPath(115,40,40,40)
addPath(80,5,6,70)

//------------------------------------------------------------------------------------------------------------------------------------
//modelLoader.js

loadModels(scene) //load the skull model
//--------------------------------------------------------------------------------------------------------------
//mirror test
//import {Reflector} from 'three/examples/jsm/objects/Reflector'
// const mirror:Reflector = new Reflector(
//     new THREE.PlaneGeometry(2,2),{
//         color:new THREE.color(0xFFFFFF),
//         textureWidth:window.innerWidth*window.devicePixelRatio,
//         textureHeight:window.innerHeight*window.devicePixelRatio,
//     }
// )
//----------------------------------------------------------------------------------------------------------------
//coaster test
// const geometryCoasterCart = new THREE.BoxGeometry( 2, 2, 2 );
// const materialCoasterCart = new THREE.MeshPhongMaterial( { color: 0xFF8080 } );
// const CoasterCart = new THREE.Mesh(geometryCoasterCart, materialCoasterCart);
// scene.add( CoasterCart );
// CoasterCart.position.set(115,3,40)
//
// const radiusCoaster = 15; // Adjust the radius of the circular motion
// const angularSpeedCoaster = 0.004; // Adjust the speed of rotation
// function moveCoaster(time) {
//     // Calculate the current angle based on time and angular speed
//     const angle = time * angularSpeedCoaster;
//
//     // Calculate the positions of spinningcube2 and spinningcube3
//     const coasterCartX = 115 + radiusCoaster * Math.cos(angle); //center of procesion(spinningcube)
//     const coasterCartZ = 40 + radiusCoaster * Math.sin(angle);
//     CoasterCart.lookAt(115,3,40)
//     CoasterCart.position.set(coasterCartX, 4, coasterCartZ);
// }
// function enterRollerCoaster(){
// if(player.position.x >92 && player.position.x<130 && player.position.z>20 && player.position.z<60){
//     camera.position.set(CoasterCart.position.x,CoasterCart.position.y+2,CoasterCart.position.z+2)
//
//     camera.lookAt(115,5,40)
//     camera.rotation.y += 90;
// }}
callCoordinateConversion(scene) //convert the rollerCoasterCoordinates.txt to coordinate objects
//buildTrack(scene)
//----------------------------------------------------------------------------------------------------------------

//console.log("(main pre animate)player loaded in at "+player.position.x+" "+player.position.z) //debug
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

    moveCarousel(time,carouselCart1,carouselPole1)
    tryToEnterCarousel(player,carouselCart1,camera)
    // moveCoaster(time);

    //carouselCart1.position.set(115,50,40)
    modelGlobal.rotation.y += 0.04; //rotate skull model
    renderer.setSize(window.innerWidth,window.innerHeight); //changes main.js module to fit in window every frame
    //console.log("(main animate)player loaded in at "+player.position.x+" "+player.position.z) //debug

    //buildTrack(scene)
    enterRollerCoaster(camera,scene,player)
};

animate();
