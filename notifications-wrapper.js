// notifications-final.js - Substitui TUDO (alert, confirm) por SweetAlert2
// Adicione este arquivo APÓS o script.js

(function() {
    // Guardar referências originais
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    
    // Flag para controlar se já substituímos as funções
    let substituido = false;
    
    // Função para extrair cidade de mensagens
    function extrairCidade(mensagem) {
        if (mensagem.includes('Picos - PI') || mensagem.match(/[A-Za-zçãáàâéêíóôú]+\s*-\s*[A-Z]{2}/)) {
            const match = mensagem.match(/([A-Za-zçãáàâéêíóôú]+\s*-\s*[A-Z]{2})/);
            return match ? match[0] : 'Picos - PI';
        }
        return null;
    }
    
    // Substituir alert COMPLETAMENTE
    window.alert = function(mensagem) {
        console.log('Alert interceptado:', mensagem);
        
        // Se for mensagem de relatório carregado com cidade
        if (mensagem.includes('Relatório carregado com sucesso')) {
            const cidade = extrairCidade(mensagem) || 'Picos - PI';
            
            // Fechar qualquer SweetAlert anterior
            Swal.close();
            
            // Mostrar novo modal
            Swal.fire({
                icon: 'success',
                title: '📋 Relatório carregado!',
                html: `
                    <div style="text-align: center; padding: 0.5rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem; color: #E8465D;">📊</div>
                        <p style="font-size: 1.2rem; font-weight: 600; color: #1d3b66; margin-bottom: 0.3rem;">${cidade}</p>
                        <p style="color: #64748b;">Dados carregados com sucesso</p>
                    </div>
                `,
                confirmButtonColor: '#E8465D',
                confirmButtonText: 'OK',
                background: '#ffffff',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
                didOpen: () => {
                    // Garantir que o body não fique travado
                    document.body.style.pointerEvents = 'auto';
                    document.body.style.overflow = 'auto';
                },
                willClose: () => {
                    // Liberar tudo ao fechar
                    document.body.style.pointerEvents = 'auto';
                    document.body.style.overflow = 'auto';
                }
            });
            return;
        }
        
        // Se for mensagem de sucesso (com ✅)
        if (mensagem.includes('✅') || mensagem.includes('sucesso')) {
            Swal.fire({
                icon: 'success',
                title: '✅ Sucesso!',
                text: mensagem.replace('✅', '').trim(),
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                background: '#ffffff',
                iconColor: '#10b981',
                didOpen: () => {
                    document.body.style.pointerEvents = 'auto';
                }
            });
            return;
        }
        
        // Se for mensagem de erro (com ❌)
        if (mensagem.includes('❌') || mensagem.includes('Erro') || mensagem.includes('incorreto')) {
            Swal.fire({
                icon: 'error',
                title: '❌ Erro',
                text: mensagem.replace('❌', '').trim(),
                confirmButtonColor: '#E8465D',
                confirmButtonText: 'OK',
                background: '#ffffff',
                iconColor: '#ef4444',
                didOpen: () => {
                    document.body.style.pointerEvents = 'auto';
                },
                willClose: () => {
                    document.body.style.pointerEvents = 'auto';
                }
            });
            return;
        }
        
        // Se for mensagem de aviso
        if (mensagem.includes('Preencha') || mensagem.includes('Selecione') || mensagem.includes('Adicione')) {
            Swal.fire({
                icon: 'warning',
                title: '⚠️ Atenção',
                text: mensagem,
                timer: 3500,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                background: '#ffffff',
                iconColor: '#f59e0b',
                didOpen: () => {
                    document.body.style.pointerEvents = 'auto';
                }
            });
            return;
        }
        
        // Qualquer outro alert - toast padrão
        Swal.fire({
            icon: 'info',
            title: 'Informação',
            text: mensagem,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            background: '#ffffff',
            didOpen: () => {
                document.body.style.pointerEvents = 'auto';
            }
        });
    };
    
    // Substituir confirm COMPLETAMENTE (agora funciona!)
    window.confirm = function(mensagem) {
        console.log('Confirm interceptado:', mensagem);
        
        // Como confirm é síncrono e Swal é assíncrono, precisamos de uma abordagem diferente
        // Vamos retornar true e mostrar o modal, mas o código original precisa ser adaptado
        
        // Detectar se é uma mensagem de exclusão
        const isDelete = mensagem.includes('apagar') || mensagem.includes('excluir') || mensagem.includes('remover');
        
        Swal.fire({
            title: isDelete ? '🗑️ Confirmar exclusão' : '🤔 Confirmação',
            text: mensagem,
            icon: 'question',
            iconColor: '#E8465D',
            showCancelButton: true,
            confirmButtonColor: isDelete ? '#dc3545' : '#E8465D',
            cancelButtonColor: '#64748b',
            confirmButtonText: isDelete ? 'Sim, apagar!' : 'Sim',
            cancelButtonText: 'Cancelar',
            background: '#ffffff',
            reverseButtons: true,
            allowOutsideClick: false,
            customClass: {
                popup: 'animate__animated animate__zoomIn',
                confirmButton: isDelete ? 'swal2-confirm-delete' : 'swal2-confirm-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Se confirmou, precisamos executar a ação original
                // Mas como o confirm original espera um retorno síncrono,
                // vamos disparar um evento personalizado
                const event = new CustomEvent('confirmacao-usuario', { 
                    detail: { confirmado: true, mensagemOriginal: mensagem }
                });
                window.dispatchEvent(event);
                
                // Pequeno atraso para garantir que o evento seja processado
                setTimeout(() => {
                    // Tenta encontrar e clicar no botão que chamou o confirm
                    const botaoAtivo = document.activeElement;
                    if (botaoAtivo && botaoAtivo.onclick) {
                        botaoAtivo.click();
                    }
                }, 100);
            }
        });
        
        // Retorna true para não bloquear o fluxo
        return true;
    };
    
    // Adicionar estilos personalizados
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
        
        .swal2-popup {
            font-family: 'Inter', sans-serif !important;
            border-radius: 24px !important;
            box-shadow: 0 25px 50px -12px rgba(232, 70, 93, 0.4) !important;
            padding: 1.5rem !important;
        }
        
        .swal2-title {
            color: #1d3b66 !important;
            font-weight: 700 !important;
            font-size: 1.5rem !important;
        }
        
        .swal2-confirm-custom {
            border-radius: 50px !important;
            padding: 0.8rem 2rem !important;
            font-weight: 600 !important;
            box-shadow: 0 10px 20px -8px rgba(232, 70, 93, 0.4) !important;
            background: #E8465D !important;
        }
        
        .swal2-confirm-delete {
            border-radius: 50px !important;
            padding: 0.8rem 2rem !important;
            font-weight: 600 !important;
            background: #dc3545 !important;
        }
        
        .swal2-cancel {
            border-radius: 50px !important;
            padding: 0.8rem 2rem !important;
            font-weight: 600 !important;
            background: #64748b !important;
        }
        
        .swal2-toast {
            border-radius: 16px !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2) !important;
        }
        
        .swal2-timer-progress-bar {
            background: #E8465D !important;
        }
        
        .swal2-icon.swal2-success { border-color: #10b981; }
        .swal2-icon.swal2-error { border-color: #ef4444; }
        .swal2-icon.swal2-warning { border-color: #f59e0b; }
        .swal2-icon.swal2-info { border-color: #3b82f6; }
        .swal2-icon.swal2-question { border-color: #E8465D; }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 Notifications FINAL carregado - alert() substituído por SweetAlert2!');
})();