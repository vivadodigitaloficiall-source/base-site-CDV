// ai.js - abstração de chamadas a endpoints serverless de IA (stubs)

const ENDPOINT_BASE = 'https://example-ai-endpoint.workers.dev'; // substituir no deploy

async function safeFetch(path, payload){
	try {
		// Em produção incluir: Authorization header (NUNCA hardcode no front). Aqui é stub.
		const res = await fetch(ENDPOINT_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
		if(!res.ok) throw new Error('AI endpoint error');
		return await res.json();
	} catch (e){
		return { ok:false, error:e.message, stub:true };
	}
}

export async function recomendarCursos(perfil){
	// stub local: recomenda por nível
	const level = perfil?.claims?.level || 'bronze';
	const mock = {
		bronze:[{id:'c1', titulo:'Fundamentos de Pipeline', motivo:'Base essencial para consistência inicial.'}],
		prata:[{id:'c2', titulo:'Otimização de Follow-up', motivo:'Aumentar taxa de conversão em etapas intermediárias.'}],
		ouro:[{id:'c3', titulo:'Negociação Avançada', motivo:'Maximizar valor percebido e margens.'}],
		diamante:[{id:'c4', titulo:'Estratégia Enterprise', motivo:'Ciclos complexos e multi-stakeholder.'}],
	};
	return { ok:true, data: mock[level] || mock.bronze, stub:true };
}

export async function resumirModulo(conteudo){
	if(conteudo?.length > 500){
		return { ok:true, resumo: conteudo.slice(0,160)+'… (resumo simulado)', stub:true };
	}
	return { ok:true, resumo: conteudo || 'Resumo indisponível', stub:true };
}

export async function feedbackDesafio(input){
	return { ok:true, comentarios: ['Clareza adequada','Pode aprofundar métricas','Adicionar CTA final forte'], stub:true };
}