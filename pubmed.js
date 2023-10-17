'use strict';

/**
 * Use Esearch to retrieve PubMed Article IDs (PMID) based on a list of keywords.
 *
 * @param {string} keywords - The keywords to search for in PubMed articles, seperated by '+'
 * @param {number} num_records - The maximum number of PubMed article IDs to retrieve.
 * @returns {Promise<Array>} A Promise that resolves with an array of PubMed Article IDs (PMID)
 * representing relevant articles based on the provided keywords.
 * @throws {Error} Throws an error if there is a problem with the fetch operation or parsing the XML response.
 *
 * @example
 * getIDByKeywords('dementia+cannabis', 20)
 *   .then(pmidArray => {
 *     console.log('PubMed Article IDs:', pmidArray);
 *   });
 * @todo <Iteration 1>: Unit testing.
 * @todo <Iteration 1>: error throwing.
 * @todo <Iteration 2>: Add proximity features to enhance search functionality.
 */
const getIDByKeywords = function (keywords, max_records) {
    const base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?";
    const term = keywords;
    const retmax = max_records;
    const database = 'pubmed';
    const return_format = 'xml';
    const url = base_url + `term=${term}` + "&" + `retmax=${retmax}` + "&" + `db=${database}` + "&" + `retmode=${return_format}`;

    // Using the fetch API to make a GET request from PubMed
    return fetch(url)
        .then((response) => response.text())
        .then((xmlStr) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
            const IdNodes = xmlDoc.getElementsByTagName("IdList")[0].querySelectorAll('Id');
            const IdArray = [];

            //iteratively retrieve the article IDs based on tagName 'Id' in 'IdList'
            for (let i = 0; i < IdNodes.length; i++) {
                IdArray.push(IdNodes[i].childNodes[0].nodeValue);
            }
            return IdArray;
        });
};


/**
 * Retrieves the abstract of PubMed articles based on their PubMed Article IDs (PMID).
 *
 * @param {string|Array<string>} PMID - A single PubMed Article ID (PMID) to retrieve abstract for.
 * @returns {Promise<Array>} A Promise that resolves with an array containing the abstract of the specified PubMed article.
 * @throws {Error} Throws an error if there is a problem with the fetch operation or parsing the XML response.
 *
 * @example
 * getAbstractByID('37391735')
 *   .then(abstractArray => {
 *     console.log('Abstract:', abstractArray);
 *   });
 * @todo <Iteration 1>: Unit testing.
 * @todo <Iteration 1>: error throwing.
 * @todo <Iteration 2>: optimization for better content retrieval.
 */
const getAbstractByID = function (PMID) {
    const base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?";
    const id = PMID;
    const rettype = 'abstract';
    const database = 'pubmed';
    const return_format = 'xml';
    const url = base_url + `id=${id}` + "&" + `db=${database}` + "&" + `retmode=${return_format}` + "&" + `rettype=${rettype}`;

    // Using the fetch API to make a GET request from PubMed
    return fetch(url)
        .then((response) => response.text())
        .then((xmlStr) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
            const abstractNodes = xmlDoc.querySelectorAll("AbstractText");
            const abstractArray = [];

            // Iteratively retrieve the abstract paragraphs marked with tagName 'AbstractText'
            for (let i = 0; i < abstractNodes.length; i++) {
                abstractArray.push(abstractNodes[i].childNodes[0].nodeValue);
            }
            return abstractArray;
        });
};


/**
 * Fetches abstracts of PubMed articles based on specified keywords and maximum number of records.
 *
 * @param {string} keywords - The keywords to search for in PubMed articles.
 * @param {number} max_records - The maximum number of PubMed article IDs to retrieve and fetch abstracts for.
 * @returns {Promise<Array<string>>} A Promise that resolves with an array containing abstracts of relevant PubMed articles.
 * @throws {Error} Throws an error if there is a problem with the fetch operation or parsing the XML response.
 *
 * @example
 * getContentByKeywords("dementia+elder", 20)
 *   .then(resArray => {
 *     console.log('Fetched Abstracts:', resArray);
 *   })
 * @todo <Iteration 1>: Unit testing.
 * @todo <Iteration 1>: error throwing.
 */
const getContentByKeywords = async function (keywords, max_records) {
    const IdList = await getIDByKeywords(keywords, max_records);
    const resArray = [];

    // fetch abstracts sequentially with a delay
    async function fetchAbstracts() {
        for (let i = 0; i < IdList.length; i++) {
            // Wait for each abstract to be fetched with a delay of 0.45 seconds, 0.45 seconds seem to be the minimum to avoid failures
            await new Promise(resolve => setTimeout(resolve, 450));
            console.log("fetching abstracts for PMID: " + IdList[i])
            const content = await getAbstractByID(IdList[i]);
            resArray.push(content);
        }
    }
    await fetchAbstracts();
    return resArray;
};