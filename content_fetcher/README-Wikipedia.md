# Wikipedia Data Fetcher

This module allows you to fetch and display top search results from Wikipedia based on given keywords and the number of records.

## Setup

1. Ensure you have Node.js installed on your machine.
2. Navigate to the project directory and install the required dependencies:

```bash
npm install
```

## Usage

### Fetching Data

Use the `fetchWikipediaData` function from the `wikipedia.js`:

```javascript
const { fetchWikipediaData } = require('./wikipedia.js');

async function displayData() {
    const results = await fetchWikipediaData('quantum physics', 5);
    console.log(results);
}

displayData();
```

### Parameters
1. keywords: The search keywords you want to use for fetching Wikipedia data.
2. num_records: The number of top search results you want to retrieve.

### Return Value
#### The function returns an array of objects, each having:

1. title: The title of the Wikipedia page.
2. content: A brief extract from the Wikipedia page.

## Testing

#### The module is equipped with tests written using jest. To run the tests:
```bash
npm test
```

## Conclusion
This module provides an easy and efficient way to fetch top search results from Wikipedia. Whether integrating it into a frontend application or using it for data analysis, it offers flexibility and ease of use.