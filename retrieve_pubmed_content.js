'use strict';

// BioC
const getDataByID = function (PMID) {
    const url = `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/${PMID}/unicode`;
    fetch(url).then((response) => { return response.json(); })
        .then((data) => {
            console.log(data);
            console.log(data.documents[0].passages[2].text); //TO DO: get abstract
        })
};
// getDataByID('17299597');


// E search
const getIDByKeywords = function (db_name, keywords, num_records, return_format) {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=${db_name}&term=${keywords}&retmax=${num_records}&retmode=${return_format}`;
    fetch(url).then((response) => { return response.json(); })
        .then((data) => {
            console.log(data);
            console.log(data.esearchresult.idlist);
        })
};
// getIDByKeywords('pubmed', 'asthma+elder+covid', 20, 'JSON');

// E summary
const getSummaryByID = function (db_name, PMID, return_format) {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=${db_name}&id=${PMID}&retmode=${return_format}`;
    fetch(url).then((response) => { return response.json(); })
        .then((data) => {
            console.log(data);
            console.log(data.result);
        })
};
getSummaryByID('pubmed', '36459955', 'JSON'); //TO DO: can be a list of UID
