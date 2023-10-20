<<<<<<< HEAD
# Source Content API Integration Platform - Chen

This branch works on the third-party source content API (such as PubMed for Iteration-1) integration platform.

### Instructions

**Provide keywords to retrieve an array of PubMed contents**

* call function `getContentByKeywords()`, it takes two arguments: `keywords` and `max_records`
* `keywords` should be chained together using '+' operator, e.g:`"wellness+covid+elder"`
* `max_records` is recommended to be kept at around 5~50, it will return less number of records if there exists less contents to be matched

  ```javascript
  // example
  getContentByKeywords("dementia+elder", 20).then(res => console.log(res));
  ```
=======
# 2023_COMS4156

advanced software engineering course project - FA2023

Overall description of the project @dev-chen
>>>>>>> 334382b00bb8462ac5526304ffd319efd917c9ac
