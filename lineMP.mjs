
export function lineMP(ponto_i,ponto_f){
	
	var pontos_linha=[];
	var distancia_absoluta_X = Math.abs(ponto_f.x-ponto_i.x);
	var distancia_absoluta_Y = Math.abs(ponto_f.y-ponto_i.y);
	var distancia_d = 2 * distancia_absoluta_Y - distancia_absoluta_X;

	var incremento_baixo = 2 * distancia_absoluta_Y;
	var incremento_cima = 2 * (distancia_absoluta_Y - distancia_absoluta_X);
	
	var x=ponto_i.x;
	var y=ponto_i.y;

	pontos_linha.push({
        x: x,
        y: y
    });

	while (x < ponto_f.x){
		if(distancia_d<=0){
			distancia_d += incremento_baixo;
			x++;
		}
		else
		{
			distancia_d += incremento_cima;
			x++;
			y++;
		}
		pontos_linha.push({
			x: x,
			y: y
		});
	}
	return pontos_linha;
}



function DesenhoLinhaPontoMedio(x_inicial, x_final, y_inicial, y_final){

	var distancia_absoluta_X = Math.abs(x_final-x_inicial);
	var distancia_absoluta_Y = Math.abs(y_final-y_inicial);
	
	var distancia_d = 2 * distancia_absoluta_Y - distancia_absoluta_X;
	var distancia_dy = 2 * distancia_absoluta_X - distancia_absoluta_Y;

	var incremento_baixo = 2 * distancia_absoluta_Y;
	var incremento_cima = 2 * (distancia_absoluta_Y - distancia_absoluta_X);
	var incremento_direita = 2 * distancia_absoluta_X;
	var incremento_esquerda = 2 * (distancia_absoluta_X - distancia_absoluta_Y);

	var x=x_inicial;
	var y=y_inicial;

	//se for para a esquerda troca-se x inicial por x final
	
	scene.add(CriarQuadrado(x,y));
	if(distancia_absoluta_Y<=distancia_absoluta_X){
		if(x_final>=x_inicial){
			while (x < x_final){
				if(distancia_d<=0)
					distancia_d += incremento_baixo;
				else
				{
					distancia_d += incremento_cima;
					y_final>y_inicial?y++:y--;	
				}
				x++;
				quadrante(x_inicial,x_final,y_inicial,y_final,x,y)
			}
		}
		else{
			while (x > x_final){
				if(distancia_d<=0)
					distancia_d += incremento_baixo;
				else
				{
					distancia_d += incremento_cima;
					y_final>y_inicial?y++:y--;
				}
				x--;
				quadrante(x_inicial,x_final,y_inicial,y_final,x,y)
			}
		}
	}
	else{
		if(y_final>y_inicial){
			while (y < y_final){
				if(distancia_dy<=0) 
					distancia_dy += incremento_direita;
				else
				{
					distancia_dy += incremento_esquerda;
					x_final>=x_inicial?x++:x--;	
				}
				y++;
				quadrante(x_inicial,x_final,y_inicial,y_final,x,y);
			}
		}
		else{
			while (y > y_final){
				if(distancia_dy<=0) 
					distancia_dy += incremento_direita;
				else
				{
					distancia_dy += incremento_esquerda;
					x_final>=x_inicial?x++:x--;	
				}
				y--;
				quadrante(x_inicial,x_final,y_inicial,y_final,x,y);
			}
		}
	}
}

function quadrante(xi,xf,yi,yf,x,y){
	if(xi<=xf){
		if(yf>=yi)
			scene.add(CriarQuadrado(x,y)); //N , NE E correto para todas as inclinações
		else
			scene.add(CriarQuadrado(x,y-1));	//S, SE 
	}
	if(xi>xf){
		if(yf>=yi)
			scene.add(CriarQuadrado(x-1,y)); //NO, O  correto para todas as inclinações
		else
			scene.add(CriarQuadrado(x-1,y-1));	//SO
	}
}






function DesenhoLinhaPontoMedio(x_inicial, x_final, y_inicial, y_final){

	var distancia_absoluta_X = Math.abs(x_final-x_inicial);
	var distancia_absoluta_Y = Math.abs(y_final-y_inicial);
	
	var distancia_d = 2 * distancia_absoluta_Y - distancia_absoluta_X;
	var distancia_dy = 2 * distancia_absoluta_X - distancia_absoluta_Y;

	var incremento_baixo = 2 * distancia_absoluta_Y;
	var incremento_cima = 2 * (distancia_absoluta_Y - distancia_absoluta_X);
	var incremento_direita = 2 * distancia_absoluta_X;
	var incremento_esquerda = 2 * (distancia_absoluta_X - distancia_absoluta_Y);

	var incremento_baixo_OU_direita;
	var incremento_cima_OU_esquerda;

	if(distancia_absoluta_Y<=distancia_absoluta_X){
		incremento_baixo_OU_direita=incremento_baixo;
		incremento_cima_OU_esquerda=incremento_cima;
	}
	else{
		incremento_baixo_OU_direita=incremento_direita;
		incremento_cima_OU_esquerda=incremento_esquerda;
	}

	var inc1;
	var inc2;

	if(x_final>=x_inicial){
		x++;
	}
	else{
		x--;
	}

	if(y_final>y_inicial){

	}
	else{

	}

	var x=x_inicial;
	var y=y_inicial;
	for(xxxxxx)

	//se for para a esquerda troca-se x inicial por x final
	
	scene.add(CriarQuadrado(x,y));
	if(distancia_absoluta_Y<=distancia_absoluta_X){
		if(x_final>=x_inicial){
			while (x < x_final){
				if(distancia_d<=0)
					distancia_d += incremento_baixo;
				else
				{
					distancia_d += incremento_cima;
					y_final>y_inicial?y++:y--;	
				}
				x++;
				quadrante(x_inicial,x_final,y_inicial,y_final,x,y)
			}
		}
		else{
			while (x > x_final){
				if(distancia_d<=0)
					distancia_d += incremento_baixo;
				else
				{
					distancia_d += incremento_cima;
					y_final>y_inicial?y++:y--;
				}
				x--;
				quadrante(x_inicial,x_final,y_inicial,y_final,x,y)
			}
		}
	}
	else{
		if(y_final>y_inicial){
			while (y < y_final){
				if(distancia_dy<=0) 
					distancia_dy += incremento_direita;
				else
				{
					distancia_dy += incremento_esquerda;
					x_final>=x_inicial?x++:x--;	
				}
				y++;
				quadrante(x_inicial,x_final,y_inicial,y_final,x,y);
			}
		}
		else{
			while (y > y_final){
				if(distancia_dy<=0) 
					distancia_dy += incremento_direita;
				else
				{
					distancia_dy += incremento_esquerda;
					x_final>=x_inicial?x++:x--;	
				}
				y--;
				quadrante(x_inicial,x_final,y_inicial,y_final,x,y);
			}
		}
	}
}

function quadrante(xi,xf,yi,yf,x,y){
	if(xi<=xf){
		if(yf>=yi)
			scene.add(CriarQuadrado(x,y)); //N , NE E correto para todas as inclinações
		else
			scene.add(CriarQuadrado(x,y-1));	//S, SE 
	}
	if(xi>xf){
		if(yf>=yi)
			scene.add(CriarQuadrado(x-1,y)); //NO, O  correto para todas as inclinações
		else
			scene.add(CriarQuadrado(x-1,y-1));	//SO
	}
}
