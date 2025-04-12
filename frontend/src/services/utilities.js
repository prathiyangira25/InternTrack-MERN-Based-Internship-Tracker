// Format date for display (YYYY-MM-DD to DD/MM/YYYY)
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString();
  };
  
  // Format currency (number to ₹X,XXX format)
  export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate duration between two dates in days
  export const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Return 0 if dates are invalid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(end - start);
    
    // Convert to days and round up
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Generate academic year based on current date
  export const getCurrentAcademicYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // If month is June or later, academic year is current year to next year
    // Otherwise, it's previous year to current year
    if (month >= 5) { // June (0-indexed months)
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };
  
  // Extract batch year from registration number (assuming first 4 digits are year)
  export const getBatchFromRegNo = (regNo) => {
    if (!regNo || regNo.length < 4) return null;
    
    const yearStart = regNo.substring(0, 4);
    // Assuming 4-year course
    const yearEnd = String(Number(yearStart) + 4).substring(2);
    
    return `${yearStart}-${yearEnd}`;
  };
  
  // Truncate text with ellipsis if it exceeds maxLength
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength - 3) + '...';
  };
  
  // Check if a value is empty (null, undefined, empty string, or empty array)
  export const isEmpty = (value) => {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  };
  
  // Download data as CSV file
  export const downloadCSV = (data, filename = 'download.csv') => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('No data to download');
      return;
    }
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content with headers
    let csvContent = headers.join(',') + '\n';
    
    // Add rows
    data.forEach(item => {
      const row = headers.map(header => {
        // Handle values with commas by wrapping in quotes
        const value = item[header] !== null && item[header] !== undefined ? item[header] : '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };