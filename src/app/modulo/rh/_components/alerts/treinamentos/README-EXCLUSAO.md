// Documentação do AlertDialog de Exclusão de Treinamento

/*
📋 FUNCIONALIDADE DE EXCLUSÃO DE TREINAMENTO:

1. ✅ AlertDialog Principal (AlertExcluirTreinamento.tsx):
   - Confirmação segura antes da exclusão
   - Exibe informações do treinamento
   - Aviso sobre planos associados
   - Loading states durante exclusão
   - Toast notifications de sucesso/erro

2. ✅ Integração no Menu (menu-tabela-treinamentos.tsx):
   - Opção "Excluir" funcional no dropdown
   - Estado local para controlar AlertDialog
   - Ícone e cor vermelha para identificação

🎯 FUNCIONALIDADES IMPLEMENTADAS:

✅ Confirmação obrigatória antes da exclusão
✅ Exibição clara do treinamento a ser excluído
✅ Aviso sobre planos que serão excluídos junto
✅ Contador de planos associados
✅ Estados de loading durante a operação
✅ Toast notifications para feedback
✅ Integração com hook useDeletarTreinamento
✅ Invalidação automática da query
✅ Design consistente com o projeto

🚀 ESTRUTURA DO ALERTDIALOG:

┌─────────────────────────────────────────────┐
│ ⚠️  Confirmar Exclusão                      │
│     Esta ação não pode ser desfeita.        │
├─────────────────────────────────────────────┤
│ 🔴 Treinamento de Segurança no Trabalho     │
│    Tipo: [Integração]                       │
├─────────────────────────────────────────────┤
│ ⚠️  Atenção: Este treinamento possui planos │
│     3 planos serão excluídos junto com o    │
│     treinamento.                            │
├─────────────────────────────────────────────┤
│ Tem certeza que deseja excluir este         │
│ treinamento?                                │
│                                             │
│ Todos os planos associados também serão     │
│ excluídos permanentemente.                  │
├─────────────────────────────────────────────┤
│                    [Cancelar] [Confirmar]   │
└─────────────────────────────────────────────┘

📝 ESTADOS DO ALERTDIALOG:

SEM PLANOS:
- Informações básicas do treinamento
- Confirmação simples
- Sem avisos adicionais

COM PLANOS:
- Informações do treinamento
- Seção de aviso amarela
- Contador de planos que serão excluídos
- Texto explicativo adicional

EXCLUINDO:
- Botões desabilitados
- Texto muda para "Excluindo..."
- Loading state ativo

🔄 FLUXO DE EXCLUSÃO:

1. Usuário clica no menu (⋮) na linha da tabela
2. Seleciona "Excluir" no dropdown (vermelho)
3. AlertDialog abre com informações completas
4. Sistema verifica se há planos associados
5. Exibe avisos apropriados
6. Usuário lê as informações e decide
7. Clica "Confirmar Exclusão" ou "Cancelar"
8. Se confirmar: API call + loading + feedback
9. Sucesso: Toast + Fechar + Atualizar tabela
10. Erro: Toast de erro + AlertDialog fica aberto

🎨 ELEMENTOS VISUAIS:

CORES E ÍCONES:
- 🔴 Vermelho para o treinamento (perigo)
- ⚠️ Amarelo para avisos (atenção)
- ⚠️ Ícone de alerta no título
- 🗑️ Ícone de lixeira no botão do menu

TIPOGRAFIA:
- Título em destaque
- Descrição explicativa
- Badges para tipo de treinamento
- Texto de aviso em amarelo
- Botões com texto em maiúsculo

LAYOUT:
- Espaçamento generoso
- Seções bem definidas
- Cores de fundo para destaque
- Alinhamento consistente

⚡ INTEGRAÇÃO TÉCNICA:

- Hook useDeletarTreinamento: exclusão via API
- API call: DELETE /rh/treinamentos/{id}
- Query invalidation: atualiza lista automaticamente
- Error handling: tratamento robusto de erros
- Loading states: feedback visual contínuo
- Toast notifications: confirmações e erros

🛡️ SEGURANÇA E UX:

PREVENÇÃO DE ERROS:
✅ Confirmação obrigatória
✅ Informações claras do que será excluído
✅ Avisos sobre consequências (planos)
✅ Botão de cancelar sempre disponível
✅ Texto explicativo sobre irreversibilidade

FEEDBACK CLARO:
✅ Mostra nome do treinamento
✅ Indica tipo (integração/capacitação)
✅ Conta planos que serão excluídos
✅ Explica que ação é irreversível
✅ Loading states durante operação

📊 CENÁRIOS DE USO:

CENÁRIO 1 - Treinamento sem Planos:
- Usuário quer excluir treinamento vazio
- AlertDialog mostra informações básicas
- Confirmação simples e direta
- Exclusão rápida sem avisos extras

CENÁRIO 2 - Treinamento com Planos:
- Usuário quer excluir treinamento completo
- AlertDialog mostra aviso destacado
- Informa quantos planos serão perdidos
- Usuário pode repensar a decisão

CENÁRIO 3 - Cancelamento:
- Usuário abre confirmação por engano
- Pode cancelar a qualquer momento
- Nenhuma alteração é feita
- Interface volta ao estado anterior

CENÁRIO 4 - Erro na Exclusão:
- Problema na API ou conectividade
- Toast de erro é exibido
- AlertDialog permanece aberto
- Usuário pode tentar novamente

🔄 MENU FINAL COMPLETO:

┌─────────────────────┐
│ ✏️  Editar          │
│ 📋  Listar Planos   │
│ ➕  Adicionar Plano │
├─────────────────────┤
│ 🗑️  Excluir         │
└─────────────────────┘

🎯 BENEFÍCIOS DA IMPLEMENTAÇÃO:

1. **Segurança**: Confirmação obrigatória evita exclusões acidentais
2. **Transparência**: Usuário sabe exatamente o que será excluído
3. **Informativo**: Avisos claros sobre consequências
4. **Reversível**: Pode cancelar até o último momento
5. **Feedback**: Sempre sabe o status da operação
6. **Consistente**: Segue padrões do projeto
*/

// Exemplo de dados que o AlertDialog recebe:
const exemploTreinamento = {
  id: "123",
  nome: "Treinamento de Segurança no Trabalho",
  tipo: "integracao",
  planos: [
    { id: "1", nome: "Normas de Segurança Básica" },
    { id: "2", nome: "Uso de EPIs" },
    { id: "3", nome: "Procedimentos de Emergência" }
  ]
}

// API call realizada:
// DELETE /rh/treinamentos/{id}

// Como usar o componente:
import { AlertExcluirTreinamento } from './AlertExcluirTreinamento'

export function ExemploUso() {
  const [open, setOpen] = useState(false)
  
  return (
    <AlertExcluirTreinamento
      treinamento={exemploTreinamento}
      open={open}
      onOpenChange={setOpen}
    />
  )
}
