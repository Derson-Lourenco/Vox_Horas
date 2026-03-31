// ========== CONFIGURAÇÕES ==========
const CONFIG = {
    DIAS_PARA_EXPIRAR: 7,
    JORNADAS: {
        COMERCIAL: "Comercial",
        DOZE_TRINTA_SEIS: "12/36",
    },
};

const API_URL =
    "https://script.google.com/a/macros/virtex.com.br/s/AKfycbzGwkbuxtSB6ca7wpEcK3LbVCiuTgvBlE54kniKqqSELHhoVX84nz7Wqds9GzH7r-v3/exec";

// ========== LISTA DE EMAILS AUTORIZADOS COM DADOS DO TÉCNICO ==========
const USERS_DATA = [
    {email: "anderson.vtx@gmail.com", nome: "Anderson Lourenço", cidade: "Picos - PI"},
    {email: "teste@gmail.com", nome: "Técnico Teste", cidade: "Teresina - PI"},
    {email: "hamuel.vtx@gmail.com", nome: "Hamuel", cidade: "Picos - PI"},
    {email: "nadya.vtx@gmail.com", nome: "Nadya", cidade: "Picos - PI"},
    {email: "lucas.vtx@gmail.com", nome: "Lucas", cidade: "Picos - PI"},
    {email: "jailton.vtx@gmail.com", nome: "Jailton", cidade: "Picos - PI"},
    {email: "rafael.vtx@gmail.com", nome: "Rafael", cidade: "Picos - PI"},
    {email: "maria.vtx@gmail.com", nome: "Maria", cidade: "Picos - PI"},
];

const ALLOWED_EMAILS = USERS_DATA.map((user) => user.email);
const PASSWORD = "vtx2026";
const SESSION_DURATION = 10 * 60 * 60 * 1000;

// ========== FUNÇÃO PARA OBTER DADOS DO USUÁRIO ==========
function getUsuarioLogado() {
    const sessionData = localStorage.getItem("vtx_session");
    if (!sessionData) return null;

    try {
        const session = JSON.parse(sessionData);
        const email = session.email;
        const usuario = USERS_DATA.find((user) => user.email === email);
        return usuario;
    } catch (e) {
        return null;
    }
}

// ========== FUNÇÃO PARA PREENCHER DADOS DO TÉCNICO INTERNO ==========
function preencherDadosTecnicoInterno() {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const cidadeInput = document.getElementById("cidade");
    const responsavelInput = document.getElementById("responsavel");

    if (cidadeInput && usuario.cidade) {
        cidadeInput.value = usuario.cidade;
    }

    if (responsavelInput && usuario.nome) {
        responsavelInput.value = usuario.nome;
    }
}

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

const SERVICOS_IGNORADOS = ["ALMOCO", "DESLOCAMENTO", "CHUVA", "RETIRADA DE TEMPO", "BANCO DE HORAS"];

// ========== TIPOS QUE DEVEM SER TRATADOS COMO RETIRADA DE TEMPO ==========
const TIPOS_RETIRADA = [
    "RV", // Remarcação
    "RC", // Reagendamento
    "DSS", // Demanda Suplementar de Serviço
    "BANCO DE HORAS", // Banco de horas
    "DESLOCAMENTO", // Deslocamento
    "RETIRADA DE TEMPO", // Retirada de tempo
    "CHUVA", // Chuva
    "CANCELAMENTO", // Cancelamento
    "INFRAESTRUTURA", // Infraestrutura
];

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
    formatarData(dataISO) {
        if (!dataISO) return "";
        const partes = dataISO.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },
    formatarDataParaAba(dataISO) {
        if (!dataISO) return "";
        const partes = dataISO.split("-");
        return `${partes[2]}/${partes[1]}`;
    },
    formatarTempo(minutos, jornada = "Comercial") {
        if (jornada === "12/36") {
            const fator = 8 / 12;
            minutos = Math.round(minutos * fator);
            if (minutos === 0 && (minutos * 12) / 8 > 0) {
                minutos = 1;
            }
        }
        if (minutos === 0) return "";
        let horas = Math.floor(minutos / 60);
        let mins = minutos % 60;
        let partes = [];
        if (horas === 1) partes.push("1 hora");
        else if (horas > 1) partes.push(horas + " horas");
        if (mins === 1) partes.push("1 minuto");
        else if (mins > 1) partes.push(mins + " minutos");
        return partes.join(" e ");
    },
    calcularMinutos(inicio, fim) {
        if (!inicio || !fim) return null;
        const [h1, m1] = inicio.split(":").map(Number);
        const [h2, m2] = fim.split(":").map(Number);
        if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) {
            return null;
        }
        const minutosInicio = h1 * 60 + m1;
        const minutosFim = h2 * 60 + m2;
        if (minutosFim <= minutosInicio) {
            return null;
        }
        return minutosFim - minutosInicio;
    },
    minutosParaHoraMinutos(minutos) {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    },
};

// ========== GESTÃO DE DADOS ==========
const DataManager = {
    registros: JSON.parse(localStorage.getItem("registros")) || [],
    justificativasAdicionais: JSON.parse(localStorage.getItem("justificativas_adicionais")) || {},
    salvarLocal() {
        localStorage.setItem("registros", JSON.stringify(this.registros));
        localStorage.setItem("justificativas_adicionais", JSON.stringify(this.justificativasAdicionais));
    },
    salvarRelatorio(data, dados) {
        const chave = `relatorio_${data}`;
        localStorage.setItem(chave, JSON.stringify({data, dados, dataSalva: new Date().toISOString()}));
    },
    carregarRelatorio(data) {
        const chave = `relatorio_${data}`;
        const itemSalvo = localStorage.getItem(chave);
        return itemSalvo ? JSON.parse(itemSalvo) : null;
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
        const todas = this.registros.filter(
            (r) => r.tecnico.toLowerCase().trim() === tecnico.toLowerCase().trim() && r.data === data
        );
        const unicos = [];
        const chaves = new Set();
        todas.forEach((r) => {
            const chave = `${r.motivo}_${r.minutos}_${r.inicio}_${r.fim}`;
            if (!chaves.has(chave)) {
                chaves.add(chave);
                unicos.push(r);
            }
        });
        return unicos;
    },
    getJustificativasAdicionais(tecnico, data) {
        const key = `${tecnico}_${data}`;
        return this.justificativasAdicionais[key] || [];
    },
    addJustificativaAdicional(tecnico, data, justificativa) {
        const key = `${tecnico}_${data}`;
        if (!this.justificativasAdicionais[key]) this.justificativasAdicionais[key] = [];
        this.justificativasAdicionais[key].push({
            id: Date.now(),
            texto: justificativa,
            dataCriacao: new Date().toISOString(),
            origem: "planilha",
        });
        this.salvarLocal();
    },
    addJustificativasAdicionaisBatch(tecnico, data, justificativas) {
        const key = `${tecnico}_${data}`;
        if (!this.justificativasAdicionais[key]) this.justificativasAdicionais[key] = [];

        justificativas.forEach((just) => {
            const jaExiste = this.justificativasAdicionais[key].some((existente) => existente.texto === just.texto);
            if (!jaExiste && just.texto && just.texto.trim()) {
                this.justificativasAdicionais[key].push({
                    id: Date.now() + Math.random(),
                    texto: just.texto.trim(),
                    dataCriacao: new Date().toISOString(),
                    origem: "planilha",
                });
            }
        });
        this.salvarLocal();
    },
    updateJustificativaAdicional(tecnico, data, id, novoTexto) {
        const key = `${tecnico}_${data}`;
        if (this.justificativasAdicionais[key]) {
            const index = this.justificativasAdicionais[key].findIndex((j) => j.id === id);
            if (index !== -1) {
                this.justificativasAdicionais[key][index].texto = novoTexto;
                this.salvarLocal();
            }
        }
    },
    deleteJustificativaAdicional(tecnico, data, id) {
        const key = `${tecnico}_${data}`;
        if (this.justificativasAdicionais[key]) {
            this.justificativasAdicionais[key] = this.justificativasAdicionais[key].filter((j) => j.id !== id);
            this.salvarLocal();
        }
    },
};

// ========== FUNÇÃO PARA OBTER REGIONAL DO TÉCNICO ==========
function obterRegionalPorTecnico(tecnicoNome) {
    for (let regional in regionais) {
        if (regionais[regional] && regionais[regional].includes(tecnicoNome)) return regional;
    }
    return "Regional não informada";
}

// ========== FUNÇÃO AUXILIAR PARA VERIFICAR SE TEM HORÁRIO VÁLIDO ==========
function temHorarioValido(texto) {
    if (!texto || texto === "" || texto === "0") return false;

    texto = String(texto).trim();

    // Verifica se tem formato de horário (HH:MM)
    const padraoHorario = /(\d{1,2}:\d{2})/;
    if (padraoHorario.test(texto)) return true;

    // Verifica se tem números que podem representar minutos (ex: "60min", "30 min")
    const padraoMinutos = /(\d+)\s*min/i;
    if (padraoMinutos.test(texto)) return true;

    // Se tiver apenas números isolados, não considera como horário válido
    // Exemplo: "123", "abc", "teste", etc.
    return false;
}

// ========== FUNÇÃO PARA EXTRAIR HORÁRIOS ==========
function extrairHorarios(texto) {
    if (!texto || texto === "") return null;
    texto = String(texto).trim();

    // Verifica se tem letras e números misturados sem formato de horário
    if (/[a-zA-Z]/.test(texto) && !/(\d{1,2}:\d{2})/.test(texto) && !/(\d+)\s*min/i.test(texto)) {
        return null;
    }

    const padraoComAcento = /(\d{1,2}:\d{2})\s*[àaÁá]\s*(\d{1,2}:\d{2})/i;
    const padraoAs = /(\d{1,2}:\d{2})\s*as\s*(\d{1,2}:\d{2})/i;
    const padraoAte = /(\d{1,2}:\d{2})\s*at[eé]\s*(\d{1,2}:\d{2})/i;
    const padraoHifen = /(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/;
    const padraoBarra = /(\d{1,2}:\d{2})\s*\/\s*(\d{1,2}:\d{2})/;

    let match = texto.match(padraoComAcento);
    if (match) return {inicio: match[1], fim: match[2]};
    match = texto.match(padraoAs);
    if (match) return {inicio: match[1], fim: match[2]};
    match = texto.match(padraoAte);
    if (match) return {inicio: match[1], fim: match[2]};
    match = texto.match(padraoHifen);
    if (match) return {inicio: match[1], fim: match[2]};
    match = texto.match(padraoBarra);
    if (match) return {inicio: match[1], fim: match[2]};

    const horarioUnico = texto.match(/(\d{1,2}:\d{2})/);
    if (horarioUnico) {
        return {inicio: horarioUnico[1], fim: null};
    }

    const minutosDir = texto.match(/(\d+)\s*min/i);
    if (minutosDir) {
        return {minutosDiretos: parseInt(minutosDir[1])};
    }

    return null;
}

// ========== PROCESSADOR DE DADOS DA PLANILHA COM LOGS ==========
const PlanilhaProcessor = {
    async carregarDadosPorData(dataISO) {
        return new Promise((resolve, reject) => {
            const callbackName = "callback_" + Date.now();
            const url = `${API_URL}?callback=${callbackName}&data=${dataISO}&t=${Date.now()}`;
            let timeout = setTimeout(() => {
                reject("Timeout na API");
            }, 15000);

            window[callbackName] = function (data) {
                clearTimeout(timeout);

                // ADICIONA PROTOCOLO VIRTUAL "1" PARA STATUS PRIORITÁRIOS COM PROTOCOLO VAZIO
                if (data && data.dados && Array.isArray(data.dados)) {
                    const tiposPrioritarios = ["DSS", "BANCO DE HORAS", "DESLOCAMENTO", "RETIRADA DE TEMPO", "CHUVA"];

                    for (let i = 0; i < data.dados.length; i++) {
                        const item = data.dados[i];
                        const linha = item.linha;

                        if (linha && linha[12]) {
                            // Coluna FEITO (índice 12)
                            const feito = linha[12].toString().toUpperCase().trim();
                            const protocolo = linha[4] ? linha[4].toString().trim() : "";

                            // Verifica se é tipo prioritário
                            const isPrioritario = tiposPrioritarios.some((tipo) => {
                                return feito === tipo;
                            });

                            // Se for prioritário E protocolo vazio, adiciona "1"
                            if (isPrioritario && protocolo === "") {
                                console.log(
                                    `🔧 PROTOCOLO VIRTUAL ADICIONADO NA CARGA: FEITO="${feito}", PROTOCOLO="" -> "1"`
                                );
                                linha[4] = "1";
                            }
                        }
                    }
                }

                resolve(data);
                delete window[callbackName];
                if (script) script.remove();
            }.bind(this);

            const script = document.createElement("script");
            script.src = url;
            script.onerror = () => {
                clearTimeout(timeout);
                delete window[callbackName];
                script.remove();
                reject("Erro ao carregar script");
            };
            document.body.appendChild(script);
        });
    },

    extrairDadosArray(dadosAPI) {
        if (!dadosAPI || dadosAPI.length === 0) return [];
        if (dadosAPI[0] && dadosAPI[0].linha) {
            return dadosAPI.map((item) => item.linha);
        }
        if (Array.isArray(dadosAPI[0])) {
            return dadosAPI;
        }
        return [];
    },
    extrairNotaFeito(dadosAPI, linhaIndex) {
        if (!dadosAPI || dadosAPI.length === 0) return "";
        if (Array.isArray(dadosAPI[0]) && !dadosAPI[0].hasOwnProperty("linha")) return "";
        if (dadosAPI[linhaIndex] && dadosAPI[linhaIndex].notaFeito !== undefined) {
            const nota = dadosAPI[linhaIndex].notaFeito;
            if (nota && nota.trim()) return nota;
        }
        return "";
    },
    getColunas(dadosAPI) {
        if (!dadosAPI || dadosAPI.length === 0) return {};
        if (dadosAPI[0] && dadosAPI[0].colunas) {
            return dadosAPI[0].colunas;
        }
        return {
            EQUIPE: 1,
            TECNICO: 2,
            PROTOCOLO: 4,
            SERVICO: 6,
            TEMPO_EXECUCAO: 11,
            FEITO: 12,
            BAIRRO: 10,
        };
    },
    extrairTecnicosPorRegional(dadosAPI) {
        if (dadosAPI.regionaisMap && Object.keys(dadosAPI.regionaisMap).length > 0) {
            return dadosAPI.regionaisMap;
        }
        const dados = this.extrairDadosArray(dadosAPI);
        if (!dados || dados.length === 0) return {};
        let regionais = {};
        let regionalAtual = "SEM REGIONAL";
        for (let i = 0; i < dados.length; i++) {
            const linha = dados[i];
            if (!linha) continue;
            const colB = (linha[1] || "").toString().trim();
            const colC = (linha[2] || "").toString().trim();
            if (colB && (colB.toUpperCase().includes("REGIONAL") || colB.toUpperCase().includes("DEMAIS"))) {
                regionalAtual = colB;
                if (!regionais[regionalAtual]) regionais[regionalAtual] = [];
                continue;
            }
            if (
                colB === "0" &&
                colC &&
                colC.length > 3 &&
                !colC.includes("BANCO") &&
                !colC.includes("PROTOCOLO") &&
                !colC.includes("DATA") &&
                !colC.includes("SERVIÇO") &&
                !colC.includes("#REF!")
            ) {
                let nomeTecnico = colC.trim();
                if (!regionais[regionalAtual]) regionais[regionalAtual] = [];
                if (!regionais[regionalAtual].includes(nomeTecnico)) {
                    regionais[regionalAtual].push(nomeTecnico);
                }
            }
        }
        return regionais;
    },
    processarDadosTecnicoPorRegional(dadosAPI, tecnicoNome, regionalNome) {
        const dados = this.extrairDadosArray(dadosAPI);
        const colunas = this.getColunas(dadosAPI);
        const idxProtocolo = colunas.PROTOCOLO;
        const idxServico = colunas.SERVICO;
        const idxFeito = colunas.FEITO;
        const idxEquipe = colunas.EQUIPE;
        const idxTecnico = colunas.TECNICO;

        // ========== ADICIONA PROTOCOLO VIRTUAL "1" PARA STATUS PRIORITÁRIOS ==========
        const tiposPrioritarios = ["DSS", "BANCO DE HORAS", "DESLOCAMENTO", "RETIRADA DE TEMPO", "CHUVA"];

        for (let i = 0; i < dados.length; i++) {
            const linha = dados[i];
            if (!linha) continue;

            const feito = linha[idxFeito] ? linha[idxFeito].toString().toUpperCase().trim() : "";
            const protocolo = linha[idxProtocolo] ? linha[idxProtocolo].toString().trim() : "";

            const isPrioritario = tiposPrioritarios.some((tipo) => {
                const tipoNorm = Utils.normalizarTexto(tipo);
                const feitoNorm = Utils.normalizarTexto(feito);
                return tipoNorm === feitoNorm;
            });

            if (isPrioritario && (protocolo === "" || protocolo === "0")) {
                console.log(`🔧 PROTOCOLO VIRTUAL ADICIONADO: FEITO="${feito}", PROTOCOLO="" -> "1"`);
                linha[idxProtocolo] = "1";
            }
        }
        // ========== FIM DA ADIÇÃO ==========

        const calcularValorServico = (servico) => {
            const s = servico.toUpperCase().replace(/\s+/g, "");
            if (s.includes("RECORRÊNCIA")) return 1;
            if (s.includes("REC+") && s.includes("DES.PORTA")) return 0.5;
            if (servico.includes("DES.") || servico.includes("DESAT") || servico.includes("RECOLHER")) return 0.25;
            if (servico.includes("+")) return 1.5;
            if (
                servico.includes("IPTV") ||
                servico.includes("TV") ||
                servico.includes("SVA") ||
                servico.includes("BOX")
            )
                return 0.5;
            return 1;
        };
        let processandoTecnico = false;
        let planejamento = 0,
            execucao = 0,
            remarcacao = 0,
            cancelamento = 0;
        let tratativasCS = 0,
            infraestrutura = 0,
            resolucaoN2 = 0,
            totalExecutado = 0;
        let mapa = {};

        for (let i = 0; i < dados.length; i++) {
            const linha = dados[i];
            if (!linha) continue;
            const colB = (linha[idxEquipe] || "").toString().trim();
            const colC = (linha[idxTecnico] || "").toString().trim();
            const colProtocolo = linha[idxProtocolo] ? linha[idxProtocolo].toString().trim() : "";

            if (colB === "0" && colC === tecnicoNome) {
                processandoTecnico = true;
                continue;
            }
            if (processandoTecnico && colB === "0" && colC && colC !== tecnicoNome && colC.length > 3) {
                processandoTecnico = false;
                break;
            }
            if (!processandoTecnico) continue;

            let protocolo = colProtocolo;
            let servicoOriginal = linha[idxServico] ? linha[idxServico].toString().trim() : "";
            let feito = linha[idxFeito] ? linha[idxFeito].toString().trim() : "";

            protocolo = protocolo.replace(/[\x00-\x1F\x7F]/g, "");
            servicoOriginal = servicoOriginal.replace(/[\x00-\x1F\x7F]/g, "");
            feito = feito.replace(/[\x00-\x1F\x7F]/g, "");

            const servicoNormalizado = Utils.normalizarTexto(servicoOriginal);
            const feitoNormalizado = Utils.normalizarTexto(feito);

            // VERIFICA SE É UM TIPO DE RETIRADA PERMITIDO (protocolo pode ser vazio)
            const tiposRetiradaPermitidos = ["DSS", "BANCO DE HORAS", "DESLOCAMENTO", "RETIRADA DE TEMPO", "CHUVA"];
            const isRetiradaPermitida = tiposRetiradaPermitidos.some((tipo) => {
                const tipoNormalizado = Utils.normalizarTexto(tipo);
                return feitoNormalizado === tipoNormalizado;
            });

            // Se NÃO for retirada permitida, valida o protocolo
            if (!isRetiradaPermitida) {
                // Se for retirada NÃO permitida, exige protocolo válido
                if (protocolo === "" || protocolo === "0") continue;
                if (!/^\d+$/.test(protocolo)) continue;
                if (protocolo === "PROTOCOLO") continue;
            } else {
                // Se for retirada permitida, aceita mesmo com protocolo vazio
                console.log(`✅ Retirada permitida encontrada: FEITO="${feito}", PROTOCOLO="${protocolo || "VAZIO"}"`);
            }

            // Ignora serviços específicos
            if (SERVICOS_IGNORADOS.some((ignorado) => servicoNormalizado.includes(Utils.normalizarTexto(ignorado)))) {
                continue;
            }

            const servicosResumo = ["M.E.", "MMA", "RESUMO", "TOTAL", "EQUIPE"];
            if (servicosResumo.some((resumo) => servicoOriginal.includes(resumo))) {
                continue;
            }

            if (feitoNormalizado === "NENHUM" || feito === "0" || feito === "-" || feito === "") {
                continue;
            }

            planejamento++;

            if (feitoNormalizado.includes("CANCEL")) {
                cancelamento++;
                continue;
            }

            if (feitoNormalizado === "RV" || feitoNormalizado === "RC") {
                remarcacao++;
                continue;
            }

            const linhaCompleta = Utils.normalizarTexto(protocolo + " " + servicoOriginal + " " + feito);
            if (linhaCompleta.includes("TRATAT")) {
                tratativasCS++;
                continue;
            }
            if (linhaCompleta.includes("INFRA")) {
                infraestrutura++;
                continue;
            }
            if (linhaCompleta.includes("NIVEL 2") || linhaCompleta.includes("N2")) {
                resolucaoN2++;
                continue;
            }
            if (
                feitoNormalizado.includes("OK") ||
                feitoNormalizado.includes("FEITO") ||
                feitoNormalizado.includes("ENCERRAMENTO")
            ) {
                execucao++;
                const valor = calcularValorServico(servicoOriginal);
                totalExecutado += valor;
                if (!mapa[servicoOriginal]) mapa[servicoOriginal] = 0;
                mapa[servicoOriginal] += 1;
            }
        }
        let produtividade = 0;
        for (let tipo in mapa) {
            let servicoNorm = Utils.normalizarTexto(tipo);
            let peso = 1;
            for (let [chave, valor] of Object.entries(TABELA_PESOS)) {
                if (Utils.normalizarTexto(chave) === servicoNorm) {
                    peso = valor;
                    break;
                }
            }
            produtividade += peso * mapa[tipo];
        }
        return {
            planejamento,
            execucao,
            totalExecutado,
            remarcacao,
            cancelamento,
            tratativasCS,
            infraestrutura,
            resolucaoN2,
            mapa,
            produtividade,
        };
    },

    // ========== FUNÇÃO PARA PROCESSAR RETIRADAS COM TEMPO ==========
    processarRetiradasDoTecnico(dadosAPI, tecnicoNome) {
        const retiradas = [];
        const dados = this.extrairDadosArray(dadosAPI);
        const colunas = this.getColunas(dadosAPI);
        const idxServico = colunas.SERVICO;
        const idxFeito = colunas.FEITO;
        const idxTempo = colunas.TEMPO_EXECUCAO;
        const idxEquipe = colunas.EQUIPE;
        const idxTecnico = colunas.TECNICO;

        // Lista de tipos PRIORITÁRIOS que DEVEM ser processados
        const tiposPrioritarios = ["DSS", "BANCO DE HORAS", "DESLOCAMENTO", "RETIRADA DE TEMPO", "CHUVA"];

        // PRIMEIRA PASSADA: PROCURA EM TODAS AS LINHAS POR TIPOS PRIORITÁRIOS
        // Não depende da estrutura de blocos!
        for (let i = 0; i < dados.length; i++) {
            const linha = dados[i];
            if (!linha) continue;

            const colB = (linha[idxEquipe] || "").toString().trim();
            const colC = (linha[idxTecnico] || "").toString().trim();
            const feito = (linha[idxFeito] || "").toString().toUpperCase();
            const feitoNormalizado = Utils.normalizarTexto(feito);
            const protocolo = (linha[4] || "").toString().trim();

            // Verifica se é um tipo prioritário
            const isPrioritario = tiposPrioritarios.some((tipo) => {
                const tipoNormalizado = Utils.normalizarTexto(tipo);
                return feitoNormalizado === tipoNormalizado;
            });

            // Verifica se a linha pertence ao técnico
            // Caso 1: O técnico está na coluna de técnico
            let pertenceAoTecnico = colC === tecnicoNome;

            // Caso 2: Se não, verifica se está no bloco do técnico (entre cabeçalhos)
            if (!pertenceAoTecnico) {
                // Busca pelo cabeçalho do técnico antes desta linha
                for (let j = i - 1; j >= 0; j--) {
                    const linhaAnterior = dados[j];
                    if (!linhaAnterior) continue;
                    const colB_ant = (linhaAnterior[idxEquipe] || "").toString().trim();
                    const colC_ant = (linhaAnterior[idxTecnico] || "").toString().trim();

                    if (colB_ant === "0" && colC_ant === tecnicoNome) {
                        pertenceAoTecnico = true;
                        break;
                    }
                    // Se encontrou outro cabeçalho de técnico, para
                    if (colB_ant === "0" && colC_ant && colC_ant !== tecnicoNome && colC_ant.length > 3) {
                        break;
                    }
                }
            }

            // Se for prioritário E pertence ao técnico, processa
            if (isPrioritario && pertenceAoTecnico) {
                console.log(`🎯 PRIORITÁRIO encontrado: ${feito} para ${tecnicoNome} - Protocolo: "${protocolo}"`);

                let tempoExecucao = (linha[idxTempo] || "").toString();
                let notaFeito = this.extrairNotaFeito(dadosAPI, i);
                let servico = (linha[idxServico] || "").toString().toUpperCase();

                // Verifica se tem horário válido
                const temHorarioValidoFlag = temHorarioValido(tempoExecucao);

                if (temHorarioValidoFlag) {
                    let minutos = 0,
                        inicio = "",
                        fim = "",
                        motivo = "";
                    const horarios = extrairHorarios(tempoExecucao);

                    if (horarios) {
                        if (horarios.minutosDiretos) {
                            minutos = horarios.minutosDiretos;
                            inicio = "00:00";
                            fim = Utils.minutosParaHoraMinutos(minutos);
                        } else if (horarios.inicio && horarios.fim) {
                            inicio = horarios.inicio;
                            fim = horarios.fim;
                            minutos = Utils.calcularMinutos(inicio, fim);
                            if (minutos === null) minutos = 0;
                        } else if (horarios.inicio && !horarios.fim) {
                            inicio = horarios.inicio;
                            const fimDia = "23:59";
                            minutos = Utils.calcularMinutos(inicio, fimDia);
                            if (minutos && minutos > 0) {
                                fim = fimDia;
                            } else {
                                minutos = 60;
                                fim = "01:00";
                            }
                        }
                    } else {
                        const numeros = tempoExecucao.match(/\d+/g);
                        if (numeros && numeros.length >= 2) {
                            if (numeros.length === 2 && numeros[0].length <= 2 && numeros[1].length === 2) {
                                minutos = parseInt(numeros[0]) * 60 + parseInt(numeros[1]);
                                inicio = `${numeros[0].padStart(2, "0")}:${numeros[1].padStart(2, "0")}`;
                                fim = Utils.minutosParaHoraMinutos(minutos);
                            }
                        }
                    }

                    if (notaFeito && notaFeito.trim()) {
                        motivo = notaFeito;
                    } else {
                        motivo = feito;
                    }

                    if (minutos > 0) {
                        console.log(
                            `✅ Retirada PRIORITÁRIA processada: ${feito} - ${inicio} às ${fim} - ${minutos} minutos`
                        );
                        retiradas.push({inicio, fim, motivo, minutos, temHoras: true, tipo: feito});
                    } else {
                        console.log(`⚠️ Retirada prioritária sem minutos válidos: ${tempoExecucao}`);
                    }
                } else {
                    console.log(`📝 Retirada prioritária sem horário válido: ${tempoExecucao} - será justificativa`);
                }
            }
        }

        // SEGUNDA PASSADA: PROCESSO NORMAL PARA RETIRADAS COM PROTOCOLO (RV, RC, etc)
        let processandoTecnico = false;

        for (let i = 0; i < dados.length; i++) {
            const linha = dados[i];
            if (!linha) continue;

            const colB = (linha[idxEquipe] || "").toString().trim();
            const colC = (linha[idxTecnico] || "").toString().trim();

            if (colB === "0" && colC === tecnicoNome) {
                processandoTecnico = true;
                continue;
            }

            if (processandoTecnico && colB === "0" && colC && colC !== tecnicoNome && colC.length > 3) {
                processandoTecnico = false;
                break;
            }

            if (processandoTecnico) {
                let servico = (linha[idxServico] || "").toString().toUpperCase();
                let feito = (linha[idxFeito] || "").toString().toUpperCase();
                let tempoExecucao = (linha[idxTempo] || "").toString();
                let notaFeito = this.extrairNotaFeito(dadosAPI, i);
                let protocolo = linha[4] ? linha[4].toString().trim() : "";

                const feitoNormalizado = Utils.normalizarTexto(feito);

                // Verifica se é retirada (RV, RC, etc)
                const isRetirada = TIPOS_RETIRADA.some((tipo) => {
                    const tipoNormalizado = Utils.normalizarTexto(tipo);
                    return feitoNormalizado === tipoNormalizado;
                });

                // Só processa retiradas NÃO prioritárias (já processamos as prioritárias)
                if (isRetirada) {
                    const temHorarioValidoFlag = temHorarioValido(tempoExecucao);

                    if (temHorarioValidoFlag) {
                        let minutos = 0,
                            inicio = "",
                            fim = "",
                            motivo = "";
                        const horarios = extrairHorarios(tempoExecucao);

                        if (horarios) {
                            if (horarios.minutosDiretos) {
                                minutos = horarios.minutosDiretos;
                                inicio = "00:00";
                                fim = Utils.minutosParaHoraMinutos(minutos);
                            } else if (horarios.inicio && horarios.fim) {
                                inicio = horarios.inicio;
                                fim = horarios.fim;
                                minutos = Utils.calcularMinutos(inicio, fim);
                                if (minutos === null) minutos = 0;
                            } else if (horarios.inicio && !horarios.fim) {
                                inicio = horarios.inicio;
                                const fimDia = "23:59";
                                minutos = Utils.calcularMinutos(inicio, fimDia);
                                if (minutos && minutos > 0) {
                                    fim = fimDia;
                                } else {
                                    minutos = 60;
                                    fim = "01:00";
                                }
                            }
                        } else {
                            const numeros = tempoExecucao.match(/\d+/g);
                            if (numeros && numeros.length >= 2) {
                                if (numeros.length === 2 && numeros[0].length <= 2 && numeros[1].length === 2) {
                                    minutos = parseInt(numeros[0]) * 60 + parseInt(numeros[1]);
                                    inicio = `${numeros[0].padStart(2, "0")}:${numeros[1].padStart(2, "0")}`;
                                    fim = Utils.minutosParaHoraMinutos(minutos);
                                }
                            }
                        }

                        if (notaFeito && notaFeito.trim()) {
                            motivo = notaFeito;
                        } else {
                            motivo = feito;
                        }

                        if (minutos > 0) {
                            // Verifica se já não foi adicionada na primeira passada
                            const jaExiste = retiradas.some((r) => r.inicio === inicio && r.fim === fim);
                            if (!jaExiste) {
                                console.log(
                                    `✅ Retirada processada: ${feito} - ${inicio} às ${fim} - ${minutos} minutos`
                                );
                                retiradas.push({inicio, fim, motivo, minutos, temHoras: true, tipo: feito});
                            }
                        }
                    }
                }
            }
        }

        return retiradas;
    },

    // ========== FUNÇÃO PARA PROCESSAR JUSTIFICATIVAS ADICIONAIS (SEM HORÁRIO VÁLIDO) ==========
    processarJustificativasAdicionaisDoTecnico(dadosAPI, tecnicoNome) {
        const justificativas = [];
        const dados = this.extrairDadosArray(dadosAPI);
        const colunas = this.getColunas(dadosAPI);
        const idxServico = colunas.SERVICO;
        const idxFeito = colunas.FEITO;
        const idxTempo = colunas.TEMPO_EXECUCAO;
        const idxEquipe = colunas.EQUIPE;
        const idxTecnico = colunas.TECNICO;

        let processandoTecnico = false;

        for (let i = 0; i < dados.length; i++) {
            const linha = dados[i];
            if (!linha) continue;

            const colB = (linha[idxEquipe] || "").toString().trim();
            const colC = (linha[idxTecnico] || "").toString().trim();

            if (colB === "0" && colC === tecnicoNome) {
                processandoTecnico = true;
                continue;
            }

            if (processandoTecnico && colB === "0" && colC && colC !== tecnicoNome && colC.length > 3) {
                processandoTecnico = false;
                break;
            }

            if (processandoTecnico) {
                let servico = (linha[idxServico] || "").toString().toUpperCase();
                let feito = (linha[idxFeito] || "").toString().toUpperCase();
                let tempoExecucao = (linha[idxTempo] || "").toString().trim();
                let notaFeito = this.extrairNotaFeito(dadosAPI, i);

                const feitoNormalizado = Utils.normalizarTexto(feito);

                // MODIFICAÇÃO: Verifica APENAS na coluna FEITO se é um tipo de retirada
                const isRetirada = TIPOS_RETIRADA.some((tipo) => {
                    const tipoNormalizado = Utils.normalizarTexto(tipo);
                    return feitoNormalizado === tipoNormalizado;
                });

                // VERIFICA: é retirada e NÃO tem horário válido
                const temHorarioValidoFlag = temHorarioValido(tempoExecucao);

                if (isRetirada && !temHorarioValidoFlag) {
                    let motivo = "";
                    if (notaFeito && notaFeito.trim()) {
                        motivo = notaFeito.trim();
                    } else {
                        motivo = feito;
                    }

                    if (motivo && motivo.trim()) {
                        console.log(`📝 Justificativa adicional: ${feito} - ${motivo}`);
                        justificativas.push({
                            texto: motivo,
                            tipo: "adicional",
                            tempoExecucaoOriginal: tempoExecucao,
                            categoria: feitoNormalizado === "RV" || feitoNormalizado === "RC" ? "remarcacao" : "outros",
                        });
                    }
                }
            }
        }

        return justificativas;
    },
};

// ========== FUNÇÕES DE DEBUG ==========
async function debugVerificarNotas() {
    const data = document.getElementById("data-retirada")?.value;
    const tecnico = tecnicoSelect ? tecnicoSelect.getValue() : "";
    if (!data || !tecnico) {
        console.log("Selecione data e técnico primeiro!");
        return;
    }
    console.log("=== DEBUG VERIFICAR NOTAS ===");
    console.log("Data:", data);
    console.log("Técnico:", tecnico);
    const resposta = await PlanilhaProcessor.carregarDadosPorData(data);
    if (resposta.dados && resposta.dados.length > 0) {
        console.log(`Total de linhas: ${resposta.dados.length}`);
        for (let i = 0; i < resposta.dados.length; i++) {
            const item = resposta.dados[i];
            const linha = item.linha;
            const feito = linha[10] ? linha[10].toString().toUpperCase() : "";
            if (feito === "RC" || feito === "RV") {
                const tempoExecucao = linha[9] || "";
                const temHorario = temHorarioValido(tempoExecucao);
                console.log(
                    `\n🔍 Linha ${i}: Feito: ${feito}, NOTA: "${item.notaFeito}", Serviço: ${
                        linha[5] || ""
                    }, Temp. Execução: "${tempoExecucao}", Tem horário válido: ${temHorario ? "SIM" : "NÃO"}`
                );
            }
        }
    }
    console.log("\n=== FIM DEBUG ===");
}
window.debugVerificarNotas = debugVerificarNotas;

async function debugProtocoloVirtual() {
    const data = document.getElementById("data-retirada")?.value;
    const tecnico = "QUERA ABRAAO";

    if (!data) {
        console.log("Selecione uma data!");
        return;
    }

    console.log("=== DEBUG PROTOCOLO VIRTUAL ===");
    console.log("Data:", data);
    console.log("Técnico:", tecnico);

    // Carrega os dados
    const resposta = await PlanilhaProcessor.carregarDadosPorData(data);

    if (!resposta.dados || resposta.dados.length === 0) {
        console.log("Nenhum dado encontrado!");
        return;
    }

    // Primeiro, mostra todas as linhas com DSS
    console.log("\n--- BUSCANDO LINHAS COM DSS ---");
    let encontrouDSS = false;
    let linhaDSS = null;

    for (let i = 0; i < resposta.dados.length; i++) {
        const item = resposta.dados[i];
        const linha = item.linha;
        const feito = linha[12] ? linha[12].toString().toUpperCase().trim() : "";

        if (feito === "DSS") {
            encontrouDSS = true;
            linhaDSS = linha;
            console.log(`\n🔍 LINHA ${i} COM DSS ENCONTRADA!`);
            console.log(`   FEITO: "${feito}"`);
            console.log(`   PROTOCOLO ANTES: "${linha[4]}"`);
            console.log(`   TEMPO: "${linha[11]}"`);
            console.log(`   Linha completa:`, linha);
        }
    }

    if (!encontrouDSS) {
        console.log("\n❌ NENHUMA LINHA COM DSS ENCONTRADA NA PLANILHA!");
        console.log("A linha com DSS precisa ser adicionada na planilha primeiro.");
        console.log("\nAdicione esta linha na planilha (entre o cabeçalho do técnico e o próximo):");
        console.log("| Coluna | Valor |");
        console.log("|--------|-------|");
        console.log("| Equipe | (vazio) |");
        console.log("| Técnico | (vazio) |");
        console.log("| Protocolo | (vazio) |");
        console.log("| Serviço | NENHUM |");
        console.log("| TEMPO | 08:00 as 08:30 |");
        console.log("| FEITO | DSS |");
        return;
    }

    // Agora, executa a função processarDadosTecnicoPorRegional para ver se o protocolo foi adicionado
    console.log("\n--- EXECUTANDO processarDadosTecnicoPorRegional ---");
    const result = PlanilhaProcessor.processarDadosTecnicoPorRegional(resposta.dados, tecnico, "");

    console.log("\n--- VERIFICANDO PROTOCOLO APÓS PROCESSAMENTO ---");
    console.log(`Protocolo agora: "${linhaDSS[4]}"`);

    if (linhaDSS[4] === "1") {
        console.log("\n✅ PROTOCOLO VIRTUAL FUNCIONOU! Protocolo foi alterado para '1'");
    } else {
        console.log(`\n❌ PROTOCOLO VIRTUAL NÃO FUNCIONOU! Protocolo continua: "${linhaDSS[4]}"`);
        console.log("Verifique se a linha com DSS está DENTRO do bloco do técnico QUERA ABRAAO");

        // Mostra onde está a linha DSS
        console.log("\n--- LOCALIZANDO A LINHA DSS NA ESTRUTURA ---");
        let dentroBloco = false;

        for (let i = 0; i < resposta.dados.length; i++) {
            const linha = resposta.dados[i].linha;
            const colB = linha[1] ? linha[1].toString().trim() : "";
            const colC = linha[2] ? linha[2].toString().trim() : "";
            const feito = linha[12] ? linha[12].toString().toUpperCase().trim() : "";

            if (colB === "0" && colC === "QUERA ABRAAO") {
                dentroBloco = true;
                console.log(`Linha ${i}: INÍCIO DO BLOCO - Técnico: ${colC}`);
                continue;
            }

            if (dentroBloco && colB === "0" && colC && colC !== "QUERA ABRAAO" && colC.length > 3) {
                console.log(`Linha ${i}: FIM DO BLOCO - Próximo técnico: ${colC}`);
                dentroBloco = false;
                break;
            }

            if (dentroBloco && feito === "DSS") {
                console.log(`Linha ${i}: ✅ LINHA DSS DENTRO DO BLOCO!`);
            } else if (feito === "DSS" && !dentroBloco) {
                console.log(`Linha ${i}: ❌ LINHA DSS FORA DO BLOCO! (antes ou depois do bloco do técnico)`);
            }
        }
    }

    console.log("\n=== FIM DEBUG ===");
}

debugProtocoloVirtual();

// ========== VARIÁVEIS GLOBAIS ==========
let regionais = {};
let tecnicosSelecionados = [];
let dadosPlanilha = null;

// ========== SELECTS PERSONALIZADOS ==========
class TecnicoSelect {
    constructor() {
        this.tecnicos = [];
        this.selectedValue = "";
        this.isOpen = false;
        this.init();
    }
    init() {
        this.input = document.getElementById("tecnoSelectInput");
        this.dropdown = document.getElementById("tecnoSelectDropdown");
        this.searchInput = document.getElementById("tecnoSelectSearch");
        this.optionsContainer = document.getElementById("tecnoSelectOptions");
        this.clearBtn = document.getElementById("tecnoSelectClear");
        if (!this.input) return;
        this.input.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        this.searchInput?.addEventListener("input", () => this.filterOptions());
        this.searchInput?.addEventListener("click", (e) => e.stopPropagation());
        this.clearBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clearSelection();
        });
        document.addEventListener("click", () => this.closeDropdown());
    }
    setTecnicos(tecnicos) {
        this.tecnicos = tecnicos.sort((a, b) => a.nome.localeCompare(b.nome));
        this.renderOptions();
    }
    renderOptions(filter = "") {
        if (!this.optionsContainer) return;
        const filtered = this.tecnicos.filter((tec) => tec.nome.toLowerCase().includes(filter.toLowerCase()));
        if (filtered.length === 0) {
            this.optionsContainer.innerHTML = `<div class="tecno-select-no-results"><i class="fas fa-search"></i> Nenhum técnico encontrado</div>`;
            return;
        }
        this.optionsContainer.innerHTML = filtered
        .map(
            (tec) =>
                `<div class="tecno-select-option ${
                    this.selectedValue === tec.nome ? "selected" : ""
                }" data-value="${this.escapeHtml(tec.nome)}" data-regional="${this.escapeHtml(
                    tec.regional
                )}"><span class="tecno-select-option-name">${this.escapeHtml(
                    tec.nome
                )}</span><span class="tecno-select-option-regional">${this.escapeHtml(tec.regional)}</span></div>`
        )
        .join("");
        this.optionsContainer.querySelectorAll(".tecno-select-option").forEach((opt) => {
            opt.addEventListener("click", (e) => {
                e.stopPropagation();
                this.selectValue(opt.dataset.value);
            });
        });
    }
    filterOptions() {
        this.renderOptions(this.searchInput?.value || "");
    }
    selectValue(value) {
        this.selectedValue = value;
        const valueSpan = this.input?.querySelector(".tecno-select-value");
        if (valueSpan) {
            valueSpan.textContent = value;
            valueSpan.classList.remove("placeholder");
        }
        if (this.clearBtn) this.clearBtn.classList.add("show");
        this.closeDropdown();
        this.renderOptions(this.searchInput?.value || "");
        if (typeof atualizarTempoTotal === "function") atualizarTempoTotal();
    }
    clearSelection() {
        this.selectedValue = "";
        const valueSpan = this.input?.querySelector(".tecno-select-value");
        if (valueSpan) {
            valueSpan.textContent = "Selecione um técnico...";
            valueSpan.classList.add("placeholder");
        }
        if (this.clearBtn) this.clearBtn.classList.remove("show");
        this.renderOptions(this.searchInput?.value || "");
        if (typeof atualizarTempoTotal === "function") atualizarTempoTotal();
    }
    toggleDropdown() {
        this.isOpen ? this.closeDropdown() : this.openDropdown();
    }
    openDropdown() {
        this.isOpen = true;
        this.input?.classList.add("active");
        this.dropdown?.classList.add("show");
        if (this.searchInput) {
            this.searchInput.value = "";
            this.searchInput.focus();
        }
        this.renderOptions();
    }
    closeDropdown() {
        this.isOpen = false;
        this.input?.classList.remove("active");
        this.dropdown?.classList.remove("show");
    }
    escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
    getValue() {
        return this.selectedValue;
    }
}

class CargaHorariaSelect {
    constructor() {
        this.selectedValue = "";
        this.isOpen = false;
        this.init();
    }
    init() {
        this.input = document.getElementById("cargaSelectInput");
        this.dropdown = document.getElementById("cargaSelectDropdown");
        this.optionsContainer = document.getElementById("cargaSelectOptions");
        this.hiddenInput = document.getElementById("jornada");
        if (!this.input) return;
        this.input.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        document.addEventListener("click", () => this.closeDropdown());
        this.renderOptions();
    }
    renderOptions() {
        if (!this.optionsContainer) return;
        this.optionsContainer.querySelectorAll(".tecno-select-option").forEach((opt) => {
            opt.addEventListener("click", (e) => {
                e.stopPropagation();
                this.selectValue(opt.dataset.value);
            });
        });
    }
    selectValue(value) {
        this.selectedValue = value;
        const valueSpan = this.input?.querySelector(".tecno-select-value");
        if (valueSpan) {
            valueSpan.textContent = value;
            valueSpan.classList.remove("placeholder");
        }
        if (this.hiddenInput) this.hiddenInput.value = value;
        this.optionsContainer
        ?.querySelectorAll(".tecno-select-option")
        .forEach((opt) => opt.classList.toggle("selected", opt.dataset.value === value));
        this.closeDropdown();
        if (typeof atualizarTempoTotal === "function") atualizarTempoTotal();
    }
    toggleDropdown() {
        this.isOpen ? this.closeDropdown() : this.openDropdown();
    }
    openDropdown() {
        this.isOpen = true;
        this.input?.classList.add("active");
        this.dropdown?.classList.add("show");
    }
    closeDropdown() {
        this.isOpen = false;
        this.input?.classList.remove("active");
        this.dropdown?.classList.remove("show");
    }
    getValue() {
        return this.selectedValue;
    }
}

let tecnicoSelect = null;
let cargaHorariaSelect = null;

// ========== FUNÇÕES DO RELATÓRIO ==========
function carregarTecnicosParaSelect() {
    if (!tecnicoSelect) tecnicoSelect = new TecnicoSelect();
    if (!regionais || Object.keys(regionais).length === 0) {
        const dataAtual = document.getElementById("data-ativacao")?.value;
        if (dataAtual) carregarTecnicosPorData(dataAtual).then(() => atualizarSelectTecnicos());
    } else {
        atualizarSelectTecnicos();
    }
}
function atualizarSelectTecnicos() {
    let todosTecnicos = [];
    for (let regional in regionais) {
        regionais[regional].forEach((tecnico) => {
            todosTecnicos.push({nome: tecnico, regional: regional});
        });
    }
    if (tecnicoSelect) tecnicoSelect.setTecnicos(todosTecnicos);
}
function renderListaTecnicosPorRegionalComFiltro() {
    const container = document.getElementById("lista-tecnicos");
    if (!container) return;
    const buscaInput = document.getElementById("busca-tecnicos");
    const termoBusca = buscaInput ? buscaInput.value.toLowerCase().trim() : "";
    let regionaisParaMostrar = regionais;
    if (termoBusca !== "") {
        regionaisParaMostrar = {};
        for (let regional in regionais) {
            const tecnicosFiltrados = regionais[regional].filter((tec) => tec.toLowerCase().includes(termoBusca));
            if (tecnicosFiltrados.length > 0) regionaisParaMostrar[regional] = tecnicosFiltrados;
        }
    }
    if (Object.keys(regionaisParaMostrar).length === 0) {
        container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-search"></i> Nenhum técnico encontrado para "${termoBusca}"</div>`;
        return;
    }
    let html = "";
    for (let regional in regionaisParaMostrar) {
        const tecnicos = regionaisParaMostrar[regional];
        html += `<div class="regional-bloco"><div class="regional-titulo"><i class="fas fa-map-marker-alt"></i> ${regional}<span class="contador">${tecnicos.length} técnicos</span></div><div class="tecnicos-lista">`;
        tecnicos.forEach((tec) => {
            const isSelected = tecnicosSelecionados.some((t) => t.nome === tec && t.regional === regional);
            html += `<div class="tecnico-checkbox-item" onclick="toggleTecnico('${tec.replace(
                /'/g,
                "\\'"
            )}', '${regional.replace(/'/g, "\\'")}')"><input type="checkbox" value="${tec.replace(
                /'/g,
                "&apos;"
            )}" id="tec_${regional.replace(/\s/g, "_")}_${tec.replace(/\s/g, "_")}" ${
                isSelected ? "checked" : ""
            }><label for="tec_${regional.replace(/\s/g, "_")}_${tec.replace(/\s/g, "_")}">${tec}</label></div>`;
        });
        html += `</div></div>`;
    }
    container.innerHTML = html;
}
function filtrarListaTecnicos() {
    renderListaTecnicosPorRegionalComFiltro();
}
function renderListaTecnicosPorRegional() {
    renderListaTecnicosPorRegionalComFiltro();
}
function toggleTecnico(nome, regional) {
    const index = tecnicosSelecionados.findIndex((t) => t.nome === nome && t.regional === regional);
    if (index === -1) tecnicosSelecionados.push({nome, regional, tipoEquipe: "Solo", jornada: "Comercial"});
    else tecnicosSelecionados.splice(index, 1);
    renderListaTecnicosPorRegional();
    atualizarEquipesSelecionadas();
}
function selecionarTodosTecnicos() {
    tecnicosSelecionados = [];
    for (let regional in regionais) {
        regionais[regional].forEach((tec) => {
            tecnicosSelecionados.push({nome: tec, regional, tipoEquipe: "Solo", jornada: "Comercial"});
        });
    }
    renderListaTecnicosPorRegional();
    atualizarEquipesSelecionadas();
}
function desmarcarTodosTecnicos() {
    tecnicosSelecionados = [];
    renderListaTecnicosPorRegional();
    atualizarEquipesSelecionadas();
}
function atualizarEquipesSelecionadas() {
    const container = document.getElementById("equipes-selecionadas");
    if (!container) return;
    if (!tecnicosSelecionados.length) {
        container.innerHTML = "";
        return;
    }
    const agrupado = {};
    tecnicosSelecionados.forEach((tec) => {
        if (!agrupado[tec.regional]) agrupado[tec.regional] = [];
        agrupado[tec.regional].push({
            nome: tec.nome,
            tipoEquipe: tec.tipoEquipe || "Solo",
            jornada: tec.jornada || "Comercial",
        });
    });
    let html = `<h5><i class="fas fa-check-circle"></i> Técnicos Selecionados (${tecnicosSelecionados.length})</h5>`;
    for (let regional in agrupado) {
        html += `<div style="margin-bottom: 1rem;"><div style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.5rem;"><i class="fas fa-map-marker-alt"></i> ${regional}</div>`;
        agrupado[regional].forEach((tec) => {
            const isSolo = tec.tipoEquipe === "Solo";
            const isComercial = tec.jornada === "Comercial";
            html += `<div class="equipe-selecionada-bloco" style="background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="font-weight: 600;"><i class="fas fa-user" style="color: #E8465D;"></i> ${
                        tec.nome
                    }</span>
                    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                        <div class="radio-group-relatorio" style="background: #f1f5f9; padding: 0.2rem; border-radius: 30px; display: inline-flex; gap: 0.2rem;">
                            <label class="radio-label-relatorio ${
                                isSolo ? "active" : ""
                            }" data-tecnico="${tec.nome.replace(/'/g, "\\'")}" data-regional="${regional.replace(
                /'/g,
                "\\'"
            )}" data-value="Solo" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${
                isSolo ? "background: #E8465D; color: white;" : "color: #64748b;"
            }">Solo</label>
                            <label class="radio-label-relatorio ${
                                !isSolo ? "active" : ""
                            }" data-tecnico="${tec.nome.replace(/'/g, "\\'")}" data-regional="${regional.replace(
                /'/g,
                "\\'"
            )}" data-value="Dupla" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${
                !isSolo ? "background: #E8465D; color: white;" : "color: #64748b;"
            }">Dupla</label>
                        </div>
                        <div style="background: #f1f5f9; padding: 0.2rem; border-radius: 30px; display: inline-flex; gap: 0.2rem;">
                            <label class="jornada-option-relatorio ${
                                isComercial ? "active" : ""
                            }" data-tecnico="${tec.nome.replace(/'/g, "\\'")}" data-regional="${regional.replace(
                /'/g,
                "\\'"
            )}" data-value="Comercial" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${
                isComercial ? "background: #4a6382; color: white;" : "color: #64748b;"
            }">Comercial</label>
                            <label class="jornada-option-relatorio ${
                                !isComercial ? "active" : ""
                            }" data-tecnico="${tec.nome.replace(/'/g, "\\'")}" data-regional="${regional.replace(
                /'/g,
                "\\'"
            )}" data-value="12/36" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${
                !isComercial ? "background: #4a6382; color: white;" : "color: #64748b;"
            }">12/36</label>
                        </div>
                        <button class="btn-add-justificativa" onclick="abrirModalJustificativas('${tec.nome.replace(
                            /'/g,
                            "\\'"
                        )}', '${regional.replace(
                /'/g,
                "\\'"
            )}')" style="background: #4a6382; color: white; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 12px;"><i class="fas fa-plus"></i> Justif.</button>
                        <button class="btn-remove-equipe" onclick="removerTecnicoSelecionado('${tec.nome.replace(
                            /'/g,
                            "\\'"
                        )}', '${regional.replace(
                /'/g,
                "\\'"
            )}')" style="background: none; border: none; color: #94a3b8; cursor: pointer;"><i class="fas fa-times-circle"></i></button>
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">${regional}</div>
            </div>`;
        });
        html += `</div>`;
    }
    container.innerHTML = html;
    document.querySelectorAll("#equipes-selecionadas .radio-label-relatorio").forEach((radio) => {
        radio.addEventListener("click", function (e) {
            e.stopPropagation();
            const parentGroup = this.closest(".radio-group-relatorio");
            parentGroup.querySelectorAll(".radio-label-relatorio").forEach((r) => {
                r.style.background = "transparent";
                r.style.color = "#64748b";
            });
            this.style.background = "#E8465D";
            this.style.color = "white";
            const tecnicoNome = this.dataset.tecnico;
            const regional = this.dataset.regional;
            const tipoEquipe = this.dataset.value;
            const index = tecnicosSelecionados.findIndex((t) => t.nome === tecnicoNome && t.regional === regional);
            if (index !== -1) {
                tecnicosSelecionados[index].tipoEquipe = tipoEquipe;
            }
        });
    });
    document.querySelectorAll("#equipes-selecionadas .jornada-option-relatorio").forEach((opt) => {
        opt.addEventListener("click", function (e) {
            e.stopPropagation();
            const parentGroup = this.parentElement;
            parentGroup.querySelectorAll(".jornada-option-relatorio").forEach((o) => {
                o.style.background = "transparent";
                o.style.color = "#64748b";
            });
            this.style.background = "#4a6382";
            this.style.color = "white";
            const tecnicoNome = this.dataset.tecnico;
            const regional = this.dataset.regional;
            const jornada = this.dataset.value;
            const index = tecnicosSelecionados.findIndex((t) => t.nome === tecnicoNome && t.regional === regional);
            if (index !== -1) {
                tecnicosSelecionados[index].jornada = jornada;
            }
        });
    });
}
function removerTecnicoSelecionado(nome, regional) {
    tecnicosSelecionados = tecnicosSelecionados.filter((t) => !(t.nome === nome && t.regional === regional));
    renderListaTecnicosPorRegional();
    atualizarEquipesSelecionadas();
}
async function carregarTecnicosPorData(dataSelecionada) {
    const container = document.getElementById("lista-tecnicos");
    if (!dataSelecionada) {
        if (container)
            container.innerHTML =
                '<div class="loading-tecnicos"><i class="fas fa-exclamation-triangle"></i> Selecione uma data primeiro!</div>';
        return false;
    }
    const dataAba = Utils.formatarDataParaAba(dataSelecionada);
    if (container)
        container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-spinner fa-pulse"></i> Buscando dados da aba "${dataAba}"...</div>`;
    tecnicosSelecionados = [];
    dadosPlanilha = null;
    if (document.getElementById("equipes-selecionadas")) document.getElementById("equipes-selecionadas").innerHTML = "";
    try {
        const resposta = await PlanilhaProcessor.carregarDadosPorData(dataSelecionada);
        if (resposta.status === "not_found" || !resposta.dados || resposta.dados.length === 0) {
            if (container)
                container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-calendar-times"></i> Nenhuma aba encontrada para ${dataAba}</div>`;
            return false;
        }
        dadosPlanilha = resposta.dados;

        let regionaisCarregadas = {};
        if (resposta.regionaisMap && Object.keys(resposta.regionaisMap).length > 0) {
            regionaisCarregadas = resposta.regionaisMap;
        } else {
            regionaisCarregadas = PlanilhaProcessor.extrairTecnicosPorRegional(dadosPlanilha);
        }

        if (Object.keys(regionaisCarregadas).length === 0) {
            if (container)
                container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-users-slash"></i> Nenhum técnico encontrado na aba "${dataAba}"</div>`;
            return false;
        }

        window.regionaisOriginal = {...regionaisCarregadas};
        regionais = {...regionaisCarregadas};

        console.log("Regionais carregadas:", regionais);

        renderListaTecnicosPorRegional();
        carregarTecnicosParaSelect();
        renderizarFavoritosBadges("ativacao");

        setTimeout(() => {
            carregarFiltroSalvo();
        }, 100);

        Swal.fire({
            icon: "success",
            title: "Dados carregados!",
            text: `Aba "${dataAba}" carregada com sucesso`,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
        });
        return true;
    } catch (erro) {
        console.error("Erro ao carregar técnicos por data:", erro);
        if (container)
            container.innerHTML =
                '<div class="loading-tecnicos"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar dados. Verifique sua conexão.</div>';
        return false;
    }
}

async function onDataChange() {
    const dataSelecionada = document.getElementById("data-ativacao")?.value;
    if (!dataSelecionada) return;
    const resultadoContainer = document.getElementById("resultado-container");
    if (resultadoContainer) resultadoContainer.style.display = "none";
    const resultadoDiv = document.getElementById("resultado-ativacao");
    const resultadoRetiradaDiv = document.getElementById("resultado-retirada-unificado");
    if (resultadoDiv) resultadoDiv.innerHTML = "";
    if (resultadoRetiradaDiv) resultadoRetiradaDiv.innerHTML = "";
    await carregarTecnicosPorData(dataSelecionada);
    renderizarFavoritosBadges("ativacao");
}
function abrirModalJustificativas(tecnico, regional) {
    const data = document.getElementById("data-ativacao")?.value;
    if (!data) {
        Swal.fire({icon: "warning", title: "Selecione uma data", text: "Primeiro selecione a data do relatório!"});
        return;
    }
    const justificativas = DataManager.getJustificativasAdicionais(tecnico, data);
    Swal.fire({
        title: `Justificativas Adicionais - ${tecnico}`,
        html: `<div style="text-align: left;"><div style="margin-bottom: 15px;"><textarea id="nova-justificativa" class="swal2-textarea" placeholder="Digite uma nova justificativa..." rows="2"></textarea><button id="btn-adicionar-just" class="btn-small btn-select-all" style="margin-top: 10px; width: 100%;"><i class="fas fa-plus"></i> Adicionar Justificativa</button></div><div id="lista-justificativas" style="max-height: 300px; overflow-y: auto;">${
            justificativas.length === 0
                ? '<p style="color: #666; text-align: center;">Nenhuma justificativa adicional cadastrada.</p>'
                : ""
        }${justificativas
        .map(
            (just) =>
                `<div class="justificativa-item-modal" data-id="${just.id}" style="background: #f5f5f5; padding: 10px; border-radius: 8px; margin-bottom: 10px;"><div class="justificativa-texto" style="margin-bottom: 8px; word-break: break-word;">${just.texto}</div><div style="display: flex; gap: 8px; justify-content: flex-end;"><button class="btn-editar-just" data-id="${just.id}" style="background: #4a6382; color: white; border: none; padding: 4px 12px; border-radius: 6px; cursor: pointer;"><i class="fas fa-edit"></i> Editar</button><button class="btn-excluir-just" data-id="${just.id}" style="background: #9e4244; color: white; border: none; padding: 4px 12px; border-radius: 6px; cursor: pointer;"><i class="fas fa-trash"></i> Excluir</button></div></div>`
        )
        .join("")}</div></div>`,
        showConfirmButton: true,
        confirmButtonText: "Fechar",
        width: "500px",
        didOpen: () => {
            document.getElementById("btn-adicionar-just")?.addEventListener("click", () => {
                const novaJust = document.getElementById("nova-justificativa")?.value.trim();
                if (!novaJust) {
                    Swal.fire({
                        icon: "warning",
                        title: "Campo vazio",
                        text: "Digite uma justificativa!",
                        toast: true,
                        timer: 2000,
                    });
                    return;
                }
                DataManager.addJustificativaAdicional(tecnico, data, novaJust);
                document.getElementById("nova-justificativa").value = "";
                Swal.close();
                setTimeout(() => abrirModalJustificativas(tecnico, regional), 100);
            });
            document.querySelectorAll(".btn-editar-just").forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    const id = parseInt(btn.dataset.id);
                    const justItem = btn.closest(".justificativa-item-modal");
                    const textoAtual = justItem.querySelector(".justificativa-texto").innerText;
                    const {value: novoTexto} = await Swal.fire({
                        title: "Editar Justificativa",
                        input: "textarea",
                        inputLabel: "Edite o texto abaixo:",
                        inputValue: textoAtual,
                        showCancelButton: true,
                        confirmButtonText: "Salvar",
                        cancelButtonText: "Cancelar",
                        inputAttributes: {rows: 3},
                    });
                    if (novoTexto && novoTexto.trim()) {
                        DataManager.updateJustificativaAdicional(tecnico, data, id, novoTexto.trim());
                        Swal.close();
                        setTimeout(() => abrirModalJustificativas(tecnico, regional), 100);
                    }
                });
            });
            document.querySelectorAll(".btn-excluir-just").forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    const id = parseInt(btn.dataset.id);
                    const result = await Swal.fire({
                        title: "Confirmar exclusão",
                        text: "Deseja realmente excluir esta justificativa?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sim, excluir",
                        cancelButtonText: "Cancelar",
                    });
                    if (result.isConfirmed) {
                        DataManager.deleteJustificativaAdicional(tecnico, data, id);
                        Swal.close();
                        setTimeout(() => abrirModalJustificativas(tecnico, regional), 100);
                    }
                });
            });
        },
    });
}

// ========== VARIÁVEIS GLOBAIS PARA RETIRADA MÚLTIPLA ==========
let tecnicosSelecionadosRetirada = [];
let dadosPlanilhaRetirada = null;
let regionaisRetirada = {};

// ========== FUNÇÕES PARA CARREGAR TÉCNICOS NA RETIRADA ==========
async function carregarTecnicosRetirada() {
    const data = document.getElementById("data-retirada")?.value;
    const container = document.getElementById("lista-tecnicos-retirada");
    if (!data) {
        if (container)
            container.innerHTML =
                '<div class="loading-tecnicos"><i class="fas fa-exclamation-triangle"></i> Selecione uma data primeiro!</div>';
        return false;
    }
    const dataAba = Utils.formatarDataParaAba(data);
    if (container)
        container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-spinner fa-pulse"></i> Buscando dados da aba "${dataAba}"...</div>`;
    tecnicosSelecionadosRetirada = [];
    dadosPlanilhaRetirada = null;
    if (document.getElementById("equipes-selecionadas-retirada"))
        document.getElementById("equipes-selecionadas-retirada").innerHTML = "";
    try {
        const resposta = await PlanilhaProcessor.carregarDadosPorData(data);
        if (resposta.status === "not_found" || !resposta.dados || resposta.dados.length === 0) {
            if (container)
                container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-calendar-times"></i> Nenhuma aba encontrada para ${dataAba}</div>`;
            return false;
        }
        dadosPlanilhaRetirada = resposta.dados;
        if (resposta.regionaisMap && Object.keys(resposta.regionaisMap).length > 0) {
            regionaisRetirada = resposta.regionaisMap;
        } else {
            regionaisRetirada = PlanilhaProcessor.extrairTecnicosPorRegional(dadosPlanilhaRetirada);
        }
        if (Object.keys(regionaisRetirada).length === 0) {
            if (container)
                container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-users-slash"></i> Nenhum técnico encontrado na aba "${dataAba}"</div>`;
            return false;
        }
        renderListaTecnicosRetirada();
        renderizarFavoritosBadges("retirada");
        setTimeout(() => {
            carregarFiltroRetiradaSalvo();
        }, 100);
        return true;
    } catch (erro) {
        console.error("Erro ao carregar técnicos:", erro);
        if (container)
            container.innerHTML =
                '<div class="loading-tecnicos"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar dados.</div>';
        return false;
    }
}
function renderListaTecnicosRetirada() {
    const container = document.getElementById("lista-tecnicos-retirada");
    if (!container) return;
    const buscaInput = document.getElementById("busca-tecnicos-retirada");
    const termoBusca = buscaInput ? buscaInput.value.toLowerCase().trim() : "";
    let regionaisParaMostrar = regionaisRetirada;
    if (termoBusca !== "") {
        regionaisParaMostrar = {};
        for (let regional in regionaisRetirada) {
            const tecnicosFiltrados = regionaisRetirada[regional].filter((tec) =>
                tec.toLowerCase().includes(termoBusca)
            );
            if (tecnicosFiltrados.length > 0) regionaisParaMostrar[regional] = tecnicosFiltrados;
        }
    }
    if (Object.keys(regionaisParaMostrar).length === 0) {
        container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-search"></i> Nenhum técnico encontrado para "${termoBusca}"</div>`;
        return;
    }
    let html = "";
    for (let regional in regionaisParaMostrar) {
        const tecnicos = regionaisParaMostrar[regional];
        html += `<div class="regional-bloco"><div class="regional-titulo"><i class="fas fa-map-marker-alt"></i> ${regional}<span class="contador">${tecnicos.length} técnicos</span></div><div class="tecnicos-lista">`;
        tecnicos.forEach((tec) => {
            const isSelected = tecnicosSelecionadosRetirada.some((t) => t.nome === tec && t.regional === regional);
            html += `<div class="tecnico-checkbox-item" onclick="toggleTecnicoRetirada('${tec.replace(
                /'/g,
                "\\'"
            )}', '${regional.replace(/'/g, "\\'")}')"><input type="checkbox" value="${tec.replace(
                /'/g,
                "&apos;"
            )}" id="tec_ret_${regional.replace(/\s/g, "_")}_${tec.replace(/\s/g, "_")}" ${
                isSelected ? "checked" : ""
            }><label for="tec_ret_${regional.replace(/\s/g, "_")}_${tec.replace(/\s/g, "_")}">${tec}</label></div>`;
        });
        html += `</div></div>`;
    }
    container.innerHTML = html;
}
function toggleTecnicoRetirada(nome, regional) {
    const index = tecnicosSelecionadosRetirada.findIndex((t) => t.nome === nome && t.regional === regional);
    if (index === -1) tecnicosSelecionadosRetirada.push({nome, regional, tipoEquipe: "Solo", jornada: "Comercial"});
    else tecnicosSelecionadosRetirada.splice(index, 1);
    renderListaTecnicosRetirada();
    atualizarEquipesSelecionadasRetirada();
}
function selecionarTodosTecnicosRetirada() {
    tecnicosSelecionadosRetirada = [];
    for (let regional in regionaisRetirada) {
        regionaisRetirada[regional].forEach((tec) => {
            tecnicosSelecionadosRetirada.push({nome: tec, regional, tipoEquipe: "Solo", jornada: "Comercial"});
        });
    }
    renderListaTecnicosRetirada();
    atualizarEquipesSelecionadasRetirada();
}
function desmarcarTodosTecnicosRetirada() {
    tecnicosSelecionadosRetirada = [];
    renderListaTecnicosRetirada();
    atualizarEquipesSelecionadasRetirada();
}
function atualizarEquipesSelecionadasRetirada() {
    const container = document.getElementById("equipes-selecionadas-retirada");
    if (!container) return;
    if (!tecnicosSelecionadosRetirada.length) {
        container.innerHTML = "";
        return;
    }
    const agrupado = {};
    tecnicosSelecionadosRetirada.forEach((tec) => {
        if (!agrupado[tec.regional]) agrupado[tec.regional] = [];
        agrupado[tec.regional].push(tec);
    });
    let html = `<h5><i class="fas fa-check-circle"></i> Técnicos Selecionados (${tecnicosSelecionadosRetirada.length})</h5>`;
    for (let regional in agrupado) {
        html += `<div style="margin-bottom: 1rem;"><div style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.5rem;"><i class="fas fa-map-marker-alt"></i> ${regional}</div>`;
        agrupado[regional].forEach((tec) => {
            const isSolo = tec.tipoEquipe === "Solo";
            const isComercial = tec.jornada === "Comercial";
            html += `<div class="equipe-selecionada-bloco" style="background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="font-weight: 600;"><i class="fas fa-user" style="color: #E8465D;"></i> ${
                        tec.nome
                    }</span>
                    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                        <div class="radio-group-relatorio" style="background: #f1f5f9; padding: 0.2rem; border-radius: 30px; display: inline-flex; gap: 0.2rem;">
                            <label class="radio-label-relatorio ${
                                isSolo ? "active" : ""
                            }" data-tecnico="${tec.nome.replace(/'/g, "\\'")}" data-regional="${regional.replace(
                /'/g,
                "\\'"
            )}" data-value="Solo" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${
                isSolo ? "background: #E8465D; color: white;" : "color: #64748b;"
            }">Solo</label>
                            <label class="radio-label-relatorio ${
                                !isSolo ? "active" : ""
                            }" data-tecnico="${tec.nome.replace(/'/g, "\\'")}" data-regional="${regional.replace(
                /'/g,
                "\\'"
            )}" data-value="Dupla" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${
                !isSolo ? "background: #E8465D; color: white;" : "color: #64748b;"
            }">Dupla</label>
                        </div>
                        <div style="background: #f1f5f9; padding: 0.2rem; border-radius: 30px; display: inline-flex; gap: 0.2rem;">
                            <label class="jornada-option ${
                                isComercial ? "active" : ""
                            }" data-tecnico="${tec.nome.replace(/'/g, "\\'")}" data-regional="${regional.replace(
                /'/g,
                "\\'"
            )}" data-value="Comercial" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${
                isComercial ? "background: #4a6382; color: white;" : "color: #64748b;"
            }">Comercial</label>
                            <label class="jornada-option ${
                                !isComercial ? "active" : ""
                            }" data-tecnico="${tec.nome.replace(/'/g, "\\'")}" data-regional="${regional.replace(
                /'/g,
                "\\'"
            )}" data-value="12/36" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${
                !isComercial ? "background: #4a6382; color: white;" : "color: #64748b;"
            }">12/36</label>
                        </div>
                        <button class="btn-remove-equipe" onclick="removerTecnicoSelecionadoRetirada('${tec.nome.replace(
                            /'/g,
                            "\\'"
                        )}', '${regional.replace(
                /'/g,
                "\\'"
            )}')" style="background: none; border: none; color: #94a3b8; cursor: pointer;"><i class="fas fa-times-circle"></i></button>
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">${regional}</div>
            </div>`;
        });
        html += `</div>`;
    }
    container.innerHTML = html;
    document.querySelectorAll("#equipes-selecionadas-retirada .radio-label-relatorio").forEach((radio) => {
        radio.addEventListener("click", function (e) {
            e.stopPropagation();
            const parentGroup = this.closest(".radio-group-relatorio");
            parentGroup.querySelectorAll(".radio-label-relatorio").forEach((r) => {
                r.style.background = "transparent";
                r.style.color = "#64748b";
            });
            this.style.background = "#E8465D";
            this.style.color = "white";
            const tecnicoNome = this.dataset.tecnico;
            const regional = this.dataset.regional;
            const tipoEquipe = this.dataset.value;
            const index = tecnicosSelecionadosRetirada.findIndex(
                (t) => t.nome === tecnicoNome && t.regional === regional
            );
            if (index !== -1) tecnicosSelecionadosRetirada[index].tipoEquipe = tipoEquipe;
        });
    });
    document.querySelectorAll("#equipes-selecionadas-retirada .jornada-option").forEach((opt) => {
        opt.addEventListener("click", function (e) {
            e.stopPropagation();
            const parentGroup = this.parentElement;
            parentGroup.querySelectorAll(".jornada-option").forEach((o) => {
                o.style.background = "transparent";
                o.style.color = "#64748b";
            });
            this.style.background = "#4a6382";
            this.style.color = "white";
            const tecnicoNome = this.dataset.tecnico;
            const regional = this.dataset.regional;
            const jornada = this.dataset.value;
            const index = tecnicosSelecionadosRetirada.findIndex(
                (t) => t.nome === tecnicoNome && t.regional === regional
            );
            if (index !== -1) tecnicosSelecionadosRetirada[index].jornada = jornada;
            atualizarTempoTotalGeral();
        });
    });
}
function removerTecnicoSelecionadoRetirada(nome, regional) {
    tecnicosSelecionadosRetirada = tecnicosSelecionadosRetirada.filter(
        (t) => !(t.nome === nome && t.regional === regional)
    );
    renderListaTecnicosRetirada();
    atualizarEquipesSelecionadasRetirada();
    atualizarTempoTotalGeral();
}
function atualizarTempoTotalGeral() {
    let totalMinutosGeral = 0;
    const data = document.getElementById("data-retirada")?.value;
    tecnicosSelecionadosRetirada.forEach((tecnico) => {
        const retiradas = DataManager.registros.filter((r) => r.data === data && r.tecnico === tecnico.nome);
        const total = retiradas.reduce((acc, r) => acc + r.minutos, 0);
        totalMinutosGeral += total;
    });
    const tempoTotalDiv = document.getElementById("tempoTotal");
    if (tempoTotalDiv) {
        const tempoFormatado = Utils.formatarTempo(totalMinutosGeral, "Comercial");
        tempoTotalDiv.innerHTML = `<i class="fas fa-clock"></i> <span>Tempo Total a Retirar: <strong>${
            tempoFormatado !== "" ? tempoFormatado : "0 minutos"
        }</strong></span>`;
    }
}
function apagarTudoPorData() {
    const data = document.getElementById("data-ativacao")?.value;
    if (!data) {
        Swal.fire({
            icon: "warning",
            title: "Selecione uma data!",
            text: "Primeiro selecione a data para apagar os dados!",
            toast: true,
            timer: 2000,
        });
        return;
    }
    Swal.fire({
        title: "⚠️ APAGAR COMPLETO",
        html: `Deseja apagar TODOS os dados da data <strong>${Utils.formatarData(data)}</strong>?<br><br>
               Serão apagados:<br>
               • Relatório salvo<br>
               • Todas as retiradas de tempo<br>
               • Justificativas adicionais<br><br>
               <span style="color: red;">Esta ação não pode ser desfeita!</span>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sim, apagar tudo!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            DataManager.apagarRelatorioPorData(data);
            const registrosAntes = DataManager.registros.length;
            DataManager.registros = DataManager.registros.filter((r) => r.data !== data);
            const justificativasKeys = Object.keys(DataManager.justificativasAdicionais);
            justificativasKeys.forEach((key) => {
                if (key.endsWith(`_${data}`)) {
                    delete DataManager.justificativasAdicionais[key];
                }
            });
            DataManager.salvarLocal();
            document.getElementById("resultado-ativacao").innerHTML = "";
            document.getElementById("resultado-retirada-unificado").innerHTML = "";
            const resultadoContainer = document.getElementById("resultado-container");
            if (resultadoContainer) resultadoContainer.style.display = "none";
            const registrosDepois = DataManager.registros.length;
            Swal.fire({
                icon: "success",
                title: "✅ Dados apagados!",
                html: `<strong>${Utils.formatarData(data)}</strong><br>
                       • Relatório: removido<br>
                       • Retiradas: ${registrosAntes - registrosDepois} registro(s) removido(s)<br>
                       • Justificativas: removidas`,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    });
}
async function calcularRetiradaTodosTecnicos() {
    const data = document.getElementById("data-retirada")?.value;
    if (!data) {
        Swal.fire({icon: "warning", title: "Selecione uma data", text: "Primeiro selecione a data!"});
        return;
    }
    if (tecnicosSelecionadosRetirada.length === 0) {
        Swal.fire({icon: "warning", title: "Nenhum técnico selecionado", text: "Selecione pelo menos um técnico!"});
        return;
    }
    if (!dadosPlanilhaRetirada) {
        const carregado = await carregarTecnicosRetirada();
        if (!carregado) {
            Swal.fire({icon: "error", title: "Erro", text: "Não foi possível carregar os dados da planilha!"});
            return;
        }
    }
    Swal.fire({
        title: "Calculando...",
        text: `Processando ${tecnicosSelecionadosRetirada.length} técnico(s)`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });
    let totalGeral = 0,
        resultados = [];
    for (const tecnicoObj of tecnicosSelecionadosRetirada) {
        const tecnico = tecnicoObj.nome,
            tipoEquipe = tecnicoObj.tipoEquipe,
            jornada = tecnicoObj.jornada;
        const retiradas = PlanilhaProcessor.processarRetiradasDoTecnico(dadosPlanilhaRetirada, tecnico);
        let totalMinutos = 0;
        retiradas.forEach((retirada) => {
            const existe = DataManager.registros.some(
                (r) =>
                    r.data === data && r.tecnico === tecnico && r.inicio === retirada.inicio && r.fim === retirada.fim
            );
            if (!existe) {
                DataManager.registros.push({
                    data,
                    tecnico,
                    regional: obterRegionalPorTecnico(tecnico),
                    tipoEquipe,
                    jornada,
                    inicio: retirada.inicio,
                    fim: retirada.fim,
                    motivo: retirada.motivo,
                    minutos: retirada.minutos,
                    isDiaTodo: retirada.inicio === "00:00" && retirada.fim === "23:59",
                    dataSalva: new Date().toISOString(),
                    fonte: "planilha",
                });
                totalMinutos += retirada.minutos;
            }
        });
        totalGeral += totalMinutos;
        resultados.push({tecnico, totalMinutos, retiradas: retiradas.length});
    }
    DataManager.salvarLocal();
    atualizarTempoTotalGeral();
    finalizarRetiradaMultiplos();
    let resultadoHtml = `<strong>Resumo do Processamento:</strong><br>`;
    resultados.forEach((r) => {
        resultadoHtml += `• ${r.tecnico}: ${r.retiradas} período(s) - ${Utils.formatarTempo(
            r.totalMinutos,
            "Comercial"
        )}<br>`;
    });
    resultadoHtml += `<br><strong>Total Geral: ${Utils.formatarTempo(totalGeral, "Comercial")}</strong>`;
    Swal.fire({icon: "success", title: "Retiradas calculadas!", html: resultadoHtml, timer: 5000});
}
function buscarRetiradasTodosTecnicos() {
    const data = document.getElementById("data-retirada")?.value;
    if (!data) {
        Swal.fire({icon: "warning", title: "Selecione uma data!"});
        return;
    }
    finalizarRetiradaMultiplos();
    const registros = DataManager.registros.filter((r) => r.data === data);
    if (registros.length === 0)
        Swal.fire({icon: "info", title: "Nenhuma retirada", text: "Não há retiradas salvas para esta data."});
    else {
        const totalMinutos = registros.reduce((acc, r) => acc + r.minutos, 0);
        Swal.fire({
            icon: "success",
            title: "Retiradas encontradas",
            html: `<strong>${registros.length}</strong> registro(s)<br><strong>Total: ${Utils.formatarTempo(
                totalMinutos,
                "Comercial"
            )}</strong>`,
        });
    }
}
function excluirRetiradasTodosTecnicos() {
    const data = document.getElementById("data-retirada")?.value;
    if (!data) {
        Swal.fire({icon: "warning", title: "Selecione uma data!"});
        return;
    }
    const registros = DataManager.registros.filter((r) => r.data === data);
    if (registros.length === 0) {
        Swal.fire({icon: "info", title: "Nenhuma retirada", text: "Não há retiradas para excluir."});
        return;
    }
    Swal.fire({
        title: "Confirmar exclusão",
        text: `Excluir TODAS as retiradas da data ${Utils.formatarData(data)}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sim, excluir todas!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            DataManager.registros = DataManager.registros.filter((r) => r.data !== data);
            DataManager.salvarLocal();
            finalizarRetiradaMultiplos();
            atualizarTempoTotalGeral();
            Swal.fire({icon: "success", title: "Excluído!", text: "Todas as retiradas foram removidas."});
        }
    });
}
const dataRetiradaInputOriginal = document.getElementById("data-retirada");
if (dataRetiradaInputOriginal) {
    dataRetiradaInputOriginal.addEventListener("change", function () {
        carregarTecnicosRetirada();
        finalizarRetiradaMultiplos();
        atualizarTempoTotalGeral();
        renderizarFavoritosBadges("retirada");
    });
}
const buscaRetiradaInput = document.getElementById("busca-tecnicos-retirada");
if (buscaRetiradaInput) buscaRetiradaInput.addEventListener("input", () => renderListaTecnicosRetirada());

// ========== FUNÇÕES DE RETIRADA DE TEMPO ==========
let tecnicosEditando = {};
function initRadioButtonsRetirada() {
    const radioGroup = document.querySelector("#aba-retirada .radio-group");
    if (!radioGroup) return;
    radioGroup.querySelectorAll(".radio-label").forEach((label) => {
        const radio = label.querySelector('input[type="radio"]');
        if (radio && radio.checked) label.classList.add("active");
        else label.classList.remove("active");
        label.addEventListener("click", (e) => {
            e.preventDefault();
            radioGroup.querySelectorAll(".radio-label").forEach((lbl) => {
                const rdo = lbl.querySelector('input[type="radio"]');
                if (rdo) rdo.checked = false;
                lbl.classList.remove("active");
            });
            const radio = label.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            label.classList.add("active");
            const changeEvent = new Event("change", {bubbles: true});
            if (radio) radio.dispatchEvent(changeEvent);
        });
    });
}
function adicionarRetirada() {
    let data = document.getElementById("data-retirada")?.value;
    let tecnico = tecnicoSelect ? tecnicoSelect.getValue() : "";
    let tipoEquipe = document.querySelector('input[name="tipo-equipe-retirada"]:checked')?.value || "Solo";
    let jornada = cargaHorariaSelect ? cargaHorariaSelect.getValue() : "";
    let inicio = document.getElementById("inicio")?.value;
    let fim = document.getElementById("fim")?.value;
    let motivo = document.getElementById("motivo")?.value.trim();
    let regional = obterRegionalPorTecnico(tecnico);
    if (!data || !tecnico || !jornada || !inicio || !fim) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }
    let minutos = Utils.calcularMinutos(inicio, fim);
    if (minutos === null) return;
    let isDiaTodo = inicio === "00:00" && fim === "23:59";
    DataManager.registros.push({
        data,
        tecnico,
        regional,
        tipoEquipe,
        jornada,
        inicio,
        fim,
        motivo: motivo || "",
        minutos,
        isDiaTodo,
        dataSalva: new Date().toISOString(),
    });
    DataManager.salvarLocal();
    atualizarTempoTotal();
    finalizarRetirada();
    document.getElementById("inicio").value = "";
    document.getElementById("fim").value = "";
    document.getElementById("motivo").value = "";
}
function editarTecnico(tecnico) {
    tecnicosEditando[tecnico] = true;
    finalizarRetirada();
}
function salvarEdicoesTecnico(tecnico) {
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
    delete tecnicosEditando[tecnico];
    atualizarTempoTotal();
    finalizarRetirada();
}
function cancelarEdicaoTecnico(tecnico) {
    delete tecnicosEditando[tecnico];
    finalizarRetirada();
}
function excluirRetirada(indice) {
    Swal.fire({
        title: "🗑️ Confirmar exclusão",
        text: "Deseja realmente excluir este período?",
        icon: "question",
        iconColor: "#E8465D",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Sim, apagar!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            let tecnico = DataManager.registros[indice]?.tecnico;
            DataManager.registros.splice(indice, 1);
            DataManager.salvarLocal();
            let dataSelecionada = document.getElementById("data-retirada")?.value;
            let aindaTemRegistros = DataManager.registros.some(
                (r) => r.tecnico === tecnico && r.data === dataSelecionada
            );
            if (!aindaTemRegistros) delete tecnicosEditando[tecnico];
            atualizarTempoTotal();
            finalizarRetirada();
            Swal.fire({
                icon: "success",
                title: "Excluído!",
                text: "O período foi removido com sucesso.",
                timer: 1500,
                showConfirmButton: false,
                toast: true,
            });
        }
    });
}
function finalizarRetirada() {
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
        let tipoEquipe = lista[0]?.tipoEquipe || "Solo";
        let regional = lista[0]?.regional || obterRegionalPorTecnico(tecnico);
        let temDiaTodo = lista.some((r) => r.isDiaTodo);
        let bloco = document.createElement("div");
        bloco.style.marginBottom = "2rem";
        if (tecnicosEditando[tecnico]) {
            bloco.innerHTML = `Retirada De Tempo<br><br>Data: ${Utils.formatarData(
                dataSelecionada
            )}<br>Técnico: ${tecnico}<br>Regional: ${regional}<br>Carga Horária: ${jornada}<br>Tipo de Equipe: ${tipoEquipe}<br>`;
            if (temDiaTodo) bloco.innerHTML += `Tempo a Retirar: Retirar o dia todo<br><br>`;
            else {
                const tempoFormatado = Utils.formatarTempo(total, jornada);
                bloco.innerHTML += `Tempo a Retirar: ${tempoFormatado !== "" ? tempoFormatado : "0 minutos"}<br><br>`;
            }
            lista.forEach((r, idx) => {
                let indiceGlobal = DataManager.registros.findIndex(
                    (reg) =>
                        reg.data === r.data && reg.tecnico === r.tecnico && reg.inicio === r.inicio && reg.fim === r.fim
                );
                bloco.innerHTML += `<div style="margin-bottom: 1rem;"><input type="time" id="edit-inicio-${indiceGlobal}" value="${r.inicio}" style="width: 120px; padding: 0.3rem; margin-right: 0.5rem;"><input type="time" id="edit-fim-${indiceGlobal}" value="${r.fim}" style="width: 120px; padding: 0.3rem; margin-right: 0.5rem;"><input type="text" id="edit-motivo-${indiceGlobal}" value="${r.motivo}" placeholder="Motivo" style="width: 300px; padding: 0.3rem;"><button onclick="excluirRetirada(${indiceGlobal})" style="background: #dc3545; color: white; border: none; padding: 0.3rem 1rem; border-radius: 20px; cursor: pointer; margin-left: 0.5rem;"><i class="fas fa-trash"></i> Excluir</button></div>`;
            });
            bloco.innerHTML += `<div style="margin-top: 1rem;"><button onclick="salvarEdicoesTecnico('${tecnico.replace(
                /'/g,
                "\\'"
            )}')" style="background: #28a745; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 20px; cursor: pointer;"><i class="fas fa-save"></i> Salvar</button><button onclick="cancelarEdicaoTecnico('${tecnico.replace(
                /'/g,
                "\\'"
            )}')" style="background: #6c757d; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 20px; cursor: pointer; margin-left: 0.5rem;"><i class="fas fa-times"></i> Cancelar</button></div>`;
        } else {
            let tempoTexto = "";
            if (temDiaTodo) {
                tempoTexto = "Retirar o dia todo";
            } else {
                const tempoFormatado = Utils.formatarTempo(total, jornada);
                tempoTexto = tempoFormatado !== "" ? tempoFormatado : "0 minutos";
            }
            bloco.innerHTML = `Retirada De Tempo<br><br>Data: ${Utils.formatarData(
                dataSelecionada
            )}<br>Técnico: ${tecnico}<br>Regional: ${regional}<br>Carga Horária: ${jornada}<br>Tipo de Equipe: ${tipoEquipe}<br>`;
            bloco.innerHTML += `Tempo a Retirar: ${tempoTexto}<br><br>`;
            lista.forEach((r) => {
                if (r.isDiaTodo) {
                    bloco.innerHTML += `Tempo: Retirar o dia todo.<br>`;
                } else {
                    const tempoPeriodo = Utils.formatarTempo(r.minutos, r.jornada);
                    if (tempoPeriodo !== "") {
                        bloco.innerHTML += `Tempo: ${tempoPeriodo}<br>`;
                    }
                }
                bloco.innerHTML += `Motivo: ${r.motivo}<br><br>`;
            });
        }
        resultadoDiv.appendChild(bloco);
        if (index < tecnicos.length - 1) resultadoDiv.appendChild(document.createElement("hr"));
    });
}
function finalizarRetiradaMultiplos() {
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
        let tipoEquipe = lista[0]?.tipoEquipe || "Solo";
        let regional = lista[0]?.regional || obterRegionalPorTecnico(tecnico);
        let temDiaTodo = lista.some((r) => r.isDiaTodo);
        let bloco = document.createElement("div");
        bloco.style.marginBottom = "2rem";
        let totalAjustado = total;
        if (jornada === "12/36") {
            totalAjustado = Math.round((total * 8) / 12);
            if (totalAjustado === 0 && total > 0) totalAjustado = 1;
        }
        let tempoTexto = "";
        if (temDiaTodo) {
            tempoTexto = "Retirar o dia todo";
        } else {
            const tempoFormatado = Utils.formatarTempo(total, jornada);
            tempoTexto =
                tempoFormatado !== "" ? tempoFormatado : totalAjustado > 0 ? `${totalAjustado} minutos` : "0 minutos";
        }
        bloco.innerHTML = `Retirada De Tempo<br><br>Data: ${Utils.formatarData(
            dataSelecionada
        )}<br>Técnico: ${tecnico}<br>Regional: ${regional}<br>Carga Horária: ${jornada}<br>Tipo de Equipe: ${tipoEquipe}<br>`;
        bloco.innerHTML += `Tempo a Retirar: ${tempoTexto}<br><br>`;
        lista.forEach((r) => {
            if (r.isDiaTodo) {
                bloco.innerHTML += `Tempo: Retirar o dia todo.<br>`;
            } else {
                let minutosExibir = r.minutos;
                if (jornada === "12/36") {
                    minutosExibir = Math.round((r.minutos * 8) / 12);
                    if (minutosExibir === 0 && r.minutos > 0) minutosExibir = 1;
                }
                let tempoPeriodo = Utils.formatarTempo(r.minutos, r.jornada);
                if (tempoPeriodo === "" && r.minutos > 0) {
                    tempoPeriodo = `${minutosExibir} minuto${minutosExibir > 1 ? "s" : ""}`;
                }
                if (tempoPeriodo !== "") {
                    bloco.innerHTML += `Tempo: ${tempoPeriodo}<br>`;
                }
            }
            bloco.innerHTML += `Motivo: ${r.motivo}<br><br>`;
        });
        resultadoDiv.appendChild(bloco);
        if (index < tecnicos.length - 1) resultadoDiv.appendChild(document.createElement("hr"));
    });
}

// ========== FUNÇÕES DE FILTRO DROPDOWN ==========
let filtroEquipesAtivo = false;
let equipesFiltradas = [];
let ultimaSelecaoFiltro = [];

function toggleFilterDropdown() {
    const dropdown = document.getElementById("filterDropdownMenu");
    const btn = document.getElementById("filterMainBtn");
    if (dropdown) {
        dropdown.classList.toggle("show");
        if (btn) btn.classList.toggle("active");
    }
}

document.addEventListener("click", function (e) {
    const container = document.querySelector(".filter-dropdown-container");
    if (container && !container.contains(e.target)) {
        const dropdown = document.getElementById("filterDropdownMenu");
        const btn = document.getElementById("filterMainBtn");
        if (dropdown) dropdown.classList.remove("show");
        if (btn) btn.classList.remove("active");
    }
});

function atualizarInterfaceFiltro() {
    const btn = document.getElementById("filterMainBtn");
    const statusText = document.getElementById("filterStatusText");
    const filterInfo = document.getElementById("filterInfo");
    const filterPreview = document.getElementById("filterPreview");
    const previewList = document.getElementById("filterPreviewList");
    const activateBtn = document.getElementById("filterActivateBtn");
    const deactivateBtn = document.getElementById("filterDeactivateBtn");

    if (filtroEquipesAtivo && equipesFiltradas && equipesFiltradas.length > 0) {
        if (btn) {
            btn.classList.add("filter-active");
            btn.style.background = "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)";
        }
        if (statusText) statusText.textContent = "Filtro Ativo";
        if (filterInfo) {
            filterInfo.className = "filter-info filter-active-info";
            filterInfo.innerHTML = `<i class="fas fa-check-circle"></i><span>Filtro ativo com ${equipesFiltradas.length} técnico(s)</span>`;
        }
        if (activateBtn) activateBtn.style.display = "none";
        if (deactivateBtn) deactivateBtn.style.display = "flex";
        if (filterPreview) filterPreview.style.display = "block";
        if (previewList && equipesFiltradas.length > 0) {
            previewList.innerHTML = equipesFiltradas
            .map((tec) => `<div class="filter-preview-item"><i class="fas fa-user"></i> ${escapeHtml(tec.nome)}</div>`)
            .join("");
        }
    } else {
        if (btn) {
            btn.classList.remove("filter-active");
            btn.style.background = "linear-gradient(135deg, #2d3a48 0%, #1e2a3a 100%)";
        }
        if (statusText) statusText.textContent = "Filtro Inativo";
        if (filterInfo) {
            filterInfo.className = "filter-info";
            filterInfo.innerHTML = `<i class="fas fa-info-circle"></i><span>Nenhum filtro ativo</span>`;
        }
        if (activateBtn) activateBtn.style.display = "flex";
        if (deactivateBtn) deactivateBtn.style.display = "none";
        if (filterPreview) filterPreview.style.display = "none";
    }
}

function ativarFiltroEquipes() {
    let tecnicosParaFiltrar = tecnicosSelecionados;
    if (tecnicosSelecionados.length === 0 && ultimaSelecaoFiltro.length > 0) {
        tecnicosParaFiltrar = ultimaSelecaoFiltro;
        tecnicosSelecionados = [...ultimaSelecaoFiltro];
        atualizarEquipesSelecionadas();
        renderListaTecnicosPorRegional();
    }
    if (tecnicosParaFiltrar.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Nenhum técnico selecionado",
            text: "Selecione os técnicos que deseja filtrar antes de ativar o filtro!",
            toast: true,
            timer: 2000,
            showConfirmButton: false,
        });
        return false;
    }
    ultimaSelecaoFiltro = [...tecnicosParaFiltrar];
    equipesFiltradas = [...tecnicosParaFiltrar];
    filtroEquipesAtivo = true;
    salvarFiltro();
    aplicarFiltroNaLista();
    atualizarInterfaceFiltro();
    Swal.fire({
        icon: "success",
        title: "✅ Filtro ativado!",
        text: `${equipesFiltradas.length} técnico(s) filtrados. O filtro será mantido para este dia.`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
    });
    return true;
}

function desativarFiltroEquipes() {
    Swal.fire({
        title: "Desativar filtro?",
        text: "Deseja desativar o filtro atual? Todos os técnicos serão exibidos novamente.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#E8465D",
        confirmButtonText: "Sim, desativar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            if (equipesFiltradas.length > 0) ultimaSelecaoFiltro = [...equipesFiltradas];
            filtroEquipesAtivo = false;
            equipesFiltradas = [];
            salvarFiltro();
            if (window.regionaisOriginal && Object.keys(window.regionaisOriginal).length > 0) {
                regionais = {...window.regionaisOriginal};
            } else {
                const dataSelecionada = document.getElementById("data-ativacao")?.value;
                if (dataSelecionada) carregarTecnicosPorData(dataSelecionada);
            }
            renderListaTecnicosPorRegional();
            if (ultimaSelecaoFiltro.length > 0) {
                tecnicosSelecionados = [...ultimaSelecaoFiltro];
                atualizarEquipesSelecionadas();
            } else {
                tecnicosSelecionados = [];
                atualizarEquipesSelecionadas();
            }
            atualizarInterfaceFiltro();
            Swal.fire({
                icon: "info",
                title: "🔓 Filtro desativado",
                text: "Todos os técnicos estão visíveis novamente. Seus técnicos selecionados foram mantidos.",
                timer: 2500,
                showConfirmButton: false,
                toast: true,
            });
        }
    });
}

function excluirFiltroEquipes() {
    if (!filtroEquipesAtivo && equipesFiltradas.length === 0 && ultimaSelecaoFiltro.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Nenhum filtro ativo",
            text: "Não há filtro ativo para excluir.",
            toast: true,
            timer: 2000,
        });
        return;
    }
    Swal.fire({
        title: "🗑️ Excluir filtro",
        text: "Deseja realmente excluir o filtro ativo? Ele será removido permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            ultimaSelecaoFiltro = [];
            filtroEquipesAtivo = false;
            equipesFiltradas = [];
            tecnicosSelecionados = [];
            localStorage.removeItem("filtro_equipes_ativacao");
            if (window.regionaisOriginal && Object.keys(window.regionaisOriginal).length > 0) {
                regionais = {...window.regionaisOriginal};
            } else {
                const dataSelecionada = document.getElementById("data-ativacao")?.value;
                if (dataSelecionada) carregarTecnicosPorData(dataSelecionada);
            }
            renderListaTecnicosPorRegional();
            tecnicosSelecionados = [];
            atualizarEquipesSelecionadas();
            atualizarInterfaceFiltro();
            Swal.fire({
                icon: "success",
                title: "✅ Filtro excluído!",
                text: "Todos os técnicos estão visíveis novamente.",
                toast: true,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    });
}

window.toggleFiltroEquipes = function () {
    if (filtroEquipesAtivo) desativarFiltroEquipes();
    else ativarFiltroEquipes();
};

function salvarFiltro() {
    const dados = {
        ativo: filtroEquipesAtivo,
        equipes: equipesFiltradas,
        ultimaSelecao: ultimaSelecaoFiltro,
        dataSalvo: new Date().toISOString(),
    };
    localStorage.setItem("filtro_equipes_ativacao", JSON.stringify(dados));
}

function carregarFiltroSalvo() {
    const filtroSalvo = localStorage.getItem("filtro_equipes_ativacao");
    if (filtroSalvo) {
        try {
            const dados = JSON.parse(filtroSalvo);
            filtroEquipesAtivo = dados.ativo;
            equipesFiltradas = dados.equipes || [];
            ultimaSelecaoFiltro = dados.ultimaSelecao || [];
            if (filtroEquipesAtivo && equipesFiltradas.length > 0) {
                setTimeout(() => {
                    if (regionais && Object.keys(regionais).length > 0) {
                        aplicarFiltroNaLista();
                        atualizarInterfaceFiltro();
                    } else {
                        const checkInterval = setInterval(() => {
                            if (regionais && Object.keys(regionais).length > 0) {
                                clearInterval(checkInterval);
                                aplicarFiltroNaLista();
                                atualizarInterfaceFiltro();
                            }
                        }, 500);
                        setTimeout(() => clearInterval(checkInterval), 5000);
                    }
                }, 500);
            } else if (ultimaSelecaoFiltro.length > 0) {
                setTimeout(() => {
                    if (regionais && Object.keys(regionais).length > 0) {
                        tecnicosSelecionados = [...ultimaSelecaoFiltro];
                        atualizarEquipesSelecionadas();
                        renderListaTecnicosPorRegional();
                        atualizarInterfaceFiltro();
                    }
                }, 500);
            }
        } catch (e) {
            console.error("Erro ao carregar filtro salvo:", e);
        }
    }
}

function aplicarFiltroNaLista() {
    if (!regionais || Object.keys(regionais).length === 0) {
        setTimeout(() => aplicarFiltroNaLista(), 500);
        return;
    }
    if (equipesFiltradas.length === 0) return;
    const regionaisFiltradas = {};
    equipesFiltradas.forEach((tec) => {
        if (!regionaisFiltradas[tec.regional]) regionaisFiltradas[tec.regional] = [];
        regionaisFiltradas[tec.regional].push(tec.nome);
    });
    if (!window.regionaisOriginal || Object.keys(window.regionaisOriginal).length === 0)
        window.regionaisOriginal = {...regionais};
    regionais = regionaisFiltradas;
    renderListaTecnicosPorRegional();
    tecnicosSelecionados = [...equipesFiltradas];
    atualizarEquipesSelecionadas();
}

function restaurarListaCompleta() {
    if (window.regionaisOriginal) regionais = {...window.regionaisOriginal};
    renderListaTecnicosPorRegional();
}

function editarFiltroEquipes() {
    let tecnicosOriginais = {};
    if (window.regionaisOriginal && Object.keys(window.regionaisOriginal).length > 0)
        tecnicosOriginais = window.regionaisOriginal;
    else tecnicosOriginais = regionais;
    const tecnicosPorRegiao = {};
    for (let regional in tecnicosOriginais) {
        if (tecnicosOriginais[regional] && tecnicosOriginais[regional].length > 0)
            tecnicosPorRegiao[regional] = [...tecnicosOriginais[regional]];
    }
    const tecnicosNoFiltro =
        filtroEquipesAtivo && equipesFiltradas.length > 0 ? equipesFiltradas.map((t) => t.nome) : [];

    function gerarHtmlTecnicosPorRegiao(termoBusca = "", selecionadosArray = []) {
        let html = "";
        const termo = termoBusca.toLowerCase().trim();
        const regioesOrdenadas = Object.keys(tecnicosPorRegiao).sort();
        for (let regional of regioesOrdenadas) {
            const tecnicos = tecnicosPorRegiao[regional].sort((a, b) => a.localeCompare(b));
            const tecnicosFiltrados = termo ? tecnicos.filter((tec) => tec.toLowerCase().includes(termo)) : tecnicos;
            if (tecnicosFiltrados.length === 0) continue;
            html += `<div class="filter-regional-bloco" style="margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #222E3A 0%, #1e2a3a 100%); color: white; padding: 0.8rem 1.2rem; font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 0.8rem;">
                    <i class="fas fa-map-marker-alt" style="color: #E8465D; font-size: 1.1rem;"></i>
                    <span>${escapeHtml(regional)}</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.7rem; border-radius: 30px; font-size: 0.7rem;">
                        <i class="fas fa-user" style="font-size: 0.6rem; margin-right: 0.3rem;"></i>${
                            tecnicosFiltrados.length
                        }
                    </span>
                </div>
                <div style="padding: 1rem; display: flex; flex-wrap: wrap; gap: 0.7rem; background: #ffffff;">`;
            tecnicosFiltrados.forEach((tec) => {
                const isSelected = selecionadosArray.includes(tec);
                html += `<div class="filter-tec-item" data-nome="${escapeHtml(tec)}" data-regional="${escapeHtml(
                    regional
                )}" style="display: inline-flex; align-items: center; gap: 0.7rem; background: ${
                    isSelected ? "#e8f5e9" : "#f8fafc"
                }; border: 1px solid ${
                    isSelected ? "#28a745" : "#e2e8f0"
                }; border-radius: 50px; padding: 0.5rem 1rem; transition: all 0.2s;">
                    <i class="fas fa-user" style="color: #E8465D; font-size: 0.85rem;"></i>
                    <span style="font-size: 0.85rem; font-weight: 500;">${escapeHtml(tec)}</span>
                    <button type="button" class="filter-tec-btn" data-nome="${escapeHtml(
                        tec
                    )}" data-regional="${escapeHtml(regional)}" data-action="${
                    isSelected ? "remove" : "add"
                }" style="background: ${
                    isSelected ? "#dc3545" : "#28a745"
                }; color: white; border: none; padding: 0.25rem 0.8rem; border-radius: 40px; cursor: pointer; font-size: 0.7rem; min-width: auto; display: flex; align-items: center; gap: 0.4rem;">
                        <i class="fas ${isSelected ? "fa-times" : "fa-plus"}" style="font-size: 0.65rem;"></i>
                        <span>${isSelected ? "Remover" : "Adicionar"}</span>
                    </button>
                </div>`;
            });
            html += `</div></div>`;
        }
        if (html === "")
            html =
                '<div style="text-align: center; color: #94a3b8; padding: 2rem;"><i class="fas fa-search" style="font-size: 2rem; margin-bottom: 0.6rem; display: block;"></i><span style="font-size: 0.9rem;">Nenhum técnico encontrado para esta busca</span></div>';
        return html;
    }

    function gerarHtmlSelecionados(selecionadosArray = []) {
        if (selecionadosArray.length === 0)
            return '<div style="text-align: center; color: #94a3b8; padding: 1.5rem;"><i class="fas fa-users-slash" style="font-size: 2rem; margin-bottom: 0.6rem; display: block;"></i><span style="font-size: 0.9rem;">Nenhum técnico selecionado</span></div>';
        let html = "";
        selecionadosArray.sort().forEach((tec) => {
            let regional = "";
            for (let reg in tecnicosPorRegiao)
                if (tecnicosPorRegiao[reg].includes(tec)) {
                    regional = reg;
                    break;
                }
            html += `<div class="filter-selected-item" data-nome="${escapeHtml(
                tec
            )}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.7rem 0.9rem; border-bottom: 1px solid #e9ecef; transition: background 0.2s;">
                <div style="display: flex; align-items: center; gap: 0.7rem;">
                    <i class="fas fa-user-check" style="color: #28a745; font-size: 0.9rem;"></i>
                    <div>
                        <span style="font-weight: 600; font-size: 0.85rem;">${escapeHtml(tec)}</span>
                        <span style="font-size: 0.65rem; color: #94a3b8; margin-left: 0.5rem;"><i class="fas fa-map-marker-alt" style="font-size: 0.6rem;"></i> ${escapeHtml(
                            regional
                        )}</span>
                    </div>
                </div>
                <button type="button" class="remove-selected-btn" data-nome="${escapeHtml(
                    tec
                )}" style="background: #dc3545; color: white; border: none; padding: 0.3rem 0.9rem; border-radius: 40px; cursor: pointer; font-size: 0.7rem; min-width: auto; display: flex; align-items: center; gap: 0.4rem;">
                    <i class="fas fa-times"></i> <span>Remover</span>
                </button>
            </div>`;
        });
        return html;
    }

    Swal.fire({
        title: '<div style="display: flex; align-items: center; justify-content: center; gap: 0.8rem;"><i class="fas fa-filter" style="color: #E8465D; font-size: 1.4rem;"></i><span style="font-size: 1.2rem; font-weight: 600;">Editar Filtro de Equipes</span></div>',
        width: "1300px",
        html: `<div style="text-align: left; padding: 0.5rem 0;">
            <div style="margin-bottom: 1.2rem;"><label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; display: block; color: #1e293b;"><i class="fas fa-search" style="color: #E8465D; margin-right: 0.5rem;"></i> Buscar técnico:</label>
            <input type="text" id="filter-search-input" placeholder="Digite o nome do técnico..." style="width: 100%; padding: 0.7rem 1.2rem; border-radius: 50px; border: 1.5px solid #e2e8f0; font-size: 0.9rem; outline: none; transition: all 0.2s;"></div>
            <div style="display: flex; gap: 1.8rem; flex-wrap: wrap;">
                <div style="flex: 1.5; min-width: 500px;"><label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.6rem; display: block; color: #1e293b;"><i class="fas fa-users" style="color: #E8465D; margin-right: 0.5rem;"></i> Todos os técnicos da planilha:</label>
                <div id="filter-all-tecnicos" style="height: 420px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 0.8rem; background: #f8fafc;">${gerarHtmlTecnicosPorRegiao(
                    "",
                    tecnicosNoFiltro
                )}</div></div>
                <div style="flex: 1; min-width: 350px;"><label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.6rem; display: block; color: #1e293b;"><i class="fas fa-check-circle" style="color: #28a745; margin-right: 0.5rem;"></i> Técnicos no filtro (<span id="selected-count" style="font-weight: 700;">${
                    tecnicosNoFiltro.length
                }</span>):</label>
                <div id="filter-selected-list" style="height: 420px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 0.5rem; background: #f8fafc;">${gerarHtmlSelecionados(
                    tecnicosNoFiltro
                )}</div></div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid #e9ecef;">
                <button id="filter-add-all" type="button" style="background: #4a6382; color: white; border: none; padding: 0.6rem 1.4rem; border-radius: 50px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.6rem; font-weight: 500; font-size: 0.8rem;"><i class="fas fa-check-double"></i> Adicionar Todos</button>
                <button id="filter-clear-all" type="button" style="background: #dc3545; color: white; border: none; padding: 0.6rem 1.4rem; border-radius: 50px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.6rem; font-weight: 500; font-size: 0.8rem;"><i class="fas fa-trash-alt"></i> Remover Todos</button>
            </div>
        </div>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save" style="margin-right: 0.5rem;"></i> Salvar Filtro',
        cancelButtonText: '<i class="fas fa-times" style="margin-right: 0.5rem;"></i> Cancelar',
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6c757d",
        didOpen: () => {
            const searchInput = document.getElementById("filter-search-input");
            const allTecnicosDiv = document.getElementById("filter-all-tecnicos");
            const selectedListDiv = document.getElementById("filter-selected-list");
            const selectedCountSpan = document.getElementById("selected-count");
            let tecnicosSelecionadosArray = [...tecnicosNoFiltro];
            function updateSelectedCount() {
                if (selectedCountSpan) selectedCountSpan.textContent = tecnicosSelecionadosArray.length;
            }
            function updateSelectedListDisplay() {
                selectedListDiv.innerHTML = gerarHtmlSelecionados(tecnicosSelecionadosArray);
                selectedListDiv.querySelectorAll(".remove-selected-btn").forEach((btn) => {
                    btn.removeEventListener("click", handleRemoveClick);
                    btn.addEventListener("click", handleRemoveClick);
                });
                updateSelectedCount();
                updateAllTecnicosDisplay(searchInput ? searchInput.value : "");
            }
            function updateAllTecnicosDisplay(termoBusca = "") {
                allTecnicosDiv.innerHTML = gerarHtmlTecnicosPorRegiao(termoBusca, tecnicosSelecionadosArray);
                allTecnicosDiv.querySelectorAll(".filter-tec-btn").forEach((btn) => {
                    btn.removeEventListener("click", handleTecBtnClick);
                    btn.addEventListener("click", handleTecBtnClick);
                });
            }
            function handleTecBtnClick(e) {
                e.stopPropagation();
                const btn = e.currentTarget,
                    nome = btn.dataset.nome,
                    action = btn.dataset.action;
                if (action === "add") {
                    if (!tecnicosSelecionadosArray.includes(nome)) tecnicosSelecionadosArray.push(nome);
                } else {
                    const index = tecnicosSelecionadosArray.indexOf(nome);
                    if (index !== -1) tecnicosSelecionadosArray.splice(index, 1);
                }
                updateSelectedListDisplay();
            }
            function handleRemoveClick(e) {
                e.stopPropagation();
                const btn = e.currentTarget,
                    nome = btn.dataset.nome,
                    index = tecnicosSelecionadosArray.indexOf(nome);
                if (index !== -1) tecnicosSelecionadosArray.splice(index, 1);
                updateSelectedListDisplay();
            }
            if (searchInput) searchInput.addEventListener("input", (e) => updateAllTecnicosDisplay(e.target.value));
            document.getElementById("filter-add-all")?.addEventListener("click", () => {
                const todosTecnicos = [];
                for (let reg in tecnicosPorRegiao)
                    tecnicosPorRegiao[reg].forEach((tec) => {
                        if (!tecnicosSelecionadosArray.includes(tec)) todosTecnicos.push(tec);
                    });
                tecnicosSelecionadosArray = [...tecnicosSelecionadosArray, ...todosTecnicos];
                updateSelectedListDisplay();
            });
            document.getElementById("filter-clear-all")?.addEventListener("click", () => {
                tecnicosSelecionadosArray = [];
                updateSelectedListDisplay();
            });
            updateSelectedListDisplay();
            window.filtroEditTempList = tecnicosSelecionadosArray;
            const interval = setInterval(() => {
                window.filtroEditTempList = tecnicosSelecionadosArray;
            }, 100);
            setTimeout(() => clearInterval(interval), 5000);
        },
        preConfirm: () => {
            const listaFinal = window.filtroEditTempList || [];
            if (listaFinal.length === 0) {
                Swal.showValidationMessage("Selecione pelo menos um técnico para o filtro!");
                return false;
            }
            const selectedTecnicos = [];
            listaFinal.forEach((nome) => {
                let regional = "";
                for (let reg in tecnicosPorRegiao)
                    if (tecnicosPorRegiao[reg].includes(nome)) {
                        regional = reg;
                        break;
                    }
                selectedTecnicos.push({nome: nome, regional: regional});
            });
            return {tecnicos: selectedTecnicos};
        },
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            equipesFiltradas = result.value.tecnicos;
            filtroEquipesAtivo = true;
            salvarFiltro();
            aplicarFiltroNaLista();
            atualizarInterfaceFiltro();
            Swal.fire({
                icon: "success",
                title: "✅ Filtro atualizado!",
                text: `${equipesFiltradas.length} técnico(s) no filtro.`,
                timer: 2000,
                showConfirmButton: false,
                toast: true,
            });
        }
    });
}

function atualizarTempoTotal() {
    let tecnico = tecnicoSelect ? tecnicoSelect.getValue() : "";
    let data = document.getElementById("data-retirada")?.value || "";
    let registros = DataManager.registros.filter((r) => r.tecnico === tecnico && r.data === data);
    let total = registros.reduce((acc, r) => acc + r.minutos, 0);
    let jornada = cargaHorariaSelect ? cargaHorariaSelect.getValue() : "Comercial";
    const tempoTotalDiv = document.getElementById("tempoTotal");
    if (tempoTotalDiv) {
        const tempoFormatado = Utils.formatarTempo(total, jornada);
        tempoTotalDiv.innerHTML = `<i class="fas fa-clock"></i> <span>Tempo a Retirar: <strong>${
            tempoFormatado !== "" ? tempoFormatado : "0 minutos"
        }</strong></span>`;
    }
}
function copiarTexto(elementId) {
    const elemento = document.getElementById(elementId);
    if (!elemento || !elemento.innerText.trim()) {
        Swal.fire({
            icon: "warning",
            title: "Nada para copiar",
            text: "Gere um relatório primeiro!",
            toast: true,
            timer: 2000,
            showConfirmButton: false,
        });
        return;
    }
    navigator.clipboard
    .writeText(elemento.innerText)
    .then(() => {
        Swal.fire({
            icon: "success",
            title: "Copiado!",
            text: "Texto copiado para a área de transferência",
            toast: true,
            timer: 1500,
            showConfirmButton: false,
        });
    })
    .catch(() => {
        Swal.fire({icon: "error", title: "Erro", text: "Não foi possível copiar o texto", toast: true, timer: 2000});
    });
}
function limparDataRetirada() {
    let dataSelecionada = document.getElementById("data-retirada")?.value;
    let tecnicoSelecionado = tecnicoSelect ? tecnicoSelect.getValue() : "";
    if (!dataSelecionada || !tecnicoSelecionado) {
        alert("Selecione uma data e um técnico!");
        return;
    }
    Swal.fire({
        title: "Limpar todos os registros?",
        text: `Excluir todos os registros de ${tecnicoSelecionado} na data ${Utils.formatarData(dataSelecionada)}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sim, limpar!",
    }).then((result) => {
        if (result.isConfirmed) {
            DataManager.registros = DataManager.registros.filter(
                (r) => !(r.data === dataSelecionada && r.tecnico === tecnicoSelecionado)
            );
            DataManager.salvarLocal();
            finalizarRetirada();
            if (tecnicoSelect) tecnicoSelect.clearSelection();
            atualizarTempoTotal();
            Swal.fire({icon: "success", title: "Registros removidos!", timer: 1500, showConfirmButton: false});
        }
    });
}
function preencherDiaTodo() {
    let data = document.getElementById("data-retirada")?.value;
    let tecnico = tecnicoSelect ? tecnicoSelect.getValue() : "";
    let jornada = cargaHorariaSelect ? cargaHorariaSelect.getValue() : "";
    if (!data || !tecnico || !jornada) {
        alert("Preencha Data, Técnico e Carga Horária primeiro!");
        return;
    }
    document.getElementById("inicio").value = "00:00";
    document.getElementById("fim").value = "23:59";
    Swal.fire({
        icon: "success",
        title: "Horário preenchido!",
        text: "00:00 às 23:59",
        timer: 1500,
        showConfirmButton: false,
    });
}

// ========== FUNÇÕES DE RETIRADA DE TEMPO (CONTINUAÇÃO) ==========
async function calcularRetirada() {
    let data = document.getElementById("data-retirada")?.value;
    let tecnico = tecnicoSelect ? tecnicoSelect.getValue() : "";
    let tipoEquipe = document.querySelector('input[name="tipo-equipe-retirada"]:checked')?.value || "Solo";
    let jornada = cargaHorariaSelect ? cargaHorariaSelect.getValue() : "";
    if (!data || !tecnico || !jornada) {
        Swal.fire({
            icon: "warning",
            title: "Campos obrigatórios",
            text: "Preencha Data, Técnico e Carga Horária!",
            timer: 2000,
            showConfirmButton: false,
        });
        return;
    }
    Swal.fire({
        title: "Calculando...",
        text: "Buscando dados da planilha",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });
    try {
        const resposta = await PlanilhaProcessor.carregarDadosPorData(data);
        if (resposta.status === "not_found" || !resposta.dados || resposta.dados.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Dados não encontrados",
                text: `Nenhum dado encontrado para a data ${Utils.formatarData(data)}`,
            });
            return;
        }

        // Processa retiradas com tempo
        const retiradas = PlanilhaProcessor.processarRetiradasDoTecnico(resposta.dados, tecnico);

        // Processa justificativas adicionais (sem tempo)
        const justificativasAdicionais = PlanilhaProcessor.processarJustificativasAdicionaisDoTecnico(
            resposta.dados,
            tecnico
        );

        if (retiradas.length === 0 && justificativasAdicionais.length === 0) {
            Swal.fire({
                icon: "info",
                title: "Sem registros",
                text: `Nenhum registro de retirada encontrado para ${tecnico} nesta data`,
            });
            return;
        }

        let totalMinutos = 0;

        // Salva retiradas com tempo
        retiradas.forEach((retirada) => {
            const existe = DataManager.registros.some(
                (r) =>
                    r.data === data && r.tecnico === tecnico && r.inicio === retirada.inicio && r.fim === retirada.fim
            );
            if (!existe) {
                DataManager.registros.push({
                    data,
                    tecnico,
                    regional: obterRegionalPorTecnico(tecnico),
                    tipoEquipe,
                    jornada,
                    inicio: retirada.inicio,
                    fim: retirada.fim,
                    motivo: retirada.motivo,
                    minutos: retirada.minutos,
                    isDiaTodo: retirada.inicio === "00:00" && retirada.fim === "23:59",
                    dataSalva: new Date().toISOString(),
                    fonte: "planilha",
                });
                totalMinutos += retirada.minutos;
            }
        });

        // Salva justificativas adicionais (sem tempo)
        if (justificativasAdicionais.length > 0) {
            DataManager.addJustificativasAdicionaisBatch(tecnico, data, justificativasAdicionais);
        }

        DataManager.salvarLocal();
        atualizarTempoTotal();
        finalizarRetirada();

        let mensagem = `<strong>Foram encontrados:</strong><br>`;
        mensagem += `• ${retiradas.length} período(s) de retirada com tempo<br>`;
        mensagem += `• ${justificativasAdicionais.length} justificativa(s) adicionais<br>`;
        mensagem += `<strong>Total de tempo: ${Utils.formatarTempo(totalMinutos, jornada)}</strong>`;

        Swal.fire({
            icon: "success",
            title: "Processamento concluído!",
            html: mensagem,
            timer: 5000,
            showConfirmButton: false,
        });
    } catch (erro) {
        console.error("❌ ERRO ao calcular retirada:", erro);
        Swal.fire({icon: "error", title: "Erro", text: "Erro ao buscar dados da planilha"});
    }
}
function buscarRetirada() {
    let data = document.getElementById("data-retirada")?.value;
    let tecnico = tecnicoSelect ? tecnicoSelect.getValue() : "";
    if (!data || !tecnico) {
        Swal.fire({
            icon: "warning",
            title: "Campos obrigatórios",
            text: "Selecione Data e Técnico!",
            timer: 2000,
            showConfirmButton: false,
        });
        return;
    }
    finalizarRetirada();
    const retiradas = DataManager.registros.filter((r) => r.data === data && r.tecnico === tecnico);
    if (retiradas.length === 0)
        Swal.fire({
            icon: "info",
            title: "Nenhuma retirada encontrada",
            text: `Não há registros de retirada para ${tecnico} em ${Utils.formatarData(data)}`,
        });
    else {
        const totalMinutos = retiradas.reduce((acc, r) => acc + r.minutos, 0);
        const jornada = retiradas[0]?.jornada || "Comercial";
        Swal.fire({
            icon: "success",
            title: "Retiradas encontradas",
            html: `<strong>${retiradas.length}</strong> período(s) de retirada<br><strong>Total: ${Utils.formatarTempo(
                totalMinutos,
                jornada
            )}</strong>`,
            timer: 3000,
            showConfirmButton: false,
        });
    }
}
function excluirRetiradaPorTecnicoData() {
    let data = document.getElementById("data-retirada")?.value;
    let tecnico = tecnicoSelect ? tecnicoSelect.getValue() : "";
    if (!data || !tecnico) {
        Swal.fire({
            icon: "warning",
            title: "Campos obrigatórios",
            text: "Selecione Data e Técnico!",
            timer: 2000,
            showConfirmButton: false,
        });
        return;
    }
    const retiradas = DataManager.registros.filter((r) => r.data === data && r.tecnico === tecnico);
    if (retiradas.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Nenhuma retirada",
            text: `Não há retiradas para excluir para ${tecnico} em ${Utils.formatarData(data)}`,
        });
        return;
    }
    Swal.fire({
        title: "Confirmar exclusão",
        text: `Excluir todas as retiradas de ${tecnico} na data ${Utils.formatarData(data)}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            DataManager.registros = DataManager.registros.filter((r) => !(r.data === data && r.tecnico === tecnico));
            DataManager.salvarLocal();
            atualizarTempoTotal();
            finalizarRetirada();
            if (tecnicoSelect) tecnicoSelect.clearSelection();
            Swal.fire({
                icon: "success",
                title: "Excluído!",
                text: "Todas as retiradas foram removidas",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    });
}

// ========== FUNÇÃO UNIFICADA: PRIMEIRO RETIRADA, DEPOIS RELATÓRIO ==========
async function gerarRelatorioCompleto() {
    const data = document.getElementById("data-ativacao")?.value;
    const cidade = document.getElementById("cidade")?.value;
    const responsavel = document.getElementById("responsavel")?.value;
    if (!data || !cidade || !responsavel) {
        Swal.fire({icon: "warning", title: "Campos obrigatórios", text: "Preencha Data, Cidade e Responsável!"});
        return;
    }
    if (tecnicosSelecionados.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Nenhum técnico selecionado",
            text: "Selecione pelo menos um técnico da lista!",
        });
        return;
    }
    if (!dadosPlanilha) {
        const carregado = await carregarTecnicosPorData(data);
        if (!carregado) {
            Swal.fire({
                icon: "warning",
                title: "Dados não carregados",
                text: "Não foi possível carregar os dados para esta data!",
            });
            return;
        }
    }
    Swal.fire({
        title: "Processando...",
        text: `Calculando retiradas e relatório para ${tecnicosSelecionados.length} técnico(s)`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });
    let retiradaTexto = "";
    let totalRetiradaGeral = 0;

    for (const tecnicoObj of tecnicosSelecionados) {
        const tecnico = tecnicoObj.nome;
        const regional = tecnicoObj.regional;
        const tipoEquipe = tecnicoObj.tipoEquipe || "Solo";
        const jornada = tecnicoObj.jornada || "Comercial";

        const retiradas = PlanilhaProcessor.processarRetiradasDoTecnico(dadosPlanilha, tecnico);
        const justificativasAdicionaisPlanilha = PlanilhaProcessor.processarJustificativasAdicionaisDoTecnico(
            dadosPlanilha,
            tecnico
        );

        if (justificativasAdicionaisPlanilha.length > 0) {
            DataManager.addJustificativasAdicionaisBatch(tecnico, data, justificativasAdicionaisPlanilha);
        }

        let totalMinutosTecnico = 0;
        retiradas.forEach((ret) => {
            totalMinutosTecnico += ret.minutos;
        });

        retiradaTexto += `Retirada De Tempo\n\n`;
        retiradaTexto += `Data: ${Utils.formatarData(data)}\n`;
        retiradaTexto += `Técnico: ${tecnico}\n`;
        retiradaTexto += `Regional: ${regional}\n`;
        retiradaTexto += `Carga Horária: ${jornada}\n`;
        retiradaTexto += `Tipo de Equipe: ${tipoEquipe}\n`;
        retiradaTexto += `Tempo a Retirar: ${Utils.formatarTempo(totalMinutosTecnico, jornada)}\n\n`;

        retiradas.forEach((ret) => {
            const minutosOriginais = ret.minutos;
            let minutosAjustados = minutosOriginais;
            let tempoConvertido = "";
            let tempoOriginal = "";
            if (jornada === "12/36") {
                minutosAjustados = Math.round((minutosOriginais * 8) / 12);
                if (minutosAjustados === 0 && minutosOriginais > 0) minutosAjustados = 1;
                if (minutosAjustados >= 60) {
                    const horas = Math.floor(minutosAjustados / 60);
                    const mins = minutosAjustados % 60;
                    if (horas === 1) tempoConvertido = `1 hora`;
                    else tempoConvertido = `${horas} horas`;
                    if (mins > 0) tempoConvertido += ` e ${mins} minutos`;
                } else if (minutosAjustados === 1) tempoConvertido = `1 minuto`;
                else tempoConvertido = `${minutosAjustados} minutos`;
                if (minutosOriginais >= 60) {
                    const horas = Math.floor(minutosOriginais / 60);
                    const mins = minutosOriginais % 60;
                    if (horas === 1) tempoOriginal = `1 hora`;
                    else tempoOriginal = `${horas} horas`;
                    if (mins > 0) tempoOriginal += ` e ${mins} minutos`;
                } else if (minutosOriginais === 1) tempoOriginal = `1 minuto`;
                else tempoOriginal = `${minutosOriginais} minutos`;
                retiradaTexto += `Tempo: ${tempoConvertido} ( referente a ${tempoOriginal} )\n`;
            } else {
                if (minutosOriginais >= 60) {
                    const horas = Math.floor(minutosOriginais / 60);
                    const mins = minutosOriginais % 60;
                    if (horas === 1) tempoConvertido = `1 hora`;
                    else tempoConvertido = `${horas} horas`;
                    if (mins > 0) tempoConvertido += ` e ${mins} minutos`;
                } else if (minutosOriginais === 1) tempoConvertido = `1 minuto`;
                else tempoConvertido = `${minutosOriginais} minutos`;
                retiradaTexto += `Tempo: ${tempoConvertido}\n`;
            }
            retiradaTexto += `Motivo: ${ret.motivo}\n\n`;
            totalRetiradaGeral += minutosOriginais;

            const existe = DataManager.registros.some(
                (r) => r.data === data && r.tecnico === tecnico && r.inicio === ret.inicio && r.fim === ret.fim
            );
            if (!existe) {
                DataManager.registros.push({
                    data,
                    tecnico,
                    regional,
                    tipoEquipe,
                    jornada,
                    inicio: ret.inicio,
                    fim: ret.fim,
                    motivo: ret.motivo,
                    minutos: minutosOriginais,
                    minutosAjustados: minutosAjustados,
                    isDiaTodo: ret.inicio === "00:00" && ret.fim === "23:59",
                    dataSalva: new Date().toISOString(),
                    fonte: "planilha",
                });
            }
        });

        retiradaTexto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    DataManager.salvarLocal();

    let relatorio = `RELATÓRIO DE ATIVAÇÃO – ${Utils.formatarData(
        data
    )} - ${cidade}\nResponsável: ${responsavel}\nNúmero de Equipes: ${tecnicosSelecionados.length}\n\n`;
    const dadosParaSalvar = {cidade, responsavel, data, equipes: []};

    for (const tecnicoObj of tecnicosSelecionados) {
        const tecnico = tecnicoObj.nome;
        const regional = tecnicoObj.regional;
        const tipoEquipe = tecnicoObj.tipoEquipe || "Solo";
        const jornada = tecnicoObj.jornada || "Comercial";
        const metricas = PlanilhaProcessor.processarDadosTecnicoPorRegional(dadosPlanilha, tecnico, regional);

        relatorio += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        relatorio += `EQUIPE TÉCNICA: ${tecnico}\n`;
        relatorio += `REGIONAL: ${regional}\n`;
        relatorio += `TIPO DE EQUIPE: ${tipoEquipe}\n`;
        relatorio += `CARGA HORÁRIA: ${jornada}\n\n`;
        relatorio += `    • Protocolos Planejamento: ${metricas.planejamento}\n`;
        relatorio += `    • Protocolos Execução: ${metricas.execucao}\n`;
        relatorio += `    • Protocolos Remarcação: ${metricas.remarcacao}\n`;
        relatorio += `    • Protocolos Cancelamento: ${metricas.cancelamento}\n`;
        relatorio += `    • Protocolos Tratativas CS: ${metricas.tratativasCS}\n`;
        relatorio += `    • Protocolos Infraestrutura: ${metricas.infraestrutura}\n`;
        relatorio += `    • Protocolos Resolução N2: ${metricas.resolucaoN2}\n\n`;
        relatorio += `RESUMO DE ATIVIDADES:\n\n`;

        for (let tipo in metricas.mapa) {
            relatorio += `          • ${tipo}: ${metricas.mapa[tipo]}\n`;
        }

        relatorio += `\n    • Total de Serviços Executados: ${metricas.totalExecutado}\n`;
        relatorio += `    • Total de Produtividade: ${metricas.produtividade.toFixed(2).replace(".", ",")}\n\n`;

        const retiradasSalvas = DataManager.buscarRetiradasPorTecnicoData(tecnico, data);
        if (retiradasSalvas && retiradasSalvas.length > 0) {
            relatorio += `JUSTIFICATIVAS DE RETIRADA DE TEMPO:\n`;
            retiradasSalvas.forEach((ret) => {
                relatorio += `    • ${ret.motivo}\n`;
            });
            relatorio += `\n`;
        }

        const justificativasAdicionais = DataManager.getJustificativasAdicionais(tecnico, data);
        if (justificativasAdicionais && justificativasAdicionais.length > 0) {
            relatorio += `JUSTIFICATIVAS ADICIONAIS:\n`;
            justificativasAdicionais.forEach((just) => {
                relatorio += `    • ${just.texto}\n`;
            });
            relatorio += `\n`;
        }

        dadosParaSalvar.equipes.push({nome: tecnico, regional, tipoEquipe, jornada, metricas});
    }

    DataManager.salvarRelatorio(data, dadosParaSalvar);

    const resultadoRelatorioDiv = document.getElementById("resultado-ativacao");
    const resultadoRetiradaDiv = document.getElementById("resultado-retirada-unificado");
    const resultadoContainer = document.getElementById("resultado-container");

    if (resultadoContainer) resultadoContainer.style.display = "flex";
    if (resultadoRelatorioDiv) resultadoRelatorioDiv.innerHTML = relatorio;
    if (resultadoRetiradaDiv) {
        resultadoRetiradaDiv.innerHTML = retiradaTexto;
        resultadoRetiradaDiv.style.whiteSpace = "pre-wrap";
        resultadoRetiradaDiv.style.fontFamily = "monospace";
    }

    Swal.fire({
        icon: "success",
        title: "Processamento concluído!",
        html: `<strong>Retiradas com tempo:</strong> Total de ${Utils.formatarTempo(
            totalRetiradaGeral,
            "Comercial"
        )}<br>
               <strong>Justificativas adicionais:</strong> Processadas e adicionadas ao relatório<br>
               <strong>Relatório:</strong> ${tecnicosSelecionados.length} técnico(s) processados`,
        timer: 5000,
        showConfirmButton: false,
    });
}

// ========== GERAR RELATÓRIO ==========
async function gerarRelatorioPlanilha() {
    const data = document.getElementById("data-ativacao")?.value;
    const cidade = document.getElementById("cidade")?.value;
    const responsavel = document.getElementById("responsavel")?.value;
    if (!data || !cidade || !responsavel) {
        Swal.fire({icon: "warning", title: "Campos obrigatórios", text: "Preencha Data, Cidade e Responsável!"});
        return;
    }
    if (tecnicosSelecionados.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Nenhum técnico selecionado",
            text: "Selecione pelo menos um técnico da lista!",
        });
        return;
    }
    if (!dadosPlanilha) {
        const carregado = await carregarTecnicosPorData(data);
        if (!carregado) {
            Swal.fire({
                icon: "warning",
                title: "Dados não carregados",
                text: "Não foi possível carregar os dados para esta data!",
            });
            return;
        }
    }
    let relatorio = `RELATÓRIO DE ATIVAÇÃO – ${Utils.formatarData(
        data
    )} - ${cidade}\nResponsável: ${responsavel}\nNúmero de Equipes: ${tecnicosSelecionados.length}\n\n`;
    const dadosParaSalvar = {cidade, responsavel, data, equipes: []};
    for (const tecnicoObj of tecnicosSelecionados) {
        const tecnico = tecnicoObj.nome,
            regional = tecnicoObj.regional,
            tipoEquipe = tecnicoObj.tipoEquipe || "Solo",
            jornada = tecnicoObj.jornada || "Comercial";
        const metricas = PlanilhaProcessor.processarDadosTecnicoPorRegional(dadosPlanilha, tecnico, regional);
        relatorio += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEQUIPE TÉCNICA: ${tecnico}\nREGIONAL: ${regional}\nTIPO DE EQUIPE: ${tipoEquipe}\nCARGA HORÁRIA: ${jornada}\n\n    • Protocolos Planejamento: ${metricas.planejamento}\n    • Protocolos Execução: ${metricas.execucao}\n    • Protocolos Remarcação: ${metricas.remarcacao}\n    • Protocolos Cancelamento: ${metricas.cancelamento}\n    • Protocolos Tratativas CS: ${metricas.tratativasCS}\n    • Protocolos Infraestrutura: ${metricas.infraestrutura}\n    • Protocolos Resolução N2: ${metricas.resolucaoN2}\n\nRESUMO DE ATIVIDADES:\n\n`;
        for (let tipo in metricas.mapa) relatorio += `          • ${tipo}: ${metricas.mapa[tipo]}\n`;
        relatorio += `\n    • Total de Serviços Executados: ${
            metricas.totalExecutado
        }\n    • Total de Produtividade: ${metricas.produtividade.toFixed(2).replace(".", ",")}\n\n`;
        const retiradas = DataManager.buscarRetiradasPorTecnicoData(tecnico, data);
        if (retiradas && retiradas.length > 0) {
            relatorio += `JUSTIFICATIVAS DE RETIRADA DE TEMPO:\n`;
            retiradas.forEach((ret) => {
                relatorio += `    • ${ret.motivo} \n`;
            });
            relatorio += `\n`;
        }
        const justificativasAdicionais = DataManager.getJustificativasAdicionais(tecnico, data);
        if (justificativasAdicionais && justificativasAdicionais.length > 0) {
            relatorio += `JUSTIFICATIVAS ADICIONAIS:\n`;
            justificativasAdicionais.forEach((just) => {
                relatorio += `    • ${just.texto}\n`;
            });
            relatorio += `\n`;
        }
        dadosParaSalvar.equipes.push({nome: tecnico, regional, tipoEquipe, jornada, metricas});
    }
    DataManager.salvarRelatorio(data, dadosParaSalvar);
    const resultadoDiv = document.getElementById("resultado-ativacao");
    const resultadoContainer = document.getElementById("resultado-container");
    if (resultadoContainer) resultadoContainer.style.display = "flex";
    if (resultadoDiv) resultadoDiv.innerHTML = relatorio;
    Swal.fire({
        icon: "success",
        title: "Relatório gerado!",
        text: `Foram processados ${tecnicosSelecionados.length} técnicos.`,
        timer: 2000,
        showConfirmButton: false,
    });
}
function carregarRelatorio() {
    const data = document.getElementById("data-ativacao")?.value;
    if (!data) {
        Swal.fire({
            icon: "warning",
            title: "⚠️ Selecione uma data",
            text: "Primeiro selecione a data para carregar o relatório!",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
        });
        return;
    }
    const itemSalvo = DataManager.carregarRelatorio(data);
    if (!itemSalvo) {
        Swal.fire({
            icon: "info",
            title: "📋 Nenhum relatório encontrado",
            text: `Não há relatório salvo para a data ${Utils.formatarData(data)}`,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
        });
        return;
    }
    document.getElementById("cidade").value = itemSalvo.dados.cidade || "";
    document.getElementById("responsavel").value = itemSalvo.dados.responsavel || "";
    const cidade = itemSalvo.dados.cidade || "Data selecionada";
    Swal.fire({
        icon: "success",
        title: "✅ Relatório carregado!",
        html: `<div style="text-align: center; padding: 0.5rem;"><div style="font-size: 3rem; margin-bottom: 1rem; color: #E8465D;">📊</div><p style="font-size: 1.2rem; font-weight: 600; color: #1d3b66; margin-bottom: 0.3rem;">${cidade}</p><p style="color: #64748b;">Data: ${Utils.formatarData(
            data
        )}</p><p style="color: #64748b;">Responsável: ${
            itemSalvo.dados.responsavel || "Não informado"
        }</p><p style="color: #10b981; margin-top: 0.5rem;">Clique em "Gerar Relatório" para visualizar</p></div>`,
        confirmButtonColor: "#E8465D",
        confirmButtonText: "OK",
    });
}
function apagarRelatorio() {
    const data = document.getElementById("data-ativacao")?.value;
    if (!data) {
        Swal.fire({
            icon: "warning",
            title: "Selecione uma data!",
            text: "Primeiro selecione a data do relatório!",
            toast: true,
            timer: 2000,
        });
        return;
    }
    Swal.fire({
        title: "Confirmar exclusão",
        text: `Deseja apagar o relatório da data ${Utils.formatarData(data)}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sim, apagar!",
    }).then((result) => {
        if (result.isConfirmed && DataManager.apagarRelatorioPorData(data)) {
            document.getElementById("resultado-ativacao").innerHTML = "";
            document.getElementById("resultado-retirada-unificado").innerHTML = "";
            const resultadoContainer = document.getElementById("resultado-container");
            if (resultadoContainer) resultadoContainer.style.display = "none";
            Swal.fire({icon: "success", title: "Apagado!", timer: 1500, showConfirmButton: false});
        }
    });
}
function copiarRelatorio() {
    const resultadoDiv = document.getElementById("resultado-ativacao");
    if (!resultadoDiv?.innerText.trim()) {
        Swal.fire({
            icon: "warning",
            title: "Nada para copiar",
            text: "Gere um relatório primeiro!",
            toast: true,
            timer: 2000,
        });
        return;
    }
    navigator.clipboard.writeText(resultadoDiv.innerText).then(() => {
        const btn = document.querySelector(".btn-copy");
        if (btn) {
            const textoOriginal = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => (btn.innerHTML = textoOriginal), 2000);
        }
    });
}

// ========== SISTEMA DE FAVORITOS/EQUIPES DE TRABALHO ==========
const FavoritosManager = {
    storageKey: "equipes_favoritas",
    carregarEquipes() {
        const equipes = localStorage.getItem(this.storageKey);
        return equipes ? JSON.parse(equipes) : [];
    },
    salvarEquipes(equipes) {
        localStorage.setItem(this.storageKey, JSON.stringify(equipes));
    },
    adicionarEquipe(nome, tecnicos) {
        const equipes = this.carregarEquipes();
        const novaEquipe = {id: Date.now(), nome: nome, tecnicos: tecnicos, dataCriacao: new Date().toISOString()};
        equipes.push(novaEquipe);
        this.salvarEquipes(equipes);
        return novaEquipe;
    },
    removerEquipe(id) {
        const equipes = this.carregarEquipes();
        const novasEquipes = equipes.filter((e) => e.id !== id);
        this.salvarEquipes(novasEquipes);
    },
    aplicarEquipe(equipe, aba) {
        if (aba === "ativacao") {
            tecnicosSelecionados = [];
            equipe.tecnicos.forEach((tec) => {
                tecnicosSelecionados.push({
                    nome: tec.nome,
                    regional: tec.regional,
                    tipoEquipe: "Solo",
                    jornada: "Comercial",
                });
            });
            renderListaTecnicosPorRegional();
            atualizarEquipesSelecionadas();
        } else if (aba === "retirada") {
            tecnicosSelecionadosRetirada = [];
            equipe.tecnicos.forEach((tec) => {
                tecnicosSelecionadosRetirada.push({
                    nome: tec.nome,
                    regional: tec.regional,
                    tipoEquipe: "Solo",
                    jornada: "Comercial",
                });
            });
            renderListaTecnicosRetirada();
            atualizarEquipesSelecionadasRetirada();
            atualizarTempoTotalGeral();
        }
    },
};
function renderizarFavoritosBadges(aba) {
    const container = document.getElementById(`favoritos-badges-${aba}`);
    if (!container) return;
    const equipes = FavoritosManager.carregarEquipes();
    if (equipes.length === 0) {
        container.innerHTML = '<span style="font-size: 0.7rem; color: #94a3b8;">Nenhuma equipe salva</span>';
        return;
    }
    let html = "";
    equipes.forEach((equipe) => {
        html += `<div class="favorito-badge" onclick="aplicarEquipeFavorita(${equipe.id}, '${aba}')" title="${
            equipe.tecnicos.length
        } técnico(s)"><i class="fas fa-users"></i> ${escapeHtml(
            equipe.nome
        )}<i class="fas fa-times-circle" onclick="event.stopPropagation(); removerEquipeFavorita(${
            equipe.id
        }, '${aba}')" style="cursor: pointer; opacity: 0.6;"></i></div>`;
    });
    container.innerHTML = html;
}
function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
function aplicarEquipeFavorita(equipeId, aba) {
    const equipes = FavoritosManager.carregarEquipes();
    const equipe = equipes.find((e) => e.id === equipeId);
    if (!equipe) {
        Swal.fire({
            icon: "error",
            title: "Equipe não encontrada",
            text: "Esta equipe pode ter sido removida.",
            toast: true,
            timer: 2000,
        });
        return;
    }
    FavoritosManager.aplicarEquipe(equipe, aba);
    Swal.fire({
        icon: "success",
        title: "✅ Filtro aplicado!",
        text: `Equipe "${equipe.nome}" carregada com ${equipe.tecnicos.length} técnico(s)`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
    });
}
function removerEquipeFavorita(equipeId, aba) {
    Swal.fire({
        title: "🗑️ Remover equipe",
        text: "Deseja realmente remover esta equipe dos favoritos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            FavoritosManager.removerEquipe(equipeId);
            renderizarFavoritosBadges(aba);
            Swal.fire({icon: "success", title: "Equipe removida!", toast: true, timer: 2000, showConfirmButton: false});
        }
    });
}
function abrirModalSalvarEquipe(aba) {
    const tecnicosSelecionadosAtuais = aba === "ativacao" ? tecnicosSelecionados : tecnicosSelecionadosRetirada;
    if (tecnicosSelecionadosAtuais.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Nenhum técnico selecionado",
            text: "Selecione pelo menos um técnico para salvar como equipe!",
            toast: true,
            timer: 2000,
        });
        return;
    }
    Swal.fire({
        title: "💾 Salvar Equipe",
        html: `<div style="text-align: left;"><input type="text" id="nome-equipe" class="swal2-input" placeholder="Nome da equipe (ex: Equipe Norte)" style="width: 100%; margin-bottom: 1rem;"><div style="margin-bottom: 0.5rem; font-size: 0.85rem; color: #64748b;"><i class="fas fa-users"></i> ${
            tecnicosSelecionadosAtuais.length
        } técnico(s) selecionado(s):</div><div style="max-height: 200px; overflow-y: auto; background: #f8fafc; border-radius: 8px; padding: 0.5rem;">${tecnicosSelecionadosAtuais
        .map(
            (tec) =>
                `<div style="padding: 0.25rem 0; font-size: 0.8rem;"><i class="fas fa-user" style="color: #E8465D; width: 20px;"></i> ${escapeHtml(
                    tec.nome
                )}</div>`
        )
        .join("")}</div></div>`,
        showCancelButton: true,
        confirmButtonText: "💾 Salvar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#28a745",
        preConfirm: () => {
            const nomeEquipe = document.getElementById("nome-equipe")?.value.trim();
            if (!nomeEquipe) {
                Swal.showValidationMessage("Digite um nome para a equipe!");
                return false;
            }
            return {nomeEquipe};
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const tecnicosParaSalvar = tecnicosSelecionadosAtuais.map((tec) => ({
                nome: tec.nome,
                regional: tec.regional,
            }));
            const novaEquipe = FavoritosManager.adicionarEquipe(result.value.nomeEquipe, tecnicosParaSalvar);
            renderizarFavoritosBadges(aba);
            Swal.fire({
                icon: "success",
                title: "✅ Equipe salva!",
                text: `"${novaEquipe.nome}" foi adicionada aos favoritos`,
                timer: 2000,
                showConfirmButton: false,
                toast: true,
            });
        }
    });
}
function limparFiltroEquipe(aba) {
    if (aba === "ativacao") {
        desmarcarTodosTecnicos();
        Swal.fire({
            icon: "info",
            title: "Filtro limpo",
            text: "Todos os técnicos foram desmarcados",
            toast: true,
            timer: 1500,
            showConfirmButton: false,
        });
    } else if (aba === "retirada") {
        desmarcarTodosTecnicosRetirada();
        Swal.fire({
            icon: "info",
            title: "Filtro limpo",
            text: "Todos os técnicos foram desmarcados",
            toast: true,
            timer: 1500,
            showConfirmButton: false,
        });
    }
}

// ========== FUNÇÕES DE FILTRO PARA RETIRADA COM PERSISTÊNCIA ==========
let filtroEquipesRetiradaAtivo = false;
let equipesFiltradasRetirada = [];
function carregarFiltroRetiradaSalvo() {
    const filtroSalvo = localStorage.getItem("filtro_equipes_retirada");
    if (filtroSalvo) {
        try {
            const dados = JSON.parse(filtroSalvo);
            filtroEquipesRetiradaAtivo = dados.ativo;
            equipesFiltradasRetirada = dados.equipes || [];
            if (filtroEquipesRetiradaAtivo && equipesFiltradasRetirada.length > 0) {
                setTimeout(() => {
                    if (regionaisRetirada && Object.keys(regionaisRetirada).length > 0) {
                        aplicarFiltroNaListaRetirada();
                        const btn = document.getElementById("btnFiltroAtivoRetirada");
                        if (btn) {
                            btn.innerHTML = '<i class="fas fa-filter"></i> Filtro Ativo';
                            btn.classList.add("active");
                        }
                    } else {
                        setTimeout(() => {
                            if (regionaisRetirada && Object.keys(regionaisRetirada).length > 0) {
                                aplicarFiltroNaListaRetirada();
                                const btn = document.getElementById("btnFiltroAtivoRetirada");
                                if (btn) {
                                    btn.innerHTML = '<i class="fas fa-filter"></i> Filtro Ativo';
                                    btn.classList.add("active");
                                }
                            }
                        }, 1000);
                    }
                }, 500);
            }
        } catch (e) {
            console.error("Erro ao carregar filtro da retirada:", e);
        }
    }
}
function salvarFiltroRetirada() {
    const dados = {
        ativo: filtroEquipesRetiradaAtivo,
        equipes: equipesFiltradasRetirada,
        dataSalvo: new Date().toISOString(),
    };
    localStorage.setItem("filtro_equipes_retirada", JSON.stringify(dados));
}
function toggleFiltroEquipesRetirada() {
    const btn = document.getElementById("btnFiltroAtivoRetirada");
    if (!btn) return;
    if (!filtroEquipesRetiradaAtivo) {
        if (tecnicosSelecionadosRetirada.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Nenhum técnico selecionado",
                text: "Selecione os técnicos que deseja filtrar antes de ativar o filtro!",
                toast: true,
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }
        equipesFiltradasRetirada = [...tecnicosSelecionadosRetirada];
        filtroEquipesRetiradaAtivo = true;
        btn.innerHTML = '<i class="fas fa-filter"></i> Filtro Ativo';
        btn.classList.add("active");
        salvarFiltroRetirada();
        Swal.fire({
            icon: "success",
            title: "✅ Filtro ativado!",
            text: `${equipesFiltradasRetirada.length} técnico(s) filtrados. O filtro será mantido para este dia e dias seguintes.`,
            timer: 3000,
            showConfirmButton: false,
            toast: true,
        });
        aplicarFiltroNaListaRetirada();
    } else {
        Swal.fire({
            title: "Desativar filtro?",
            text: "Deseja desativar o filtro atual? Os técnicos filtrados serão removidos.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#E8465D",
            confirmButtonText: "Sim, desativar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                filtroEquipesRetiradaAtivo = false;
                equipesFiltradasRetirada = [];
                btn.innerHTML = '<i class="fas fa-filter"></i> Filtro Inativo';
                btn.classList.remove("active");
                localStorage.removeItem("filtro_equipes_retirada");
                Swal.fire({
                    icon: "info",
                    title: "🔓 Filtro desativado",
                    text: "Todos os técnicos estão visíveis novamente.",
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                });
                restaurarListaCompletaRetirada();
            }
        });
    }
}
function aplicarFiltroNaListaRetirada() {
    if (!regionaisRetirada || Object.keys(regionaisRetirada).length === 0) {
        setTimeout(() => aplicarFiltroNaListaRetirada(), 500);
        return;
    }
    if (equipesFiltradasRetirada.length === 0) return;
    const regionaisFiltradas = {};
    equipesFiltradasRetirada.forEach((tec) => {
        if (!regionaisFiltradas[tec.regional]) regionaisFiltradas[tec.regional] = [];
        regionaisFiltradas[tec.regional].push(tec.nome);
    });
    window.regionaisRetiradaOriginal = {...regionaisRetirada};
    regionaisRetirada = regionaisFiltradas;
    renderListaTecnicosRetirada();
    tecnicosSelecionadosRetirada = [...equipesFiltradasRetirada];
    atualizarEquipesSelecionadasRetirada();
    atualizarTempoTotalGeral();
}
function restaurarListaCompletaRetirada() {
    if (window.regionaisRetiradaOriginal) regionaisRetirada = {...window.regionaisRetiradaOriginal};
    renderListaTecnicosRetirada();
}
function excluirFiltroEquipesRetirada() {
    if (!filtroEquipesRetiradaAtivo) {
        Swal.fire({
            icon: "info",
            title: "Nenhum filtro ativo",
            text: "Não há filtro ativo para excluir.",
            toast: true,
            timer: 2000,
        });
        return;
    }
    Swal.fire({
        title: "🗑️ Excluir filtro",
        text: "Deseja realmente excluir o filtro ativo? Ele será removido permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            filtroEquipesRetiradaAtivo = false;
            equipesFiltradasRetirada = [];
            const btn = document.getElementById("btnFiltroAtivoRetirada");
            if (btn) {
                btn.innerHTML = '<i class="fas fa-filter"></i> Filtro Inativo';
                btn.classList.remove("active");
            }
            localStorage.removeItem("filtro_equipes_retirada");
            restaurarListaCompletaRetirada();
            desmarcarTodosTecnicosRetirada();
            atualizarTempoTotalGeral();
            Swal.fire({icon: "success", title: "✅ Filtro excluído!", toast: true, timer: 2000});
        }
    });
}

// ========== FUNÇÕES DE UI ==========
function mudarAba(aba) {
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        if (aba === "ativacao") pageTitle.textContent = "Relatório / Retirada de Tempo";
        else if (aba === "busca") pageTitle.textContent = "Busca Avançada";
    }
    
    // Remover active de todos os itens
    document.querySelectorAll(".nav-item").forEach((item, i) => {
        item.classList.remove("active");
        // Adicionar active baseado na aba
        if ((aba === "ativacao" && i === 0) || (aba === "busca" && i === 1)) {
            item.classList.add("active");
        }
    });
    
    // Mostrar/esconder as abas
    document.getElementById("aba-ativacao")?.classList.remove("ativo");
    document.getElementById("aba-retirada")?.classList.remove("ativo");
    document.getElementById("aba-busca")?.classList.remove("ativo");
    document.getElementById(`aba-${aba}`)?.classList.add("ativo");
    
    localStorage.setItem("aba_atual", aba);
    
    if (aba === 'busca') {
        const hoje = new Date();
        const semanaAtras = new Date();
        semanaAtras.setDate(hoje.getDate() - 7);
        
        const dataInicio = document.getElementById("busca-data-inicio");
        const dataFim = document.getElementById("busca-data-fim");
        
        if (dataInicio && !dataInicio.value) {
            dataInicio.value = semanaAtras.toISOString().split('T')[0];
        }
        if (dataFim && !dataFim.value) {
            dataFim.value = hoje.toISOString().split('T')[0];
        }
    }
    
    setTimeout(() => {
        if (aba === "retirada") {
            initRadioButtonsRetirada();
        }
    }, 100);
}
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
}
function logout() {
    localStorage.removeItem("vtx_session");
    window.location.href = "index.html";
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", function () {
    const isLoginPage =
        window.location.pathname.includes("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname === "";
    if (isLoginPage) {
        setupLoginPage();
        return;
    }
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
        const userName = document.getElementById("user-name");
        if (userName)
            userName.textContent =
                session.email.split("@")[0].charAt(0).toUpperCase() + session.email.split("@")[0].slice(1);
    } catch (e) {
        window.location.href = "index.html";
        return;
    }
    const hoje = new Date().toISOString().split("T")[0];
    const dataAtivacao = document.getElementById("data-ativacao");
    const dataRetirada = document.getElementById("data-retirada");
    if (dataAtivacao && !dataAtivacao.value) dataAtivacao.value = hoje;
    if (dataRetirada && !dataRetirada.value) dataRetirada.value = hoje;
    const dateBadge = document.getElementById("current-date");
    if (dateBadge) {
        const hojeObj = new Date();
        dateBadge.textContent = hojeObj.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
    preencherDadosTecnicoInterno();
    const ultimaAba = localStorage.getItem("aba_atual");
    if (ultimaAba) mudarAba(ultimaAba);
    if (dataAtivacao) {
        dataAtivacao.addEventListener("change", onDataChange);
        if (dataAtivacao.value) setTimeout(() => onDataChange(), 100);
    }
    const dataRetiradaInput = document.getElementById("data-retirada");
    if (dataRetiradaInput) dataRetiradaInput.addEventListener("change", finalizarRetirada);
    const buscaInput = document.getElementById("busca-tecnicos");
    if (buscaInput) buscaInput.addEventListener("input", () => filtrarListaTecnicos());
    carregarTecnicosParaSelect();
    cargaHorariaSelect = new CargaHorariaSelect();
    setTimeout(() => {
        initRadioButtonsRetirada();
        carregarTecnicosRetirada();
        renderizarFavoritosBadges("ativacao");
        renderizarFavoritosBadges("retirada");
        carregarFiltroSalvo();
        carregarFiltroRetiradaSalvo();
        initFilterInterface();
    }, 500);
});

function initFilterInterface() {
    setTimeout(() => {
        atualizarInterfaceFiltro();
    }, 500);
}

// ========== FUNÇÕES DE LOGIN ==========
function setupLoginPage() {
    const sessionData = localStorage.getItem("vtx_session");
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const now = new Date().getTime();
            if (now - session.loginTime < SESSION_DURATION) {
                window.location.href = "painel.html";
                return;
            } else localStorage.removeItem("vtx_session");
        } catch (e) {
            localStorage.removeItem("vtx_session");
        }
    }
    const loginForm = document.getElementById("login-form");
    if (loginForm)
        loginForm.onsubmit = function (e) {
            e.preventDefault();
            handleLogin();
        };
}
function handleLogin() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const errorMessageDiv = document.getElementById("error-message");
    if (!ALLOWED_EMAILS.includes(email)) {
        if (errorMessageDiv) {
            errorMessageDiv.style.display = "flex";
            setTimeout(() => (errorMessageDiv.style.display = "none"), 3000);
        }
        return;
    }
    if (password !== PASSWORD) {
        if (errorMessageDiv) {
            errorMessageDiv.style.display = "flex";
            setTimeout(() => (errorMessageDiv.style.display = "none"), 3000);
        }
        return;
    }
    const sessionData = {email: email, loginTime: new Date().getTime()};
    localStorage.setItem("vtx_session", JSON.stringify(sessionData));
    Swal.fire({
        icon: "success",
        title: "Login realizado!",
        text: "Redirecionando...",
        timer: 1500,
        showConfirmButton: false,
    }).then(() => (window.location.href = "painel.html"));
}
function togglePasswordField() {
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
}

// ========== FUNÇÕES DA ABA BUSCA ==========
let dadosBuscaAcumulados = [];
let metricasChart, distribuicaoChart;

async function buscarDadosPorPeriodo() {
    const dataInicio = document.getElementById("busca-data-inicio")?.value;
    const dataFim = document.getElementById("busca-data-fim")?.value;
    
    if (!dataInicio || !dataFim) {
        Swal.fire({
            icon: "warning",
            title: "Campos obrigatórios",
            text: "Selecione a data inicial e final!",
            toast: true,
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }
    
    Swal.fire({
        title: "Buscando dados...",
        text: `Carregando dados de ${Utils.formatarData(dataInicio)} a ${Utils.formatarData(dataFim)}`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    dadosBuscaAcumulados = [];
    
    // Gerar array de datas entre início e fim
    const datas = [];
    let currentDate = new Date(dataInicio);
    const endDate = new Date(dataFim);
    
    while (currentDate <= endDate) {
        const dataISO = currentDate.toISOString().split('T')[0];
        datas.push(dataISO);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    let totalMetricas = {
        planejamento: 0,
        execucao: 0,
        remarcacao: 0,
        cancelamento: 0,
        tratativasCS: 0,
        infraestrutura: 0,
        resolucaoN2: 0
    };
    
    // Buscar dados para cada data
    for (const data of datas) {
        try {
            const resposta = await PlanilhaProcessor.carregarDadosPorData(data);
            
            if (resposta.dados && resposta.dados.length > 0) {
                // Extrair técnicos da planilha
                const regionaisTemp = PlanilhaProcessor.extrairTecnicosPorRegional(resposta.dados);
                let tecnicosTemp = [];
                
                for (let regional in regionaisTemp) {
                    regionaisTemp[regional].forEach(tecnico => {
                        tecnicosTemp.push({nome: tecnico, regional: regional});
                    });
                }
                
                // Processar cada técnico
                for (const tecnicoObj of tecnicosTemp) {
                    const metricas = PlanilhaProcessor.processarDadosTecnicoPorRegional(
                        resposta.dados, 
                        tecnicoObj.nome, 
                        tecnicoObj.regional
                    );
                    
                    totalMetricas.planejamento += metricas.planejamento;
                    totalMetricas.execucao += metricas.execucao;
                    totalMetricas.remarcacao += metricas.remarcacao;
                    totalMetricas.cancelamento += metricas.cancelamento;
                    totalMetricas.tratativasCS += metricas.tratativasCS;
                    totalMetricas.infraestrutura += metricas.infraestrutura;
                    totalMetricas.resolucaoN2 += metricas.resolucaoN2;
                }
                
                dadosBuscaAcumulados.push({
                    data: data,
                    metricas: {...totalMetricas}
                });
            }
        } catch (error) {
            console.error(`Erro ao carregar dados para ${data}:`, error);
        }
    }
    
    // Atualizar interface
    atualizarCardsResumo(totalMetricas);
    atualizarGraficos(totalMetricas);
    atualizarTabelaResultados(dadosBuscaAcumulados);
    
    Swal.fire({
        icon: "success",
        title: "Busca concluída!",
        text: `Foram processados ${dadosBuscaAcumulados.length} dias`,
        timer: 3000,
        showConfirmButton: false
    });
}

function atualizarCardsResumo(metricas) {
    document.getElementById("total-planejamento").textContent = metricas.planejamento;
    document.getElementById("total-execucao").textContent = metricas.execucao;
    document.getElementById("total-remarcacao").textContent = metricas.remarcacao;
    document.getElementById("total-cancelamento").textContent = metricas.cancelamento;
    document.getElementById("total-tratativas").textContent = metricas.tratativasCS;
    document.getElementById("total-infra").textContent = metricas.infraestrutura;
    document.getElementById("total-resolucao").textContent = metricas.resolucaoN2;
}

function atualizarGraficos(metricas) {
    const ctx1 = document.getElementById('metricasChart')?.getContext('2d');
    const ctx2 = document.getElementById('distribuicaoChart')?.getContext('2d');
    
    if (!ctx1 || !ctx2) return;
    
    const labels = ['Planejamento', 'Execução', 'Remarcação', 'Cancelamento', 'Tratativas CS', 'Infraestrutura', 'Resolução N2'];
    const valores = [
        metricas.planejamento,
        metricas.execucao,
        metricas.remarcacao,
        metricas.cancelamento,
        metricas.tratativasCS,
        metricas.infraestrutura,
        metricas.resolucaoN2
    ];
    
    // Destruir gráficos existentes
    if (metricasChart) metricasChart.destroy();
    if (distribuicaoChart) distribuicaoChart.destroy();
    
    // Gráfico de Barras - Versão Ultra Premium com gradiente
    const gradient = ctx1.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(232, 70, 93, 0.9)');
    gradient.addColorStop(0.5, 'rgba(232, 70, 93, 0.6)');
    gradient.addColorStop(1, 'rgba(232, 70, 93, 0.3)');
    
    metricasChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade de Protocolos',
                data: valores,
                backgroundColor: gradient,
                borderColor: '#E8465D',
                borderWidth: 2,
                borderRadius: 16,
                barPercentage: 0.7,
                categoryPercentage: 0.85,
                hoverBackgroundColor: 'rgba(232, 70, 93, 0.9)',
                hoverBorderColor: '#E8465D',
                hoverBorderWidth: 3,
                hoverBorderRadius: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 1200,
                easing: 'easeOutElastic',
                delay: (context) => context.dataIndex * 100
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12,
                            weight: '600',
                            family: 'Inter'
                        },
                        usePointStyle: true,
                        boxWidth: 10,
                        padding: 15,
                        color: '#1e293b'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} protocolos`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)',
                        drawBorder: false,
                        lineWidth: 1
                    },
                    ticks: {
                        stepSize: Math.ceil(Math.max(...valores) / 5) || 1,
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        color: '#64748b'
                    },
                    title: {
                        display: true,
                        text: 'QUANTIDADE',
                        font: {
                            size: 11,
                            weight: '700',
                            family: 'Inter'
                        },
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10,
                            weight: '500'
                        },
                        maxRotation: 35,
                        minRotation: 35,
                        color: '#475569'
                    }
                }
            }
        }
    });
    
    // Gráfico de Doughnut - Versão Ultra Premium com efeito 3D e gradiente
    const doughnutColors = [
        'rgba(232, 70, 93, 0.9)',
        'rgba(40, 167, 69, 0.9)',
        'rgba(255, 193, 7, 0.9)',
        'rgba(220, 53, 69, 0.9)',
        'rgba(23, 162, 184, 0.9)',
        'rgba(111, 66, 193, 0.9)',
        'rgba(253, 126, 20, 0.9)'
    ];
    
    distribuicaoChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: doughnutColors,
                borderWidth: 0,
                hoverOffset: 20,
                cutout: '65%',
                spacing: 2,
                offset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 10,
                            weight: '600',
                            family: 'Inter'
                        },
                        usePointStyle: true,
                        boxWidth: 8,
                        padding: 12,
                        color: '#334155'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 10,
                    callbacks: {
                        label: function(context) {
                            const total = valores.reduce((a, b) => a + b, 0);
                            const percent = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${context.raw} (${percent}%)`;
                        }
                    }
                }
            },
            layout: {
                padding: 10
            }
        }
    });
    
    // Adicionar texto central no gráfico de doughnut
    const total = valores.reduce((a, b) => a + b, 0);
    if (total > 0) {
        const centerText = {
            id: 'centerText',
            beforeDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();
                const fontSize = (height / 150).toFixed(2);
                ctx.font = `600 ${fontSize * 1.2}rem 'Inter'`;
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#1e293b';
                const text = total;
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        };
        distribuicaoChart.options.plugins = {
            ...distribuicaoChart.options.plugins,
            ...centerText
        };
    }
}

function atualizarTabelaResultados(dados) {
    const tbody = document.getElementById("tabela-body");
    if (!tbody) return;
    
    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum resultado encontrado</td></tr>';
        return;
    }
    
    let html = "";
    dados.forEach(item => {
        html += `
            <tr>
                <td>${Utils.formatarData(item.data)}</td>
                <td>${item.metricas.planejamento}</td>
                <td>${item.metricas.execucao}</td>
                <td>${item.metricas.remarcacao}</td>
                <td>${item.metricas.cancelamento}</td>
                <td>${item.metricas.tratativasCS}</td>
                <td>${item.metricas.infraestrutura}</td>
                <td>${item.metricas.resolucaoN2}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function exportarResultadosBusca() {
    if (dadosBuscaAcumulados.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Nenhum dado",
            text: "Realize uma busca primeiro!",
            toast: true,
            timer: 2000
        });
        return;
    }
    
    let csvContent = "Data,Planejamento,Execução,Remarcação,Cancelamento,Tratativas CS,Infraestrutura,Resolução N2\n";
    
    dadosBuscaAcumulados.forEach(item => {
        csvContent += `${Utils.formatarData(item.data)},${item.metricas.planejamento},${item.metricas.execucao},${item.metricas.remarcacao},${item.metricas.cancelamento},${item.metricas.tratativasCS},${item.metricas.infraestrutura},${item.metricas.resolucaoN2}\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_${document.getElementById("busca-data-inicio")?.value}_a_${document.getElementById("busca-data-fim")?.value}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    Swal.fire({
        icon: "success",
        title: "Exportado!",
        text: "Arquivo CSV gerado com sucesso",
        toast: true,
        timer: 2000
    });
}

    // Efeito de loading nos cards
function showCardsLoading() {
    const cards = document.querySelectorAll('.summary-card h3');
    cards.forEach(card => {
        card.style.opacity = '0.5';
        card.classList.add('loading-shimmer');
    });
}

function hideCardsLoading() {
    const cards = document.querySelectorAll('.summary-card h3');
    cards.forEach(card => {
        card.style.opacity = '1';
        card.classList.remove('loading-shimmer');
    });
}

// Adicionar animação ao buscar
const buscarDadosPorPeriodoOriginal = buscarDadosPorPeriodo;
window.buscarDadosPorPeriodo = async function() {
    showCardsLoading();
    await buscarDadosPorPeriodoOriginal();
    hideCardsLoading();
};

// Função para recarregar a página
function recarregarPagina() {
    Swal.fire({
        title: "Recarregar página?",
        text: "Todos os dados não salvos serão perdidos.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#E8465D",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sim, recarregar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });

}

window.mudarAba = function(aba) {
    const pageTitle = document.getElementById("page-title");
    
    // Atualizar título da página
    if (pageTitle) {
        if (aba === "ativacao") {
            pageTitle.textContent = "Relatório / Retirada de Tempo";
        } else if (aba === "busca") {
            pageTitle.textContent = "Busca Avançada";
        } else if (aba === "busca-personalizada") {
            pageTitle.textContent = "Busca Avançada Personalizada";
        }
    }
    
    // Remover active de todos os itens do menu
    document.querySelectorAll(".nav-item").forEach((item, i) => {
        item.classList.remove("active");
        // Adicionar active baseado na aba
        if ((aba === "ativacao" && i === 0) || 
            (aba === "busca" && i === 1) || 
            (aba === "busca-personalizada" && i === 2)) {
            item.classList.add("active");
        }
    });
    
    // Esconder todas as abas
    const abas = document.querySelectorAll('.aba-conteudo');
    abas.forEach(abaElement => {
        abaElement.classList.remove('ativo');
    });
    
    // Mostrar apenas a aba selecionada
    const abaSelecionada = document.getElementById(`aba-${aba}`);
    if (abaSelecionada) {
        abaSelecionada.classList.add('ativo');
    }
    
    // Salvar aba atual no localStorage
    localStorage.setItem("aba_atual", aba);
    
    // Ações específicas para cada aba
    if (aba === 'busca') {
        const hoje = new Date();
        const semanaAtras = new Date();
        semanaAtras.setDate(hoje.getDate() - 7);
        
        const dataInicio = document.getElementById("busca-data-inicio");
        const dataFim = document.getElementById("busca-data-fim");
        
        if (dataInicio && !dataInicio.value) {
            dataInicio.value = semanaAtras.toISOString().split('T')[0];
        }
        if (dataFim && !dataFim.value) {
            dataFim.value = hoje.toISOString().split('T')[0];
        }
    }
    
    if (aba === "retirada") {
        setTimeout(() => {
            initRadioButtonsRetirada();
        }, 100);
    }
    
    // Se for a busca personalizada, garantir que os componentes estejam prontos
    if (aba === "busca-personalizada") {
        setTimeout(() => {
            // Garantir que a primeira tab esteja ativa
            const tecnicosTab = document.getElementById('tab-tecnicos');
            const resultadosTab = document.getElementById('tab-resultados');
            const protocolosTab = document.getElementById('tab-protocolos');
            
            if (tecnicosTab && !tecnicosTab.classList.contains('ativo')) {
                tecnicosTab.classList.add('ativo');
                if (resultadosTab) resultadosTab.classList.remove('ativo');
                if (protocolosTab) protocolosTab.classList.remove('ativo');
            }
            
            // Garantir que o botão do menu esteja correto
            const menuBtn = document.querySelector('#aba-busca-personalizada .menu-btn[data-tab="tecnicos"]');
            if (menuBtn && !menuBtn.classList.contains('active')) {
                document.querySelectorAll('#aba-busca-personalizada .menu-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                menuBtn.classList.add('active');
            }
        }, 100);
    }
};

// ========== FUNÇÕES DA BUSCA PERSONALIZADA (COPIADAS DO RELATÓRIO) ==========
let tecnicosSelecionadosPersonalizada = [];
let regionaisPersonalizada = {};
let dadosPlanilhaPersonalizada = {};

function renderListaTecnicosPersonalizada() {
    const container = document.getElementById('lista-tecnicos-personalizada');
    if (!container) return;
    
    const buscaInput = document.getElementById('busca-tecnicos-personalizada');
    const termoBusca = buscaInput ? buscaInput.value.toLowerCase().trim() : '';
    
    let regionaisParaMostrar = regionaisPersonalizada;
    if (termoBusca !== '') {
        regionaisParaMostrar = {};
        for (let regional in regionaisPersonalizada) {
            const tecnicosFiltrados = regionaisPersonalizada[regional].filter(tec => tec.toLowerCase().includes(termoBusca));
            if (tecnicosFiltrados.length > 0) regionaisParaMostrar[regional] = tecnicosFiltrados;
        }
    }
    
    if (Object.keys(regionaisParaMostrar).length === 0) {
        container.innerHTML = `<div class="loading-tecnicos"><i class="fas fa-search"></i> Nenhum técnico encontrado para "${termoBusca}"</div>`;
        return;
    }
    
    let html = "";
    for (let regional in regionaisParaMostrar) {
        const tecnicos = regionaisParaMostrar[regional];
        html += `<div class="regional-bloco"><div class="regional-titulo"><i class="fas fa-map-marker-alt"></i> ${regional}<span class="contador">${tecnicos.length} técnicos</span></div><div class="tecnicos-lista">`;
        tecnicos.forEach((tec) => {
            const isSelected = tecnicosSelecionadosPersonalizada.some((t) => t.nome === tec && t.regional === regional);
            html += `<div class="tecnico-checkbox-item" onclick="toggleTecnicoPersonalizada('${tec.replace(/'/g, "\\'")}', '${regional.replace(/'/g, "\\'")}')">
                <input type="checkbox" ${isSelected ? "checked" : ""}>
                <label>${tec}</label>
            </div>`;
        });
        html += `</div></div>`;
    }
    container.innerHTML = html;
}

function toggleTecnicoPersonalizada(nome, regional) {
    const index = tecnicosSelecionadosPersonalizada.findIndex((t) => t.nome === nome && t.regional === regional);
    if (index === -1) {
        tecnicosSelecionadosPersonalizada.push({nome, regional, tipoEquipe: "Solo", status: "normal"});
    } else {
        tecnicosSelecionadosPersonalizada.splice(index, 1);
    }
    renderListaTecnicosPersonalizada();
    atualizarEquipesSelecionadasPersonalizada();
}

function selecionarTodosTecnicosPersonalizada() {
    tecnicosSelecionadosPersonalizada = [];
    for (let regional in regionaisPersonalizada) {
        regionaisPersonalizada[regional].forEach((tec) => {
            tecnicosSelecionadosPersonalizada.push({nome: tec, regional, tipoEquipe: "Solo", status: "normal"});
        });
    }
    renderListaTecnicosPersonalizada();
    atualizarEquipesSelecionadasPersonalizada();
}

function desmarcarTodosTecnicosPersonalizada() {
    tecnicosSelecionadosPersonalizada = [];
    renderListaTecnicosPersonalizada();
    atualizarEquipesSelecionadasPersonalizada();
}

function atualizarEquipesSelecionadasPersonalizada() {
    const container = document.getElementById('equipes-selecionadas-personalizada');
    if (!container) return;
    
    if (!tecnicosSelecionadosPersonalizada.length) {
        container.innerHTML = "";
        return;
    }
    
    const agrupado = {};
    tecnicosSelecionadosPersonalizada.forEach((tec) => {
        if (!agrupado[tec.regional]) agrupado[tec.regional] = [];
        agrupado[tec.regional].push(tec);
    });
    
    let html = `<h5><i class="fas fa-check-circle"></i> Técnicos Selecionados (${tecnicosSelecionadosPersonalizada.length})</h5>`;
    
    for (let regional in agrupado) {
        html += `<div style="margin-bottom: 1rem;"><div style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.5rem;"><i class="fas fa-map-marker-alt"></i> ${regional}</div>`;
        
        agrupado[regional].forEach((tec) => {
            const isSolo = tec.tipoEquipe === "Solo";
            const isDupla = tec.tipoEquipe === "Dupla";
            const isNormal = tec.status === "normal";
            const isAcionado = tec.status === "acionado";
            const isDinheiro = tec.status === "dinheiro";
            
            html += `<div class="equipe-selecionada-bloco" style="background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="font-weight: 600;"><i class="fas fa-user" style="color: #E8465D;"></i> ${tec.nome}</span>
                    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                        <div class="radio-group-relatorio" style="background: #f1f5f9; padding: 0.2rem; border-radius: 30px; display: inline-flex; gap: 0.2rem;">
                            <label class="radio-label-relatorio ${isSolo ? "active" : ""}" onclick="alterarTipoEquipePersonalizada('${tec.nome.replace(/'/g, "\\'")}', '${tec.regional}', 'Solo')" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${isSolo ? "background: #E8465D; color: white;" : "color: #64748b;"}">Solo</label>
                            <label class="radio-label-relatorio ${isDupla ? "active" : ""}" onclick="alterarTipoEquipePersonalizada('${tec.nome.replace(/'/g, "\\'")}', '${tec.regional}', 'Dupla')" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${isDupla ? "background: #E8465D; color: white;" : "color: #64748b;"}">Dupla</label>
                        </div>
                        <div class="radio-group-relatorio" style="background: #f1f5f9; padding: 0.2rem; border-radius: 30px; display: inline-flex; gap: 0.2rem;">
                            <label class="radio-label-relatorio ${isNormal ? "active" : ""}" onclick="alterarStatusPersonalizada('${tec.nome.replace(/'/g, "\\'")}', '${tec.regional}', 'normal')" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${isNormal ? "background: #E8465D; color: white;" : "color: #64748b;"}">Normal</label>
                            <label class="radio-label-relatorio ${isAcionado ? "active" : ""}" onclick="alterarStatusPersonalizada('${tec.nome.replace(/'/g, "\\'")}', '${tec.regional}', 'acionado')" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${isAcionado ? "background: #E8465D; color: white;" : "color: #64748b;"}">Acionado</label>
                            <label class="radio-label-relatorio ${isDinheiro ? "active" : ""}" onclick="alterarStatusPersonalizada('${tec.nome.replace(/'/g, "\\'")}', '${tec.regional}', 'dinheiro')" style="padding: 4px 12px; border-radius: 25px; font-size: 0.75rem; cursor: pointer; ${isDinheiro ? "background: #E8465D; color: white;" : "color: #64748b;"}">Dinheiro</label>
                        </div>
                        <button class="btn-remove-equipe" onclick="removerTecnicoSelecionadoPersonalizada('${tec.nome.replace(/'/g, "\\'")}', '${tec.regional}')" style="background: none; border: none; color: #94a3b8; cursor: pointer;"><i class="fas fa-times-circle"></i></button>
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">${regional}</div>
            </div>`;
        });
        html += `</div>`;
    }
    container.innerHTML = html;
}

function alterarTipoEquipePersonalizada(nome, regional, tipo) {
    const index = tecnicosSelecionadosPersonalizada.findIndex(t => t.nome === nome && t.regional === regional);
    if (index !== -1) {
        tecnicosSelecionadosPersonalizada[index].tipoEquipe = tipo;
        atualizarEquipesSelecionadasPersonalizada();
    }
}

function alterarStatusPersonalizada(nome, regional, status) {
    const index = tecnicosSelecionadosPersonalizada.findIndex(t => t.nome === nome && t.regional === regional);
    if (index !== -1) {
        tecnicosSelecionadosPersonalizada[index].status = status;
        atualizarEquipesSelecionadasPersonalizada();
    }
}

function removerTecnicoSelecionadoPersonalizada(nome, regional) {
    tecnicosSelecionadosPersonalizada = tecnicosSelecionadosPersonalizada.filter(t => !(t.nome === nome && t.regional === regional));
    renderListaTecnicosPersonalizada();
    atualizarEquipesSelecionadasPersonalizada();
}

async function carregarTecnicosPersonalizada() {
    const dataInicio = document.getElementById('personalizada-data-inicio')?.value;
    const dataFim = document.getElementById('personalizada-data-fim')?.value;
    
    if (!dataInicio || !dataFim) {
        Swal.fire({icon: 'warning', title: 'Selecione um período', text: 'Defina a data inicial e final', toast: true, timer: 2000});
        return;
    }
    
    const container = document.getElementById('lista-tecnicos-personalizada');
    container.innerHTML = '<div class="loading-tecnicos"><i class="fas fa-spinner fa-pulse"></i> Carregando técnicos do período...</div>';
    
    tecnicosSelecionadosPersonalizada = [];
    regionaisPersonalizada = {};
    dadosPlanilhaPersonalizada = {};
    
    try {
        const datas = [];
        let currentDate = new Date(dataInicio);
        const endDate = new Date(dataFim);
        
        while (currentDate <= endDate) {
            datas.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        for (const data of datas) {
            const resposta = await PlanilhaProcessor.carregarDadosPorData(data);
            if (resposta.dados && resposta.dados.length > 0) {
                dadosPlanilhaPersonalizada[data] = resposta.dados;
                const regionaisTemp = PlanilhaProcessor.extrairTecnicosPorRegional(resposta.dados);
                
                for (let regional in regionaisTemp) {
                    if (!regionaisPersonalizada[regional]) regionaisPersonalizada[regional] = [];
                    regionaisTemp[regional].forEach(tecnico => {
                        if (!regionaisPersonalizada[regional].includes(tecnico)) {
                            regionaisPersonalizada[regional].push(tecnico);
                        }
                    });
                }
            }
        }
        
        if (Object.keys(regionaisPersonalizada).length === 0) {
            container.innerHTML = '<div class="loading-tecnicos"><i class="fas fa-users-slash"></i> Nenhum técnico encontrado neste período</div>';
            return;
        }
        
        renderListaTecnicosPersonalizada();
        atualizarEquipesSelecionadasPersonalizada();
        
        Swal.fire({icon: 'success', title: 'Técnicos carregados!', text: `${Object.values(regionaisPersonalizada).flat().length} técnico(s) encontrado(s)`, timer: 2000, showConfirmButton: false, toast: true});
        
    } catch (erro) {
        console.error('Erro ao carregar técnicos:', erro);
        container.innerHTML = '<div class="loading-tecnicos"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar dados</div>';
    }
}

async function buscarDadosPersonalizada() {
    const dataInicio = document.getElementById('personalizada-data-inicio')?.value;
    const dataFim = document.getElementById('personalizada-data-fim')?.value;
    
    if (!dataInicio || !dataFim || tecnicosSelecionadosPersonalizada.length === 0) {
        Swal.fire({icon: 'warning', title: 'Dados incompletos', text: 'Selecione um período e pelo menos um técnico', toast: true, timer: 2000});
        return;
    }
    
    Swal.fire({title: 'Buscando dados...', text: `Processando ${tecnicosSelecionadosPersonalizada.length} técnico(s)`, allowOutsideClick: false, didOpen: () => Swal.showLoading()});
    
    const datas = [];
    let currentDate = new Date(dataInicio);
    const endDate = new Date(dataFim);
    
    while (currentDate <= endDate) {
        datas.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const resumoPorTecnico = [];
    
    for (const data of datas) {
        if (!dadosPlanilhaPersonalizada[data]) {
            const resposta = await PlanilhaProcessor.carregarDadosPorData(data);
            if (resposta.dados && resposta.dados.length > 0) {
                dadosPlanilhaPersonalizada[data] = resposta.dados;
            } else {
                continue;
            }
        }
        
        for (const tecnicoObj of tecnicosSelecionadosPersonalizada) {
            const metricas = PlanilhaProcessor.processarDadosTecnicoPorRegional(
                dadosPlanilhaPersonalizada[data],
                tecnicoObj.nome,
                tecnicoObj.regional
            );
            
            let tecIndex = resumoPorTecnico.findIndex(t => t.nome === tecnicoObj.nome);
            if (tecIndex === -1) {
                resumoPorTecnico.push({
                    nome: tecnicoObj.nome,
                    tipo: tecnicoObj.tipoEquipe,
                    status: tecnicoObj.status,
                    regional: tecnicoObj.regional,
                    planejamento: metricas.planejamento,
                    execucao: metricas.execucao,
                    remarcacao: metricas.remarcacao,
                    cancelamento: metricas.cancelamento,
                    tratativasCS: metricas.tratativasCS,
                    infraestrutura: metricas.infraestrutura,
                    resolucaoN2: metricas.resolucaoN2,
                    total: metricas.planejamento + metricas.execucao + metricas.remarcacao + metricas.cancelamento + metricas.tratativasCS + metricas.infraestrutura + metricas.resolucaoN2
                });
            } else {
                resumoPorTecnico[tecIndex].planejamento += metricas.planejamento;
                resumoPorTecnico[tecIndex].execucao += metricas.execucao;
                resumoPorTecnico[tecIndex].remarcacao += metricas.remarcacao;
                resumoPorTecnico[tecIndex].cancelamento += metricas.cancelamento;
                resumoPorTecnico[tecIndex].tratativasCS += metricas.tratativasCS;
                resumoPorTecnico[tecIndex].infraestrutura += metricas.infraestrutura;
                resumoPorTecnico[tecIndex].resolucaoN2 += metricas.resolucaoN2;
                resumoPorTecnico[tecIndex].total += metricas.planejamento + metricas.execucao + metricas.remarcacao + metricas.cancelamento + metricas.tratativasCS + metricas.infraestrutura + metricas.resolucaoN2;
            }
        }
    }
    
    // Atualizar cards
    let totalMetricas = {planejamento:0, execucao:0, remarcacao:0, cancelamento:0, tratativasCS:0, infraestrutura:0, resolucaoN2:0};
    resumoPorTecnico.forEach(tec => {
        totalMetricas.planejamento += tec.planejamento;
        totalMetricas.execucao += tec.execucao;
        totalMetricas.remarcacao += tec.remarcacao;
        totalMetricas.cancelamento += tec.cancelamento;
        totalMetricas.tratativasCS += tec.tratativasCS;
        totalMetricas.infraestrutura += tec.infraestrutura;
        totalMetricas.resolucaoN2 += tec.resolucaoN2;
    });
    
    document.getElementById('personalizada-planejamento').textContent = totalMetricas.planejamento;
    document.getElementById('personalizada-execucao').textContent = totalMetricas.execucao;
    document.getElementById('personalizada-remarcacao').textContent = totalMetricas.remarcacao;
    document.getElementById('personalizada-cancelamento').textContent = totalMetricas.cancelamento;
    document.getElementById('personalizada-tratativas').textContent = totalMetricas.tratativasCS;
    document.getElementById('personalizada-infra').textContent = totalMetricas.infraestrutura;
    document.getElementById('personalizada-resolucao').textContent = totalMetricas.resolucaoN2;
    
    // Atualizar tabela
    let tbody = document.getElementById('personalizada-tabela-body');
    let html = '';
    resumoPorTecnico.forEach(tec => {
        html += `<tr>
            <td><strong>${tec.nome}</strong><br><small>${tec.regional}</small></td>
            <td><span class="badge" style="background: ${tec.tipo === 'Solo' ? '#E8465D' : '#4a6382'}">${tec.tipo}</span></td>
            <td><span class="badge" style="background: ${tec.status === 'normal' ? '#28a745' : (tec.status === 'acionado' ? '#ffc107' : '#17a2b8')}">${tec.status === 'normal' ? 'Normal' : (tec.status === 'acionado' ? 'Acionado' : 'Dinheiro')}</span></td>
            <td>${tec.planejamento}</td><td>${tec.execucao}</td><td>${tec.remarcacao}</td>
            <td>${tec.cancelamento}</td><td>${tec.tratativasCS}</td><td>${tec.infraestrutura}</td>
            <td>${tec.resolucaoN2}</td><td><strong>${tec.total}</strong></td>
        </tr>`;
    });
    tbody.innerHTML = html;
    
    document.getElementById('resultados-personalizada').style.display = 'block';
    
    Swal.fire({icon: 'success', title: 'Busca concluída!', text: `${tecnicosSelecionadosPersonalizada.length} técnico(s) processados em ${datas.length} dia(s)`, timer: 3000, showConfirmButton: false});
}

function exportarResultadosPersonalizada() {
    const rows = document.querySelectorAll('#personalizada-tabela-body tr');
    if (rows.length === 0 || rows[0].innerText.includes('Nenhum resultado')) {
        Swal.fire({icon: 'warning', title: 'Nenhum dado', text: 'Realize uma busca primeiro!', toast: true, timer: 2000});
        return;
    }
    
    let csvContent = "Técnico,Regional,Tipo,Status,Planejamento,Execução,Remarcação,Cancelamento,Tratativas CS,Infraestrutura,Resolução N2,Total\n";
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 11) {
            csvContent += `"${cells[0].innerText.replace(/\n/g, ' ')}",`;
            csvContent += `"${cells[0].querySelector('small')?.innerText || ''}",`;
            csvContent += `"${cells[1].innerText.replace(/<[^>]*>/g, '')}",`;
            csvContent += `"${cells[2].innerText.replace(/<[^>]*>/g, '')}",`;
            csvContent += `${cells[3].innerText},${cells[4].innerText},${cells[5].innerText},${cells[6].innerText},`;
            csvContent += `${cells[7].innerText},${cells[8].innerText},${cells[9].innerText},${cells[10].innerText}\n`;
        }
    });
    
    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `busca_personalizada_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    Swal.fire({icon: 'success', title: 'Exportado!', text: 'Arquivo CSV gerado com sucesso', toast: true, timer: 2000});
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', function() {
    const buscaInput = document.getElementById('busca-tecnicos-personalizada');
    if (buscaInput) {
        buscaInput.addEventListener('input', () => renderListaTecnicosPersonalizada());
    }
    
    const hoje = new Date();
    const semanaAtras = new Date();
    semanaAtras.setDate(hoje.getDate() - 7);
    
    const dataInicio = document.getElementById('personalizada-data-inicio');
    const dataFim = document.getElementById('personalizada-data-fim');
    
    if (dataInicio && !dataInicio.value) dataInicio.value = semanaAtras.toISOString().split('T')[0];
    if (dataFim && !dataFim.value) dataFim.value = hoje.toISOString().split('T')[0];
});

// Exportar funções da busca
window.buscarDadosPorPeriodo = buscarDadosPorPeriodo;
window.exportarResultadosBusca = exportarResultadosBusca;

// ========== EXPOR FUNÇÕES GLOBAIS ==========
window.mudarAba = mudarAba;
window.copiarRelatorio = copiarRelatorio;
window.carregarRelatorio = carregarRelatorio;
window.apagarRelatorio = apagarRelatorio;
window.gerarRelatorioPlanilha = gerarRelatorioPlanilha;
window.onDataChange = onDataChange;
window.carregarTecnicosPorData = carregarTecnicosPorData;
window.selecionarTodosTecnicos = selecionarTodosTecnicos;
window.desmarcarTodosTecnicos = desmarcarTodosTecnicos;
window.toggleTecnico = toggleTecnico;
window.removerTecnicoSelecionado = removerTecnicoSelecionado;
window.adicionarRetirada = adicionarRetirada;
window.finalizarRetirada = finalizarRetirada;
window.limparDataRetirada = limparDataRetirada;
window.preencherDiaTodo = preencherDiaTodo;
window.logout = logout;
window.toggleSidebar = toggleSidebar;
window.abrirModalJustificativas = abrirModalJustificativas;
window.carregarTecnicosParaSelect = carregarTecnicosParaSelect;
window.editarTecnico = editarTecnico;
window.salvarEdicoesTecnico = salvarEdicoesTecnico;
window.cancelarEdicaoTecnico = cancelarEdicaoTecnico;
window.excluirRetirada = excluirRetirada;
window.filtrarListaTecnicos = filtrarListaTecnicos;
window.calcularRetirada = calcularRetirada;
window.buscarRetirada = buscarRetirada;
window.excluirRetiradaPorTecnicoData = excluirRetiradaPorTecnicoData;
window.carregarTecnicosRetirada = carregarTecnicosRetirada;
window.toggleTecnicoRetirada = toggleTecnicoRetirada;
window.selecionarTodosTecnicosRetirada = selecionarTodosTecnicosRetirada;
window.desmarcarTodosTecnicosRetirada = desmarcarTodosTecnicosRetirada;
window.removerTecnicoSelecionadoRetirada = removerTecnicoSelecionadoRetirada;
window.calcularRetiradaTodosTecnicos = calcularRetiradaTodosTecnicos;
window.buscarRetiradasTodosTecnicos = buscarRetiradasTodosTecnicos;
window.excluirRetiradasTodosTecnicos = excluirRetiradasTodosTecnicos;
window.abrirModalSalvarEquipe = abrirModalSalvarEquipe;
window.aplicarEquipeFavorita = aplicarEquipeFavorita;
window.removerEquipeFavorita = removerEquipeFavorita;
window.limparFiltroEquipe = limparFiltroEquipe;
window.toggleFiltroEquipes = toggleFiltroEquipes;
window.excluirFiltroEquipes = excluirFiltroEquipes;
window.toggleFiltroEquipesRetirada = toggleFiltroEquipesRetirada;
window.excluirFiltroEquipesRetirada = excluirFiltroEquipesRetirada;
window.gerarRelatorioCompleto = gerarRelatorioCompleto;
window.apagarTudoPorData = apagarTudoPorData;
window.editarFiltroEquipes = editarFiltroEquipes;
