import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { enriquecerLead } from '@/lib/enrichment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { nombre, whatsapp, nombreNegocio, especialidad, variant, address } = body;

    if (!nombre || !whatsapp || !nombreNegocio || !especialidad || !variant || !address) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (variant !== 'A' && variant !== 'B') {
      return NextResponse.json(
        { error: 'Variante inválida' },
        { status: 400 }
      );
    }

    const enrichmentData = enriquecerLead(especialidad);

    const query = `
      INSERT INTO leads (
        nombre, whatsapp, nombre_negocio, especialidad, variant_shown, 
        address_json, ticket_promedio, segmento
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING lead_id, created_at, ticket_promedio, segmento
    `;

    const values = [
      nombre,
      whatsapp,
      nombreNegocio,
      especialidad,
      variant,
      JSON.stringify(address),
      enrichmentData.ticketPromedio,
      enrichmentData.segmento
    ];

    const result = await pool.query(query, values);
    const insertedLead = result.rows[0];

    return NextResponse.json({
      success: true,
      leadId: insertedLead.lead_id,
      createdAt: insertedLead.created_at,
      enrichment: {
        ticketPromedio: insertedLead.ticket_promedio,
        segmento: insertedLead.segmento
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error al guardar lead:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_leads,
          COUNT(CASE WHEN segmento = 'HIGH_TICKET' THEN 1 END) as high_ticket_count,
          COUNT(CASE WHEN segmento = 'LOW_TICKET' THEN 1 END) as low_ticket_count,
          COUNT(CASE WHEN variant_shown = 'A' THEN 1 END) as variant_a_count,
          COUNT(CASE WHEN variant_shown = 'B' THEN 1 END) as variant_b_count,
          ROUND(AVG(ticket_promedio)) as ticket_promedio_avg
        FROM leads
      `;
      
      const segmentQuery = `
        SELECT 
          segmento,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads), 2) as porcentaje
        FROM leads
        WHERE segmento IS NOT NULL
        GROUP BY segmento
      `;

      const especialidadQuery = `
        SELECT 
          especialidad,
          segmento,
          ticket_promedio,
          COUNT(*) as count
        FROM leads
        GROUP BY especialidad, segmento, ticket_promedio
        ORDER BY especialidad
      `;

      const [statsResult, segmentResult, especialidadResult] = await Promise.all([
        pool.query(statsQuery),
        pool.query(segmentQuery),
        pool.query(especialidadQuery)
      ]);

      return NextResponse.json({
        resumen: statsResult.rows[0],
        porSegmento: segmentResult.rows,
        porEspecialidad: especialidadResult.rows
      });
    }

    const query = `
      SELECT 
        lead_id,
        nombre,
        whatsapp,
        nombre_negocio,
        especialidad,
        variant_shown,
        ticket_promedio,
        segmento,
        address_json,
        created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const result = await pool.query(query);

    return NextResponse.json({
      leads: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error al obtener leads:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
