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
    const wall1 = new Wall(scene,160,0,-10,-20) //wall behind player spawn
    const wall2 = new Wall(scene,120,0.5*Math.PI,50,20)  // wall to the right of player spawn
    const wall3 = new Wall(scene,120,0.5*Math.PI,50,-25) // wall to the left of player spawn
    const wall4 = new Wall(scene,190,0,140,-5) //long wall behind cubes
    const wall5 = new Wall(scene,150,0.5*Math.PI,65,-100) // left carousel wall
    const wall6 = new Wall(scene,200,0.5*Math.PI,60,100) //rightmost wall
    const wall7 = new Wall(scene,220,0,-40,-10) //wall behind player spawn
    const wall8 = new Wall(scene,200,0.5*Math.PI,60,-120) // leftmost wall
    const wall9 = new Wall(scene,220,0,160,-10)
}

export {buildWalls};