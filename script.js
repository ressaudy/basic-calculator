// script.js — Kalkulator basic dengan dukungan keyboard
(function(){
    const openBtn = document.getElementById('openCalc');
    const modal = document.getElementById('calcModal');
    const closeBtn = document.getElementById('closeCalc');
    const display = document.getElementById('display');
    const keys = document.querySelector('.keys');

    function openModal(){
        modal.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        modal.classList.add('visible');
        requestAnimationFrame(()=> modal.querySelector('.modal-content').classList.add('pop'));
    }

    function closeModal(){
        const content = modal.querySelector('.modal-content');
        content.classList.remove('pop');
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
    }

    function pressKey(key){
        if(key === 'clear') return display.value = '';
        if(key === 'back') return display.value = display.value.slice(0,-1);
        if(key === 'equals'){
            let expr = display.value.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
            try{ display.value = Function('return '+expr)(); }catch(e){ display.value = 'Error'; }
            return;
        }
        display.value += key;
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });

    // Clicks on calculator buttons
    keys.addEventListener('click', function(e){
        const t = e.target.closest('.btn');
        if(!t) return;
        const action = t.dataset.action;
        const val = t.dataset.value;
        if(action === 'clear') return pressKey('clear');
        if(action === 'back') return pressKey('back');
        if(action === 'equals') return pressKey('equals');
        pressKey(val || '');
    });

    // Keyboard support
    window.addEventListener('keydown', function(e){
        // if modal not visible, only open when user presses 'k' or 'Enter' while focus on page
        const modalVisible = modal.classList.contains('visible');
        const key = e.key;

        if(!modalVisible){
            if(key === 'Enter' || key.toLowerCase() === 'k'){
                openModal();
                e.preventDefault();
            }
            return; // ignore other keys when modal closed
        }

        // when modal open, handle keys
        if(key === 'Escape') return closeModal();
        if(key === 'Backspace') return (e.preventDefault(), pressKey('back'));
        if(key === 'Enter' || key === '=') return (e.preventDefault(), pressKey('equals'));
        if(key === 'c' || key === 'C') return pressKey('clear');

        // allowed chars: digits, operators, dot
        if(/^[0-9]$/.test(key) || key === '.' ) return pressKey(key);
        if(key === '/' || key === '*' || key === '-' || key === '+') return pressKey(key);

        // also support numpad keys (they appear as same chars in most browsers)
    });
})();
