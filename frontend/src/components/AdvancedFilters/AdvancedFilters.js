import React, { useState } from 'react';
import './AdvancedFilters.css';

function AdvancedFilters({ filters, onFilterChange, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="advanced-filters">
      <button
        className="advanced-filters__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span>🔍 Filtres avancés</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={isExpanded ? 'rotated' : ''}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isExpanded && (
        <div className="advanced-filters__panel">
          <div className="advanced-filters__grid">
            <div className="advanced-filters__group">
              <label htmlFor="filter-type">Type de logement</label>
              <select
                id="filter-type"
                value={filters.type || ''}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="chambre">Chambre</option>
                <option value="studio">Studio</option>
                <option value="appartement">Appartement</option>
                <option value="colocation">Colocation</option>
              </select>
            </div>

            <div className="advanced-filters__group">
              <label htmlFor="filter-zone">Zone / Quartier</label>
              <input
                id="filter-zone"
                type="text"
                placeholder="Ex: Universiapolis, Founty..."
                value={filters.zone || ''}
                onChange={(e) => handleChange('zone', e.target.value)}
              />
            </div>

            <div className="advanced-filters__group">
              <label htmlFor="filter-prix-min">Prix minimum (MAD)</label>
              <input
                id="filter-prix-min"
                type="number"
                placeholder="Min"
                value={filters.prixMin || ''}
                onChange={(e) => handleChange('prixMin', e.target.value)}
                min="0"
              />
            </div>

            <div className="advanced-filters__group">
              <label htmlFor="filter-prix-max">Prix maximum (MAD)</label>
              <input
                id="filter-prix-max"
                type="number"
                placeholder="Max"
                value={filters.prixMax || ''}
                onChange={(e) => handleChange('prixMax', e.target.value)}
                min="0"
              />
            </div>

            <div className="advanced-filters__group">
              <label htmlFor="filter-surface-min">Surface minimum (m²)</label>
              <input
                id="filter-surface-min"
                type="number"
                placeholder="Min"
                value={filters.surfaceMin || ''}
                onChange={(e) => handleChange('surfaceMin', e.target.value)}
                min="0"
              />
            </div>

            <div className="advanced-filters__group">
              <label htmlFor="filter-nb-chambres">Nombre de chambres</label>
              <select
                id="filter-nb-chambres"
                value={filters.nbChambres || ''}
                onChange={(e) => handleChange('nbChambres', e.target.value)}
              >
                <option value="">Tous</option>
                <option value="1">1 chambre</option>
                <option value="2">2 chambres</option>
                <option value="3">3 chambres</option>
                <option value="4+">4+ chambres</option>
              </select>
            </div>

            <div className="advanced-filters__group">
              <label htmlFor="filter-meuble">Meublé</label>
              <select
                id="filter-meuble"
                value={filters.meuble || ''}
                onChange={(e) => handleChange('meuble', e.target.value)}
              >
                <option value="">Tous</option>
                <option value="true">Meublé</option>
                <option value="false">Non meublé</option>
              </select>
            </div>

            <div className="advanced-filters__group">
              <label htmlFor="filter-disponibilite">Disponibilité</label>
              <select
                id="filter-disponibilite"
                value={filters.disponibilite || ''}
                onChange={(e) => handleChange('disponibilite', e.target.value)}
              >
                <option value="">Toutes</option>
                <option value="immediate">Immédiate</option>
                <option value="1mois">Dans 1 mois</option>
                <option value="2mois">Dans 2 mois</option>
              </select>
            </div>
          </div>

          <div className="advanced-filters__actions">
            <button
              type="button"
              className="advanced-filters__reset"
              onClick={onReset}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;



