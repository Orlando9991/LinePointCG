import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js'


var renderer, scene, controls;

const raycaster = new THREE.Raycaster();
const posicaoRato_2d = new THREE.Vector2();
import {lineMP}	from '../../lineMP.mjs'
let P = {x: 0, y: 0}; let Q = {x: 3, y: 1};
			let R= lineMP(P,Q);
			console.log(R); // imprime [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 1}, {x: 3, y: 1}
			//Coloca uma mensagem na pagina
			prompt(R);

//Camera
var camera;
const fov = 40; 										  // fov - field of view. 75 graus em dimensão vertical. Angulo de visão em V
const aspect =  window.outerWidth / window.outerHeight;   // Tamanho da janela
const near = 1;											  // Tudo o que vai ser apresentado perto
const far = 10000; 										  // Tudo o que vai ser apresentado longe
			

init();
CriarPadrao();
animate();


function init() {
			  
// renderer
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.outerWidth, window.outerHeight);
renderer.setClearColor(new THREE.Color(1,1,0.9));					//Adicionar Cor de fundo
//renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
	  
// scene
scene = new THREE.Scene();
	  
// camera
camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set(0, 0, 10);
	  
// controls
controls = new OrbitControls(camera, renderer.domElement);
}
	  
function animate() {
	requestAnimationFrame(animate);
	//controls.update();
	renderer.render(scene, camera);
}

function CriarPadrao(){
				
	// ambient
	scene.add(new THREE.AmbientLight(0x222222));

	  // light
	  var light = new THREE.DirectionalLight(0xffffff, 1);
	  light.position.set(5, 5, 0);
	  scene.add(light);

	  //Criar Display Raster;
	  DisplayRaster();
	  
	  // eixos
	  eixos();
}

//Criar um display raster
function DisplayRaster(){

	//20 quadrados em ambas as direções
	var x=-20;			// x inicial.
	var y=-20;			// y inicial.
	var x_f=20;			// x final.
	var y_f=20;			// y final.

	//Vão existir dois tipos de materiais, de forma a poder existir duas cores diferentes.
	const material1 = new THREE.MeshBasicMaterial( 
		{color: 0xdb4035, 
		 side: THREE.DoubleSide,
		 opacity:0.75,
		 transparent:true
		});

	const material2 = new THREE.MeshBasicMaterial( 
		{color: 0x158fad,
		 side: THREE.DoubleSide,
		 opacity:0.75,
		 transparent:true
		});

	//Pixel com dimensão x=1, y=1
	const geometria_pixel = new THREE.PlaneGeometry( 1, 1 );

	for (let y_aux=y,mat=material1; y_aux < y_f; y_aux++) {
		//Numero par ou impar influencia no material a atribuir.
		if(Math.abs(y_aux)%2>0)
			mat=material2;
		else
			mat=material1;

		for (let x_aux=x; x_aux < x_f; x_aux++) {

			//Cria o pixel atribuindo o material e posição. 
			const pixel = new THREE.Mesh( geometria_pixel, mat);
			pixel.position.set(x_aux,y_aux,0);
			scene.add(pixel);

			//alternando em no eixo X o material de forma a obter um xadrez.
			if(mat==material1)
				mat=material2;
			else
				mat=material1;	
		}
	  }
}


function eixos(){
	
	const material_eixo_X = new THREE.LineBasicMaterial({color: 0x12106b});
	const material_eixo_Y = new THREE.LineBasicMaterial({color: 0x782517});
	
	const pontosX = [];
	pontosX.push( new THREE.Vector3( 0, 0, 0 ) );
	pontosX.push( new THREE.Vector3( 20, 0, 0 ) );

	const pontosY = [];
	pontosY.push( new THREE.Vector3( 0, 0, 0 ) );
	pontosY.push( new THREE.Vector3( 0, 20, 0 ) );
	
	const geometria_X = new THREE.BufferGeometry().setFromPoints( pontosX );
	const geometria_Y = new THREE.BufferGeometry().setFromPoints( pontosY );
	
	const eixo_X = new THREE.Line( geometria_X, material_eixo_X );
	const eixo_Y = new THREE.Line( geometria_Y, material_eixo_Y );
	
	scene.add( eixo_X );
	scene.add( eixo_Y );

}


function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	posicaoRato_2d.x = ( event.clientX / 6 ) * 2 - 1;
	posicaoRato_2d.y = - ( event.clientY / 3 ) * 2 + 1;
	console.log(posicaoRato_2d.x);
	console.log(posicaoRato_2d.y);

}

function render() {

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( posicaoRato_2d, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );

	}

	renderer.render( scene, camera );

}

window.addEventListener( 'mousemove', onMouseMove, false );

window.requestAnimationFrame(render);
