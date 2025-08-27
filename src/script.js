// script.js
// Enhanced exchange rates (more currencies added)
const rates = {
  "USD": { "USD": 1, "EUR": 0.92, "GBP": 0.79, "JPY": 147.65, "CAD": 1.36, "AUD": 1.54, "CHF": 0.88, "CNY": 7.18, "INR": 83.00 },
  "EUR": { "USD": 1.09, "EUR": 1, "GBP": 0.86, "JPY": 160.87, "CAD": 1.48, "AUD": 1.67, "CHF": 0.96, "CNY": 7.82, "INR": 90.50 },
  "GBP": { "USD": 1.27, "EUR": 1.16, "GBP": 1, "JPY": 186.56, "CAD": 1.72, "AUD": 1.95, "CHF": 1.12, "CNY": 9.10, "INR": 105.00 },
  "JPY": { "USD": 0.0068, "EUR": 0.0062, "GBP": 0.0054, "JPY": 1, "CAD": 0.0092, "AUD": 0.0104, "CHF": 0.0060, "CNY": 0.049, "INR": 0.56 },
  "CAD": { "USD": 0.74, "EUR": 0.68, "GBP": 0.58, "JPY": 108.70, "CAD": 1, "AUD": 1.13, "CHF": 0.65, "CNY": 5.28, "INR": 61.00 },
  "AUD": { "USD": 0.65, "EUR": 0.60, "GBP": 0.51, "JPY": 96.00, "CAD": 0.88, "AUD": 1, "CHF": 0.57, "CNY": 4.66, "INR": 54.00 },
  "CHF": { "USD": 1.14, "EUR": 1.04, "GBP": 0.89, "JPY": 167.50, "CAD": 1.54, "AUD": 1.75, "CHF": 1, "CNY": 8.15, "INR": 94.50 },
  "CNY": { "USD": 0.14, "EUR": 0.13, "GBP": 0.11, "JPY": 20.45, "CAD": 0.19, "AUD": 0.21, "CHF": 0.12, "CNY": 1, "INR": 11.60 },
  "INR": { "USD": 0.012, "EUR": 0.011, "GBP": 0.0095, "JPY": 1.79, "CAD": 0.016, "AUD": 0.019, "CHF": 0.011, "CNY": 0.086, "INR": 1 }
};

let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

document.addEventListener('DOMContentLoaded', function() {
  // Load history if available
  updateHistory();
  
  // Set up event listeners
  document.getElementById('convert').addEventListener('click', convert);
  document.getElementById('swap').addEventListener('click', swapCurrencies);
  document.getElementById('clear-history').addEventListener('click', clearHistory);
  
  // Allow Enter key to trigger conversion
  document.getElementById('amount').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      convert();
    }
  });
});

function convert() {
  const amountInput = document.getElementById('amount');
  const fromSelect = document.getElementById('from');
  const toSelect = document.getElementById('to');
  const resultSection = document.getElementById('result-section');
  const resultAmount = document.getElementById('result-amount');
  const resultText = document.getElementById('result-text');
  const conversionDate = document.getElementById('conversion-date');
  
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  // Input validation
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than 0");
    amountInput.focus();
    return;
  }

  // Perform conversion
  const result = (amount * rates[from][to]).toFixed(2);
  
  // Format numbers with commas
  const formattedAmount = formatNumber(amount);
  const formattedResult = formatNumber(result);
  
  // Display result
  resultAmount.textContent = `${formattedResult} ${to}`;
  resultText.textContent = `${formattedAmount} ${from} equals`;
  
  // Show conversion date
  const now = new Date();
  conversionDate.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
  
  // Show result section with animation
  resultSection.classList.add('show');
  
  // Add to history
  const historyItem = {
    amount: formattedAmount,
    from,
    to,
    result: formattedResult,
    date: now.toLocaleString()
  };
  
  history.unshift(historyItem);
  if (history.length > 10) history.pop(); // Keep only last 10 conversions
  
  // Save to localStorage
  localStorage.setItem('conversionHistory', JSON.stringify(history));
  
  // Update history display
  updateHistory();
}

function swapCurrencies() {
  const fromSelect = document.getElementById('from');
  const toSelect = document.getElementById('to');
  
  // Swap values
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
}

function updateHistory() {
  const historyBody = document.getElementById('history-body');
  const noHistory = document.getElementById('no-history');
  
  // Clear current history display
  historyBody.innerHTML = '';
  
  if (history.length === 0) {
    noHistory.style.display = 'block';
    return;
  }
  
  noHistory.style.display = 'none';
  
  // Add history items to table
  history.forEach(item => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${item.amount}</td>
      <td>${item.from}</td>
      <td>${item.to}</td>
      <td>${item.result}</td>
      <td>${item.date}</td>
    `;
    
    historyBody.appendChild(row);
  });
}

function clearHistory() {
  if (history.length === 0) return;
  
  if (confirm("Are you sure you want to clear your conversion history?")) {
    history = [];
    localStorage.removeItem('conversionHistory');
    updateHistory();
  }
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-IN', { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 2 
  }).format(num);
}