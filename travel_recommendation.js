// Get DOM elements
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const resultsSection = document.getElementById('resultsSection');

// Timezone mapping for countries
const timezones = {
  'Australia': 'Australia/Sydney',
  'Japan': 'Asia/Tokyo',
  'Brazil': 'America/Sao_Paulo',
  'Cambodia': 'Asia/Phnom_Penh',
  'India': 'Asia/Kolkata',
  'Indonesia': 'Asia/Jakarta',
  'French Polynesia': 'Pacific/Tahiti'
};

// Function to get current time for a timezone
function getCurrentTime(timezone) {
  const options = {
    timeZone: timezone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  try {
    const time = new Date().toLocaleTimeString('en-US', options);
    return time;
  } catch (error) {
    return '';
  }
}

// Function to extract country from location name
function getCountryFromLocation(locationName) {
  const parts = locationName.split(',');
  if (parts.length > 1) {
    return parts[1].trim();
  }
  return null;
}

// Function to search destinations
function searchDestinations() {
  const keyword = searchInput.value.trim().toLowerCase();
  
  if (!keyword) {
    alert('Please enter a search keyword');
    return;
  }

  resultsDiv.innerHTML = '<div style="text-align: center; padding: 20px;">Searching...</div>';
  resultsSection.style.display = 'block';
  
  // Scroll to results section smoothly
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      console.log('Data fetched successfully:', data);
      
      let results = [];
      let searchType = '';

      // Normalize keyword and check for variations
      // Beach variations
      if (keyword === 'beach' || keyword === 'beaches') {
        results = data.beaches || [];
        searchType = 'beaches';
      }
      // Temple variations
      else if (keyword === 'temple' || keyword === 'temples') {
        results = data.temples || [];
        searchType = 'temples';
      }
      // Country variations
      else if (keyword === 'country' || keyword === 'countries') {
        searchType = 'countries';
        // Get all cities from all countries
        if (data.countries) {
          data.countries.forEach(country => {
            if (country.cities) {
              results = results.concat(country.cities);
            }
          });
        }
      }
      // Search for specific country by name
      else {
        searchType = 'specific';
        
        // Search in countries
        if (data.countries) {
          data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(keyword)) {
              if (country.cities) {
                results = results.concat(country.cities);
              }
            }
          });
        }
        
        // Search in beaches
        if (data.beaches) {
          data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(keyword)) {
              results.push(beach);
            }
          });
        }
        
        // Search in temples
        if (data.temples) {
          data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(keyword)) {
              results.push(temple);
            }
          });
        }
      }

      // Display results
      displayResults(results, searchType);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      resultsDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Error loading recommendations. Please try again.</div>';
    });
}

// Function to display results
function displayResults(results, searchType) {
  if (results.length === 0) {
    resultsDiv.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
        <h3 style="color: #666;">No recommendations found</h3>
        <p style="color: #999;">Try searching for "beach", "temple", or "country"</p>
      </div>
    `;
    return;
  }

  resultsDiv.innerHTML = '';
  
  results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // Get timezone if available
    let timeDisplay = '';
    const country = getCountryFromLocation(item.name);
    if (country && timezones[country]) {
      const currentTime = getCurrentTime(timezones[country]);
      if (currentTime) {
        timeDisplay = `
          <div class="result-time">
            <i class="fas fa-clock"></i>
            <span>Local time: ${currentTime}</span>
          </div>
        `;
      }
    }
    
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
      <div class="result-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${timeDisplay}
        <a href="#" class="btn-visit">Visit</a>
      </div>
    `;
    
    resultsDiv.appendChild(card);
  });
}

// Function to clear results
function clearResults() {
  resultsDiv.innerHTML = '';
  searchInput.value = '';
  resultsSection.style.display = 'none';
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event listeners
if (btnSearch) {
  btnSearch.addEventListener('click', searchDestinations);
}

if (btnClear) {
  btnClear.addEventListener('click', clearResults);
}

if (searchInput) {
  // Allow search on Enter key
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchDestinations();
    }
  });
}

// Log when script is loaded
console.log('Travel Recommendation script loaded successfully');
