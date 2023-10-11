
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const loader = new GLTFLoader();//loader
let modelGlobal; //global variable for the skull model, so it can be called in the animate function
async function loadModels(scene) {
    try {
        const skullModelFile = await loader.loadAsync('assets/3d_models/human_skull_free.glb'); //loads skull model
        const model = skullModelFile.scene;
        scene.add(model); //adds skull to the scene
        //model.scale.set(2,2,2); //make skull bigger
        model.position.set(47,6,54)
        modelGlobal=model; //makes it possible for animate function to call the model

    } catch (error) {
        console.error('An error occurred while loading the model:', error); //oh shit oh fuck
    }
}
export {loadModels,modelGlobal}