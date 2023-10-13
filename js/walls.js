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

function buildWalls(scene){
    const wall1 = new Wall(scene,180,0,-10,0)
    const wall2 = new Wall(scene,140,0.5*Math.PI,60,90)
}

export {buildWalls};