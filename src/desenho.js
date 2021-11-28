import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'https://unpkg.com/three@0.124.0/examples/jsm/libs/dat.gui.module'
import {lineMP}	from '../../lineMP.mjs'

var renderer, scene, controls;
const raycaster = new THREE.Raycaster();
const posicaoRato_2d = new THREE.Vector2();

var posicao_anterior_x,posicao_anterior_y;
var pixel_inicial,pixel_final;
var contador=0;
var fora_do_plano;

//Camera
var camera;
const fov = 75; 										  // fov - field of view. 75 graus em dimensão vertical. Angulo de visão em V
const aspect =  window.innerWidth / window.innerHeight;   // Tamanho da janela
const near = 1;											  // Tudo o que vai ser apresentado perto
const far = 1000; 										  // Tudo o que vai ser apresentado longe
			
init();
CriarPadrao();
animate();

//#################   Iniciar Three   ####################

function init() {		  
// render
renderer = new THREE.WebGLRenderer();								
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(1,1,0.7));
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
	  
// cena
scene = new THREE.Scene();
	  
// camera
camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set(0, 0, 14);
	  
// controlos
controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

// janela GUI
Opcoes();
}
	  
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

//#################   Plano / Eixos   ####################

function CriarPadrao(){
				
	// Ambiente
	scene.add(new THREE.AmbientLight(0x222222));

	// luz
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 0, 10);
	scene.add(light);

	//Criar Display Raster;
	DisplayRaster();
	  
	// Eixos
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
		 opacity:0.85,
		 transparent:true
		});

	const material2 = new THREE.MeshBasicMaterial( 
		{color: 0x158fad,
		 side: THREE.DoubleSide,
		 opacity:0.85,
		 transparent:true
		});

	//Pixel com dimensão x=1, y=1
	const geometria_pixel = new THREE.PlaneGeometry( 1, 1 );

	for (let y_aux=y,mat=material1; y_aux < y_f; y_aux++) {
		
		//Numero par ou impar influencia no material a atribuir.
		if(Math.abs(y_aux)%2>0) mat=material2;
		else mat=material1;

		for (let x_aux=x; x_aux < x_f; x_aux++) {

			//Cria o pixel atribuindo o material e posição. 
			const pixel = new THREE.Mesh( geometria_pixel, mat);
			pixel.position.set(x_aux,y_aux,0);
			pixel.name="Pixel";
			scene.add(pixel);

			//alternando o material no eixo X de forma a obter um xadrez.
			if(mat==material1) mat=material2;
			else mat=material1;	
		}
	  }
}

function eixos(){
	
	const material_eixo_X = new THREE.LineBasicMaterial({color: 0x0000FF});		//cor e caracteristicas visuais (azul)
	const material_eixo_Y = new THREE.LineBasicMaterial({color: 0xFF0000});		//cor e caracteristicas visuais	(vermelho)
	
	const pontosX = [];															
	pontosX.push( new THREE.Vector3( 0, 0, 0 ) );								//pontos em X
	pontosX.push( new THREE.Vector3( 10+(1/2), 0, 0 ) );

	const pontosY = [];
	pontosY.push( new THREE.Vector3( 0, 0, 0 ) );								//pontos em Y
	pontosY.push( new THREE.Vector3( 0, 10+(1/2), 0 ) );
	
	const geometria_X = new THREE.BufferGeometry().setFromPoints( pontosX );	//Criar geometria
	const geometria_Y = new THREE.BufferGeometry().setFromPoints( pontosY );	//tendo em conta os pontos anteriores
	
	const eixo_X = new THREE.Line( geometria_X, material_eixo_X );				//Criar linhas
	const eixo_Y = new THREE.Line( geometria_Y, material_eixo_Y );
	
	scene.add( eixo_X );														//Adicionar á cena
	scene.add( eixo_Y );
}

//#################   Desenho e Limpeza   ####################

window.addEventListener( 'mousemove', Movimento_Rato, false );

function Movimento_Rato( event ) {

	posicaoRato_2d.x =   (event.clientX / renderer.domElement.clientWidth) * 2 - 1;			//Calcular a posição atual do rato
	posicaoRato_2d.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;			//guardando em variaveis globais						
	RaioIntersecao();		//Detetar se existem objectos na posição atual do rato
}

function RaioIntersecao() {

	raycaster.setFromCamera( posicaoRato_2d, camera );		// posição tendo em conta a camera e posição do rato

	var intersectados = raycaster.intersectObjects(scene.children);		//Obter os objectos intersetados

	if(intersectados.length==0) fora_do_plano=true;			//O rato está fora do plano	
	else{
		for (var i = 0; i < intersectados.length; i++) {
		let obj = intersectados[i];               
			if(obj.object.name == "Pixel"){
				fora_do_plano=false;
				if(posicao_anterior_x!=obj.object.position.x || posicao_anterior_y!=obj.object.position.y){			// log da posição atual
					console.log("x:",obj.object.position.x,"  y:",obj.object.position.y)							// que só faz refresh se
					posicao_anterior_x=obj.object.position.x;														// a nova posição for diferente
					posicao_anterior_y=obj.object.position.y;														// da anterior
				}
				if(contador<2)
					contador==0?pixel_inicial=obj: pixel_final=obj;		//Guarda o objecto intersetado para utilizar depois
			}							   
		}
	}
}

function recentrar() {
	controls.reset();		//restaurar posição da camera
}

function limpar_pixels(){
	contador=0;

	var Pixel_rem,Pixel_Amarelo_rem,Linha_rem;
	do{
		Pixel_rem=scene.getObjectByName("Pixel");						//Verifica se os objetos correspondem ao nome
		Pixel_Amarelo_rem=scene.getObjectByName("Pixel_Amarelo");		//de forma a eliminar apenas os objetos
		Linha_rem=scene.getObjectByName("Linha");						//pretendidos
		if(Pixel_rem!=null) scene.remove(Pixel_rem);
		if(Linha_rem!=null) scene.remove(Linha_rem);
		if(Pixel_Amarelo_rem!=null) scene.remove(Pixel_Amarelo_rem);

	} while(Pixel_rem || Linha_rem)

	DisplayRaster();	//Restaurar Grelha
}

window.addEventListener("keydown", Tecla_Pressionada, false);

function Tecla_Pressionada (event) {
    var TeclaCod = event.which;
	//tecla x
    if (TeclaCod == 88 && contador<2 && !fora_do_plano) {
		if(contador==0){
			var NovoMaterial=pixel_inicial.object.material.clone();		//criar um novo material
			NovoMaterial.color.setHex( 0xff0000 );						//mudar a cor do pixel
			pixel_inicial.object.material=NovoMaterial;					//Associar o novo material ao objecto
			contador++;
		}
		else if(contador==1 && !fora_do_plano){
			var NovoMaterial=pixel_final.object.material.clone();		//criar um novo material
			NovoMaterial.color.setHex( 0xff0000 );						//mudar a cor do pixel
			pixel_final.object.material=NovoMaterial;					//Associar o novo material ao objecto
			
			Criar_Reta(pixel_inicial.object.position.x,					
						pixel_inicial.object.position.y,				//Criar Linha e cubos
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

	CriarLinha(pi_x,pf_x,pi_y,pf_y);		//Criar linha apartir dos pontos	

	for(var p in pontos){
		scene.add(CriarCubo(pontos[p].x,pontos[p].y));	//Criar cubos apartir dos pontos
	}	
}

function CriarCubo(posicao_x,posicao_y){
	
	//Geometria do cubo
	const box_Largura = 1;
	const box_Altura = 1;
	const box_Profundidade = 1/4;
	const geometria_cubo = new THREE.BoxGeometry(box_Largura,box_Altura,box_Profundidade);
	
	//(Material) cor e caracteristicas visuais
	const material_cubo = new THREE.MeshBasicMaterial(
		{color: 0xDDEE00, 
			opacity:0.7,
			transparent:true
		});

	//cria cubo
	const cubo = new THREE.Mesh( geometria_cubo, material_cubo);
	cubo.name="Pixel_Amarelo";
	cubo.position.x=posicao_x;
	cubo.position.y=posicao_y;
	cubo.position.z=box_Profundidade/2;

	return cubo;
}

function CriarLinha(x_inicial, x_final, y_inicial, y_final){

	const material_linha = new THREE.LineBasicMaterial({color: 0x000000});			//cor e caracteristicas visuais
	var pontos = [];
	
	pontos.push( new THREE.Vector3( x_inicial, y_inicial, 0 ) );					//array com as cordenadas de inicio e fim
	pontos.push( new THREE.Vector3( x_final, y_final, 0 ) );						//da linha a ser apresentada

	var geometria_linha = new THREE.BufferGeometry().setFromPoints( pontos )		//geometria da linha definida por pontos

	var linha = new THREE.Line( geometria_linha, material_linha );					//Cria linha
	linha.name="Linha";

	scene.add(linha);																//Adiciona à cena
}

function Opcoes(){
	
	var gui = new GUI ({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_estilo.appendChild(gui.domElement);	

	//Criar "botões" para centralizar o plano ou limpar
	var parametros = {
		Centrar: recentrar,
		Limpar: limpar_pixels
	};
	
	var folder = gui.addFolder('Opções');
	
	gui.add(parametros, 'Centrar');
	gui.add(parametros, 'Limpar')
	gui.open();
}