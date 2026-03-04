# Tablas sin uso y manejo de errores

## Tablas sin uso actual

### revenue_summary
- **Definición:** Script 03. Resumen diario por `user_id` (daily_revenue, membership_fees, personal_training, other_revenue, total_transactions).
- **Uso actual:** Ninguno. El dashboard y accounting calculan agregados directamente desde `payments`.
- **Decisión:** Mantener la tabla. En el futuro se puede usar para cache o reportes precalculados (job que rellene desde `payments`). No eliminar del schema.

### trainer_members
- **Definición:** Script 07. Relación N:N entre `trainers` y `members` (UNIQUE(trainer_id, member_id)).
- **Uso actual:** Ninguno en la UI.
- **Decisión:** Mantener. La relación existe en el modelo; cuando se implemente "asignar miembros a entrenadores" hará falta GET/POST/DELETE sobre esta tabla.

### sessions
- **Definición:** Script 01. Sesiones por `user_id` (token, expires_at).
- **Uso actual:** Ninguno. La autenticación usa Supabase Auth; no se crean filas en `sessions`.
- **Decisión:** Mantener por si en el futuro se usa autenticación custom o listado/revocación de sesiones. No eliminar del schema.

---

## Manejo de errores en acciones GET

Todas las Server Actions que leen datos devuelven un resultado tipado `{ data, error }` (o `{ counts, error }`, `{ stats, error }`, `{ plans, error }` según el caso). Cuando `error` no es null, la página correspondiente muestra un `<Alert variant="destructive">` con el mensaje.

### Funciones migradas al patrón

| Módulo | Función | Tipo resultado | Página que muestra error |
|--------|---------|----------------|---------------------------|
| dashboard | getDashboardCounts | GetDashboardCountsResult | Dashboard overview |
| dashboard | getSalesChartData | GetSalesChartResult | Dashboard (Alert agrupado "Could not load some charts") |
| dashboard | getMembershipDistribution | GetMembershipDistResult | Dashboard |
| dashboard | getRevenueChartData | GetRevenueChartResult | Dashboard |
| members | getMembers | GetMembersResult | Members, Accounting |
| payments | getPayments | GetPaymentsResult | Accounting |
| payments | getAccountingStats | GetAccountingStatsResult | Accounting |
| plans | getMembershipPlans | GetMembershipPlansResult | Plans, Accounting |
| check-ins | getCheckIns | GetCheckInsResult | QR Scanner |
| branches | getBranches | GetBranchesResult | Branches, Trainers |
| trainers | getTrainers | GetTrainersResult | Trainers |
| admin | getAdminKPIs | GetAdminKPIsResult | Admin overview |
| admin | getAdminClients | GetAdminClientsResult | Admin Clients, Admin Plans |
| admin | getAdminClientsOverview | GetAdminClientsOverviewResult | Admin overview |
| admin | getAdminActiveUsersChartData | GetAdminActiveUsersChartResult | Admin overview |
| admin | getAdminRevenueStats | GetAdminRevenueStatsResult | Admin Accounting |
| admin | getAdminRevenueChartData | GetAdminRevenueChartResult | Admin Accounting |
| admin | getAdminPayments | GetAdminPaymentsResult | Admin Accounting |
| admin | getAdminUserGrowthData | GetAdminUserGrowthDataResult | Admin Analytics |
| admin | getAdminGrowthMetrics | GetAdminGrowthMetricsResult | Admin Analytics |
| platform-plans | getPlatformPlans | GetPlatformPlansResult | Admin Plans |
| platform-plans | getPlatformPlansPublic | GetPlatformPlansResult | (consumidor extrae .plans) |

### Error boundaries

- `app/dashboard/error.tsx` y `app/admin/error.tsx`: capturan excepciones no controladas en el árbol de cada sección y muestran mensaje con botón "Try again".
