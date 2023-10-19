import * as THREE from 'three';

class Wall{
    constructor(scene,wallLength,rotationY,positionX,positionZ) {

        this.wallTexture = new THREE.TextureLoader().load("assets/textures/wall/wall.jpg");
        this.wallTexture.wrapS = THREE.RepeatWrapping
        this.wallTexture.wrapT = THREE.RepeatWrapping
        this.wallTexture.repeat.set(wallLength/10, 1);

        this.wallGeometry = new THREE.BoxGeometry(1,13,wallLength);
        this.wallMaterial = new THREE.MeshBasicMaterial({color:0x808080,map: this.wallTexture});
        this.wall = new THREE.Mesh(this.wallGeometry,this.wallMaterial)
        scene.add(this.wall);
        this.wall.position.set(positionX,6,positionZ)
        this.wall.rotation.y = rotationY;
    }
}

//function to load all the walls, called from main.
function buildWalls(scene){
    //notes:
    //0.5*Math.PI means the wall is rotated 90 degrees.
    //0 means it would be perpendicular to player spawn rotation, 90 means parallel to player spawn rotation
    //there are no walls that are in the same plane and touching, meaning any continuous looking wall is a continuous wall.
    const wall1 = new Wall(scene,180,0,-10,0) //wall behind player spawn
    const wall2 = new Wall(scene,160,0.5*Math.PI,70,90)  //long wall to the right of player spawn
    const wall3 = new Wall(scene,200,0,150,-10) // wall behind carousel
    const wall4 = new Wall(scene,60,0.5*Math.PI,120,10)// wall left of carousel
    const wall5 = new Wall(scene,40,0,70,0) //wall behind spinning cubes
    const wall6 = new Wall(scene,80,0.5*Math.PI,30,-20) //wall left of player spawn
    const wall7 = new Wall(scene,160,0.5*Math.PI,70,-90) // wall behind coaster
}

export {buildWalls};