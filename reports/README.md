# Continuous Integration

the links for CI reports generated automatically from github actions are provided in the `CI/link.txt`.

# Coverage

the coverage folder contains reports for branch coverage tests ouputed by jest, to generate the report, run `npx jest --coverage`.

# ESLint

the ESLint folder contains reports for both style checking and static analysis bug finding for all javascript files outputed by ESLint, to generate the report, run

```
npx eslint .js c/.js t/*.js --format html --output-file reports/ESLint/eslint-report.html
```
