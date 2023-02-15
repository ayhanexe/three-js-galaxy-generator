import "./sass/main.scss";

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BufferGeometry,
    PointsMaterial,
    Points,
    BufferAttribute,
    Clock,
    Color
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

// Core Elements Of ThreeJS         
const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer();
const gui = new GUI();

// Configuration
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
camera.position.set(0, 5, 5);
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement);

// 3D Objects
let particleGeometry = null;
let particleMaterial = null;
let particles = null;

// Particles
const options = {
    count: 4000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 1,
    randomnessPower: 3,
    insideColor: 0xd80d62,
    outsideColor: 0x7d00f2
}

gui.add(options, "count", 1, 100_000, 1).setValue(options.count).onFinishChange(generateGalaxy);
gui.add(options, "size", 0.01, 3, 0.01).setValue(options.size).onFinishChange(generateGalaxy);
gui.add(options, "radius", 1, 30, 1).setValue(options.radius).onFinishChange(generateGalaxy);
gui.add(options, "branches", 1, 10, 1).setValue(options.branches).onFinishChange(generateGalaxy);
gui.add(options, "spin", -10, 10, 1).setValue(options.spin).onFinishChange(generateGalaxy);
gui.add(options, "randomness", 0, 2, 0.001).setValue(options.randomness).onFinishChange(generateGalaxy);
gui.add(options, "randomnessPower", 1, 5, 0.01).setValue(options.randomnessPower).onFinishChange(generateGalaxy);

gui.addColor(options, "insideColor").setValue(options.insideColor).onFinishChange(generateGalaxy);
gui.addColor(options, "outsideColor").setValue(options.outsideColor).onFinishChange(generateGalaxy);


function generateGalaxy() {
    // clean old ones
    if (particles) {
        particleGeometry.dispose();
        particleMaterial.dispose();
        scene.remove(particles);
    }

    particleGeometry = new BufferGeometry();

    const particlePositions = new Float32Array(options.count * 3);
    const particleColors = new Float32Array(options.count * 3);

    const colorInside = new Color(options.insideColor);
    const colorOutside = new Color(options.outsideColor);

    for (let i = 0; i < particlePositions.length; i++) {
        const i3 = i * 3;
        const radius = (Math.random() * options.radius);
        const angle = ((i % options.branches) / options.branches) * Math.PI * 2;
        const spinAngle = radius * options.spin;

        const randomX = Math.pow(Math.random() * options.randomness, options.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random() * options.randomness, options.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random() * options.randomness, options.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        particlePositions[i3] = (Math.cos(angle + spinAngle) * radius) + randomX;
        particlePositions[i3 + 1] = randomY;
        particlePositions[i3 + 2] = (Math.sin(angle + spinAngle) * radius) + randomZ;

        const mixedColor = colorInside.clone();

        mixedColor.lerp(colorOutside, radius / options.radius)

        particleColors[i3] = mixedColor.r;
        particleColors[i3 + 1] = mixedColor.g;
        particleColors[i3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute("position", new BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new BufferAttribute(particleColors, 3));

    particleMaterial = new PointsMaterial({
        size: options.size,
        vertexColors: true
    });

    particles = new Points(particleGeometry, particleMaterial);

    scene.add(particles);
}

generateGalaxy();

// Events
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
function render() {
    renderer.render(scene, camera);


    controls.update();

    requestAnimationFrame(render);
}

render();