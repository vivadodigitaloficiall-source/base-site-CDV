// firebase.js
// Implementação real (email/senha) usando Firebase Web modular via CDN. Sem Google OAuth.
// Para produção: substituir firebaseConfig com valores do projeto real e garantir regras de segurança / custom claims setadas via Cloud Functions após compra.

// Import dinâmico sob demanda para evitar custo quando não necessário (login.html carrega diretamente).
let _firebaseLibsPromise;
async function loadFirebase(){
	if(!_firebaseLibsPromise){
		_firebaseLibsPromise = Promise.all([
			import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
			import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js')
		]).then(([appMod, authMod])=>({ ...appMod, ...authMod }));
	}
	return _firebaseLibsPromise;
}

export const firebaseConfig = {
	apiKey: 'FIREBASE_API_KEY_PUBLICO',
	authDomain: 'seu-projeto.firebaseapp.com',
	projectId: 'seu-projeto',
	appId: '1:00000000000:web:abcdef123456'
};

let appInstance=null; let authInstance=null;
export async function initFirebase(){
	if(authInstance) return authInstance;
	const { initializeApp, getApps } = await loadFirebase();
	if(!getApps().length) appInstance = initializeApp(firebaseConfig); else appInstance = getApps()[0];
	const { getAuth } = await loadFirebase();
	authInstance = getAuth(appInstance);
	return authInstance;
}

export async function signInEmailPassword(email,password){
	const { signInWithEmailAndPassword } = await loadFirebase();
	const auth = await initFirebase();
	const cred = await signInWithEmailAndPassword(auth,email,password);
	// Claims custom: assumimos Cloud Function seta claim level. Fallback bronze.
	cred.user.claims = { level: 'bronze' }; // será sobrescrito por getIdTokenResult custom se existir.
	return { user: cred.user };
}


export async function sendPasswordReset(email){
	const { sendPasswordResetEmail } = await loadFirebase();
	const auth = await initFirebase();
	await sendPasswordResetEmail(auth,email); return true;
}

export async function getIdTokenResult(user){
	const { getIdTokenResult } = await loadFirebase();
	try {
		const res = await getIdTokenResult(user, true);
		return { claims: { level: res.claims.level || 'bronze' } };
	} catch(e){
		return { claims: { level: 'bronze' } };
	}
}

export async function signOut(){
	const { signOut } = await loadFirebase();
	const auth = await initFirebase();
	await signOut(auth); return true;
}

// Upgrade permanece stub até integração de compra.
export async function requestLevelUpgrade(targetLevel){
	await new Promise(r=>setTimeout(r,600));
	return { ok:true, newLevel: targetLevel };
}

export async function upgradeLevel(currentUser, targetLevel, track){
	if(!currentUser) throw new Error('Usuário não autenticado');
	track && track('upgrade_initiated',{from: currentUser.claims?.level||'bronze', to: targetLevel});
	const res = await requestLevelUpgrade(targetLevel);
	if(res.ok){
		currentUser.claims = { ...(currentUser.claims||{}), level: res.newLevel };
		track && track('upgrade_success',{level: res.newLevel});
	} else {
		track && track('upgrade_failed',{to: targetLevel});
	}
	return res;
}