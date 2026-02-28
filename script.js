// ========== CONFIGURAÇÕES ==========
const CONFIG = {
    DIAS_PARA_EXPIRAR: 7,
    JORNADAS: {
        COMERCIAL: "Comercial",
        DOZE_TRINTA_SEIS: "12/36",
    },
};

// ========== LISTA DE EMAILS AUTORIZADOS ==========
const ALLOWED_EMAILS = [
    "anderson.vtx@gmail.com",
    "nadya.vtx@gmail.com",
    "hamuel.vtx@gmail.com",
    "lucas.vtx@gmail.com",
    "jailton.vtx@gmail.com",
    "rafael.vtx@gmail.com",
];

const PASSWORD = "vtx2026";
const SESSION_DURATION = 10 * 60 * 60 * 1000; // 10 horas em milissegundos

// ========== TABELA DE CONVERSÃO 12/36 PARA 8H ==========
const TABELA_CONVERSAO_12X36 = {
    "00:30": "00:20",
    "01:00": "00:40",
    "01:30": "01:00",
    "02:00": "01:20",
    "02:30": "01:40",
    "03:00": "02:00",
    "03:30": "02:20",
    "04:00": "02:40",
    "04:30": "03:00",
    "05:00": "03:20",
    "05:30": "03:40",
    "06:00": "04:00",
    "06:30": "04:20",
    "07:00": "04:40",
    "07:30": "05:00",
    "08:00": "05:20",
    "08:30": "05:40",
    "09:00": "06:00",
    "09:30": "06:20",
    "10:00": "06:40",
    "10:30": "07:00",
    "11:00": "07:20",
    "11:30": "07:40",
    "12:00": "08:00",
};

// ========== TABELA DE PESOS DOS SERVIÇOS ==========
const TABELA_PESOS = {
    "ADIANTAMENTO DE SERV.": 2,
    "ALT. PPPOE": 0.25,
    "ALT. SENHA": 1,
    "APOIO A EQUIPE": 1.5,
    "APP ESPECÍFICO": 1.7,
    "AT. IPTV": 1,
    "AT. TECNOLOGICA": 1.7,
    "AT. WIFI PLUS": 1.7,
    "AT. WIFI PLUS EMP": 2,
    "AT. WIFI PRO": 2,
    ATENUAÇÃO: 1.7,
    ATIVAÇÃO: 2,
    "ATIVAÇÃO - FIBRA + WI-FI PLUS": 3,
    "ATIVAÇÃO - RÁDIO": 2,
    "ATIVAÇÃO FIBRA + VIRTEX TV": 2.5,
    "ATIVAÇÃO PRP": 2,
    "ATV - FIBRA + TELEFONIA": 3,
    "ATV SVA": 0.5,
    "ATV WIFI PLUS EMP": 2,
    "ATV- FIBRA+WIFI PRO": 2.5,
    "CABO BAIXO": 1,
    "COLHER ASSINATURA": 0.25,
    "CONF. ROTEAD. C/ VISITA": 1.5,
    "DES. DE TELEFONIA": 0.25,
    "DES. PORTA": 0.4,
    "DES. WIFI PLUS": 0.25,
    "DESAT. BOX": 0.25,
    "EMP EQUI. ESPEC.": 1.7,
    "EMP S/ CONEXÃO": 2,
    "EMP. LENTIDÃO": 2,
    "EMP. REDE INTERNA": 2,
    "EMP. TROCA EQUIP.": 1.7,
    "EQUIP. ESPECIFICO": 1.7,
    ESCALONAMENTO: 1,
    LENTIDÃO: 2,
    "LENTIDÃO ACOMP. NOC": 2,
    "M.E": 2,
    "MAN. WIFI PRO": 2,
    "MANUTENÇÃO POP": 2,
    "ME + WIFI PLUS": 2.5,
    "ME+WIFI PLUS": 2.5,
    MIGRAÇÃO: 1.7,
    MLP: 1.5,
    MMA: 2,
    "MUD. PASSAGEM DROP": 1.5,
    "ORGANIZAÇÃO DE CABO": 1.5,
    PADRONIZAÇÃO: 0.25,
    "PÓS SERVIÇO": 1.7,
    REATIVAÇÃO: 2,
    "REC+DES. PORTA": 0.25,
    RECORRÊNCIA: 1.7,
    "RECOLHER EQUIP.": 0.4,
    "RECOLOCAR EQUIP.": 1,
    "REDE INTERNA": 2,
    "REDE LIVE": 2,
    REMANEJAMENTO: 2,
    RETENÇÃO: 2.5,
    "SEM CONEXÃO": 2,
    "SEM CONEXÃO ACOMP. NOC": 2,
    "SUP. TELEFONIA": 1.7,
    "SUP. WIFI PLUS": 1.7,
    "SUP.WIFI PLUS EMP": 1.7,
    "SUPORTE ATIVO": 1.7,
    "SUPORTE VIRTEX TV": 0.5,
    "TEL. COM PORTABILIDADE": 1,
    "TEL. SEM PORTABILIDADE": 1,
    "TESTE VELOCIDADE": 1.7,
    "TROCA DE POSTE": 4,
    "TROCA EQUIP.": 1.7,
    "VIRTEX TV COM BOX": 0.5,
    "VIRTEX TV SEM BOX": 0.5,
    "VISTORIA PRÉ-ATIVAÇÃO": 0,
    "VISTORIA WIFIPRO": 1.5,
};

// ========== UTILITÁRIOS ==========
const Utils = {
    normalizarTexto(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[–—]/g, "-")
            .replace(/\s+/g, " ")
            .toUpperCase()
            .trim();
    },

    formatarDataISO(dataISO) {
        if (!dataISO) return "";
        let [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    },

    formatarData(dataISO) {
        if (!dataISO) return "";
        const partes = dataISO.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },

    minutosParaHoraMinutos(minutos) {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    },

    horaMinutosParaMinutos(horaMinutos) {
        const [horas, minutos] = horaMinutos.split(":").map(Number);
        return horas * 60 + minutos;
    },

    calcularMinutos(inicio, fim) {
        let [h1, m1] = inicio.split(":").map(Number);
        let [h2, m2] = fim.split(":").map(Number);

        let minutosInicio = h1 * 60 + m1;
        let minutosFim = h2 * 60 + m2;

        if (minutosFim <= minutosInicio) {
            alert("Hora final deve ser maior que a inicial.");
            return null;
        }
        return minutosFim - minutosInicio;
    },

    formatarTempo(minutos, jornada = "Comercial") {
        const minutosParaExibir = ConversorTempo.obterTempoConvertido(minutos, jornada);

        if (minutosParaExibir === 0) return "0 minutos";

        let horas = Math.floor(minutosParaExibir / 60);
        let mins = minutosParaExibir % 60;
        let partes = [];

        if (horas === 1) partes.push("1 hora");
        else if (horas > 1) partes.push(horas + " horas");

        if (mins === 1) partes.push("1 minuto");
        else if (mins > 1) partes.push(mins + " minutos");

        return partes.join(" e ");
    },
};

// ========== CONVERSOR DE TEMPO ==========
const ConversorTempo = {
    obterTempoConvertido(minutos, jornada) {
        if (jornada !== CONFIG.JORNADAS.DOZE_TRINTA_SEIS) {
            return minutos;
        }

        const tempoFormatado = Utils.minutosParaHoraMinutos(minutos);

        if (TABELA_CONVERSAO_12X36.hasOwnProperty(tempoFormatado)) {
            const tempoConvertidoFormatado = TABELA_CONVERSAO_12X36[tempoFormatado];
            return Utils.horaMinutosParaMinutos(tempoConvertidoFormatado);
        }

        return minutos;
    },
};

// ========== GESTÃO DE DADOS ==========
const DataManager = {
    registros: JSON.parse(localStorage.getItem("registros")) || [],

    salvarLocal() {
        this.registros = this.registros.map((r) => ({
            ...r,
            dataSalva: r.dataSalva || new Date().toISOString(),
        }));
        localStorage.setItem("registros", JSON.stringify(this.registros));
    },

    limparDadosAntigos() {
        const agora = new Date().getTime();
        const msPorDia = 24 * 60 * 60 * 1000;

        let registrosFiltrados = this.registros.filter((item) => {
            if (!item.dataSalva) return true;
            const dataItem = new Date(item.dataSalva).getTime();
            const diferencaDias = (agora - dataItem) / msPorDia;
            return diferencaDias <= CONFIG.DIAS_PARA_EXPIRAR;
        });

        if (this.registros.length !== registrosFiltrados.length) {
            this.registros = registrosFiltrados;
            localStorage.setItem("registros", JSON.stringify(this.registros));
        }

        for (let i = 0; i < localStorage.length; i++) {
            const chave = localStorage.key(i);
            if (chave && chave.startsWith("relatorio_")) {
                const item = JSON.parse(localStorage.getItem(chave));
                if (item && item.dataSalva) {
                    const dataItem = new Date(item.dataSalva).getTime();
                    const diferencaDias = (agora - dataItem) / msPorDia;
                    if (diferencaDias > CONFIG.DIAS_PARA_EXPIRAR) {
                        localStorage.removeItem(chave);
                    }
                }
            }
        }
    },

    salvarRelatorio(data, dados) {
        const chave = `relatorio_${data}`;
        const item = {
            data: data,
            dados: dados,
            dataSalva: new Date().toISOString(),
        };
        localStorage.setItem(chave, JSON.stringify(item));
    },

    carregarRelatorio(data) {
        const chave = `relatorio_${data}`;
        const itemSalvo = localStorage.getItem(chave);
        if (!itemSalvo) return null;
        try {
            return JSON.parse(itemSalvo);
        } catch (e) {
            console.error("Erro ao carregar relatório:", e);
            return null;
        }
    },

    apagarRelatorioPorData(data) {
        const chave = `relatorio_${data}`;
        if (localStorage.getItem(chave)) {
            localStorage.removeItem(chave);
            return true;
        }
        return false;
    },

    buscarRetiradasPorTecnicoData(tecnico, data) {
        return this.registros.filter(
            (r) => r.tecnico.toLowerCase().trim() === tecnico.toLowerCase().trim() && r.data === data
        );
    },
};

// ========== PROCESSADOR DE TABELA ==========
const ProcessadorTabela = {
    encontrarPesoServico(servicoOriginal) {
        const servicoNormalizado = Utils.normalizarTexto(servicoOriginal);

        for (let [chave, peso] of Object.entries(TABELA_PESOS)) {
            if (Utils.normalizarTexto(chave) === servicoNormalizado) {
                return peso;
            }
        }
        return 1;
    },

    processar(texto) {
        if (!texto || texto.trim() === "") return null;

        const linhas = texto.trim().split("\n");
        if (linhas.length <= 1) return null;

        const dividirColunas = (linha) => linha.trim().split(/\t|\s{2,}/);
        const cabecalho = dividirColunas(linhas[0]);

        const indexServico = cabecalho.findIndex(
            (c) => c.toLowerCase().includes("serviço") || c.toLowerCase().includes("servico")
        );

        const indexStatus = cabecalho.findIndex(
            (c) => c.toLowerCase().includes("feito") || c.toLowerCase().includes("status")
        );

        if (indexServico === -1 || indexStatus === -1) {
            console.log("Cabeçalho não identificado:", cabecalho);
            return null;
        }

        const normalizar = (texto) => {
            return texto
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[–—]/g, "-")
                .replace(/\s+/g, " ")
                .toUpperCase()
                .trim();
        };

        const calcularValorServico = (servico) => {
            const s = servico.toUpperCase().replace(/\s+/g, "");
            if (s.includes("RECORRÊNCIA")) return 1;
            if (s.includes("REC+") && s.includes("DES.PORTA")) return 0.5;
            if (servico.includes("DES.") || servico.includes("DESAT") || servico.includes("RECOLHER")) return 0.25;
            if (servico.includes("+")) return 1.5;
            if (servico.includes("IPTV") || servico.includes("TV") || servico.includes("SVA") || servico.includes("BOX")) return 0.5;
            return 1;
        };

        let planejamento = 0, execucao = 0, totalExecutado = 0;
        let remarcacao = 0, cancelamento = 0, tratativasCS = 0, infraestrutura = 0, resolucaoN2 = 0;
        let mapa = {};

        for (let i = 1; i < linhas.length; i++) {
            if (!linhas[i].trim()) continue;

            const colunas = dividirColunas(linhas[i]);
            const servicoOriginal = colunas[indexServico]?.trim();
            const statusOriginal = colunas[indexStatus]?.trim();

            if (!servicoOriginal || !statusOriginal) continue;

            const servico = normalizar(servicoOriginal);
            const status = normalizar(statusOriginal);

            planejamento++;

            if (status.includes("CANCEL")) {
                cancelamento++;
                continue;
            }

            if (status === "RV" || status === "RC") {
                remarcacao++;
                continue;
            }

            if (status.includes("OK") || status.includes("FEITO")) {
                execucao++;
                const valor = calcularValorServico(servico);
                totalExecutado += valor;
                if (!mapa[servicoOriginal]) mapa[servicoOriginal] = 0;
                mapa[servicoOriginal] += 1;

                if (servico.includes("TRATATIVA CS")) tratativasCS++;
                if (servico.includes("INFRAESTRUTURA")) infraestrutura++;
                if (servico.includes("NIVEL 2")) resolucaoN2++;
            }
        }

        return { planejamento, execucao, totalExecutado, remarcacao, cancelamento, tratativasCS, infraestrutura, resolucaoN2, mapa };
    },
};

// ========== FUNÇÕES DE LOGIN ==========
const LoginManager = {
    togglePassword() {
        const passwordInput = document.getElementById("password");
        const toggleIcon = document.getElementById("toggle-icon");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.classList.remove("fa-eye");
            toggleIcon.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            toggleIcon.classList.remove("fa-eye-slash");
            toggleIcon.classList.add("fa-eye");
        }
    },

    isValidEmail(email) {
        return ALLOWED_EMAILS.includes(email.toLowerCase().trim());
    },

    showError(show, message = "Email ou senha incorretos") {
        const errorDiv = document.getElementById("error-message");
        if (!errorDiv) return;
        const errorSpan = errorDiv.querySelector("span");
        if (errorSpan) errorSpan.textContent = message;

        if (show) {
            errorDiv.style.display = "flex";
            setTimeout(() => { errorDiv.style.display = "none"; }, 3000);
        } else {
            errorDiv.style.display = "none";
        }
    },

    handleLogin() {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const loginButton = document.querySelector(".login-button");

        if (!emailInput || !passwordInput || !loginButton) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            this.showError(true, "Preencha todos os campos");
            return;
        }

        loginButton.classList.add("loading");
        loginButton.innerHTML = '<span>Entrando</span><i class="fas fa-spinner"></i>';

        setTimeout(() => {
            if (this.isValidEmail(email) && password === PASSWORD) {
                const sessionData = { email, loginTime: new Date().getTime(), expiresIn: SESSION_DURATION };
                localStorage.setItem("vtx_session", JSON.stringify(sessionData));
                window.location.href = "painel.html";
            } else {
                loginButton.classList.remove("loading");
                loginButton.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
                this.showError(true, "Email ou senha incorretos");
            }
        }, 800);
    },

    checkExistingSession() {
        const sessionData = localStorage.getItem("vtx_session");
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                const sessionAge = now - session.loginTime;
                if (sessionAge < SESSION_DURATION) {
                    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
                        window.location.href = "painel.html";
                    }
                    return true;
                } else {
                    localStorage.removeItem("vtx_session");
                }
            } catch (e) {
                localStorage.removeItem("vtx_session");
            }
        }
        return false;
    },

    logout() {
        localStorage.removeItem("vtx_session");
        window.location.href = "index.html";
    },

    initLoginPage() {
        const loginForm = document.getElementById("login-form");
        const passwordInput = document.getElementById("password");
        const toggleBtn = document.querySelector(".password-toggle");

        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") this.handleLogin();
            });
        }

        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => this.togglePassword());
        }
    },
};


// ========== INTERFACE DE USUÁRIO ==========
const UI = {
    tecnicosEditando: {},

    atualizarInfoCabecalho() {
        const dataAtual = document.getElementById("current-date");
        if (dataAtual) {
            const hoje = new Date();
            const opcoes = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
            dataAtual.textContent = hoje.toLocaleDateString("pt-BR", opcoes);
        }

        const userName = document.getElementById("user-name");
        if (userName) {
            const sessionData = localStorage.getItem("vtx_session");
            if (sessionData) {
                try {
                    const session = JSON.parse(sessionData);
                    const emailName = session.email.split("@")[0];
                    const nomeFormatado = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                    userName.textContent = nomeFormatado;
                } catch (e) {
                    userName.textContent = "Técnico";
                }
            }
        }
    },

    init() {
        if (document.getElementById("login-form")) {
            LoginManager.initLoginPage();
            return;
        }

        this.atualizarTempoTotal();
        this.preencherDatasAtuais();
        this.atualizarInfoCabecalho();

        const btnCopy = document.querySelector(".btn-copy");
        if (btnCopy) btnCopy.style.display = "none";

        const tecnicoInput = document.getElementById("tecnico");
        const dataRetirada = document.getElementById("data-retirada");
        const jornadaSelect = document.getElementById("jornada");

        if (tecnicoInput) tecnicoInput.addEventListener("input", () => this.atualizarTempoTotal());
        if (dataRetirada) dataRetirada.addEventListener("change", () => this.atualizarTempoTotal());
        if (jornadaSelect) jornadaSelect.addEventListener("change", () => this.atualizarTempoTotal());
    },

    preencherDatasAtuais() {
        const hoje = new Date().toISOString().split("T")[0];
        const dataAtivacao = document.getElementById("data-ativacao");
        const dataRetirada = document.getElementById("data-retirada");

        if (dataAtivacao && !dataAtivacao.value) dataAtivacao.value = hoje;
        if (dataRetirada && !dataRetirada.value) dataRetirada.value = hoje;
    },

    atualizarTempoTotal() {
        let tecnico = document.getElementById("tecnico")?.value || "";
        let data = document.getElementById("data-retirada")?.value || "";
        let total = DataManager.registros.filter((r) => r.tecnico === tecnico && r.data === data).reduce((acc, r) => acc + r.minutos, 0);
        let jornada = document.getElementById("jornada")?.value || "Comercial";
        let tempoTotal = document.getElementById("tempoTotal");

        if (tempoTotal) {
            tempoTotal.innerHTML = `<i class="fas fa-clock"></i> <span>Tempo a Retirar: <strong>${Utils.formatarTempo(total, jornada)}</strong></span>`;
        }
    },

    adicionarJustificativa(container) {
        const justificativaItem = document.createElement("div");
        justificativaItem.className = "justificativa-item";
        justificativaItem.innerHTML = `
            <input type="text" class="justificativa-texto" placeholder="Digite a justificativa...">
            <button class="btn-remove-just" onclick="removerJustificativa(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(justificativaItem);
    },

    removerJustificativa(botao) {
        botao.parentElement.remove();
    },

    adicionarEquipe() {
        const container = document.getElementById("equipes");
        if (!container) return;

        const bloco = document.createElement("div");
        bloco.className = "equipe-bloco";
        bloco.innerHTML = `
            <h5><i class="fas fa-user-hard-hat"></i>Técnico de Campo</h5>
            <label><i class="fas fa-user inline-icon"></i>Nome</label>
            <input type="text" class="nomeTecnico" placeholder="Nome do Técnico">
            <label><i class="fas fa-table inline-icon"></i>Tabela de Dados</label>
            <textarea class="tabelaDados" rows="6" placeholder="Cole aqui a tabela do técnico..."></textarea>
            <label><i class="fas fa-pen inline-icon"></i>Justificativas</label>
            <div class="justificativas-container"></div>
            <button class="btn-add-just" onclick="adicionarJustificativa(this.previousElementSibling)">
                <i class="fas fa-plus-circle"></i> Adicionar Justificativa
            </button>
            <div class="btn-group" style="margin-top: 1rem;">
                <button class="btn-danger" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-trash-alt"></i> Remover Técnico
                </button>
            </div>
        `;
        container.appendChild(bloco);
    },

    adicionarRetirada() {
        let data = document.getElementById("data-retirada")?.value;
        let tecnico = document.getElementById("tecnico")?.value.trim();
        let jornada = document.getElementById("jornada")?.value;
        let inicio = document.getElementById("inicio")?.value;
        let fim = document.getElementById("fim")?.value;
        let motivo = document.getElementById("motivo")?.value.trim();

        if (!data || !tecnico || !jornada || !inicio || !fim || !motivo) {
            alert("Preencha todos os campos!");
            return;
        }

        let minutos = Utils.calcularMinutos(inicio, fim);
        if (minutos === null) return;

        DataManager.registros.push({ data, tecnico, jornada, inicio, fim, motivo, minutos, dataSalva: new Date().toISOString() });
        DataManager.salvarLocal();
        this.atualizarTempoTotal();

        document.getElementById("inicio").value = "";
        document.getElementById("fim").value = "";
        document.getElementById("motivo").value = "";
    },

    editarTecnico(tecnico) {
        this.tecnicosEditando[tecnico] = true;
        this.finalizarRetirada();
    },

    salvarEdicoesTecnico(tecnico) {
        let dataSelecionada = document.getElementById("data-retirada")?.value;

        DataManager.registros.forEach((registro, indice) => {
            if (registro.tecnico === tecnico && registro.data === dataSelecionada) {
                let inicio = document.getElementById(`edit-inicio-${indice}`)?.value;
                let fim = document.getElementById(`edit-fim-${indice}`)?.value;
                let motivo = document.getElementById(`edit-motivo-${indice}`)?.value.trim();

                if (inicio && fim && motivo) {
                    let minutos = Utils.calcularMinutos(inicio, fim);
                    if (minutos !== null) {
                        DataManager.registros[indice].inicio = inicio;
                        DataManager.registros[indice].fim = fim;
                        DataManager.registros[indice].motivo = motivo;
                        DataManager.registros[indice].minutos = minutos;
                        DataManager.registros[indice].dataSalva = new Date().toISOString();
                    }
                }
            }
        });

        DataManager.salvarLocal();
        delete this.tecnicosEditando[tecnico];
        this.atualizarTempoTotal();
        this.finalizarRetirada();
    },

    cancelarEdicaoTecnico(tecnico) {
        delete this.tecnicosEditando[tecnico];
        this.finalizarRetirada();
    },

    excluirRetirada(indice) {
        if (!confirm("Deseja realmente excluir este período?")) return;
        let tecnico = DataManager.registros[indice].tecnico;
        DataManager.registros.splice(indice, 1);
        DataManager.salvarLocal();

        let dataSelecionada = document.getElementById("data-retirada")?.value;
        let aindaTemRegistros = DataManager.registros.some((r) => r.tecnico === tecnico && r.data === dataSelecionada);

        if (!aindaTemRegistros) delete this.tecnicosEditando[tecnico];

        this.atualizarTempoTotal();
        this.finalizarRetirada();
    },

    finalizarRetirada() {
        let dataSelecionada = document.getElementById("data-retirada")?.value;
        let resultadoDiv = document.getElementById("resultado-retirada");
        if (!resultadoDiv) return;

        resultadoDiv.innerHTML = "";
        let registrosDaData = DataManager.registros.filter((r) => r.data === dataSelecionada);

        if (registrosDaData.length === 0) {
            resultadoDiv.innerHTML = "Nenhum registro nesta data.";
            return;
        }

        let tecnicos = [...new Set(registrosDaData.map((r) => r.tecnico))];

        tecnicos.forEach((tecnico, index) => {
            let lista = registrosDaData.filter((r) => r.tecnico === tecnico);
            let total = lista.reduce((acc, r) => acc + r.minutos, 0);
            let jornada = lista[0]?.jornada || "";

            let bloco = document.createElement("div");
            bloco.style.marginBottom = "2rem";

            bloco.innerHTML = `Retirada De Tempo<br><br>`;
            bloco.innerHTML += `Data: ${Utils.formatarDataISO(dataSelecionada)}<br>`;
            bloco.innerHTML += `Técnico: ${tecnico}<br>`;
            bloco.innerHTML += `Carga Horária: ${jornada}<br>`;
            bloco.innerHTML += `Tempo a Retirar: ${Utils.formatarTempo(total, jornada)}<br><br>`;

            if (this.tecnicosEditando[tecnico]) {
                lista.forEach((r) => {
                    let indiceGlobal = DataManager.registros.findIndex(
                        (reg) => reg.data === r.data && reg.tecnico === r.tecnico && reg.inicio === r.inicio && reg.fim === r.fim && reg.motivo === r.motivo
                    );

                    bloco.innerHTML += `
                        <div style="background: rgba(255,255,255,0.9); padding: 1rem; border-radius: 16px; margin-bottom: 1rem;">
                            <input type="time" id="edit-inicio-${indiceGlobal}" value="${r.inicio}" style="margin-bottom: 0.5rem;">
                            <input type="time" id="edit-fim-${indiceGlobal}" value="${r.fim}" style="margin-bottom: 0.5rem;">
                            <textarea id="edit-motivo-${indiceGlobal}" rows="2" style="margin-bottom: 0.5rem;">${r.motivo}</textarea>
                            <div>
                                <button onclick="excluirRetirada(${indiceGlobal})" style="min-width: 80px; padding: 0.5rem 1rem; font-size: 0.85rem; background: linear-gradient(135deg, #9e4244, #b14d4f);">
                                    <i class="fas fa-trash"></i> Excluir
                                </button>
                            </div>
                        </div>
                    `;
                });

                bloco.innerHTML += `
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button onclick="salvarEdicoesTecnico('${tecnico}')" style="min-width: 120px; padding: 0.5rem 1rem; background: linear-gradient(135deg, #28a745, #34ce57);">
                            <i class="fas fa-save"></i> Salvar
                        </button>
                        <button onclick="cancelarEdicaoTecnico('${tecnico}')" style="min-width: 120px; padding: 0.5rem 1rem; background: linear-gradient(135deg, #6c757d, #868e96);">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                `;
            } else {
                lista.forEach((r) => {
                    bloco.innerHTML += `Tempo: ${Utils.formatarTempo(r.minutos, r.jornada)}.<br>`;
                    bloco.innerHTML += `Motivo: ${r.motivo}<br><br>`;
                });

                bloco.innerHTML += `
                    <button onclick="editarTecnico('${tecnico}')" style="min-width: 120px; padding: 0.5rem 1rem; margin-top: 0.5rem; background: linear-gradient(135deg, #4a6382, #5a7b9c);">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                `;
            }

            resultadoDiv.appendChild(bloco);
            if (index < tecnicos.length - 1) {
                let separador = document.createElement("div");
                separador.className = "separador-linha";
                resultadoDiv.appendChild(separador);
            }
        });
    },

    emitirRelatorio() {
        const data = document.getElementById("data-ativacao")?.value;
        const cidade = document.getElementById("cidade")?.value;
        const responsavel = document.getElementById("responsavel")?.value;

        if (!data || !cidade || !responsavel) {
            alert("Preencha todos os campos: Data, Cidade e Responsável!");
            return;
        }

        const nomes = document.querySelectorAll(".nomeTecnico");
        const tabelas = document.querySelectorAll(".tabelaDados");
        const blocos = document.querySelectorAll(".equipe-bloco");

        let totalEquipes = 0;
        nomes.forEach((nome) => { if (nome.value.trim() !== "") totalEquipes++; });

        if (totalEquipes === 0) {
            alert("Adicione pelo menos uma equipe!");
            return;
        }

        let relatorio = "";
        let totalPlanejamentoGeral = 0, totalExecutadoGeral = 0, totalRemarcacaoGeral = 0, totalCancelamentoGeral = 0;

        relatorio += `Relatório de Ativação – ${Utils.formatarData(data)} - ${cidade}\n`;
        relatorio += `Responsável: ${responsavel}\n`;
        relatorio += `Número de Equipes: ${totalEquipes}\n\n`;

        const dadosParaSalvar = { cidade, responsavel, equipes: [] };

        for (let i = 0; i < nomes.length; i++) {
            const nome = nomes[i].value.trim();
            const dados = ProcessadorTabela.processar(tabelas[i].value);

            if (!nome || !dados) continue;

            totalPlanejamentoGeral += dados.planejamento;
            totalExecutadoGeral += dados.totalExecutado;
            totalRemarcacaoGeral += dados.remarcacao;
            totalCancelamentoGeral += dados.cancelamento;

            relatorio += `-----------------------------------------------\n\n`;
            relatorio += `Equipe Técnica: ${nome}\n\n`;
            relatorio += `    • Protocolos Planejamento: ${dados.planejamento}\n`;
            relatorio += `    • Protocolos Execução: ${dados.execucao}\n`;
            relatorio += `    • Protocolos Remarcação: ${dados.remarcacao}\n`;
            relatorio += `    • Protocolos Cancelamento: ${dados.cancelamento}\n`;
            relatorio += `    • Protocolos Tratativas CS: ${dados.tratativasCS}\n`;
            relatorio += `    • Protocolos Infraestrutura: ${dados.infraestrutura}\n`;
            relatorio += `    • Protocolos Resolução N2: ${dados.resolucaoN2}\n\n`;
            relatorio += `Resumo de Atividades:\n\n`;

            for (let tipo in dados.mapa) {
                relatorio += `          • ${tipo}: ${dados.mapa[tipo]}\n`;
            }

            relatorio += `\n`;
            relatorio += `    • Total de Serviços Executados: ${dados.totalExecutado.toString().replace(".", ",")}\n`;

            let produtividade = 0;
            for (let tipo in dados.mapa) {
                produtividade += ProcessadorTabela.encontrarPesoServico(tipo) * dados.mapa[tipo];
            }
            relatorio += `    • Total de Produtividade: ${produtividade.toFixed(2).replace(".", ",")}\n\n`;

            relatorio += `Justificativa:\n`;

            let contadorJustificativas = 1;
            const justificativasContainer = blocos[i].querySelector(".justificativas-container");
            const justificativasManuais = [];

            if (justificativasContainer) {
                justificativasContainer.querySelectorAll(".justificativa-texto").forEach((input) => {
                    const texto = input.value.trim();
                    if (texto !== "") {
                        relatorio += `${contadorJustificativas}º ${texto}\n`;
                        justificativasManuais.push(texto);
                        contadorJustificativas++;
                    }
                });
            }

            let retiradas = DataManager.buscarRetiradasPorTecnicoData(nome, data);
            if (retiradas && retiradas.length > 0) {
                retiradas.forEach((retirada) => {
                    relatorio += `${contadorJustificativas}º ${retirada.motivo} - Tempo: ${Utils.formatarTempo(retirada.minutos, retirada.jornada)}\n`;
                    contadorJustificativas++;
                });
            }

            relatorio += `\n`;
            dadosParaSalvar.equipes.push({ nome, tabela: tabelas[i].value, justificativas: justificativasManuais });
        }

        let blocoTotais = `    • Total de Protocolos: ${totalPlanejamentoGeral}\n`;
        blocoTotais += `    • Total de Execução: ${totalExecutadoGeral.toFixed(2).replace(".", ",")}\n`;
        blocoTotais += `    • Total de Remarcações: ${totalRemarcacaoGeral}\n`;
        blocoTotais += `    • Total de Cancelamentos: ${totalCancelamentoGeral}\n\n`;

        relatorio = relatorio.replace(`Número de Equipes: ${totalEquipes}\n\n`, `Número de Equipes: ${totalEquipes}\n\n${blocoTotais}`);

        DataManager.salvarRelatorio(data, dadosParaSalvar);

        let btnCopy = document.querySelector(".btn-copy");
        if (btnCopy) btnCopy.style.display = "inline-flex";

        let resultadoDiv = document.getElementById("resultado-ativacao");
        if (resultadoDiv) resultadoDiv.innerHTML = relatorio;
    },

    carregarRelatorio() {
        const data = document.getElementById("data-ativacao")?.value;
        if (!data) {
            alert("Selecione uma data primeiro!");
            return;
        }

        const itemSalvo = DataManager.carregarRelatorio(data);
        if (!itemSalvo) {
            alert("Nenhum relatório encontrado para esta data!");
            return;
        }

        try {
            const dados = itemSalvo.dados;

            document.getElementById("equipes").innerHTML = "";
            document.getElementById("cidade").value = dados.cidade || "";
            document.getElementById("responsavel").value = dados.responsavel || "";

            if (dados.equipes && dados.equipes.length > 0) {
                dados.equipes.forEach((equipe) => {
                    this.adicionarEquipe();
                    const bloco = document.querySelectorAll(".equipe-bloco")[document.querySelectorAll(".equipe-bloco").length - 1];
                    bloco.querySelector(".nomeTecnico").value = equipe.nome || "";
                    bloco.querySelector(".tabelaDados").value = equipe.tabela || "";

                    const container = bloco.querySelector(".justificativas-container");
                    if (container && equipe.justificativas) {
                        equipe.justificativas.forEach((just) => {
                            this.adicionarJustificativa(container);
                            container.querySelectorAll(".justificativa-texto")[container.querySelectorAll(".justificativa-texto").length - 1].value = just;
                        });
                    }
                });
            }

            alert("Relatório carregado com sucesso!");
        } catch (e) {
            alert("Erro ao carregar relatório!");
            console.error(e);
        }
    },

    apagarRelatorio() {
        const data = document.getElementById("data-ativacao")?.value;
        if (!data) {
            alert("Selecione uma data primeiro!");
            return;
        }

        if (!confirm(`⚠️ Deseja realmente apagar o relatório da data ${Utils.formatarData(data)}?`)) return;

        if (DataManager.apagarRelatorioPorData(data)) {
            document.getElementById("resultado-ativacao").innerHTML = "";
            document.getElementById("equipes").innerHTML = "";
            document.getElementById("cidade").value = "";
            document.getElementById("responsavel").value = "";
            alert(`✅ Relatório da data ${Utils.formatarData(data)} apagado com sucesso!`);
        } else {
            alert(`❌ Nenhum relatório encontrado para a data ${Utils.formatarData(data)}.`);
        }
    },

    limparDataRetirada() {
        let dataSelecionada = document.getElementById("data-retirada")?.value;
        let tecnicoSelecionado = document.getElementById("tecnico")?.value.trim();

        if (!dataSelecionada || !tecnicoSelecionado) {
            alert("Selecione uma data e um técnico!");
            return;
        }

        if (!confirm("Deseja realmente excluir todos os registros desta data para este técnico?")) return;

        DataManager.registros = DataManager.registros.filter((r) => !(r.data === dataSelecionada && r.tecnico === tecnicoSelecionado));
        DataManager.salvarLocal();
        document.getElementById("resultado-retirada").innerHTML = "";
        this.atualizarTempoTotal();
        alert("Registros removidos com sucesso!");
    },

    copiarRelatorio() {
        const resultadoDiv = document.getElementById("resultado-ativacao");
        if (!resultadoDiv) return;

        const relatorioTexto = resultadoDiv.innerText.trim();
        if (!relatorioTexto) {
            alert("Nenhum relatório para copiar!");
            return;
        }

        navigator.clipboard.writeText(relatorioTexto).then(() => {
            const btn = document.querySelector(".btn-copy");
            if (btn) {
                const textoOriginal = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                btn.style.background = "linear-gradient(135deg, #28a745, #34ce57)";
                setTimeout(() => {
                    btn.innerHTML = textoOriginal;
                    btn.style.background = "linear-gradient(135deg, #2c405c, #364d6b)";
                }, 2000);
            }
        }).catch(() => {
            const textArea = document.createElement("textarea");
            textArea.value = relatorioTexto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            alert("Relatório copiado!");
        });
    },

    mudarAba(aba) {
        // Atualizar título da página
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = aba === 'ativacao' ? 'Relatório de Ativação' : 'Retirada de Tempo';
        }

        // Remover active de todos os itens do menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adicionar active no item correspondente
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems.length >= 2) {
            if (aba === 'ativacao') {
                navItems[0].classList.add('active');
            } else {
                navItems[1].classList.add('active');
            }
        }

        // Mostrar a aba correspondente
        document.getElementById('aba-ativacao').classList.remove('ativo');
        document.getElementById('aba-retirada').classList.remove('ativo');
        document.getElementById('aba-' + aba).classList.add('ativo');
    },

    logout() {
        LoginManager.logout();
    },
};

// ========== INICIALIZAÇÃO ==========
DataManager.limparDadosAntigos();

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("login-form")) {
        LoginManager.checkExistingSession();
        LoginManager.initLoginPage();
    } else {
        const sessionData = localStorage.getItem("vtx_session");
        if (!sessionData) {
            window.location.href = "index.html";
            return;
        }

        try {
            const session = JSON.parse(sessionData);
            const now = new Date().getTime();
            if (now - session.loginTime >= SESSION_DURATION) {
                localStorage.removeItem("vtx_session");
                window.location.href = "index.html";
                return;
            }
        } catch (e) {
            localStorage.removeItem("vtx_session");
            window.location.href = "index.html";
            return;
        }

        UI.init();
    }
});

// ========== EXPOR FUNÇÕES PARA O HTML ==========
window.mudarAba = (aba) => UI.mudarAba(aba);
window.copiarRelatorio = () => UI.copiarRelatorio();
window.adicionarEquipe = () => UI.adicionarEquipe();
window.carregarRelatorio = () => UI.carregarRelatorio();
window.emitirRelatorio = () => UI.emitirRelatorio();
window.apagarRelatorio = () => UI.apagarRelatorio();
window.adicionarJustificativa = (container) => UI.adicionarJustificativa(container);
window.removerJustificativa = (botao) => UI.removerJustificativa(botao);
window.adicionarRetirada = () => UI.adicionarRetirada();
window.finalizarRetirada = () => UI.finalizarRetirada();
window.limparDataRetirada = () => UI.limparDataRetirada();
window.editarTecnico = (tecnico) => UI.editarTecnico(tecnico);
window.salvarEdicoesTecnico = (tecnico) => UI.salvarEdicoesTecnico(tecnico);
window.cancelarEdicaoTecnico = (tecnico) => UI.cancelarEdicaoTecnico(tecnico);
window.excluirRetirada = (indice) => UI.excluirRetirada(indice);
window.logout = () => UI.logout();
window.togglePassword = () => LoginManager.togglePassword();
window.handleLogin = () => LoginManager.handleLogin();
window.toggleSidebar = () => document.querySelector('.sidebar').classList.toggle('active');