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

function readAndConvertCoordinatesFromFile(filename) {

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
            console.log("defined done")
            for (const line of lines) { //goes through every line of the file
                console.log("test1")
                const [x, y, z] = line.trim().split(' ').map(parseFloat); //assign x,y and z, based on a space character separating degrees of freedom
                console.log("test2")
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)) { //checks if the split numbers x,y and z are numbers (!isNaN = not not a number)
                    console.log("test3")
                    const coordinate = new CoasterCoordinate(x, y, z); //calls CoasterCoordinate class for new object
                    coordinates.push(coordinate); //adds to list
                    console.log("test4")
                }
            }
            coasterCoordinates = coordinates;
            return coordinates;
        })
        .catch((error) => { //it went wrong
            console.error('Error reading the file:', error); //error msg
            return []; //log empty list
        });
}

// Usage

export function callCoordinateConversion() { // function to call from main to convert the coordinate file to objects
    const filename = 'js/rollerCoasterCoordinates.txt'; // file path for the coaster coordinates txt file
    readAndConvertCoordinatesFromFile(filename) // calls the conversion function
        .then((coasterCoordinates) => { //debug
            console.log("poopoopoopoopoo")
            console.log(coasterCoordinates[10])
            console.log(coasterCoordinates[10].getX()); // get the x coordinate for debug
        });
}

function buildTrack(counter,scene){
    const geometryTrackPiece = new THREE.BoxGeometry(1, 1, 1);
    const materialTrackPiece = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
    const trackPiece = new THREE.Mesh(geometryTrackPiece, materialTrackPiece);
    try {
        trackPiece.position.set(coasterCoordinates[counter].getX(),coasterCoordinates[counter].getY()-5,coasterCoordinates[counter].getZ());

    }
    catch (err){
    }
    scene.add(trackPiece);
}

let counter =0;
export function enterRollerCoaster(camera,scene,player) { //WIP function to attach camera to the coaster path

    if (player.position.x > 90 && player.position.x < 100 && player.position.z < 2 && player.position.z > -10) {
        if (counter >coasterCoordinates.length-1){
            counter=0;
        }
    camera.position.set(coasterCoordinates[counter].getX(),coasterCoordinates[counter].getY(),coasterCoordinates[counter].getZ()+2)

}
    buildTrack(counter,scene);
    counter++

}
