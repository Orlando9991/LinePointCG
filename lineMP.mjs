export function lineMP(ponto_i,ponto_f){

	var pontos_linha=[];
	var distancia_absoluta_X = Math.abs(ponto_f.x-ponto_i.x);		//Distancia absoluta X
	var distancia_absoluta_Y = Math.abs(ponto_f.y-ponto_i.y);		//Distancia absoluta Y
	
	var distancia_dx  = 2 * distancia_absoluta_Y - distancia_absoluta_X;	//Calcula a distancia do proximo ponto cima/baixo
	var distancia_dy = 2 * distancia_absoluta_X - distancia_absoluta_Y;		//Calcula a distancia do proximo ponto esquerda/direita
	
	var incremento_baixo    = 2 * distancia_absoluta_Y;								//Ponto mais a Sul
	var incremento_cima     = 2 * (distancia_absoluta_Y - distancia_absoluta_X);	//Ponto mais a Norte
	var incremento_direita  = 2 * distancia_absoluta_X;								//Ponto mais á direita
	var incremento_esquerda = 2 * (distancia_absoluta_X - distancia_absoluta_Y);	//Ponto mais á esquerda
	
	//Variaveis auxiliares para substituição
	var incremento_baixo_OU_direita;												
	var incremento_cima_OU_esquerda;
	var var1,var2,distancia_pontos,inicial,final,inicial2,final2,distancia_d_aux;
	
	//Substituição de variaveis tendo em conta a inclinação da reta
	if(distancia_absoluta_Y <= distancia_absoluta_X){
		incremento_baixo_OU_direita = incremento_baixo
		incremento_cima_OU_esquerda = incremento_cima
		var1 = inicial  = ponto_i.y
		var2 = inicial2 = ponto_i.x
		distancia_pontos = distancia_absoluta_X
		distancia_d_aux = distancia_dx
		final = ponto_f.y
		final2 = ponto_f.x 
	}
	else{
		incremento_baixo_OU_direita = incremento_direita
		incremento_cima_OU_esquerda = incremento_esquerda
		var1 = inicial  = ponto_i.x
		var2 = inicial2 = ponto_i.y
		distancia_pontos = distancia_absoluta_Y
		distancia_d_aux = distancia_dy
		final = ponto_f.x
		final2 = ponto_f.y
	}
	
	//Ponto inicial
	pontos_linha.push({
        x: ponto_i.x,
        y: ponto_i.y
    });
	
	//determinação de pontos
	for (var i=0 ; i<distancia_pontos;i++){
		if(distancia_d_aux<=0)
			distancia_d_aux += incremento_baixo_OU_direita;
		else
		{
			distancia_d_aux += incremento_cima_OU_esquerda;
			final>=inicial? var1++:var1--;	
		}
		final2>=inicial2? var2++:var2--;
			
		if(distancia_absoluta_Y <= distancia_absoluta_X)
			pontos_linha.push({x: var2, y: var1});
		else
			pontos_linha.push({x: var1, y: var2});
	}
	return pontos_linha;
}