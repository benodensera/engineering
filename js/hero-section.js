// imports

import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";

// hero section

// gsap
gsap.registerPlugin();

// canvas
const canvas = document.getElementById("bannerCanvas");

// scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffffff);

// camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 0, 25);

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.outputEncoding = THREE.sRGBEncoding;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

// lights
const ambient = new THREE.AmbientLight(0xffffff, 2.8);

scene.add(ambient);

// directional
const directional = new THREE.DirectionalLight(0xffffff, 2.5);

directional.position.set(5, 8, 12);

scene.add(directional);

// blue fill
const blueFill = new THREE.PointLight(0xbfd4ff, 0.6, 30);

blueFill.position.set(-10, 4, -8);

scene.add(blueFill);

// top light
const topLight = new THREE.PointLight(0xffffff, 1.5, 30);

topLight.position.set(0, 12, 0);

scene.add(topLight);

// loader
const loader = new GLTFLoader();

// model
let model;

// final rotation
let baseRotationY = 0.1;

// intro rotation
const introStartRotation = 0.9;
const introTargetRotation = 0.1;

// cursor

// let targetRotX = 0; // vertical mouse motion
let targetRotY = 0;

// enable motion after intro
let introFinished = false;

// load model
loader.load(
    "./models/building.glb",

    (gltf) => {
        model = gltf.scene;

        // scale
        model.scale.set(1, 1, 1);

        // initial rotation
        model.rotation.y = introStartRotation;

        // material settings
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    child.material.metalness = 0.15;

                    child.material.roughness = 0.75;
                }
            }
        });

        // add to scene
        scene.add(model);

        // auto center
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.x -= center.x;

        model.position.y -= center.y;

        model.position.z -= center.z;

        // lower model
        model.position.y -= 1;

        /* auto camera fit */
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        camera.position.z = -350;
        camera.lookAt(0, 0, 0);

        // start loop
        animate();
    },

    undefined,

    (error) => {
        console.error("Error loading GLB:", error);
    },
);

// mouse control
window.addEventListener("mousemove", (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;

    const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    // rotation targets
    targetRotY = mouseX * 0.35;
    // targetRotX = mouseY * 0.15; // vertical mouse motion
});

// animation loop
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        /* only after intro */
        if (introFinished) {
            // very slow auto rotation
            baseRotationY += 0.00015;

            // follow mouse */
            model.rotation.y += (baseRotationY + targetRotY - model.rotation.y) * 0.025;

            // model.rotation.x += (targetRotX - model.rotation.x) * 0.025; // vertical mouse motion
        }
    }

    renderer.render(scene, camera);
}

// resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// loader animation
window.addEventListener(
    "load",

    () => {
        const tl = gsap.timeline();

        // loading line
        tl.to(".loader-line", {
            width: "100%",

            duration: 1.8,

            ease: "power2.inOut",
        });

        // title exit
        tl.to(".loader-logo", {
            y: -120,

            opacity: 0,

            duration: 1,

            ease: "power4.inOut",
        });

        // line collapse
        tl.to(
            ".loader-line-wrap",
            {
                scaleX: 0,

                transformOrigin: "right center",

                duration: 0.8,

                ease: "power4.inOut",
            },
            "<",
        );

        // smooth dissolve
        tl.call(() => {
            const loaderScreen = document.querySelector(".loader-screen");

            loaderScreen.classList.add("is-hidden");

            setTimeout(() => {
                loaderScreen.remove();
            }, 1600);
        });

        // reveal content
        tl.call(() => {
            revealAfterLoader();
        });

        // start model intro
        tl.call(
            () => {
                const waitForModel = setInterval(() => {
                    if (model) {
                        clearInterval(waitForModel);

                        model.rotation.y = introStartRotation;

                        gsap.to(
                            model.rotation,

                            {
                                y: introTargetRotation,

                                duration: 2.8,

                                ease: "power3.inOut",

                                onUpdate: () => {
                                    baseRotationY = model.rotation.y;
                                },

                                onComplete: () => {
                                    introFinished = true;

                                    baseRotationY = introTargetRotation;
                                },
                            },
                        );
                    }
                }, 16);
            },
            null,
            "-=0.9",
        );
    },
);

// hero marquee

const marqueeTrack = document.querySelector(".marquee-track");

if (marqueeTrack) {
    gsap.to(marqueeTrack, {
        xPercent: -50,

        duration: 28,

        repeat: -1,

        ease: "none",
    });
}
