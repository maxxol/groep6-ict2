import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

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
        this.texture.repeat.set(100, 100);
        this.geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        this.material = new THREE.MeshLambertMaterial({ map: this.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);
    }
}

class Tree {
    constructor(glbPath, position) {
        this.object = new THREE.Object3D();  // Create an empty Object3D to hold the 3D model of the tree.

        const loader = new GLTFLoader();// Create a new instance of the GLTFLoader to load the 3D model.

        // Load the GLB model specified by the provided path.
        // When the model is loaded, add it to the Object3D and set its position.
        loader.load(glbPath, (gltf) => {
            const model = gltf.scene;
            this.object.add(model);
            this.object.position.copy(position);
        });
    }
}

export { Skybox, Ground,Tree};
