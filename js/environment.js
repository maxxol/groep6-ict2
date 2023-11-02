import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import {CoasterCoordinate} from "./rollerCoaster";
import {normalMap} from "three/nodes";


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

        this.normalMapGrass = new THREE.TextureLoader().load("assets/textures/ground/normalMapGrass.jpg")
        this.normalMapGrass.wrapS = THREE.RepeatWrapping;
        this.normalMapGrass.wrapT = THREE.RepeatWrapping;
        this.normalMapGrass.repeat.set(100, 100);

        this.geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        this.material = new THREE.MeshLambertMaterial({ normalMap:this.normalMapGrass, map:this.texture});
        this.material.normalScale.set(0.1,0.1)
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
        this.pondRockMaterial = new THREE.MeshLambertMaterial( {
            color: 0x909090,
            map: this.rockShoreTexture
        });
        this.pondRock = new THREE.Mesh( this.pondRockGeometry, this.pondRockMaterial ); scene.add( this.pondRock );
        this.pondRock.rotation.x = 0.5*Math.PI;
        this.pondRock.position.set(x,0.6,z);

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

export function loadTreesFromTextFile(scene, filePath) {
    const loader = new THREE.FileLoader();

    loader.load(filePath, (data) => {
        const lines = data.split('\n');

        for (const line of lines) {
            const parts = line.trim().split(' ');

            if (parts.length === 3) {
                const x = parseFloat(parts[0]);
                const y = parseFloat(parts[1]);
                const z = parseFloat(parts[2]);

                const tree = new Tree(scene, new THREE.Vector3(x, y, z));
            }
        }
    });
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
export { Skybox, Ground,Tree, Lightpost,Pond};

