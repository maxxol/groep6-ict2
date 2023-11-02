
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const loader = new GLTFLoader();//loader

async function loadModels(scene) {
    try {
        const skullModelFile = await loader.loadAsync('assets/3d_models/human_skull_free.glb'); //loads skull model
        const model = skullModelFile.scene;
        scene.add(model); //adds skull to the scene
        model.scale.set(4,4,4); //make skull bigger
        model.position.set(47,4,54)

    } catch (error) {
        console.error('An error occurred while loading the model:', error); //oh shit oh fuck
    }
}
export {loadModels}