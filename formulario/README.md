# Formulario de Registro de Aliados con A/B Testing

Sistema de registro de aliados con prueba A/B para optimizar la captura de direcciones usando Mapbox.

## Características

- **Prueba A/B en tiempo real**: Asignación aleatoria 50/50 entre dos variantes
- **Variante A (Control)**: Inputs manuales para dirección, ciudad y departamento
- **Variante B (Test)**: Autocompletado inteligente con Mapbox Geocoding
- **Persistencia**: Mantiene la variante asignada usando localStorage
- **Captura de coordenadas**: La Variante B captura lat/lng automáticamente
- **Base de datos PostgreSQL**: Almacenamiento estructurado de leads

## Stack Tecnológico

- **Frontend**: Next.js 15 con TypeScript
- **Styling**: Tailwind CSS
- **Mapbox**: @mapbox/search-js-react
- **Base de datos**: PostgreSQL
- **ORM**: pg (node-postgres)

## Estructura del Proyecto

```
formulario/
├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.ts          # API endpoint para guardar leads
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
│   └── db.ts                     # Configuración PostgreSQL
└── database/
    └── schema.sql                # Esquema de base de datos
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
  "createdAt": "2025-11-20T10:30:00.000Z"
}
```

## Análisis de Resultados

Para análisis de los resultados de la prueba A/B, se pueden ejecutar los queries:

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
