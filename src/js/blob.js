import $ from 'jquery';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
$(document).ready(function() {

    let $canvas = $('#blob canvas'),
        canvas = $canvas[0],
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            context: canvas.getContext('webgl2'),
            antialias: true,
            alpha: true
        });

        var nzy = new createNoise3D
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer.setSize($canvas.width(), $canvas.height());
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    let scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, $canvas.width() / $canvas.height(), 0.1, 1000);

    camera.position.z = 5;

    let geometry = new THREE.SphereGeometry(0.8, 128, 128);

    let material = new THREE.MeshPhongMaterial({
        color: 0xE4ECFA,
        shininess: 100
    });

    let lightTop = new THREE.DirectionalLight(0xFFFFFF, .7);
    lightTop.position.set(0, 500, 200);
    lightTop.castShadow = true;
    scene.add(lightTop);

    let lightBottom = new THREE.DirectionalLight(0xFFFFFF, .25);
    lightBottom.position.set(0, -500, 400);
    lightBottom.castShadow = true;
    scene.add(lightBottom);

    let ambientLight = new THREE.AmbientLight(0x798296);
    scene.add(ambientLight);

    let sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const SPEED = 2;
    const SPIKES = .2;
    const PROCESSING = 2;

    let positionAttribute = sphere.geometry.attributes.position;
    //let simplex = new SimplexNoise(); // Make sure SimplexNoise is available

    let update = () => {

        let time = performance.now() * 0.00001 * SPEED * Math.pow(PROCESSING, 3),
            spikes = SPIKES * PROCESSING;

        for (let i = 0; i < positionAttribute.count; i++) {
            let x = positionAttribute.getX(i);
            let y = positionAttribute.getY(i);
            let z = positionAttribute.getZ(i);
            let p = new THREE.Vector3(x, y, z);
            p.normalize().multiplyScalar(1 + 0.3 * nzy(p.x * spikes, p.y * spikes, p.z * spikes + time));
            positionAttribute.setXYZ(i, p.x, p.y, p.z);
        }

        positionAttribute.needsUpdate = true; // Notify Three.js that the attribute data has changed
        sphere.geometry.computeVertexNormals();
    };

    function animate() {
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

});
