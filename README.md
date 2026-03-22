# 🚀 CRM - Sistema de Gestão de Relacionamento com Clientes

## Descrição do Projeto

Sistema CRM desenvolvido para otimizar processos de captação, gestão e acompanhamento de clientes, leads e documentos. Uma plataforma robusta, segura e escalável, pensada para empresas que buscam produtividade e controle.

---

## ✅ Funcionalidades

- 🔹 Gestão de clientes e leads.
- 🔹 Histórico de ações e movimentações.
- 🔹 Upload e armazenamento seguro de documentos.
- 🔹 Gestão de usuários, permissões e perfis.
- 🔹 Controle de acesso seguro (Spring Security + JWT).
- 🔹 API documentada com Swagger.
- 🔹 Frontend responsivo e moderno (Angular 19+).
- 🔹 Integração entre backend e frontend 100% funcional.

---


## 🔗 Integração Angular + Spring Security (Java)

Para rodar frontend e backend juntos em ambiente local sem erro de CORS:

1. Suba o backend Spring Security em `http://localhost:8080`.
2. Garanta que o arquivo `src/environments/environment.development.ts` esteja com `apiBaseUrl: 'http://localhost:8080'`.
3. Suba o frontend Angular com `npm start` (ou `ng serve`).

Para deploy em produção (AWS), configure o endpoint do backend em `src/environments/environment.ts` no campo `apiBaseUrl`.

Isso permite manter uma configuração separada por ambiente (dev/prod), exatamente como no padrão usado com backend Spring.

---
## 🏗️ Tecnologias Utilizadas

### Backend
- Java 17+
- Spring Boot
- Spring Security (JWT)
- PostgreSQL
- Swagger

### Frontend
- Angular 19+
- Angular Standalone Components
- Angular Material

### Mobile (em desenvolvimento)
- Flutter ou React Native (em análise)

### DevOps e Infraestrutura
- Docker e Docker Compose
- Jenkins
- GitLab CI/CD
- SonarQube

---

## 🛡️ Segurança
- Autenticação via JWT.
- Controle refinado de permissões por roles.
- Proteção de endpoints sensíveis.

---

## 🚀 Roadmap

- ✅ Gestão de leads e clientes.
- ✅ Upload e gestão de documentos.
- ✅ Controle de usuários e permissões.
- ✅ Histórico de movimentações.
- 🔄 Dashboard com indicadores e gráficos.
- 🔄 Automação de tarefas e processos.
- 🔄 Integrações externas (WhatsApp, e-mail, DeepSeek).
- 🔄 Deploy em ambiente de nuvem.
- 🔄 **Aplicativo mobile para Android e iOS.**

## 📌 Estado Atual

As principais funcionalidades já disponíveis no projeto incluem:

- Cadastro de leads com upload de documentos e endereço.
- Gerenciamento de endereços do lead (editar, excluir e definir principal).
- Geração de link público para o lead enviar documentos.
- Autenticação com login, registro de usuários e permissões.
- Paginação e filtros básicos nas listagens.cd ..
- Feedback visual com _snackbars_ durante as operações.

## 📝 Próximas Etapas

Funcionalidades planejadas para as versões futuras:

- Converter lead em cliente adicionando módulos de contratos e pós-venda.
- Cadastro de múltiplos endereços diretamente na criação do lead.
- Histórico e auditoria detalhados de alterações de leads e endereços.
- Notificações por e-mail ou push para acompanhamento do lead.
- Dashboard completo com métricas de funil e performance por corretor.
- Exportação de dados em CSV/Excel e política de exclusão segura.
- Validações avançadas de uploads e permissões dinâmicas via painel.
- Melhorias de segurança como refresh token e bloqueio de IP suspeito.
- Integrações adicionais (WhatsApp, API pública, app mobile) e CI/CD.

---

## 🏆 Diferenciais

- Simples, prático e escalável.
- Pensado para aumentar produtividade e controle.
- Segurança robusta e arquitetura moderna.
- Solução multiplataforma: Web e Mobile.

---

## 🤝 Contato

Se você tem interesse em testar, colaborar ou adquirir a solução, entre em contato:

- 💼 [LinkedIn - Danilo Pelusci](https://www.linkedin.com/in/danilo-pelusci/)
- 📧 Email: **[Seu email aqui]**

---

## 📄 Licença

Projeto licenciado sob a [MIT License](LICENSE).

---
