'use client';

import React, { useState, useEffect } from 'react';
import { AddressData } from '@/types/form';

interface VariantBProps {
  address: AddressData;
  onChange: (address: AddressData) => void;
}

export default function VariantB({ address, onChange }: VariantBProps) {
  const [inputValue, setInputValue] = useState(address.direccion);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}&country=CO&language=es&types=address,place`
      );
      const data = await response.json();
      
      if (data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error buscando dirección:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange({
      ...address,
      direccion: value
    });
    
    if (value.length >= 3) {
      searchAddress(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (feature: any) => {
    const placeName = feature.place_name || '';
    const parts = placeName.split(',').map((p: string) => p.trim());
    
    const direccion = feature.text || parts[0] || '';
    let ciudad = '';
    let departamento = '';
    
    feature.context?.forEach((ctx: any) => {
      if (ctx.id.startsWith('place')) {
        ciudad = ctx.text;
      } else if (ctx.id.startsWith('region')) {
        departamento = ctx.text;
      }
    });
    
    if (!ciudad && parts.length > 1) {
      ciudad = parts[1];
    }
    if (!departamento && parts.length > 2) {
      departamento = parts[2];
    }

    const [lng, lat] = feature.center || [];

    setInputValue(direccion);
    onChange({
      direccion,
      ciudad,
      departamento,
      lng,
      lat
    });
    
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="direccion-auto" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          type="text"
          id="direccion-auto"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Empieza a escribir tu dirección..."
          required
        />
        {isLoading && (
          <div className="absolute right-3 top-9 text-gray-400">
            Buscando...
          </div>
        )}
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-900">
                  {suggestion.text}
                </div>
                <div className="text-xs text-gray-500">
                  {suggestion.place_name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="ciudad-auto" className="block text-sm font-medium text-gray-700 mb-1">
          Ciudad
        </label>
        <input
          type="text"
          id="ciudad-auto"
          value={address.ciudad}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          placeholder="Se completará automáticamente"
        />
      </div>

      <div>
        <label htmlFor="departamento-auto" className="block text-sm font-medium text-gray-700 mb-1">
          Departamento
        </label>
        <input
          type="text"
          id="departamento-auto"
          value={address.departamento}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          placeholder="Se completará automáticamente"
        />
      </div>

      {address.lat && address.lng && (
        <div className="text-xs text-gray-500 mt-2">
          Coordenadas: {address.lat.toFixed(6)}, {address.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
