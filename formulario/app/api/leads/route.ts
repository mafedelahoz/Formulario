import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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

    const query = `
      INSERT INTO leads (nombre, whatsapp, nombre_negocio, especialidad, variant_shown, address_json)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING lead_id, created_at
    `;

    const values = [
      nombre,
      whatsapp,
      nombreNegocio,
      especialidad,
      variant,
      JSON.stringify(address)
    ];

    const result = await pool.query(query, values);
    const insertedLead = result.rows[0];

    return NextResponse.json({
      success: true,
      leadId: insertedLead.lead_id,
      createdAt: insertedLead.created_at
    }, { status: 201 });

  } catch (error) {
    console.error('Error al guardar lead:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
