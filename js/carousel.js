import * as THREE from 'three'

class Carousel {
    constructor(scene,x,z) {

        //floor cylinder
        this.carouselBottomGeometry = new THREE.CylinderGeometry(20, 20, 1, 40);
        this.carouselBottomMaterial = new THREE.MeshLambertMaterial({color: 0xF02020,});
        this.carouselBottomMesh = new THREE.Mesh(this.carouselBottomGeometry,this.carouselBottomMaterial)
        scene.add(this.carouselBottomMesh)
        this.carouselBottomMesh.position.set(x,1,z)

        //middle pillar
        this.middlePillarGeometry = new THREE.CylinderGeometry(2, 2, 20, 40);
        this.middlePillarMaterial = new THREE.MeshLambertMaterial({color: 0xF02020,});
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
        carouselCart.position.set(115,3,40)
        return carouselCart;
    }

    function carouselPole(scene) {
        //pole that connects cart to the structure
        const carouselCartPoleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 18, 40);
        const carouselCartPoleMaterial = new THREE.MeshLambertMaterial({color: 0x909090,});
        const carouselCartPoleMesh = new THREE.Mesh( carouselCartPoleGeometry,  carouselCartPoleMaterial)
        scene.add(carouselCartPoleMesh)
        carouselCartPoleMesh.position.set(115, 10, 40)
        return carouselCartPoleMesh
    }

const radiusCoaster = 15; // Adjust the radius of the circular motion
const angularSpeedCoaster = 0.002; // Adjust the speed of rotation
function moveCarousel(time,carouselCart1,carouselCartPole1) {

    // Calculate the current angle based on time and angular speed
    const angle = time * angularSpeedCoaster;

    // Calculate the positions of spinningcube2 and spinningcube3
    const coasterCartX = 115 + radiusCoaster * Math.cos(angle); //center of procesion(spinningcube)
    const coasterCartZ = 40 + radiusCoaster * Math.sin(angle);
    carouselCart1.lookAt(115,4,40)
    carouselCart1.position.set(coasterCartX, 4, coasterCartZ);
    carouselCartPole1.position.set(carouselCart1.position.x,8,carouselCart1.position.z)

}

export{Carousel,carouselCart,carouselPole,moveCarousel}