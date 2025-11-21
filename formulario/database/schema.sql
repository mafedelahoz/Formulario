CREATE TABLE IF NOT EXISTS leads (
  lead_id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  nombre_negocio VARCHAR(255) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  variant_shown CHAR(1) NOT NULL CHECK (variant_shown IN ('A', 'B')),
  address_json JSONB NOT NULL,
  ticket_promedio INTEGER,
  segmento VARCHAR(20) CHECK (segmento IN ('HIGH_TICKET', 'LOW_TICKET')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_variant_shown ON leads(variant_shown);
CREATE INDEX idx_created_at ON leads(created_at);
CREATE INDEX idx_especialidad ON leads(especialidad);
CREATE INDEX idx_segmento ON leads(segmento);

COMMENT ON TABLE leads IS 'Tabla de leads capturados del formulario con prueba A/B';
COMMENT ON COLUMN leads.variant_shown IS 'Variante mostrada: A o B ';
COMMENT ON COLUMN leads.address_json IS 'Objeto con dirección, ciudad, departamento y coordenadas (lat/lng)';
COMMENT ON COLUMN leads.ticket_promedio IS 'Ticket promedio inferido según la especialidad';
COMMENT ON COLUMN leads.segmento IS 'Segmentación del lead: HIGH_TICKET (>= 500k) o LOW_TICKET (< 500k)';
