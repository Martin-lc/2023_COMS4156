document.getElementById('queryForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  document.getElementById('loading').style.display = 'block';

  const query = document.getElementById('query').value;
  const userPreference = document.getElementById('userPreference').value;
  const record_num = document.getElementById('record_num').value;

  const requestData = {
    query: query,
    userPreference: userPreference,
    record_num: parseInt(record_num)
  };

  try {
    const response = await fetch('http://localhost:3000/demo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      const data = await response.json();
      displayResults(data);
    } else {
      const errorText = await response.text();
      throw new Error(`Server responded with an error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error:', error);
    displayResults({ error: error.message });
  }
  document.getElementById('loading').style.display = 'none';
});

function displayResults(data) {
  const resultsElement = document.getElementById('results');
  if (data.error) {
      resultsElement.innerText = `Error: ${data.error}`;
  } else {
      resultsElement.innerHTML = `
          <strong>Keywords:</strong> ${data.keywords}<br>
          <strong>Pubmed Content:</strong> <pre>${formatContent(data.pubmedContent)}</pre><br>
          <strong>Wiki Content:</strong> <pre>${formatContent(data.wikiContent)}</pre><br>
          <strong>Top Content:</strong> ${data.topContent}`;
  }
}

function formatContent(contentArray) {
  return contentArray.map(content => JSON.stringify(content, null, 2)).join('\n');
}
