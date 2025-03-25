import { useState, useEffect, useRef } from 'react';

// Dropdown Component
const Dropdown = ({
  options = [],
  isMultiSelect = false,
  selectedOptions = [],
  onChange,
  placeholder = "Select...",
}) => {
  // #region State and References

  const [isOpen, setIsOpen] = useState(false);                  // Tracks if dropdown is open or closed
  const [isAggregationOpen, setIsAggregationOpen] = useState(false);  // Tracks if aggregation submenu is open
  const dropdownRef = useRef(null);                             // Reference to detect clicks outside the dropdown

  // #endregion

  // #region Dropdown Visibility Management

  const toggleDropdown = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const clickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsAggregationOpen(false);
      }
    };

    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  // #endregion

  // #region Option Handling Functions

  // Handles option selection logic based on single/multi-select
  const handleOptionClick = (option) => {
    if (isMultiSelect) {
      onChange(
        selectedOptions.includes(option)
          ? selectedOptions.filter(item => item !== option)
          : [...selectedOptions, option]
      );
    } else {
      onChange(selectedOptions[0] === option ? [] : [option]);
      setIsOpen(false);
    }
  };

  // Removes a selected option (multi-select mode)
  const removeSelectedOption = (optionToRemove) => {
    onChange(selectedOptions.filter(option => option !== optionToRemove));
  };

  // Selects all options
  const selectAll = () => onChange([...options]);

  // Deselects all options
  const deselectAll = () => onChange([]);

  // Selects even-indexed options
  const selectEven = () => onChange(options.filter((_, idx) => idx % 2 === 1));

  // Selects odd-indexed options
  const selectOdd = () => onChange(options.filter((_, idx) => idx % 2 === 0));

  // Selects options at Fibonacci positions
  const selectFibonacci = () => {
    const isPerfectSquare = (n) => {
      const sqrt = Math.sqrt(n);
      return sqrt === Math.floor(sqrt);
    };

    const isFibonacci = (num) => {
      return (
        isPerfectSquare(5 * num * num + 4) ||
        isPerfectSquare(5 * num * num - 4)
      );
    };

    onChange(options.filter((_, idx) => isFibonacci(idx + 1)));
  };

  // #endregion

  // #region Render Selected Options Display

  const renderSelectedOptions = () => {
    if (!selectedOptions.length) return placeholder;

    if (isMultiSelect) {
      return (
        <div className="selected-options">
          {selectedOptions.map(option => (
            <span className="selected-card" key={option}>
              {option}
              <button className="remove-btn" onClick={(e) => {
                e.stopPropagation();
                removeSelectedOption(option);
              }}>
                ✕
              </button>
            </span>
          ))}
        </div>
      );
    }

    return selectedOptions[0];
  };

  // #endregion

  // #region Component Rendering

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={toggleDropdown}>
        {renderSelectedOptions()}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
        {isMultiSelect && (
          <>
            <div className="dropdown-actions">
              <button className="action-btn" onClick={selectAll}>Select All</button>
              <button className="action-btn" onClick={deselectAll}>Deselect All</button>
              <button className="action-btn" onClick={() => setIsAggregationOpen(prev => !prev)}>
                Filters {isAggregationOpen ? "▲" : "▼"}
              </button>
            </div>

            {isAggregationOpen && (
              <div className="aggregation-menu">
                <button className="action-btn" onClick={selectEven}>Select All Even</button>
                <button className="action-btn" onClick={selectOdd}>Select All Odd</button>
                <button className="action-btn" onClick={selectFibonacci}>Select Fibonacci</button>
              </div>
            )}
          </>
        )}

        {options.map(option => (
          <div
            key={option}
            className={`dropdown-item ${selectedOptions.includes(option) ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            {isMultiSelect && (
              <span className="checkbox">
                {selectedOptions.includes(option) ? '✓' : ''}
              </span>
            )}
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // #endregion
};

export default Dropdown;
