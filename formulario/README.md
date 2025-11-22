# Formulario de Registro de Aliados con A/B Testing y Enriquecimiento Automático

Sistema completo de registro de aliados con:
- Prueba A/B para optimizar la captura de direcciones
- Enriquecimiento automático de datos
- Segmentación inteligente de leads
- Análisis completo de resultados

## Resultados del Experimento A/B

**Variante B (Mapbox) gana con +146.54% de Lift**

Después de analizar 1,000 leads simulados:
- Variante A (Manual): 9.16% CR
- Variante B (Mapbox): 22.59% CR
- **Impacto especialmente fuerte en HIGH_TICKET: +185.74%**


## Características

### Fase 1: A/B Testing
- **Prueba A/B en tiempo real**: Asignación aleatoria 50/50 entre dos variantes
- **Variante A (Control)**: Inputs manuales para dirección, ciudad y departamento
- **Variante B (Test)**: Autocompletado inteligente con Mapbox Geocoding
- **Persistencia**: Mantiene la variante asignada usando localStorage
- **Captura de coordenadas**: La Variante B captura lat/lng automáticamente

### Fase 2: Enriquecimiento Automático
- **Cálculo de ticket promedio**: Inferencia automática según especialidad
- **Segmentación inteligente**: HIGH_TICKET (>= 500k) o LOW_TICKET (< 500k)
- **Dashboard de análisis**: Visualización de métricas y segmentos

### Fase 3: Análisis de Datos
- **Generación de datos experimentales**: Script Python con 1,000 leads simulados
- **Análisis estadístico completo**: CR por variante, segmento y especialidad
- **Insights de negocio**: Identificación de patrones y recomendaciones
- **Documentación ejecutiva**: Informe completo para toma de decisiones
- **Base de datos enriquecida**: Almacenamiento con datos calculados

## Stack Tecnológico

- **Frontend**: Next.js 15 con TypeScript
- **Styling**: Tailwind CSS
- **Mapbox**: API de Geocoding para autocompletado
- **Base de datos**: PostgreSQL (Neon)
- **Cliente DB**: pg (node-postgres)

## Estructura del Proyecto

```
formulario/
├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.ts          # API con enriquecimiento automático
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard de análisis
│   ├── layout.tsx
│   └── page.tsx                  # Página principal
├── components/
│   ├── RegistroForm.tsx          # Componente principal del formulario
│   ├── VariantA.tsx              # Inputs manuales
│   └── VariantB.tsx              # Autocompletado Mapbox
├── hooks/
│   └── useABTest.ts              # Hook para asignación A/B
├── types/
│   └── form.ts                   # Tipos TypeScript
├── lib/
│   ├── db.ts                     # Configuración PostgreSQL
│   └── enrichment.ts             # Lógica de enriquecimiento
├── database/
│   ├── schema.sql                # Esquema completo
│   └── migration_add_enrichment.sql  # Migración Fase 2
├── setup-db.js                   # Script inicial de DB
├── run-migration.js              # Script de migración
└── FASE2_DOCUMENTACION.md        # Documentación detallada Fase 2
```

## Configuración

### 1. Variables de Entorno

Edita el archivo `.env.local` en la raíz del proyecto (Datos expuestos por fines de prueba):

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibWFmZWRlbGFob3oiLCJhIjoiY21pN3pyajA1MDdmdzJyb2k2YWtmZzdmYyJ9.dtLR3xD9Y1BWHSSdcKEJ4w
DATABASE_URL=postgresql://neondb_owner:npg_EZyA8zek0VTp@ep-sweet-night-ahw5bea9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 4. Ejecutar el Proyecto

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Esquema de Base de Datos

La tabla `leads` almacena:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| lead_id | SERIAL | ID único autoincrementable |
| nombre | VARCHAR(255) | Nombre completo del aliado |
| whatsapp | VARCHAR(50) | Número de WhatsApp |
| nombre_negocio | VARCHAR(255) | Nombre del negocio |
| especialidad | VARCHAR(100) | Odontología, Veterinaria, etc. |
| variant_shown | CHAR(1) | 'A' o 'B' |
| address_json | JSONB | Objeto con dirección y coordenadas |
| created_at | TIMESTAMP | Fecha de creación |

## Funcionamiento de la Prueba A/B

1. **Primera visita**: Se asigna aleatoriamente Variante A o B (50/50)
2. **Persistencia**: Se guarda en localStorage con clave `ab_test_variant`
3. **Visitas posteriores**: Se mantiene la misma variante
4. **Registro**: Se guarda qué variante vio el usuario en `variant_shown`

## API Endpoints

### POST /api/leads

Guarda un nuevo lead en la base de datos.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "whatsapp": "+57 300 123 4567",
  "nombreNegocio": "Clínica San José",
  "especialidad": "Odontología",
  "variant": "B",
  "address": {
    "direccion": "Carrera 7 # 32-16",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "lat": 4.624335,
    "lng": -74.063644
  }
}
```

**Response:**
```json
{
  "success": true,
  "leadId": 123,
  "createdAt": "2025-11-20T10:30:00.000Z",
  "enrichment": {
    "ticketPromedio": 800000,
    "segmento": "HIGH_TICKET"
  }
}
```

## Enriquecimiento Automático (Fase 2)

### Reglas de Negocio

El sistema enriquece automáticamente cada lead con:

| Especialidad | Ticket Promedio | Segmento |
|-------------|----------------|----------|
| Odontología | $800,000 | HIGH_TICKET |
| Estética | $800,000 | HIGH_TICKET |
| Veterinaria | $200,000 | LOW_TICKET |
| Medicina General | $200,000 | LOW_TICKET |

**Umbral de segmentación:**
- HIGH_TICKET: ticket_promedio >= $500,000
- LOW_TICKET: ticket_promedio < $500,000

### Dashboard de Análisis

Accede a `/dashboard` para ver:
- Total de leads y distribución
- Métricas de segmentación (HIGH_TICKET vs LOW_TICKET)
- Análisis de prueba A/B
- Desglose por especialidad
- Ticket promedio general

## Análisis de Resultados (Fase 3)

### Generar Datos del Experimento

```bash
python3 generate_experiment_data.py
```

Esto crea `experiment_data.csv` con:
- 1,000 leads distribuidos 50/50 entre variantes A y B
- Segmentación HIGH_TICKET y LOW_TICKET
- Tasas de conversión simuladas

### Ver Documentación Completa

Lee [FASE3_ANALISIS.md](FASE3_ANALISIS.md) para:
- Resultados detallados del experimento
- Respuestas a preguntas de negocio
- Insights y recomendaciones

## Archivos Generados

- `experiment_data.csv` - Datos completos del experimento
- `experiment_results.png` - Gráficas principales de análisis
- `experiment_lift_analysis.png` - Análisis visual del lift por segmento

### Vía Dashboard Web
Visita http://localhost:3000/dashboard para visualizaciones interactivas.

### Vía API
```bash
curl http://localhost:3000/api/leads?action=stats
```

### Vía SQL

```sql
-- Tasa de conversión por variante
SELECT 
  variant_shown,
  COUNT(*) as total_leads,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as porcentaje
FROM leads
GROUP BY variant_shown;

-- Calidad de datos 
SELECT 
  variant_shown,
  COUNT(CASE WHEN address_json->>'lat' IS NOT NULL THEN 1 END) as con_coordenadas,
  COUNT(*) as total
FROM leads
GROUP BY variant_shown;
```
