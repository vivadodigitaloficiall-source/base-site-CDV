// components.js - inicialização de comportamentos de componentes

export function initTabs(root=document){
	root.querySelectorAll('.tabs').forEach(tabsEl=>{
		const list=tabsEl.querySelector('.tab-list');
		if(!list) return;
		const buttons=[...list.querySelectorAll('button')];
		const panels=[...tabsEl.querySelectorAll('.tab-panel')];
		function activate(id){
			buttons.forEach(b=>b.setAttribute('aria-selected', b.id===id));
			panels.forEach(p=>{p.classList.toggle('active', p.getAttribute('aria-labelledby')===id); p.hidden = !(p.getAttribute('aria-labelledby')===id);});
		}
		buttons.forEach(btn=>btn.addEventListener('click',()=>activate(btn.id)));
		if(buttons.length){activate(buttons[0].id);}    
	});
}

export function initAccordions(root=document){
	root.querySelectorAll('details.accordion').forEach(det=>{
		det.addEventListener('toggle',()=>{
			if(det.open){
				// fechamento exclusivo (opcional)
				const group=det.dataset.group;
				if(group){root.querySelectorAll(`details.accordion[data-group='${group}']`).forEach(o=>{if(o!==det) o.open=false;});}
			}
		});
	});
}

export function setProgress(el,value){
	const span=el.querySelector('span');if(span){span.style.width=Math.min(100,Math.max(0,value))+'%';}
}

export function initComponents(){
	initTabs();
	initAccordions();
}

if(document.readyState!=='loading') initComponents(); else document.addEventListener('DOMContentLoaded', initComponents);