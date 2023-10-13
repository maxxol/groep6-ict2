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

//function to load all the walls, called from main
function buildWalls(scene){
    const wall1 = new Wall(scene,180,0,-10,0)
    const wall2 = new Wall(scene,160,0.5*Math.PI,70,90) //0.5*Math.PI means the wall is rotated 90 degrees
    const wall3 = new Wall(scene,80,0,150,50)
    const wall4 = new Wall(scene,80,0.5*Math.PI,110,10)
    const wall5 = new Wall(scene,40,0,70,0)
    const wall6 = new Wall(scene,100,0.5*Math.PI,40,-20)
}

export {buildWalls};