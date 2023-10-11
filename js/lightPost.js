import * as THREE from "three";


class LightPosts {
    constructor(scene) {
        this.scene = scene;
    }

    create(x, z) {
        // Post without the 'glass' containing the lamp
        const geometryPost = new THREE.BoxGeometry(0.7, 5, 0.7);
        const materialPost = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
        this.lampPost = new THREE.Mesh(geometryPost, materialPost);
        this.lampPost.position.set(x, 3, z);
        this.scene.add(this.lampPost);

        // Glass containing the lamp
        const geometryPostGlass = new THREE.BoxGeometry(1, 1, 1);
        const materialPostGlass = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        this.lampPostGlass = new THREE.Mesh(geometryPostGlass, materialPostGlass);
        this.lampPostGlass.position.set(x, 5.8, z);
        this.scene.add(this.lampPostGlass);

        // Light emitter
        this.lightPostLamp = new THREE.PointLight(0xFFFFFF, 100);
        this.lightPostLamp.position.set(x, 5.8, z);
        this.scene.add(this.lightPostLamp);
    }
}

// Create light posts
function placeLightPosts(scene){
    const lightPosts = new LightPosts(scene);
// Lights at opening path
    lightPosts.create(10, 4);
    lightPosts.create(10, -10);

// Light at spinning cubes
    lightPosts.create(40, 4);
    lightPosts.create(40, -10);

// Lights at skull
    lightPosts.create(40, 47);
    lightPosts.create(54, 47);
    lightPosts.create(54, 33);

//lights at coaster test
    lightPosts.create(90,47);
    lightPosts.create(90,33);

}
export { placeLightPosts };


