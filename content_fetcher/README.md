# Content Fetching Integration

This part of module integrate content fetching third-party APIs.

# Wikipedia Data Fetcher

This module allows you to fetch and display top search results from Wikipedia based on given keywords and the number of records.

## Wikipedia API Usage

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

## PubMed API Usage

### Instructions

**Provide keywords to retrieve an array of PubMed contents**

* call function `getContentByKeywords()`, it takes two arguments: `keywords` and `max_records`
* `keywords` should be chained together using '+' operator, e.g:`"wellness+covid+elder"`
* `max_records` is recommended to be kept at around 5~50, it will return less number of records if there exists less contents to be matched

  ```javascript
  // example
  getContentByKeywords("dementia+elder", 20).then(res => console.log(res));
  ```

## Conclusion

This module provides an easy and efficient way to fetch top search results from Wikipedia. Whether integrating it into a frontend application or using it for data analysis, it offers flexibility and ease of use.

This branch works on the third-party source content API (such as PubMed for Iteration-1) integration platform.
