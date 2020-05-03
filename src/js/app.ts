import * as THREE from 'three';
import * as Stats from 'stats.js';



// * stats init *
let stats: Stats;

if (process.env.NODE_ENV === 'development') {
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
}



// * types *
type TSceneEntities = [ THREE.Scene, THREE.Mesh ];
type TDrawEntities = [ THREE.WebGLRenderer, THREE.Scene, THREE.PerspectiveCamera, THREE.Mesh]; // first three are shouldn't to be moved
type TAnimateEntities = [ THREE.Mesh ];


// * fns used *
const rendererSetup = (): THREE.WebGLRenderer => {
    const root = document.getElementById('root');
    const canvas = document.createElement('canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
    });
    root.appendChild(renderer.domElement);
    renderer.setClearColor(0x444444,1);
    updateRendererSize(renderer); // eslint-disable-line @typescript-eslint/no-use-before-define

    return renderer;
};

const updateRendererSize = (renderer: THREE.WebGLRenderer): void => {
    renderer.setSize(0, 0);
    renderer.setSize(innerWidth, innerHeight);
};

const updateCamera = (camera: THREE.PerspectiveCamera): void => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};

const resize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera): void => {
    updateRendererSize(renderer);
    updateCamera(camera);
};

const setupCamera = (): THREE.PerspectiveCamera => {
    const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 1, 100);
    camera.position.z = 10;
    return camera;
};

const setupSceneEntities = (camera: THREE.PerspectiveCamera): TSceneEntities => {
    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(geometry, material);
    const light = new THREE.HemisphereLight(0xcbcbcb, 0x404040, 1);

    scene.add(cube);
    scene.add(light);
    scene.add(camera);

    return [ scene, cube ];
};

const setupEnvironment = (entities: TDrawEntities): void => {
    const [ renderer, ,camera ] = entities; // eslint-disable-line @typescript-eslint/no-unused-vars

    window.addEventListener('resize', resize.bind(null, renderer, camera));
    // nb: three scene has no active lifecycle (with removing & then creation), so no need in removeEventListener currently here
};

const setup = (): TDrawEntities => {
    const renderer = rendererSetup();

    const camera = setupCamera();
    const [ scene, cube ] = setupSceneEntities(camera);
    renderer.render(scene, camera);

    const entities: TDrawEntities = [ renderer, scene, camera, cube ];
    setupEnvironment(entities);

    return entities;
};

const animate = ([ cube ]: TAnimateEntities): void => {
    cube.rotation.x += .01;
    cube.rotation.y += .01;
};

const draw = ([ renderer, scene, camera, cube ]: TDrawEntities): void => {
    requestAnimationFrame(draw.bind(null, [ renderer, scene, camera, cube ]));

    process.env.NODE_ENV === 'development' && stats.begin();

    animate([ cube ]);
    renderer.render(scene, camera);

    process.env.NODE_ENV === 'development' && stats.end();
};


// * start *
draw(setup());
