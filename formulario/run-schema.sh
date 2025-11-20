#!/bin/bash

# Script para ejecutar el schema en Neon
# Asegúrate de tener la DATABASE_URL correcta en .env.local

if [ -f .env.local ]; then
  export $(cat .env.local | grep DATABASE_URL | xargs)
else
  echo "Error: Archivo .env.local no encontrado"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL no está configurada en .env.local"
  exit 1
fi

echo "Ejecutando schema.sql en la base de datos..."
psql "$DATABASE_URL" -f database/schema.sql

if [ $? -eq 0 ]; then
  echo "Schema ejecutado exitosamente"
else
  echo "Error al ejecutar el schema"
  exit 1
fi
