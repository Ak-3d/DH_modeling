//AK_ROBO
const mainDom = document.querySelector('.main');
const rect = mainDom.getBoundingClientRect();
const debugDom = document.querySelector('#txt')
const GUI = g;

const toRadian = Math.PI / 180;
//init renderer
const renderer = new THREE.WebGLRenderer();
mainDom.appendChild( renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x222222);

//init camera
const camera = new THREE.PerspectiveCamera( 75, rect.width / rect.height, 0.1, 1000 );
camera.position.set(-5,2,10);
camera.lookAt(0,0,0);

//init display controlers
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

//init scene
const scene = new THREE.Scene();
const gui = new GUI();

scene.add(lineControl.line);

const planeGeo = new THREE.PlaneGeometry(10,10,5,5);
const planeMat = new THREE.MeshBasicMaterial({color: 0x888888, side:THREE.DoubleSide, transparent:true, opacity:0.3});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.set(-Math.PI * 0.5, 0, 0);
plane.position.y = -0.05;
scene.add(plane);

// function createSolidLink(ref, w, h, d){
//     const geometry = new THREE.BoxGeometry( w, h, d );
//     const material = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
//     const cube = new THREE.Mesh( geometry, material );

//     ref.add(cube);
//     return cube;
// }
// cube = createSolidLink(scene, 2, 1, 1);
// cube.position.z = -4;
// cube.position.y = 0.5;
// cube.rotation.y = 60*toRadian;

// const dirLight = new THREE.DirectionalLight(0xffffff, 1);
// dirLight.position.set(5,5,5);
// dirLight.lookAt(0,0,0);
// const ambLight = new THREE.AmbientLight(0xffffff,0.5);
// scene.add(dirLight);
// scene.add(ambLight);

const objs = [];
const axs = [];
const axesSize = 1;
axs.push(new THREE.AxesHelper(axesSize));

scene.add(axs[0]);

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.domElement.style.width = `${width}px`;
        renderer.domElement.style.height = `${height}px`;
        renderer.setSize(width, height, false);
    }
    return needResize;
  }

function draw(time) {
    if (resizeRendererToDisplaySize(renderer)) {        
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }  
    controls.update();
    lineControl.update(axs);
    renderer.render( scene, camera );

    requestAnimationFrame( draw );
};
requestAnimationFrame(draw);
function deb(){
    const pos = camera.position;

    debugDom.innerHTML = `x:${pos.x} <br> y:${pos.y} <br> z:${pos.z}`;
}

const contentCtrl = document.querySelector('.content');
const hideBtn = document.querySelector('#hide');
hideBtn.onclick = () => {
    if(hideBtn.textContent === 'Show'){
        contentCtrl.style.display = 'flex';
        hideBtn.textContent = 'Hide';
        return;
    }
    contentCtrl.style.display = 'none';
    hideBtn.textContent = 'Show';
}
const rows = [];

const createButton = document.querySelector('#create');

function updateLinks(){
    rows.forEach((row, i)=>{
        let alpha = parseFloat(row.childNodes[1].value);
        alpha = alpha?alpha:0;

        let a = parseFloat(row.childNodes[2].value);
        a = a?a:0;

        let d = parseFloat(row.childNodes[3].value);
        d = d?d:0;

        let theta = parseFloat(row.childNodes[4].value);
        theta = theta?theta:0;

        objs[i].rotation.x = alpha * toRadian;
        objs[i].position.x = a;
        axs[i+1].position.z = d;
        axs[i+1].rotation.z= theta* toRadian;

        // console.log(axs[i+1]);
    });
}

function createLink(){
    const row = document.createElement('div');
    rows.push(row);

    row.className = 'row';
    const inputs = 
    "<input type=number class='data num' value='"+rows.length+"' disabled>"+
    "<input type=number class='data alpha' placeholder=alpha>"+
    "<input type=number class='data a' placeholder=a>"+
    "<input type=number class='data d' placeholder=d>"+
    "<input type=number class='data theta' placeholder=theta>";

    row.innerHTML = inputs;
    createButton.parentElement.insertBefore(row, createButton);
    
    const axis = new THREE.AxesHelper(axesSize);
    axs.push(axis);

    const obj = new THREE.Object3D();
    objs.push(obj);
    obj.add(axis);

    axs[axs.length-2].add(obj);
    const i = axs.length - 1;
    const f = gui.addFolder(`${axs.length-1}`);

    const cont = {
        rotateZ:0,
        positionZ:0
    };
    f.add(axis.position, 'z', -5, 5).name('d').listen();
    f.add(cont, 'rotateZ', -180, 180).name('theta').listen().onChange((value)=>{
        axis.rotation.z = value * toRadian;
    });
    
    row.childNodes.forEach((txtBox, i) =>{
        txtBox.addEventListener('focusout', ()=>{
            updateLinks();
        });
    });
}
createButton.onclick = createLink;

function removeLink(){
    if(axs.length == 1)return;

    //too lazy 😑
    const row = rows.pop();
    row.remove();

    axis = axs.pop();
    a2 = axs.pop();

    obj = objs.pop();
    obj.remove(axis);

    a2.remove(obj);
    axs.push(a2);

    f = gui.folders.pop();
    gui.folders.push(f);
    f.destroy();
}
document.querySelector('#remove').onclick = removeLink;