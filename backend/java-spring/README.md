# FitPulse — Enterprise Spring Boot 3 Biometric Telemetry OS

A modern, clinical-grade **Online Fitness Tracking Platform** built on the **Java Enterprise Ecosystem** (Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, Hibernate) and client-side interactive WebGL telemetry visualizations.

---

## 1. Architectural Highlights

- **100% Java Enterprise Backend**: Spring Boot 3.x with Java 21 / 17 LTS support.
- **Strict Role-Based Access Control (RBAC)**: Spring Security 6 + stateless JJWT (`ROLE_ADMIN`, `ROLE_USER`) with method security (`@PreAuthorize`).
- **Persistence & Auditing**: Spring Data JPA + Hibernate with H2 (in-memory PostgreSQL dialect) or live PostgreSQL/MySQL.
- **Enterprise Layered Architecture**:
  - `model` (Annotated JPA Entities)
  - `repository` (Spring Data JPA)
  - `service` (Transactional business logic)
  - `security` (JWT authentication filter & provider)
  - `dto` (Validated request/response objects)
  - `controller` (RESTful APIs + Thymeleaf Multi-Route View Controller)
  - `exception` (`@RestControllerAdvice` global exception handling)
- **Clinical Aesthetics**: 90% dominant white (`#FFFFFF`, `#F8FAF8`, `#F3F6F3`) with delicate mint accents (`#10B981`, `#A7F3D0`).
- **Client-Side Interactive WebGL Telemetry**:
  - **ActivityMetricsVisualizer**: Dynamically pulsating core reflecting weekly goal completion.
  - **BodyModel (Realistic Human Anatomy)**: 360° mouse-drag orbit with sculpted physique (head, neck, pectoralis major plates, latissimus dorsi, rectus abdominis muscle segments, deltoids, biceps, contoured quadriceps femoris with vastus medialis, calves, physical lighting with key/fill/rim lights, natural skin physical shader) and clickable muscle fatigue hotspots.
  - **CategoryDistributionChart**: Extruded cylindrical donut sectors with hover Y-lift and emissive mint glow.
  - **PerformanceVolumeChart**: Volumetric columns with raycast hover interaction.

---

## 2. Default Seed Accounts

| Account Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Athlete** | `sarah@fitpulse.com` | `User123!` | Logging sessions, anatomical body model, progress telemetry |
| **Administrator** | `admin@fitpulse.com` | `Admin123!` | Full governance, user directory, content moderation queue |

---

## 3. How to Run

### Requirements
- JDK 21 (or 17)
- Apache Maven 3.9+

### Execution
```bash
cd fitpulse-spring
mvn clean spring-boot:run
```

- Web Application: `http://localhost:8080/`
- OpenAPI Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 In-Memory Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:fitpulsedb`)
