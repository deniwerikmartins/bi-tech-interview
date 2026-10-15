# Desafio Fullstack — CRUD de Pacientes

Aplicação fullstack completa para cadastro e gestão de pacientes, desenvolvida com **Laravel 10** no backend e **Vue.js 2** no frontend, containerizada com **Docker**.

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Como rodar a aplicação](#como-rodar-a-aplicação)
- [URLs de acesso](#urls-de-acesso)
- [Como rodar os testes](#como-rodar-os-testes)
- [Arquitetura e decisões técnicas](#arquitetura-e-decisões-técnicas)
- [Collection do Postman](#collection-do-postman)

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+

Nenhuma outra dependência precisa ser instalada localmente.

---

## Como rodar a aplicação

Clone o repositório e suba toda a stack com um único comando na raiz do projeto:

```bash
git clone <url-do-repositorio>
cd bi-tech-interview
docker compose up --build
```

Na primeira execução o processo:

1. Baixa e compila as imagens (pode levar alguns minutos)
2. Aguarda o MySQL ficar saudável
3. Executa as migrations automaticamente
4. Executa os seeders — gera **25 pacientes** com dados brasileiros realistas
5. Sobe o servidor Laravel (PHP-FPM + Nginx) na porta `8000`
6. Compila o frontend Vue.js e serve via Nginx na porta `3000`

Para parar:

```bash
docker compose down
```

Para destruir também os dados do banco:

```bash
docker compose down -v
```

---

## URLs de acesso

| Serviço | URL |
|---|---|
| **Frontend** (Vue.js) | http://localhost:3000 |
| **API** (Laravel) | http://localhost:8000/api |
| **Health Check** | http://localhost:8000/api/health |
| **MySQL** | `localhost:3307` (usuário: `bi_user`, senha: `secret`) |

---

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status da aplicação e conexão com o banco |
| `GET` | `/api/patients` | Listagem paginada (suporta `?search=` e `?per_page=`) |
| `POST` | `/api/patients` | Cadastrar novo paciente |
| `GET` | `/api/patients/{id}` | Detalhes de um paciente |
| `PUT` | `/api/patients/{id}` | Atualizar paciente |
| `DELETE` | `/api/patients/{id}` | Excluir paciente (soft delete) |

---

## Como rodar os testes

### Backend (Laravel — PHPUnit)

```bash
docker exec bi_backend php artisan test
```

Saída esperada:
```
Tests:    18 passed (56 assertions)
Duration: ~0.6s
```

Os testes de feature cobrem:
- Health check
- Listagem com paginação e filtro por nome/CPF
- Cadastro com dados válidos
- Validação de campos obrigatórios (422)
- CPF duplicado
- Atualização de paciente
- Soft delete e verificação de exclusão na listagem

O ambiente de testes usa **SQLite in-memory** (`phpunit.xml`), sem dependência do MySQL.

### Frontend (Vue.js — Jest)

O container do frontend é apenas Nginx (sem Node.js), então os testes precisam ser executados com um container Node temporário:

```bash
# A partir da pasta front-vuejs
cd front-vuejs
docker run --rm -it -v $(pwd):/app -w /app node:18-alpine npm test
```

Ou localmente (com Node.js 18+ instalado):

```bash
cd front-vuejs
npm install
npm test
```

Saída esperada:
```
Test Suites: 4 passed, 4 total
Tests:       27 passed, 27 total
```

Os testes de componente cobrem:
- `DeletePatientModal` — renderização, eventos, spinner
- `PatientsView` — título, chamada ao service, loading, empty state, busca
- `PatientCreateView` — validação vazia, chamada ao service, erros 422, redirect
- `PatientEditView` — pré-preenchimento, conversão de data, update, delete, redirect

---

## Arquitetura e decisões técnicas

### Backend

```
php-laravel/
├── app/
│   ├── Actions/
│   │   └── PatientAction.php       # Lógica de negócio (service layer)
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   └── PatientController.php   # Controller thin — delega ao Action
│   │   ├── Requests/
│   │   │   ├── StorePatientRequest.php  # Validação do cadastro
│   │   │   └── UpdatePatientRequest.php # Validação da atualização
│   │   └── Resources/
│   │       └── PatientResource.php      # Transformação do JSON de resposta
│   └── Models/
│       └── Patient.php              # Model com SoftDeletes
├── database/
│   ├── factories/PatientFactory.php # Dados brasileiros realistas
│   ├── migrations/                  # Tabela patients com deleted_at
│   └── seeders/PatientSeeder.php    # 25 pacientes gerados no boot
└── tests/Feature/PatientApiTest.php # 18 testes de feature
```

**Princípios aplicados:**
- **Form Requests** para isolamento das regras de validação
- **API Resources** para padronização e transformação do JSON
- **Service/Action Layer** para desacoplar lógica de negócio dos Controllers
- **SoftDeletes** — registros excluídos ficam no banco com `deleted_at` preenchido
- **Faker PT-BR** — nomes, CPFs e telefones com formato brasileiro

### Frontend

```
front-vuejs/
├── src/
│   ├── services/
│   │   ├── api.ts              # Instância Axios + interceptors de erro
│   │   └── patientService.ts   # Métodos de acesso à API
│   ├── components/
│   │   ├── AppSidebar.vue      # Sidebar azul escuro
│   │   └── DeletePatientModal.vue  # Modal de confirmação de exclusão
│   ├── views/
│   │   ├── PatientsView.vue    # Listagem com busca e paginação
│   │   ├── PatientCreateView.vue   # Cadastro com validação reativa
│   │   ├── PatientDetailView.vue   # Detalhes do paciente
│   │   └── PatientEditView.vue     # Edição + exclusão
│   └── tests/
│       ├── setup.ts            # Bootstrap-Vue global para testes
│       ├── PatientsView.spec.ts
│       ├── PatientCreateView.spec.ts
│       ├── PatientEditView.spec.ts
│       └── DeletePatientModal.spec.ts
```

**Princípios aplicados:**
- **Axios com interceptors globais** para tratamento unificado de erros HTTP
- **Service layer** separado das views para facilitar mocks nos testes
- **Bootstrap-Vue 2** para componentes UI consistentes com o protótipo
- **vue-the-mask** para máscaras de CPF, RG e telefone
- **Debounce** na busca para evitar requisições excessivas

### Infraestrutura Docker

```
docker-compose.yml          # Orquestra mysql + backend + frontend
php-laravel/
├── Dockerfile              # PHP 8.2-FPM + Nginx em container único
├── docker/
│   ├── entrypoint.sh       # Boot automatizado: env → key → migrate → seed → serve
│   └── nginx.conf          # Configuração do Nginx para o Laravel
front-vuejs/
├── Dockerfile              # Build Node 18 + serve Nginx (multi-stage)
└── docker/
    └── nginx.conf          # Nginx com suporte ao Vue Router history mode
```

---

## Collection do Postman

Importe o arquivo [`postman/pacientes-api.json`](./postman/pacientes-api.json) no Postman para ter acesso a todos os endpoints com exemplos de requisição e resposta.

**Variável de ambiente:** `{{base_url}}` = `http://localhost:8000`
