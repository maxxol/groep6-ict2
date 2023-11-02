import * as THREE from 'three';

import controls, {loadPlayer, getPlayer,updateControls } from "./controls"
import { SpinningCube, LightPoint, spinTheCubes } from "./orbitingCubes";
import  {Foodstand} from './Foodstand'
import { Skybox, Ground, Pond,Tree,Lightpost } from './environment';
import {loadModels} from "./modelLoader";
import{Carousel,carouselCart,moveCarousel,carouselPole,tryToEnterCarousel} from "./Carousel";
import {updateRollerCoaster,callCoordinateConversion} from "./rollerCoaster";
import {recordCoasterCoordinates} from "./rollerCoasterTrackRecorder";
import{checkInteract} from "./controls";
import {loadTreesFromTextFile} from "./environment";
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
//Carousel.js
const carousel1 = new Carousel(scene,50,-50);
const carouselCart1 = carouselCart(scene);
const carouselPole1 = carouselPole(scene);
//------------------------------------------------------------------------------------------------------------------
//OrbitingCubes.js

const spinningcube1 = new SpinningCube(scene, 60, 5, -3, 0xF0ff00, 2, "MeshBasicMaterial");
const spinningcube2 = new SpinningCube(scene, 60, 5, -2.8, 0xFF8080, 1, "MeshPhongMaterial");
const spinningcube3 = new SpinningCube(scene, 60, 5, -2.8, 0x00FFFF, 1, "MeshPhongMaterial");
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
addPath(25,-3,50,6) //spawn path forward
addPath(47,-3,6,30) //path fork in front of spinning cubes
addPath(60,-15 ,30,6) //left path round cube
addPath(60,9,30,6) //right path round cube
addPath(72,-3,6,30) //path fork behind cube
addPath(99,-3,60,6) // path forward behind cube
addPath(126,-10,6,80) // path fork at hind wall
addPath(99,-50,60,6)// path to carousel
addPath(99,30,60,6) // path to coaster

//------------------------------------------------------------------------------------------------------------------------------------
//modelLoader.js
const filePath = 'txt_files/treeLocations.txt';
loadTreesFromTextFile(scene,filePath)
// loading tree models


// loading ramen foodstand
const textMessage = 'Added ramen!';
const foodstand = new Foodstand(textMessage,scene,renderer);

// Create multiple lightposts
const lightpost1 = new Lightpost(scene, new THREE.Vector3(10, 0, 4));
const lightpost2 = new Lightpost(scene, new THREE.Vector3(10, 0, -10));
const lightpost3 = new Lightpost(scene, new THREE.Vector3(40, 0, 4));
const lightpost4 = new Lightpost(scene, new THREE.Vector3(40, 0, -10));


// Lights at opening path
// lightPosts.create(10, 4);
// lightPosts.create(10, -10);
//
// // Light at spinning cubes
// lightPosts.create(40, 4);
// lightPosts.create(40, -10);

//--------------------------------------------------------------------------------------------------------------
//prepare coordinates for rollercoaster
callCoordinateConversion(scene) //convert the rollerCoasterCoordinates.txt to coordinate objects
//----------------------------------------------------------------------------------------------------------------
// Create a variable to track the last timestamp
let lastTimestamp = 0;

// Define a constant frame rate
const targetFPS = 90;
const frameInterval = 1000 / targetFPS;
//console.log("(main pre animate)player loaded in at "+player.position.x+" "+player.position.z) //debug
// Animation loop
const animate = () => {
    const time = performance.now();
    const delta = (time - controls.prevTime) / 1000;
    requestAnimationFrame(animate); //rendering a frame

    const elapsed = time - lastTimestamp;

    // If enough time has passed, render the frame
    if (elapsed >= frameInterval) {


        renderer.render(scene, camera);

        lastTimestamp = time; // Store the current timestamp as the last timestamp

        updateControls(camera,time,delta);
        camera.position.set(player.position.x,player.position.y+4.6,player.position.z)

        spinTheCubes(scene, performance.now(), spinningcube1, spinningcube2, spinningcube3); // Rotate the majestic cube of death

        moveCarousel(time,carouselCart1,carouselPole1)
        tryToEnterCarousel(player,carouselCart1,camera)

        renderer.setSize(window.innerWidth,window.innerHeight); //changes main.js module to fit in window every frame
        //console.log("(main animate)player loaded in at "+player.position.x+" "+player.position.z) //debug

        updateRollerCoaster(camera,scene,player) //puts player into roller coaster if conditions are met
        //uncomment the following code to activate the track recording feature, it is adviseable to make updateRollerCoaster into a comment beforehand to avoid entering the coaster accidently while recording
        // if(checkInteract()){
        //     recordCoasterCoordinates(player)
        // }

    }
};

animate();
