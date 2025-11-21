ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS ticket_promedio INTEGER,
ADD COLUMN IF NOT EXISTS segmento VARCHAR(20) CHECK (segmento IN ('HIGH_TICKET', 'LOW_TICKET'));

CREATE INDEX IF NOT EXISTS idx_segmento ON leads(segmento);

COMMENT ON COLUMN leads.ticket_promedio IS 'Ticket promedio inferido según la especialidad';
COMMENT ON COLUMN leads.segmento IS 'Segmentación del lead: HIGH_TICKET (>= 500k) o LOW_TICKET (< 500k)';
