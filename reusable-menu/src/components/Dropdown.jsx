import { useState, useEffect, useRef } from 'react';

const Dropdown = ({
  options = [],
  isMultiSelect = false,
  selectedOptions = [],
  onChange,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAggregationOpen, setIsAggregationOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

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

  const removeSelectedOption = (optionToRemove) => {
    onChange(selectedOptions.filter(option => option !== optionToRemove));
  };

  const selectAll = () => onChange([...options]);
  const deselectAll = () => onChange([]);

  const selectEven = () => onChange(options.filter((_, idx) => idx % 2 === 1));
  const selectOdd = () => onChange(options.filter((_, idx) => idx % 2 === 0));

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
};

export default Dropdown;
