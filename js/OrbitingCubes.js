import * as THREE from "three";

class SpinningCube {
    constructor(scene, x, y, z, color, size, material) {
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE[material]({ color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z);
        scene.add(this.mesh);
    }

    rotate(xRotation, yRotation) {
        this.mesh.rotation.x += xRotation;
        this.mesh.rotation.y += yRotation;
    }
}

class LightPoint {
    constructor(scene, x, y, z, color, intensity) {
        this.light = new THREE.PointLight(color, intensity);
        this.light.position.set(x, y, z);
        scene.add(this.light);
    }
}

const radius = 5;
const angularSpeed = 0.004;
function createTheCubes(scene){
    const spinningcube1 = new SpinningCube(scene, 55, 5, -3, 0xF0ff00, 2, "MeshBasicMaterial");
    const spinningcube2 = new SpinningCube(scene, 55, 5, -2.8, 0xFF8080, 1, "MeshPhongMaterial");
    const spinningcube3 = new SpinningCube(scene, 55, 5, -2.8, 0x00FFFF, 1, "MeshPhongMaterial");
    const lightP = new LightPoint(scene, spinningcube1.mesh.position.x, spinningcube1.mesh.position.y, spinningcube1.mesh.position.z, 0xFFFFFF, 100);

}
function spinTheCubes(scene, time, spinningcube1, spinningcube2, spinningcube3) {

    const angle = time * angularSpeed;
    const cube2X = spinningcube1.mesh.position.x + radius * Math.cos(angle);
    const cube2Z = spinningcube1.mesh.position.z + radius * Math.sin(angle);
    const cube3X = spinningcube1.mesh.position.x + radius * Math.cos(angle + Math.PI);
    const cube3Z = spinningcube1.mesh.position.z + radius * Math.sin(angle + Math.PI);
    spinningcube2.mesh.position.set(cube2X, spinningcube2.mesh.position.y, cube2Z);
    spinningcube3.mesh.position.set(cube3X, spinningcube3.mesh.position.y, cube3Z);
    spinningcube1.rotate(0.09, 0.09);
    spinningcube2.rotate(-0.09, -0.09);
    spinningcube3.rotate(-0.09, -0.09);
}

export { SpinningCube, LightPoint, spinTheCubes };
