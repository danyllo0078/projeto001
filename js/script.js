// =========================================================
// VERIFICAR LOGIN AO CARREGAR A PÁGINA
// =========================================================
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    const authPage = document.getElementById('authPage');
    const mainContent = document.getElementById('mainContent');
    
    if (currentUser) {
        authPage.style.display = 'none';
        mainContent.classList.remove('hidden');
    } else {
        authPage.style.display = 'flex';
        mainContent.classList.add('hidden');
    }
});

// =========================================================
// FUNÇÃO GLOBAL DE POPUP
// =========================================================
function showPopup(message, type = 'info', autoClose = 3000) {
    const popup = document.getElementById('notifyPopup');
    const msg = document.getElementById('notifyMessage');
    const closeBtn = document.getElementById('notifyClose');

    if (!popup || !msg || !closeBtn) return;

    msg.textContent = message;
    popup.classList.remove('success', 'error', 'info');
    popup.classList.add(type);
    popup.classList.add('show');

    function close() {
        popup.classList.remove('show', 'success', 'error', 'info');
        closeBtn.removeEventListener('click', close);
        if (timeout) clearTimeout(timeout);
    }

    closeBtn.addEventListener('click', close);
    let timeout = null;
    if (autoClose > 0) timeout = setTimeout(close, autoClose);
}

// =========================================================
// LOGIN E REGISTRO
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const authPage = document.getElementById('authPage');
    const mainContent = document.getElementById('mainContent');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtnTab = document.getElementById('loginBtn');
    const registerBtnTab = document.getElementById('registerBtn');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    function showAuthTab(tab = 'login') {
        if (tab === 'login') {
            loginBtnTab.classList.add('active');
            registerBtnTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            loginBtnTab.classList.remove('active');
            registerBtnTab.classList.add('active');
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        }
    }

    if (loginBtnTab) loginBtnTab.addEventListener('click', (e) => { e.preventDefault(); showAuthTab('login'); });
    if (registerBtnTab) registerBtnTab.addEventListener('click', (e) => { e.preventDefault(); showAuthTab('register'); });
    if (switchToRegister) switchToRegister.addEventListener('click', (e) => { e.preventDefault(); showAuthTab('register'); });
    if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); showAuthTab('login'); });

    function loadUsers() {
        try {
            return JSON.parse(localStorage.getItem('users')) || [];
        } catch {
            return [];
        }
    }
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // REGISTRO
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (document.getElementById('registerName')?.value || '').trim();
            const email = (document.getElementById('registerEmail')?.value || '').trim().toLowerCase();
            const phone = (document.getElementById('registerPhone')?.value || '').trim();
            const password = document.getElementById('registerPassword')?.value || '';
            const confirmPassword = document.getElementById('registerConfirmPassword')?.value || '';

            if (!name) { showPopup('Preencha o nome.', 'error'); return; }
            if (!email) { showPopup('Preencha o email.', 'error'); return; }
            if (!phone) { showPopup('Preencha o telefone.', 'error'); return; }
            if (password !== confirmPassword) { showPopup('As senhas não coincidem!', 'error'); return; }

            const users = loadUsers();
            const exists = users.find(u => u.email === email);
            if (exists) { showPopup('Este email já está registrado!', 'error'); return; }

            users.push({ name, email, phone, password, registeredDate: new Date().toISOString() });
            saveUsers(users);

            showPopup('Registro realizado com sucesso. Faça login para continuar.', 'success', 2800);
            registerForm.reset();
            setTimeout(() => showAuthTab('login'), 900);
        });
    }

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (document.getElementById('loginEmail')?.value || '').trim().toLowerCase();
            const password = document.getElementById('loginPassword')?.value || '';

            if (!email || !password) {
                showPopup('Preencha o email e a senha.', 'error');
                return;
            }

            const users = loadUsers();
            const user = users.find(u => u.email === email);
            
            if (!user || user.password !== password) {
                showPopup('Login ou senha incorretos!', 'error');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            showPopup('Login efetuado com sucesso!', 'success', 1200);
            setTimeout(() => {
                if (authPage) authPage.style.display = 'none';
                if (mainContent) mainContent.classList.remove('hidden');
                window.scrollTo(0, 0);
            }, 1200);
        });
    }

    // LOGOUT
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            location.reload();
        });
    }
});

// =========================================================
// MENU MÓVEL
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
                if (menuToggle) {
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });
});

// =========================================================
// SLIDER
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    let slideIndex = 0;

    function showSlide(n) {
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) return;
        if (n >= slides.length) slideIndex = 0;
        if (n < 0) slideIndex = slides.length - 1;
        
        slides.forEach(slide => slide.classList.remove('active'));
        slides[slideIndex].classList.add('active');
    }

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (nextBtn) nextBtn.addEventListener('click', () => { slideIndex++; showSlide(slideIndex); });
    if (prevBtn) prevBtn.addEventListener('click', () => { slideIndex--; showSlide(slideIndex); });

    showSlide(slideIndex);
});

// =========================================================
// MODAL AGENDAMENTO
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('agendamentoModal');
    const openModalBtns = [
        document.getElementById('openModalBtn'),
        document.getElementById('openModalBtnHero')
    ];
    const closeModalBtn = document.querySelector('.close-btn');
    const scheduleForm = document.getElementById('scheduleForm');

    openModalBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'block';
            });
        }
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome')?.value || '';
            const servico = document.getElementById('servico')?.value || '';
            const data = document.getElementById('data')?.value || '';
            const horario = document.getElementById('horario')?.value || '';

            const mensagem = `Olá! Gostaria de agendar um horário.\n\nNome: ${nome}\nServiço: ${servico}\nData: ${data}\nHorário: ${horario}`;
            const numeroWhatsApp = '91982987008';
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
            
            window.open(urlWhatsApp, '_blank');
            
            showPopup('Agendamento enviado! Você será redirecionado para o WhatsApp.', 'success', 3000);

            scheduleForm.reset();
            modal.style.display = 'none';
        });
    }
});