import * as THREE from 'three';


class Skybox {
    constructor(scene, texturePath, radius) {
        this.texture = new THREE.TextureLoader().load(texturePath);
        this.geometry = new THREE.SphereGeometry(radius, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.BackSide });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);
    }
}

class Ground {
    constructor(scene, texturePath, size) {
        this.texture = new THREE.TextureLoader().load(texturePath);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(50, 50);
        this.geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        this.material = new THREE.MeshLambertMaterial({ map: this.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);
        this.mesh.position.y=-0.2;
    }
}
class Pond {
    constructor(scene, radiusTop, radiusBottom, height, radialSegments, x, z) {

        //loading normal map texture for water cylinder
        this.waterNormalMap = new THREE.TextureLoader().load("assets/textures/pond/waterNormalMap.jpg");
        this.waterNormalMap.wrapS = THREE.RepeatWrapping
        this.waterNormalMap.wrapT = THREE.RepeatWrapping
        this.waterNormalMap.repeat.set(2, 2);

        //water cylinder
        this.pondGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        this.pondMaterial = new THREE.MeshPhongMaterial({
            color: 0x00FFFF,
            shininess: 700,
            reflectivity:10,
            opacity: 0.6,
            transparent: true,
            normalMap: this.waterNormalMap
        });
        this.pond = new THREE.Mesh(this.pondGeometry, this.pondMaterial);
        scene.add(this.pond);
        this.pond.position.set(x, 0.3, z)

        //loading rock texture for bottom cylinder
        this.rockBottomTexture = new THREE.TextureLoader().load("assets/textures/pond/rocktexture.jpg");
        this.rockBottomTexture.wrapS = THREE.RepeatWrapping
        this.rockBottomTexture.wrapT = THREE.RepeatWrapping
        this.rockBottomTexture.repeat.set(5, 5);

        //bottom cylinder
        this.pondBottomGeometry = new THREE.CylinderGeometry(radiusTop + 2, radiusBottom, height, radialSegments);
        this.pondBottomMaterial = new THREE.MeshLambertMaterial({
            color: 0x909090,
            map: this.rockBottomTexture
        });
        this.pondBottom = new THREE.Mesh(this.pondBottomGeometry, this.pondBottomMaterial);
        scene.add(this.pondBottom);
        this.pondBottom.position.set(x, 0.25, z)

        //texture for torus around pond (needs different wrapping)
        this.rockShoreTexture = this.rockBottomTexture;
        this.rockShoreTexture.repeat.set(25, 2.5);

        //torus around side
        this.pondRockGeometry = new THREE.TorusGeometry( radiusTop+1, 1.1, 16, 50 );
        this.pondRockMaterial = new THREE.MeshBasicMaterial( {
            color: 0x909090,
            map: this.rockShoreTexture
        });
        this.pondRock = new THREE.Mesh( this.pondRockGeometry, this.pondRockMaterial ); scene.add( this.pondRock );
        this.pondRock.rotation.x = 0.5*Math.PI;
        this.pondRock.position.set(x,0.6,z);

    }
}



export { Skybox, Ground, Pond };
