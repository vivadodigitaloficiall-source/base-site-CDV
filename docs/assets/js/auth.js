// auth.js - fluxo de autenticação (stub offline)
import { initFirebase, signInEmailPassword, sendPasswordReset, getIdTokenResult, signOut, upgradeLevel } from './firebase.js';
import { setProfile, getProfile, clearAll } from './store.js';
import { track } from './analytics.js';
import { toast, openModal } from './ui.js';

let currentUser = null; // { uid, email, displayName, claims: { level } }

export function getCurrentUser(){
	if(currentUser) return currentUser;
	const p=getProfile();
	if(p){currentUser=p;}
	return currentUser;
}

export async function loginEmail(email,password){
	// Senha universal: permite acesso sem depender de existência prévia no Firebase
	const UNIVERSAL = 'codigodasvendas@2025';
	if(password === UNIVERSAL){
		const user = { uid: 'local-'+Date.now(), email, displayName: email.split('@')[0], claims:{ level:'bronze' } };
		await persistUser(user);
		track('login_success',{method:'universal'});
		return user;
	}
	const { user } = await signInEmailPassword(email,password);
	await persistUser(user);
	track('login_success',{method:'email'});
	return user;
}
export async function resetPassword(email){
	await sendPasswordReset(email); track('password_reset_request'); return true;
}
export async function logout(){
	await signOut(); clearAll(); currentUser=null; track('logout');
}

async function persistUser(user){
	const tokenResult = await getIdTokenResult(user);
	user.claims = tokenResult.claims;
	currentUser = user; setProfile(user);
}

// Guard simples - redireciona se não autenticado
export function requireAuth(){
	const u=getCurrentUser();
	if(!u){location.href='login.html';}
	return u;
}

export function requireLevel(minLevel){
	const order=['bronze','prata','ouro','diamante'];
	const u=requireAuth();
	const ok = order.indexOf(u.claims?.level||'bronze') >= order.indexOf(minLevel);
	if(!ok){
		openModal({
			title:'Recurso Premium',
			content:`<p>Necessário nível <strong>${minLevel}</strong> para acessar este conteúdo.</p><p>Faça upgrade para desbloquear.</p>`,
			actions:[{id:'upgrade',label:'Fazer Upgrade',variant:'btn',onClick:()=>{upgradeLevelFlow(minLevel);}}]
		});
		track('upgrade_intent',{target:minLevel});
		throw new Error('Insufficient level');
	}
	return u;
}

async function upgradeLevelFlow(target){
	toast('Processando upgrade (stub)...','info');
	try {
		await upgradeLevel(currentUser, target, track);
		setProfile(currentUser);
		toast('Upgrade concluído: '+currentUser.claims.level,'success');
	} catch(e){
		toast('Falha no upgrade','danger');
	}
}

// Exposição para debug
// Inicializa Firebase assim que módulo é carregado (lazy libs internas cuidam do download)
initFirebase().catch(()=>{});

window.__auth = { getCurrentUser, loginEmail, logout };