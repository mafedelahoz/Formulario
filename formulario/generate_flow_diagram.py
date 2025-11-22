#!/usr/bin/env python3
import matplotlib
matplotlib.use('Agg')  # Backend sin GUI para servidores
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

# Configuración del lienzo
fig, ax = plt.subplots(figsize=(14, 22))
ax.set_xlim(0, 10)
ax.set_ylim(0, 26)
ax.axis('off')

# Paleta de colores
COLOR_FASE1 = '#E3F2FD'
COLOR_FASE2 = '#FFF3E0'
COLOR_FASE3 = '#E8F5E9'
COLOR_USUARIO = '#F3E5F5'
COLOR_DB = '#FFE0B2'

# Funciones auxiliares
def caja(x, y, w, h, text, color, fs=9, fw='normal'):
    """Crear una caja con texto"""
    box = FancyBboxPatch((x, y), w, h,
                         boxstyle="round,pad=0.08",
                         facecolor=color,
                         edgecolor='#424242',
                         linewidth=2)
    ax.add_patch(box)
    ax.text(x + w/2, y + h/2, text,
            ha='center', va='center',
            fontsize=fs, fontweight=fw,
            linespacing=1.3)

def flecha(x1, y1, x2, y2, txt=''):
    """Crear flecha con etiqueta opcional"""
    arr = FancyArrowPatch((x1, y1), (x2, y2),
                         arrowstyle='->', 
                         mutation_scale=25,
                         linewidth=2.5,
                         color='#424242',
                         zorder=1)
    ax.add_patch(arr)
    if txt:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx + 0.2, my, txt,
                fontsize=8, 
                bbox=dict(boxstyle='round,pad=0.25', 
                         facecolor='white', 
                         edgecolor='gray',
                         alpha=0.9),
                ha='center')

# ========== TÍTULO ==========
ax.text(5, 25, 'FLUJO DE DATOS DEL SISTEMA',
        ha='center', fontsize=20, fontweight='bold')

# ========== FASE 1: A/B TESTING ==========
ax.text(5, 23.2, 'FASE 1: A/B TESTING Y CAPTURA DE DATOS',
        ha='center', fontsize=12, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.4', 
                 facecolor=COLOR_FASE1, 
                 edgecolor='#1976D2', 
                 linewidth=2))

caja(0.5, 21, 1.5, 0.8, 'USUARIO\nLlega al sitio', COLOR_USUARIO, 9, 'bold')
caja(3, 21, 1.6, 0.8, 'Asignación\nA/B Test\n50/50', COLOR_FASE1, 8)

caja(0.5, 19, 1.8, 1, 'VARIANTE A\nManual\n\n• Dirección\n• Ciudad\n• Depto', '#FFCDD2', 8)
caja(3.2, 19, 1.8, 1, 'VARIANTE B\nMapbox\n\n• Autocomplete\n• Coordenadas', '#C5E1A5', 8)

caja(6, 20, 3, 1.2, 'FORMULARIO\n\nNombre, WhatsApp,\nNegocio, Especialidad\n+ Dirección (A o B)', COLOR_FASE1, 8, 'bold')

caja(6.5, 18, 2, 0.7, 'SUBMIT', '#1976D2', 10, 'bold')

# Flechas Fase 1
flecha(2, 21.4, 3, 21.4)
flecha(3.8, 21, 1.4, 20)
flecha(4.4, 21, 3.2, 20)
flecha(2.3, 19.5, 6, 20.3)
flecha(5, 19.5, 6, 20.5)
flecha(7.5, 20, 7.5, 18.7, 'Click')

# ========== ESPACIO ==========

# ========== FASE 2: ENRIQUECIMIENTO ==========
ax.text(5, 16.5, 'FASE 2: ENRIQUECIMIENTO AUTOMÁTICO',
        ha='center', fontsize=12, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.4', 
                 facecolor=COLOR_FASE2, 
                 edgecolor='#F57C00', 
                 linewidth=2))

caja(3.5, 14.5, 3, 0.8, 'POST /api/leads\nRecibe datos', '#90CAF9', 9, 'bold')
flecha(7.5, 18, 7.5, 15.3, 'HTTP')

caja(0.8, 12.5, 2.2, 1.1, 'Enriquecimiento\n\nCalcular ticket\nsegún especialidad', COLOR_FASE2, 8, 'bold')

caja(0.8, 10.8, 2.2, 1, 'Odont/Estét:\n$800,000\n\nVet/Med:\n$200,000', '#FFF9C4', 7)

caja(4.5, 12.5, 2.2, 1.1, 'Segmentación\n\nAsignar nivel\nde cliente', COLOR_FASE2, 8, 'bold')

caja(4.5, 10.8, 2.2, 1, '>= $500k:\nHIGH_TICKET\n\n< $500k:\nLOW_TICKET', '#FFF9C4', 7)

caja(8, 12, 1.6, 1.2, 'Preparar\nINSERT\nSQL', COLOR_FASE2, 8)

# Flechas Fase 2
flecha(5, 14.5, 2, 13.6, 'Especialidad')
flecha(5, 14.5, 5.6, 13.6, 'Ticket')
flecha(3, 13, 4.5, 13)
flecha(2, 11.8, 4.5, 11.8)
flecha(6.7, 13, 8, 12.6)

# ========== ESPACIO ==========

# ========== BASE DE DATOS ==========
ax.text(5, 9.2, 'BASE DE DATOS POSTGRESQL',
        ha='center', fontsize=12, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.4', 
                 facecolor=COLOR_DB, 
                 edgecolor='#F57F17', 
                 linewidth=2))

caja(2, 7, 6, 1.4, 'TABLA: leads\n\nCampos: nombre, whatsapp, negocio, especialidad,\nvariant_shown, address_json,\nticket_promedio, segmento, created_at', COLOR_DB, 8, 'bold')

flecha(8.8, 12, 7.5, 8.4, 'INSERT')

caja(0.8, 5, 3, 0.8, 'Registro guardado\nID + timestamp', '#A5D6A7', 8)
flecha(5, 7, 2.5, 5.8, 'RETURN')

# ========== ESPACIO ==========

# ========== FASE 3: ANÁLISIS ==========
ax.text(5, 3.8, 'FASE 3: ANÁLISIS Y VISUALIZACIÓN',
        ha='center', fontsize=12, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.4', 
                 facecolor=COLOR_FASE3, 
                 edgecolor='#388E3C', 
                 linewidth=2))

caja(0.5, 1.8, 2, 0.9, 'Dashboard\n/dashboard\nTiempo real', COLOR_FASE3, 8, 'bold')
caja(3, 1.8, 2, 0.9, 'API Stats\nGET /api/leads\n?action=stats', COLOR_FASE3, 8, 'bold')
caja(5.5, 1.8, 1.8, 0.9, 'Análisis\nPython\nGráficas', COLOR_FASE3, 8, 'bold')
caja(7.8, 1.8, 1.7, 0.9, 'Export\nCSV/JSON', COLOR_FASE3, 8, 'bold')

# Flechas Fase 3
flecha(1.5, 5, 1.5, 2.7)
flecha(4, 5, 4, 2.7)
flecha(6.5, 7, 6.5, 2.7)
flecha(7.5, 7, 8.7, 2.7)

# ========== LEYENDA ==========
legend_elements = [
    mpatches.Patch(facecolor=COLOR_FASE1, edgecolor='#1976D2', 
                  label='Fase 1: A/B Testing'),
    mpatches.Patch(facecolor=COLOR_FASE2, edgecolor='#F57C00', 
                  label='Fase 2: Enriquecimiento'),
    mpatches.Patch(facecolor=COLOR_FASE3, edgecolor='#388E3C', 
                  label='Fase 3: Análisis'),
    mpatches.Patch(facecolor=COLOR_DB, edgecolor='#F57F17', 
                  label='Base de Datos'),
]

ax.legend(handles=legend_elements, 
         loc='lower right', 
         fontsize=9, 
         frameon=True, 
         shadow=True,
         fancybox=True)

# Guardar archivos
plt.tight_layout(pad=1.0)
plt.savefig('diagrama_flujo_datos.png', dpi=300, bbox_inches='tight', facecolor='white')
plt.savefig('diagrama_flujo_datos.pdf', dpi=300, bbox_inches='tight', facecolor='white')

print("✅ Diagrama generado exitosamente:")
print("   - diagrama_flujo_datos.png")
print("   - diagrama_flujo_datos.pdf")
print("\n✨ Mejoras implementadas:")
print("   ✓ Espaciado mejorado entre fases")
print("   ✓ Sin superposición de texto")
print("   ✓ Conexiones claras entre componentes")
print("   ✓ Organización visual por fases")
print("   ✓ Leyenda incluida")
