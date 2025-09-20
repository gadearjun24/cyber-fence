import React from "react";

const FilterBar = ({ filters, setFilters, setLoading }) => {
  return (
    <div className="filter-bar">
      <select
        value={filters.prediction}
        onChange={(e) => setFilters({ ...filters, prediction: e.target.value })}
      >
        <option value="">All Results</option>
        <option value="Safe">Safe</option>
        <option value="Suspicious">Suspicious</option>
        <option value="Phishing">Phishing</option>
      </select>
    </div>
  );
};

export default FilterBar;
