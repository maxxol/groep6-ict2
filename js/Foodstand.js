import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

class Foodstand {
    constructor(modelPath, textMessage, scene, camera, renderer) {
        this.modelPath = modelPath; // Path to the 3D model
        this.textMessage = textMessage; // Message to display on click
        this.scene = scene; // Three.js scene
        this.camera = camera; // Three.js camera
        this.renderer = renderer; // Three.js renderer
        this.ramenCount = 0; // Initialize ramen count to 0

        // Load the 3D model and set up event listeners
        this.loadModel();
        this.addEventListeners();
    }

    // Load the 3D model and add it to the scene
    loadModel() {
        const loader = new GLTFLoader();// Create a new instance of the GLTFLoader to load the 3D model.
        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            this.model.position.set(87,0,34); // Set the initial position
            this.model.scale.set(0.03,0.03,0.03 )
            this.scene.add(this.model); // Add the model to the scene
        });
    }

    // Display a temporary text message
    displayTextMessage() {
        // Create a new <div> element to display the text message
        const div = document.createElement('div');

        // Styling for the message
        div.style.position = 'absolute';
        div.style.top = '10px';
        div.style.left = '10px';
        div.style.padding = '10px';
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        div.style.color = 'white';
        div.textContent = this.textMessage;

        // Add the message to the HTML document
        document.body.appendChild(div);

        // Remove the message after 5 seconds
        setTimeout(() => {
            document.body.removeChild(div);
        }, 5000);
    }

    // Increment the ramen count and log the updated count to the console
    addRamenToArray() {
        this.ramenCount += 1;
        console.log('Ramen count:', this.ramenCount);
    }

    // Set up event listeners to detect clicks on the 3D model
    addEventListeners() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onClick = (event) => {
            event.preventDefault();

            // Calculate mouse coordinates relative to the renderer element
            const canvasBounds = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
            mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            // Check for intersections with the model
            const intersects = raycaster.intersectObjects([this.model]);

            if (intersects.length > 0) {
                this.displayTextMessage(); // Show a text message
                this.addRamenToArray(); // Add 1 to the ramen count and log it
            }
        };

        // Listen for click events on the renderer element
        this.renderer.domElement.addEventListener('click', onClick);
    }
}

export {Foodstand};