import {CoasterCoordinate} from "./rollerCoaster";
import {checkLogResult} from "./controls";

let listOfRecordedCoordinates = [];
let stringOfRecordedCoordinates = "";
export function recordCoasterCoordinates(player) { //function that records player location and transforms it into coordinates
        try {
            const recordedCoordinate = new CoasterCoordinate(player.position.x, player.position.y, player.position.z);//create new CoasterCoordinate(see rollerCoaster.js)
            listOfRecordedCoordinates.push(recordedCoordinate) //add coordinate to list of recorded coordinates
        }
        catch (err) {
            console.log("error in recording coordinate")
        }
        if (checkLogResult()) {
            for (let y = 0; y < listOfRecordedCoordinates.length; y++) { //runs through all the recorded coordinates
                stringOfRecordedCoordinates = stringOfRecordedCoordinates.concat( //turns all the coordinates into one string -
                    // (separate logs for every coordinate are tedious to copy paste due to chrome stating the line -
                    // in which the log statement was called for every single coordinate).

                    Math.round(listOfRecordedCoordinates[y].getX() * 100) / 100         //x component, "*100)/100" round to 1 decimal place
                    , " ",                                                              //space
                    (Math.round(listOfRecordedCoordinates[y].getY() * 100) / 100) + 7     //y component
                    , " ",
                    Math.round(listOfRecordedCoordinates[y].getZ() * 100) / 100         //z component
                    , "\n"                                                              //newline
                )
            }
            console.log(stringOfRecordedCoordinates) //logs all the coordinates in one string for easy copy pasting into txt file
        }
}