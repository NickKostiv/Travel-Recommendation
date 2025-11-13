const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const resultsDiv = document.getElementById('results');

function searchDestinations() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  resultsDiv.innerHTML = '';

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      const filtered = data.destinations.filter(dest => 
        dest.type.some(t => t.toLowerCase() === keyword) || 
        dest.country.toLowerCase() === keyword
      );

      if (filtered.length > 0) {
        filtered.forEach(dest => {
          resultsDiv.innerHTML += `
            <div class="destination">
              <h3>${dest.name}</h3>
              <p><strong>Country:</strong> ${dest.country}</p>
              <p>${dest.description}</p>
              <img src="${dest.image}" alt="${dest.name}" style="max-width:300px;">
            </div>
          `;
        });
      } else {
        resultsDiv.innerHTML = 'No results found.';
      }
    })
    .catch(err => {
      console.error(err);
      resultsDiv.innerHTML = 'Error fetching data.';
    });
}

function clearResults() {
  resultsDiv.innerHTML = '';
  document.getElementById('searchInput').value = '';
}

btnSearch.addEventListener('click', searchDestinations);
btnClear.addEventListener('click', clearResults);
