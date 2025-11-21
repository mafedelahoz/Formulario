'use client';

import React, { useState } from 'react';
import { useABTest } from '@/hooks/useABTest';
import VariantA from '@/components/VariantA';
import VariantB from '@/components/VariantB';
import { FormData, especialidades, AddressData } from '@/types/form';

export default function RegistroForm() {
  const variant = useABTest();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [enrichmentData, setEnrichmentData] = useState<{ticketPromedio: number; segmento: string} | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    whatsapp: '',
    nombreNegocio: '',
    especialidad: '',
    address: {
      direccion: '',
      ciudad: '',
      departamento: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (address: AddressData) => {
    setFormData(prev => ({
      ...prev,
      address
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          whatsapp: formData.whatsapp,
          nombreNegocio: formData.nombreNegocio,
          especialidad: formData.especialidad,
          variant: variant,
          address: formData.address
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      const result = await response.json();
      setEnrichmentData(result.enrichment);
      setSubmitSuccess(true);
      setFormData({
        nombre: '',
        whatsapp: '',
        nombreNegocio: '',
        especialidad: '',
        address: {
          direccion: '',
          ciudad: '',
          departamento: ''
        }
      });

    } catch (error) {
      setSubmitError('Ocurrió un error al enviar el formulario. Por favor intenta de nuevo.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!variant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registro Exitoso</h2>
          <p className="text-gray-600 mb-4">
            Gracias por registrarte como aliado. Nos pondremos en contacto contigo pronto.
          </p>
          
          {enrichmentData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Información de Segmentación</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Ticket Promedio:</span>
                  <span className="font-semibold">${enrichmentData.ticketPromedio.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Segmento:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    enrichmentData.segmento === 'HIGH_TICKET' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {enrichmentData.segmento}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              setSubmitSuccess(false);
              setEnrichmentData(null);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Registrar Otro Aliado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Registro de Aliados</h1>
              <p className="text-gray-600">
                Completa el formulario para convertirte en nuestro aliado
              </p>
            </div>
            <a
              href="/dashboard"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Ver Dashboard
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+57 300 123 4567"
                required
              />
            </div>

            <div>
              <label htmlFor="nombreNegocio" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <input
                type="text"
                id="nombreNegocio"
                name="nombreNegocio"
                value={formData.nombreNegocio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Clínica San José"
                required
              />
            </div>

            <div>
              <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad
              </label>
              <select
                id="especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una especialidad</option>
                {especialidades.map(esp => (
                  <option key={esp} value={esp}>{esp}</option>
                ))}
              </select>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ubicación</h3>
              {variant === 'A' ? (
                <VariantA address={formData.address} onChange={handleAddressChange} />
              ) : (
                <VariantB address={formData.address} onChange={handleAddressChange} />
              )}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'Enviando...' : 'Registrarse como Aliado'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Variante de prueba: {variant}
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('ab_test_variant');
                window.location.reload();
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Cambiar variante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
