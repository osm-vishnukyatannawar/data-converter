# Introduction

This script will normalize the extractor data.

## Setup

**Use node 10**

```sh
nvm use 10
```
**Install dependencies**

```sh
npm i
```

## Download extractor data

First download the extractor data and drop in the associated folder.

i.e. https://github.com/vishnukyatannawar/data-converter/tree/master/source

> Download the NDJSON format

## Update the mapping JSON

We need to do two sort of mapping for each website.

1. PDP mapping (`pdp-map.js`)
2. Market share mapping (`marketshare-map.js`)

> Note that currently only apartment list mapping is done properly. (Trulia is just a copy of apartment list, so please update it)

**Few key points while mapping**

- Property name should match the source folder name. 
```js
'apartmentlist.com': {}, // Correct
'apartmentlist': {} // Wrong
```
- Additional property source needs to added.
```js
'source': 'Apartment List',
```
- Property name is column name from extractor and value is column name from Athena.
```
'PMC_Name': 'management company',
// PMC_Name --> Extractor column name
// management company --> Athena table column name
```
- Athena column name can be found here
  - PDP - https://console.aws.amazon.com/glue/home?region=us-east-1#table:name=rentpath_pdp;namespace=rentpath_collector
  - Marketsharing - https://console.aws.amazon.com/glue/home?region=us-east-1#table:name=rentpath_marketshare;namespace=rentpath_collector
- Be very carefull while updating the mapping file.

## Run the script

**Before running**
- Make sure that there is no dummy/sample json file in source directory.
- Corss check that mappings object is fine.

**Normalize PDP**
```sh
node pdp-converter.js
```

**Normalize Marketsharing**
```sh
node marketshare-map.js
```



  


