import * as THREE from "three";
import {camera} from "./main"

const player = new THREE.Object3D();

function loadPlayer(scene, camera) {
    // Add the passed camera to the player object
    const player = new THREE.Object3D();
    player.add(camera);
    camera.rotation.order = "YXZ"; // Set the camera's eulerOrder to "YXZ" (prevents camera rolling when moving mouse up and down)

    // Set the initial camera position and rotation
    camera.rotation.set(0, 1.5*Math.PI, 0); // looking down the path


    // Set the initial player position
    player.position.set(0, 0, -2); //standing in front the path

    // Add the player object to the passed scene
    scene.add(player);

    //console.log("(controls.js)Player loaded in at " + player.position.x + " " + player.position.z); //debug
}

function getPlayer() {
    return player;
}

export { loadPlayer, getPlayer };

// creating control booleans, default on false
const controls = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    canJump: false,
    prevTime: performance.now(),
    velocity: new THREE.Vector3(),
};


document.addEventListener('keydown', (event) => { //listeners for key presses
    switch (event.code) {
        case 'KeyW':
            controls.moveForward = true;
            break;
        case 'KeyA':
            controls.moveLeft = true;
            break;
        case 'KeyS':
            controls.moveBackward = true;
            break;
        case 'KeyD':
            controls.moveRight = true;
            break;
        case 'Space':
            if (controls.canJump === true) controls.velocity.y += 40;
            controls.canJump = false;
            break;
        case 'ShiftLeft':
            controls.moveDown = true;
            break;
    }
});

document.addEventListener('keyup', (event) => { //listeners for keys being unpressed
    switch (event.code) {
        case 'KeyW':
            controls.moveForward = false;
            break;
        case 'KeyA':
            controls.moveLeft = false;
            break;
        case 'KeyS':
            controls.moveBackward = false;
            break;
        case 'KeyD':
            controls.moveRight = false;
            break;
        case 'ShiftLeft':
            controls.moveDown = false;
            break;
    }
});

//variables for mouse movement
const mouse = new THREE.Vector2();
const sensitivityX = 0.003;
const sensitivityY = 0.003;
const maxPitch = Math.PI / 2 - 0.01;
const minPitch = -maxPitch;

document.addEventListener('mousemove', (event) => {

    camera.rotation.y -= event.movementX * sensitivityX; // Rotate the camera around the y-axis (yaw)

    const pitchRotation = event.movementY * sensitivityY;// Calculate the pitch rotation (rotation around x-axis)
    camera.rotation.x -= pitchRotation;// Apply the pitch rotation to the camera
    camera.rotation.x = Math.max(minPitch, Math.min(maxPitch, camera.rotation.x)); // Limit the pitch rotation (no further than straight up or down)

    camera.updateProjectionMatrix(); // Update the camera's rotation
});


//animate controls function
export function updateControls(camera,time,delta) {
    const speed = 30; // Adjust this value for movement speed
    const gravity = 10; // Adjust this value for gravity strength

    const cameraRotation = camera.getWorldQuaternion(new THREE.Quaternion());

// Calculate the camera's forward direction vector
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(cameraRotation);

// Handle movement based on control inputs
//     if (controls.moveForward) {
//         player.position.add(direction.clone().multiplyScalar(speed * delta));
//     }
    if (controls.moveForward) {
        const forwardDirection = new THREE.Vector3(direction.x, 0, direction.z); // Create a direction vector that ignores the Y component
        forwardDirection.normalize();// Normalize the forwardDirection vector
        player.position.add(forwardDirection.clone().multiplyScalar(speed * delta)); // Move the player along the modified forwardDirection vector
    }
    if (controls.moveBackward) {
        const backwardDirection = new THREE.Vector3(direction.x, 0, direction.z); //same but for backward
        backwardDirection.normalize();
        player.position.add(backwardDirection.clone().multiplyScalar(-speed * delta)); //-speed because backward = -forward
    }

    if (controls.moveLeft) {
        const leftDirection = new THREE.Vector3(-1, 0, 0); // Create a direction vector that represents right movement (-x is right when camerarotation = 0,0,0)
        leftDirection.applyQuaternion(cameraRotation); // Apply the camera's rotation to the left Direction vector
        leftDirection.normalize();// Normalize the leftDirection vector
        player.position.add(leftDirection.clone().multiplyScalar(speed * delta)); // Move the player right along the modified leftDirection vector
    }

    if (controls.moveRight) {
        const rightDirection = new THREE.Vector3(1, 0, 0); // same but for right
        rightDirection.applyQuaternion(cameraRotation);
        rightDirection.normalize();
        player.position.add(rightDirection.clone().multiplyScalar(speed * delta));
    }


// Update the player's position with gravity
    controls.velocity.y -= gravity * 9.8 * delta;
    player.position.add(controls.velocity.clone().multiplyScalar(delta));
// Collision detection (you can add your own collision logic here)

// Prevent the camera from falling through the ground
    if (player.position.y < 1.6) {
        controls.velocity.y = 0;
        player.position.y = 1.6;
        controls.canJump = true;
    }

    controls.prevTime = time;


}

export default controls