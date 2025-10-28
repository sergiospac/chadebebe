# 🔧 Diagnóstico SMTP - Erro 535

## ❌ Erro Atual
```
535-5.7.8 Username and Password not accepted
Error code: EAUTH
```

## 🔍 Causas Raiz Possíveis

### 1. **Senha de App Incorreta**
- A senha deve ter **16 caracteres SEM espaços**
- Exemplo correto: `abcdefghijklmnop`
- Exemplo errado: `abcd efgh ijkl mnop` (com espaços)

### 2. **2FA Não Habilitado**
- Gmail **exige** autenticação em 2 fatores para gerar App Passwords
- Acesse: https://myaccount.google.com/security

### 3. **Senha de App Não Criada**
- Você precisa gerar especificamente um "App Password"
- Não use a senha normal da conta Google
- Acesse: https://myaccount.google.com/apppasswords

### 4. **Conta Bloqueada Temporariamente**
- Muitas tentativas falhas podem bloquear a conta
- Aguarde 24h ou acesse: https://accounts.google.com/DisplayUnlockCaptcha

### 5. **Espaços ou Caracteres Especiais na Senha**
- A senha de App é exatamente 16 caracteres alfanuméricos
- Copie SEM os espaços que o Google exibe
- Exemplo de exibição: `abcd efgh ijkl mnop`
- Use assim: `abcdefghijklmnop`

## ✅ Solução Passo a Passo

### PASSO 1: Habilitar 2FA
```
1. Acesse: https://myaccount.google.com/security
2. Clique em "Autenticação em duas etapas"
3. Configure com seu telefone
4. Siga as instruções
```

### PASSO 2: Criar App Password
```
1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Outro (Nome personalizado)"
3. Digite: Chadebebe Dev
4. Clique em "Gerar"
5. Copie a senha de 16 caracteres (SEM espaços)
```

### PASSO 3: Atualizar .env.development
```bash
# Edite o arquivo
nano .env.development

# Altere a linha SMTP_PASS para:
SMTP_PASS="abcdefghijklmnop"  # SUA SENHA REAL SEM ESPAÇOS

# Salve e saia (Ctrl+X, Y, Enter)
```

### PASSO 4: Testar Conexão
```bash
# Execute o script de teste
npm run test:smtp

# Se funcionar, você verá:
# ✅ Servidor SMTP conectado e autenticado com sucesso!
# ✅ Email enviado com sucesso!
```

### PASSO 5: Verificar Configuração
```bash
# Verifique se está correto
cat .env.development | grep -E "SMTP_USER|SMTP_PASS|USE_REAL_EMAIL"
```

Deve mostrar:
```
SMTP_USER="enxoval.org@gmail.com"
SMTP_PASS="abcdefghijklmnop"    # 16 caracteres, SEM espaços
USE_REAL_EMAIL="true"
```

## 🧪 Script de Teste

Execute:
```bash
tsx scripts/test-smtp.ts
```

Este script irá:
1. ✅ Testar a conexão SMTP
2. ✅ Verificar credenciais
3. ✅ Enviar um email de teste para si mesmo
4. ❌ Mostrar diagnóstico detalhado se houver erro

## 📝 Checklist

- [ ] 2FA habilitado em enxoval.org@gmail.com
- [ ] App Password criado (16 caracteres)
- [ ] Senha copiada SEM espaços
- [ ] .env.development atualizado com senha correta
- [ ] USE_REAL_EMAIL="true"
- [ ] npm run test:smtp executado com sucesso

## 🚨 Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `535-5.7.8 Username and Password not accepted` | Senha incorreta | Recrie a App Password |
| `534-5.7.9 Application-specific password required` | 2FA não habilitado | Habilite 2FA primeiro |
| `Error code: EAUTH` | Credenciais inválidas | Verifique user e pass no .env |
| `Connection timeout` | Firewall | Libere porta 587 |

## 📚 Links Úteis

- [Gerar App Password](https://myaccount.google.com/apppasswords)
- [Gerenciar Segurança](https://myaccount.google.com/security)
- [Desbloquear Conta](https://accounts.google.com/DisplayUnlockCaptcha)


