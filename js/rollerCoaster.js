import * as THREE from 'three'
import {checkInteract} from "./controls";


export class CoasterCoordinate { //class for coordinates that represent the roller coaster path
    constructor(xCoord, yCoord, zCoord) {
        this.x = xCoord; //assign coords given to variables
        this.y = yCoord;
        this.z = zCoord;
    }

    getX() { //return the x component of the coordinate
        return this.x;
    }

    getY() { //return the y component of the coordinate
        return this.y;
    }

    getZ() { //return the z component of the coordinate
        return this.z;
    }
}

let coasterCoordinates;
let coasterCart;
function readAndConvertCoordinatesFromFile(filename,scene) {

    return fetch(filename)
        .then((response) => {
            if (!response.ok) { // browser done goofed finding the txt file
                throw new Error(`Failed to fetch file`);
            }
            return response.text();
        })
        .then((data) => { //if txt file is found
            const lines = data.split('\n'); //splits the txt file into separate lines
            const coordinates = []; //makes list for all the coordinate objects
            for (const line of lines) { //goes through every line of the file
                const [x, y, z] = line.trim().split(' ').map(parseFloat); //assign x,y and z, based on a space character separating degrees of freedom
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)) { //checks if the split numbers x,y and z are numbers (!isNaN = not not a number)
                    const coordinate = new CoasterCoordinate(x, y, z); //calls CoasterCoordinate class for new object
                    coordinates.push(coordinate); //adds to list
                }
            }
            coasterCoordinates = coordinates;

            coasterCart=createCoasterCart(scene)
            try {
                buildTrack(scene)
            }
            catch (err){console.log("something went wrong building track")}

            return coordinates;
        })
        .catch((error) => { //it went wrong
            console.error('Error reading the file:', error); //error msg
            return []; //log empty list
        });

}

// Usage

export function callCoordinateConversion(scene) { // function to call from main to convert the coordinate file to objects
    //recordedCoasterTrack1, recordedCoasterTrack2,manualCoasterTrack
    const filename = 'txt_files/recordedCoasterTrack3.txt'; // file path for the coaster coordinates txt file
    readAndConvertCoordinatesFromFile(filename,scene) // calls the conversion function
        .then((coasterCoordinates) => { //promise
        });

}
function buildTrack(scene) {

    const materialSupportBeam = new THREE.MeshLambertMaterial({color:0xEE0000});

    const geometryTrackPiece = new THREE.BoxGeometry(1, 1, 1);
    const materialTrackPiece = new THREE.MeshPhongMaterial({ color: 0xEEEEEE });
    for (let counter = 0; counter < coasterCoordinates.length; counter++) { //adds every track piece
        try {

                const trackPiece = new THREE.Mesh(geometryTrackPiece, materialTrackPiece);
                trackPiece.position.set(coasterCoordinates[counter].getX(), coasterCoordinates[counter].getY() - 5, coasterCoordinates[counter].getZ());
                scene.add(trackPiece);
                const currentPoint = coasterCoordinates[counter];
                const nextPoint = coasterCoordinates[counter + 1];
                const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize(); // Calculate the direction vector from the current point to the next point
                trackPiece.rotation.y = Math.atan2(direction.x, direction.z); // Calculate the angle between the direction vector and the positive z-axis and apply it to the cart

            } catch (err) {
            console.log("Error trying to create box for coaster track");
        }
        if(counter%100===0){
            try {
                //console.log(counter+" %15 = "+counter%15)
                const beamHeight = coasterCoordinates[counter].getY()
                const geometrySupportBeam = new THREE.CylinderGeometry(0.5,0.5,beamHeight)
                const supportBeam = new THREE.Mesh(geometrySupportBeam,materialSupportBeam);
                scene.add(supportBeam);
                supportBeam.position.set(coasterCoordinates[counter].getX(), coasterCoordinates[counter].getY()/2-5, coasterCoordinates[counter].getZ())
            }
            catch (err){console.log("Error trying to create support beam")}
        }
    }

    //pad where player enter coaster
    const geometryStartPad = new THREE.BoxGeometry(10, 1, 12);
    const materialStartPad = new THREE.MeshPhongMaterial({ color: 0x0000AA });
    const startPad = new THREE.Mesh(geometryStartPad, materialStartPad);
    startPad.position.set(65,0.5,30)
    scene.add(startPad);
}

function createCoasterCart(scene) {
    const geometryCoasterCart = new THREE.BoxGeometry(3, 3, 8);
    const materialCoasterCart = new THREE.MeshPhongMaterial({color: 0xFF0000});
    const coasterCart = new THREE.Mesh(geometryCoasterCart, materialCoasterCart);
    scene.add(coasterCart);
    return coasterCart;
}

function updateCartRotation(coasterCart, counter) {
    if (counter < coasterCoordinates.length - 1) {
        const currentPoint = coasterCoordinates[counter];
        const nextPoint = coasterCoordinates[counter + 1];


        const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize(); // Calculate the direction vector from the current point to the next point
        coasterCart.rotation.y = Math.atan2(direction.x, direction.z); // Calculate the angle between the direction vector and the positive z-axis and apply it to the cart

    }
}



let counter =0;
let inCoaster = false; //currently not in coaster
export function updateRollerCoaster(camera,scene,player) { //WIP function to attach camera to the coaster path
    if (player.position.x > 60 && player.position.x < 70 && player.position.z < 35 && player.position.z > 25 && checkInteract()) {
        camera.fov = 100
        if(!inCoaster){ //changes counter to 0 once so coaster always starts at same place when entered
            counter=0;
            inCoaster=true; //currently in coaster
        }

        if (counter >coasterCoordinates.length-1){
            counter=0;
        }
    camera.position.set(coasterCoordinates[counter].getX(),coasterCoordinates[counter].getY(),coasterCoordinates[counter].getZ()+2);
    coasterCart.position.set(coasterCoordinates[counter].getX(),coasterCoordinates[counter].getY()-4,coasterCoordinates[counter].getZ());
    }
    else{
        counter=0;
        coasterCart.position.set(coasterCoordinates[counter].getX()-1,coasterCoordinates[counter].getY()-4,coasterCoordinates[counter].getZ());
        inCoaster=false
        camera.fov = 75}

    updateCartRotation(coasterCart,counter)

    counter++

}
