import * as THREE from 'three'

class Carousel {
    constructor(scene,x,z) {

        //loading normal map texture for water cylinder
        this.metalTexture = new THREE.TextureLoader().load("assets/textures/carousel/metalTexture.jpg");
        this.metalTexture.wrapS = THREE.RepeatWrapping
        this.metalTexture.wrapT = THREE.RepeatWrapping
        this.metalTexture.repeat.set(15,15);

        //floor cylinder
        this.carouselBottomGeometry = new THREE.CylinderGeometry(20, 20, 1, 40);
        this.carouselBottomMaterial = new THREE.MeshPhongMaterial({
            color: 0x909090,
            map:this.metalTexture,
            emissive: 0x202020, // Adjust the emissive color
            emissiveIntensity: 0.2,
        });

        this.carouselBottomMesh = new THREE.Mesh(this.carouselBottomGeometry,this.carouselBottomMaterial)
        scene.add(this.carouselBottomMesh)
        this.carouselBottomMesh.position.set(x,1,z)

        //middle pillar
        this.middlePillarGeometry = new THREE.CylinderGeometry(2, 2, 20, 40);
        this.middlePillarMaterial = this.carouselBottomMaterial;
        this.middlePillarMesh = new THREE.Mesh(this.middlePillarGeometry,this.middlePillarMaterial)
        scene.add(this.middlePillarMesh)
        this.middlePillarMesh.position.set(x,10,z)

        //roof cone
        this.roofConeGeometry = new THREE.ConeGeometry(20,7,60,10)
        this.roofConeMaterial = new THREE.MeshPhongMaterial({color: 0xF02020,side: THREE.DoubleSide});
        this.roofConeMesh = new THREE.Mesh(this.roofConeGeometry,this.roofConeMaterial);
        scene.add(this.roofConeMesh);
        this.roofConeMesh.position.set(x,20,z)



    }
}

    function carouselCart(scene){

        //carousel cart test
        const geometryCarouselCart = new THREE.BoxGeometry( 2, 2, 2 );
        const materialCarouselCart = new THREE.MeshPhongMaterial( { color: 0xFF8080 } );
        const carouselCart = new THREE.Mesh(geometryCarouselCart, materialCarouselCart);
        scene.add( carouselCart );
        carouselCart.position.set(50,3,-50)
        return carouselCart;
    }

    function carouselPole(scene) {
        //pole that connects cart to the structure
        const carouselCartPoleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 18, 40);
        const carouselCartPoleMaterial = new THREE.MeshLambertMaterial({color: 0x909090,});
        const carouselCartPoleMesh = new THREE.Mesh( carouselCartPoleGeometry,  carouselCartPoleMaterial)
        scene.add(carouselCartPoleMesh)
        carouselCartPoleMesh.position.set(50, 10, -50)
        return carouselCartPoleMesh
    }

const radiusCoaster = 15; // Adjust the radius of the circular motion
const angularSpeedCoaster = 0.002; // Adjust the speed of rotation
const radiusPole = 14
function moveCarousel(time,carouselCart1,carouselCartPole1) {

    // Calculate the current angle based on time and angular speed
    const angle = time * angularSpeedCoaster;

    // Calculate the positions of spinningcube2 and spinningcube3
    const carouselCartX = 50 + radiusCoaster * Math.cos(angle); //center of procesion(spinningcube)
    const carouselCartZ = -50 + radiusCoaster * Math.sin(angle);
    carouselCart1.lookAt(50,4,-50)
    carouselCart1.position.set(carouselCartX, 4, carouselCartZ);

    const carouselPoleX = 50 + radiusPole * Math.cos(angle); //center of procesion(spinningcube)
    const carouselPoleZ = -50 + radiusPole * Math.sin(angle);
    carouselCartPole1.position.set(carouselPoleX,8,carouselPoleZ)

}

function tryToEnterCarousel(player,CoasterCart,camera){
if(player.position.x >30 && player.position.x<65 && player.position.z>-65 && player.position.z<-35){

    camera.position.set(CoasterCart.position.x,CoasterCart.position.y+2,(CoasterCart.position.z+2))

    camera.lookAt(50,5,-50)
    camera.rotation.y += 0.4*Math.PI;
}}

export{Carousel,carouselCart,carouselPole,moveCarousel,tryToEnterCarousel}