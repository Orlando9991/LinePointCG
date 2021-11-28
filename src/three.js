import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'https://unpkg.com/three@0.124.0/examples/jsm/libs/dat.gui.module'
import {lineMP}	from '../../lineMP.mjs'

var renderer, scene, controls;
const raycaster = new THREE.Raycaster();
const posicaoRato_2d = new THREE.Vector2();

var Pontos_Amarelos=[];
var pixel_inicial,pixel_final;
var bufferMaterial_pixel_inicial,bufferMaterial_pixel_final;
var contador=0;

//Camera
var camera;
const fov = 75; 										  // fov - field of view. 75 graus em dimensão vertical. Angulo de visão em V
const aspect =  window.innerWidth / window.innerHeight;   // Tamanho da janela
const near = 1;											  // Tudo o que vai ser apresentado perto
const far = 1000; 										  // Tudo o que vai ser apresentado longe
			

init();
CriarPadrao();
animate();


function init() {
			  
// renderer
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(1,1,0.9));					//Adicionar Cor de fundo
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
	  
// scene
scene = new THREE.Scene();
	  
// camera
camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set(0, 0, 14);
	  
// controls
controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

Opcoes();
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

	//21x21
	var x=-10;			// x inicial.
	var y=-10;			// y inicial.
	var x_f=11;			// x final.
	var y_f=11;			// y final.

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
			pixel.name="Pixel";

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

	posicaoRato_2d.x =   (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
	posicaoRato_2d.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
	render();
}

function render() {

	// posição tendo em conta a camera e posição do rato
	raycaster.setFromCamera( posicaoRato_2d, camera );

	//Obter os objectos intersetado
	var intersectados = raycaster.intersectObjects(scene.children);


	for (var i = 0; i < intersectados.length; i++) {
	   let obj = intersectados[i];               
        if(obj.object.name === "Pixel"){
			console.log("x:",obj.object.position.x,"  y:",obj.object.position.y)
			if(contador<2)
				contador==0?pixel_inicial=obj: pixel_final=obj;
		}   
	}
	renderer.render( scene, camera );
}

window.addEventListener( 'mousemove', onMouseMove, false );


function recentrar() {
	controls.reset();
}

function limpar_pixels(){
	contador=0;
	if(pixel_inicial)
	pixel_inicial.object.material=bufferMaterial_pixel_inicial;
	pixel_final.object.material=bufferMaterial_pixel_final;
	
	var Pixel_rem,Linha_rem;

	do{
		Pixel_rem=scene.getObjectByName("Pixel_Amarelo");
		Linha_rem=scene.getObjectByName("Linha");
		scene.remove(Pixel_rem);
		scene.remove(Linha_rem);

	}while(Pixel_rem || Linha_rem)
	//scene.remove(scene.getObjectByName("Pixel_Amarelo"));
	//scene.remove(scene.getObjectByName("Linha");
}

window.addEventListener("keydown", Tecla_Pressionada, false);

function Tecla_Pressionada (event) {
    var TeclaCod = event.which;
	//tecla x
    if (TeclaCod == 88 && contador<2) {
		if(contador==0){
			bufferMaterial_pixel_inicial=pixel_inicial.object.material;	//Guardar material original
			var NovoMaterial=bufferMaterial_pixel_inicial.clone();		//criar um novo material
			NovoMaterial.color.setHex( 0xff0000 );						//mudar a cor do pixel
			pixel_inicial.object.material=NovoMaterial;					//Associar o novo material ao objecto
			contador++;
		}
		else if(contador==1){
			bufferMaterial_pixel_final=pixel_final.object.material;		//Guardar material original
			var NovoMaterial=bufferMaterial_pixel_final.clone();		//criar um novo material
			NovoMaterial.color.setHex( 0xff0000 );						//mudar a cor do pixel
			pixel_final.object.material=NovoMaterial;					//Associar o novo material ao objecto
			
			Criar_Reta(pixel_inicial.object.position.x,				//Criar Linha
						pixel_inicial.object.position.y,
						pixel_final.object.position.x,
						pixel_final.object.position.y,
						)															
			contador=0;
		}
	} 
	//tecla backspace
	else if (TeclaCod == 8) {
		limpar_pixels();
	}
        
};

function Criar_Reta(pi_x,pi_y,pf_x,pf_y){
	var P1={x:pi_x , y: pi_y};
	var P2={x:pf_x , y: pf_y};

	var pontos=lineMP(P1,P2);

	const material = new THREE.MeshBasicMaterial( 
		{color: 0xDDEE00, 
		 side: THREE.DoubleSide,
		 opacity:0.4,
		 transparent:true
		});

	CriarLinha(pi_x,pf_x,pi_y,pf_y);	

	for(var p in pontos){
		//Pixel com dimensão x=1, y=1
		const geometria_pixel = new THREE.PlaneGeometry( 1, 1 );
		//Cria o pixel atribuindo o material e posição. 
		const pixel = new THREE.Mesh( geometria_pixel, material);
		pixel.position.set(pontos[p].x,pontos[p].y,1/4);
		pixel.name="Pixel_Amarelo";
		scene.add(pixel);
	}	
}

function CriarLinha(x_inicial, x_final, y_inicial, y_final){

	//Caracteristicas da linha a ser representada
	const material_linha = new THREE.LineBasicMaterial({color: 0x990000});						//cor e caracteristicas visuais
	var pontos = [];
	
	pontos.push( new THREE.Vector3( x_inicial, y_inicial, 0 ) );								//array com as cordenadas de inicio e fim
	pontos.push( new THREE.Vector3( x_final, y_final, 0 ) );									//da linha a ser apresentada

	var geometria_linha = new THREE.BufferGeometry().setFromPoints( pontos )					//geometria da linha definida por pontos

	var linha = new THREE.Line( geometria_linha, material_linha );
	linha.name="Linha";

	scene.add(linha);
}


function Opcoes(){
	
	var gui = new GUI ({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_estilo.appendChild(gui.domElement);	

	//Criar "botão" para centralizar o plano
	var parametros = {
		Centrar: recentrar,
		Limpar: limpar_pixels
	};
	
	var folder = gui.addFolder('Opções');
	
	gui.add(parametros, 'Centrar');
	gui.add(parametros, 'Limpar')
	gui.open();
}



//Redimensionar janela
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

//Redimensionar EventListener
window.addEventListener('resize', onWindowResize, false)

