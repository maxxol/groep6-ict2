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

            for (const line of lines) { //goes through every line of the file
                const [x, y, z] = line.trim().split(' ').map(parseFloat); //assign x,y and z, based on a space character separating degrees of freedom

                if (!isNaN(x) && !isNaN(y) && !isNaN(z)) { //checks if the split numbers x,y and z are numbers (!isNaN = not not a number)
                    const coordinate = new CoasterCoordinate(x, y, z); //calls CoasterCoordinate class for new object
                    coordinates.push(coordinate); //adds to list
                }
            }

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
            console.log(coasterCoordinates[1].getX()); // get the x coordinate for debug
        });
}

// export function enterRollerCoaster(camera){ //WIP function to attach camera to the coaster path
//     camera.position.set(listOfCoords[counter],6,0)
//     counter++
//     if (counter >listOfCoords.length){
//         counter=0;
//     }
// }
