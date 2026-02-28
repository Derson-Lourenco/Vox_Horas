// Lista de emails autorizados
const ALLOWED_EMAILS = [
    'anderson.vtx@gmail.com',
    'nadya.vtx@gmail.com',
    'hamuel.vtx@gmail.com',
    'lucas.vtx@gmail.com',
    'jailton.vtx@gmail.com',
    'rafael.vtx@gmail.com'
];

const PASSWORD = 'vtx2026';
const SESSION_DURATION = 10 * 60 * 60 * 1000; // 10 horas em milissegundos

// Mostrar/ocultar senha
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggle-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Validação de email
function isValidEmail(email) {
    return ALLOWED_EMAILS.includes(email.toLowerCase().trim());
}

// Mostrar mensagem de erro
function showError(show, message = 'Email ou senha incorretos') {
    const errorDiv = document.getElementById('error-message');
    const errorSpan = errorDiv.querySelector('span');
    errorSpan.textContent = message;
    
    if (show) {
        errorDiv.style.display = 'flex';
        // Esconder após 3 segundos
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    } else {
        errorDiv.style.display = 'none';
    }
}

// Login
function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginButton = document.querySelector('.login-button');
    
    // Validações básicas
    if (!email || !password) {
        showError(true, 'Preencha todos os campos');
        return;
    }
    
    // Mostrar loading
    loginButton.classList.add('loading');
    loginButton.innerHTML = '<span>Entrando</span><i class="fas fa-spinner"></i>';
    
    // Simular delay de rede
    setTimeout(() => {
        // Verificar credenciais
        if (isValidEmail(email) && password === PASSWORD) {
            // Criar sessão com timestamp
            const sessionData = {
                email: email,
                loginTime: new Date().getTime(),
                expiresIn: SESSION_DURATION
            };
            
            localStorage.setItem('vtx_session', JSON.stringify(sessionData));
            
            // Redirecionar para o painel
            window.location.href = 'painel.html';
        } else {
            // Login falhou
            loginButton.classList.remove('loading');
            loginButton.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
            
            showError(true, 'Email ou senha incorretos');
        }
    }, 800);
}

// Verificar se já está logado
function checkExistingSession() {
    const sessionData = localStorage.getItem('vtx_session');
    
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const now = new Date().getTime();
            const sessionAge = now - session.loginTime;
            
            // Se a sessão ainda é válida (menos de 10 horas)
            if (sessionAge < SESSION_DURATION) {
                window.location.href = 'painel.html';
                return true;
            } else {
                // Sessão expirada, limpar
                localStorage.removeItem('vtx_session');
            }
        } catch (e) {
            localStorage.removeItem('vtx_session');
        }
    }
    return false;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar sessão existente
    checkExistingSession();
    
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    // Remover loading state se existir
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.classList.remove('loading');
        loginButton.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
    }
});

// Prevenir clique no botão de submit do form
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
});