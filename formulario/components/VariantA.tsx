'use client';

import React from 'react';
import { AddressData } from '@/types/form';

interface VariantAProps {
  address: AddressData;
  onChange: (address: AddressData) => void;
}

export default function VariantA({ address, onChange }: VariantAProps) {
  const handleChange = (field: keyof AddressData, value: string) => {
    onChange({
      ...address,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          type="text"
          id="direccion"
          value={address.direccion}
          onChange={(e) => handleChange('direccion', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Calle 123 # 45-67"
          required
        />
      </div>

      <div>
        <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
          Ciudad
        </label>
        <input
          type="text"
          id="ciudad"
          value={address.ciudad}
          onChange={(e) => handleChange('ciudad', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Bogotá"
          required
        />
      </div>

      <div>
        <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
          Departamento
        </label>
        <input
          type="text"
          id="departamento"
          value={address.departamento}
          onChange={(e) => handleChange('departamento', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cundinamarca"
          required
        />
      </div>
    </div>
  );
}
