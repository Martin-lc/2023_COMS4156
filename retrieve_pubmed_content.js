'use strict';

const getPubmedData = function (keyword) {
    const url = `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/${keyword}/unicode`;
    fetch(url).then((response) => { return response.json(); })
        .then((data) => {
            console.log(data);
            console.log(typeof (data));
            console.log(typeof (data.documents[0].passages));
            console.log(data.documents[0].passages[2].text);
        })
};
getPubmedData('17299597');