import {CoasterCoordinate} from "./rollerCoaster";


let listOfRecordedCoordinates = [];
let stringOfRecordedCoordinates = "";
export function recordCoasterCoordinates(player,mainIteration,numberOfRecordedTrackPieces){
    try {
        const recordedCoordinate = new CoasterCoordinate(player.position.x, player.position.y, player.position.z);
        listOfRecordedCoordinates.push(recordedCoordinate)
        console.log("coordinate recorded")
    }
    catch (err){console.log("error in recording coordinate")}
    if (mainIteration === numberOfRecordedTrackPieces-1){
        for(let y=0;y<listOfRecordedCoordinates.length;y++){
            stringOfRecordedCoordinates = stringOfRecordedCoordinates.concat(
                Math.round(listOfRecordedCoordinates[y].getX()*100)/100 //x component, "*100)/100" round to 1 decimal place
                ," ",                                                    //space
                (Math.round(listOfRecordedCoordinates[y].getY()*100)/100)+7 //y component
                ," ",
                Math.round(listOfRecordedCoordinates[y].getZ()*100)/100 //z component
                ,"\n"
            )
        }
        console.log(stringOfRecordedCoordinates)
    }
}