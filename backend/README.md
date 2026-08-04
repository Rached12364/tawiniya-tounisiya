# Tawiniya Backend — TASK-B001

Initialisation du projet Spring Boot pour Tawiniya Tounisiya.

## Stack
- Spring Boot 4.1.0
- Java 17 (compatible jusqu'à Java 21)
- PostgreSQL + Hibernate (Spring Data JPA)
- Spring Security (stateless, prêt pour JWT)
- JWT via `jjwt` (implémentation dans TASK-B002)
- Lombok + MapStruct
- Actuator (`/actuator/health`)

## Prérequis
- JDK 17+
- Maven 3.8+
- PostgreSQL (local ou Docker)

## Configuration base de données

Créer la base PostgreSQL :

```sql
CREATE DATABASE tawiniya_db;
```

Variables d'environnement (ou valeurs par défaut dans `application.yml`) :

| Variable       | Défaut         |
|----------------|----------------|
| DB_HOST        | localhost      |
| DB_PORT        | 5432           |
| DB_NAME        | tawiniya_db    |
| DB_USER        | postgres       |
| DB_PASSWORD    | postgres       |
| JWT_SECRET     | (voir application.yml) |
| CORS_ORIGINS   | http://localhost:3000 |

## Démarrage

```bash
mvn clean install
mvn spring-boot:run
```

## Vérification (critères d'acceptation TASK-B001)

- `mvn spring-boot:run` démarre sans erreur
- `GET http://localhost:8080/actuator/health` → `{"status":"UP"}`

## Structure des packages

```
tn.tawiniya.tounisiya
├── entity        # Entités JPA
├── repository    # Repositories Spring Data JPA
├── service       # Logique métier
├── controller    # Contrôleurs REST
├── dto           # Objets de transfert
├── exception     # Exceptions + GlobalExceptionHandler
├── security      # Config Security + JWT
└── config        # Config générale (CORS, ...)
```

## TASK-B002 — API Register + JWT

### Endpoints

**POST /api/auth/register**
```json
{
  "nom": "Ilahi",
  "prenom": "Rached",
  "email": "rached@example.com",
  "phone": "+21620000000",
  "password": "motdepasse123",
  "role": "TECHNICIEN"
}
```
→ `201 Created` avec `{ "token": "...", "user": { ... } }`

**POST /api/auth/login**
```json
{
  "email": "rached@example.com",
  "password": "motdepasse123"
}
```
→ `200 OK` avec `{ "token": "...", "user": { ... } }`
→ `401 Unauthorized` si email/mot de passe incorrect

### Tester avec curl

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nom\":\"Ilahi\",\"prenom\":\"Rached\",\"email\":\"rached@example.com\",\"phone\":\"+21620000000\",\"password\":\"motdepasse123\",\"role\":\"TECHNICIEN\"}"

curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"rached@example.com\",\"password\":\"motdepasse123\"}"
```

Rôles valides : `ADMIN`, `TECHNICIEN`, `ENTREPRISE`, `STAGIAIRE`, `BENEFICIEL`

### Ce qui a été ajouté
- Entité `User` (implémente `UserDetails`) + enum `Role`
- `UserRepository`
- `JwtService` (HS384, expiration 24h, configurable via `app.jwt.*`)
- `JwtFilter` (OncePerRequestFilter) branché dans `SecurityConfig`
- `AuthService` + `AuthController`
- `GlobalExceptionHandler` (409 email déjà pris, 401 mauvais identifiants, 400 validation, 500 générique)
- `UserMapper` (MapStruct) pour ne jamais exposer le mot de passe

## Prochaine étape
➡ TASK-B003 — Historique des connexions (entité `LoginHistory`, `LoginAuditService`)

## TASK-B003 — Historique des connexions

### Ce qui a été ajouté
- Entité `LoginHistory` (email, user, success, ip, userAgent, loginAt)
- `LoginHistoryRepository`
- `LoginAuditService.record(...)` — annoté `@Transactional(propagation = Propagation.REQUIRES_NEW)` :
  ouvre une transaction **indépendante**, donc la trace d'audit est bien enregistrée même si
  l'authentification échoue et provoque un rollback de la transaction appelante.
- `AuthService.login()` appelle désormais `loginAuditService.record(...)` :
  - en cas d'échec (mauvais mot de passe / email inconnu) → `success = false`
  - en cas de succès → `success = true`

### Vérifier en base

Après quelques tentatives de login (réussies et échouées) :

```sql
psql -U postgres -p 5433 -d tawiniya_db
SELECT id, email, success, ip, user_agent, login_at FROM login_history ORDER BY login_at DESC;
```

Vous devez voir une ligne par tentative, avec `success = true` ou `false` selon le cas,
et l'IP / user-agent de la requête curl (ex: `curl.exe` → IP `127.0.0.1`).

## Sprint 1 (backend) terminé 🎉
TASK-B001, TASK-B002, TASK-B003 sont validées.
➡ Prochaine étape : Sprint 2 (TASK-B004 — API Techniciens, TASK-B005 — API Entreprises)
