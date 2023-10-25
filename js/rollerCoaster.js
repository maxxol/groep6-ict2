import * as THREE from 'three'



class CoasterCoordinate { //class for coordinates that represent the roller coaster path
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
            buildTrack(scene)

            return coordinates;
        })
        .catch((error) => { //it went wrong
            console.error('Error reading the file:', error); //error msg
            return []; //log empty list
        });

}

// Usage

export function callCoordinateConversion(scene) { // function to call from main to convert the coordinate file to objects
    const filename = 'js/rollerCoasterCoordinates.txt'; // file path for the coaster coordinates txt file
    readAndConvertCoordinatesFromFile(filename,scene) // calls the conversion function
        .then((coasterCoordinates) => { //debug
        });

}
function buildTrack(scene) {
    const geometryTrackPiece = new THREE.BoxGeometry(1, 1, 1);
    const materialTrackPiece = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });

    for (let counter = 0; counter < coasterCoordinates.length; counter++) { //adds every track piece
        try {
            const trackPiece = new THREE.Mesh(geometryTrackPiece, materialTrackPiece);
            trackPiece.position.set(coasterCoordinates[counter].getX(), coasterCoordinates[counter].getY() - 5, coasterCoordinates[counter].getZ());
            scene.add(trackPiece);
        } catch (err) {
            console.log("Error trying to create box for coaster track");
        }
    }
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
        const angle = Math.atan2(direction.x, direction.z); // Calculate the angle between the direction vector and the positive z-axis
        coasterCart.rotation.y = -angle; //set the rotation of the cart
    }
}



let counter =0;
let inCoaster = false; //currently not in coaster
export function updateRollerCoaster(camera,scene,player) { //WIP function to attach camera to the coaster path

    if (player.position.x > 90 && player.position.x < 100 && player.position.z < 2 && player.position.z > -10) {

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
        inCoaster=false}

    updateCartRotation(coasterCart,counter)
    counter++

}
