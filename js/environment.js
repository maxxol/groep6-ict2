import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
const loader = new GLTFLoader();//loader

async function treeModel(scene) {
    try {
        const treeModel = await loader.loadAsync('assets/3d_models/low_poly_tree.glb'); //loads tree models
        const treeModel1 = await loader.loadAsync('assets/3d_models/low_poly_tree.glb'); //loads tree models
        const treeModel2 = await loader.loadAsync('assets/3d_models/low_poly_tree.glb'); //loads tree models
        const treeModel3 = await loader.loadAsync('assets/3d_models/low_poly_tree.glb'); //loads tree models

        const model  = treeModel.scene;
        const model1 = treeModel1.scene;
        const model2 = treeModel2.scene;
        const model3 = treeModel3.scene;
        scene.add(model, model1, model2,model3); //adds tree to the scene

        model.position.set(87,0,54)
        model1.position.set(47,0,54)
        model2.position.set(27,0,54)
        model3.position.set(107,0,54)



    } catch (error) {
        console.error('An error occurred while loading the model:', error);
    }
}


export { Skybox, Ground,treeModel};
