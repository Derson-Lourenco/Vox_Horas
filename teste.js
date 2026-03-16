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
    "teste@gmail.com",
    "hamuel.vtx@gmail.com",
];

const PASSWORD = "795816";
const SESSION_DURATION = 10 * 60 * 60 * 1000;

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
};

// ========== SERVIÇOS IGNORADOS ==========
const SERVICOS_IGNORADOS = ["ALMOCO", "DESLOCAMENTO", "CHUVA", "RETIRADA DE TEMPO", "BANCO DE HORAS"];

// ========== UTILITÁRIOS ==========
const Utils = {

    limparCaracteresOcultos(texto) {
        if (!texto) return "";

        return texto
            .toString()
            .replace(/\uFEFF/g, "")
            .replace(/\u200B/g, "")
            .replace(/\u200C/g, "")
            .replace(/\u200D/g, "")
            .replace(/\u2060/g, "")
            .replace(/\u00A0/g, " ")
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/\r/g, "")
            .trim();
    },

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

        const fatorConversao = 8 / 12;
        const minutosConvertidos = Math.round((minutos * fatorConversao) / 10) * 10;

        return minutosConvertidos;
    },
};

// ========== PROCESSADOR DE TABELA ==========
const ProcessadorTabela = {

    dividirColunas(linha) {

        linha = Utils.limparCaracteresOcultos(linha);

        if (linha.includes("\t")) {
            return linha.split("\t").map(col => Utils.limparCaracteresOcultos(col));
        }

        return linha.split(/\s{2,}/).map(col => Utils.limparCaracteresOcultos(col));
    },

    processar(texto) {

        texto = Utils.limparCaracteresOcultos(texto);

        if (!texto || texto.trim() === "") return null;

        const linhas = texto
            .split("\n")
            .map(l => Utils.limparCaracteresOcultos(l));

        if (linhas.length <= 1) return null;

        const cabecalho = this.dividirColunas(linhas[0]);

        const indexProtocolo = cabecalho.findIndex(c =>
            Utils.limparCaracteresOcultos(c).toLowerCase().includes("protocolo")
        );

        const indexServico = cabecalho.findIndex(c =>
            Utils.limparCaracteresOcultos(c).toLowerCase().includes("serviço") ||
            Utils.limparCaracteresOcultos(c).toLowerCase().includes("servico")
        );

        const indexStatus = cabecalho.findIndex(c =>
            Utils.limparCaracteresOcultos(c).toLowerCase().includes("feito") ||
            Utils.limparCaracteresOcultos(c).toLowerCase().includes("status")
        );

        if (indexServico === -1 || indexStatus === -1) {
            return null;
        }

        let planejamento = 0;
        let execucao = 0;

        for (let i = 1; i < linhas.length; i++) {

            if (!linhas[i].trim()) continue;

            const colunas = this.dividirColunas(linhas[i]);

            if (colunas.length <= Math.max(indexServico, indexStatus)) {
                continue;
            }

            const protocolo = Utils.limparCaracteresOcultos(colunas[indexProtocolo] || "");
            const servicoOriginal = Utils.limparCaracteresOcultos(colunas[indexServico] || "");
            const statusOriginal = Utils.limparCaracteresOcultos(colunas[indexStatus] || "");

            if (!servicoOriginal) continue;

            const servico = Utils.normalizarTexto(servicoOriginal);
            const status = Utils.normalizarTexto(statusOriginal);

            if (SERVICOS_IGNORADOS.some(p => servico.includes(p))) {
                continue;
            }

            planejamento++;

            if (status.includes("OK") || status.includes("FEITO")) {
                execucao++;
            }
        }

        return {
            planejamento,
            execucao
        };
    }
};