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
    constructor(scene, position) {
        this.scene = scene; // Three.js scene
        this.position = position; // Set position of the 3d model

        this.loadModel();       // Load the 3D model
    }
        loadModel() {
            const loader = new GLTFLoader();
            loader.load('assets/3d_models/low_poly_tree.glb', (gltf) => {
                this.model = gltf.scene;            // Store the loaded 3D model
                this.model.position.copy(this.position); // Set the position of the model
                this.scene.add(this.model); // Add the model to the scene
            });
        }
}

class Lightpost {
    constructor(scene, position) {
        this.scene = scene; // Three.js scene
        this.position = position; // Set position of the 3d model

        this.loadModel();       // Load the 3D model of the lightpost
        this.createLight();     // creates point light in side the lightpost
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('assets/3d_models/light_post.glb', (gltf) => {
            this.model = gltf.scene;            // Store the loaded 3D model
            this.model.scale.set(0.15,0.15,0.15 )   // set scale of 3D model
            this.model.position.copy(this.position); // Set the position of the model
            this.scene.add(this.model); // Add the model to the scene
        });
    }

    createLight() {
        const pointLight = new THREE.PointLight(0xFFFFFF, 1000, 10); // Create a point light with the specified color and intensity
        pointLight.position.copy(this.position);
        pointLight.position.set(this.position.x, 8, this.position.z);

        this.scene.add(pointLight); // Add the light to the scene
    }
}
export { Skybox, Ground,Tree, Lightpost};
