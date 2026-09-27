# TradeWise Phase 2 — Authentication

1. Add Spring Security and JJWT dependencies shown below to backend/pom.xml.

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId><artifactId>jjwt-api</artifactId>
  <version>0.12.6</version>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId><artifactId>jjwt-impl</artifactId>
  <version>0.12.6</version><scope>runtime</scope>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId><artifactId>jjwt-jackson</artifactId>
  <version>0.12.6</version><scope>runtime</scope>
</dependency>

2. Copy the application.yml from this package into your backend.

3. Add JWT_SECRET to the backend environment in docker-compose.yml. Use at least 32 characters.

4. Rebuild:
docker compose down
docker compose up --build

5. Test:
POST http://localhost:8081/api/auth/register
{
  "name":"Karthik",
  "email":"karthik@example.com",
  "password":"Password@123"
}

POST http://localhost:8081/api/auth/login
{
  "email":"karthik@example.com",
  "password":"Password@123"
}

GET http://localhost:8081/api/auth/me
Header: Authorization: Bearer YOUR_TOKEN
