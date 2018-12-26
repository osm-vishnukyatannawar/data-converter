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

> Note that destination folder should have the normalized data.

## Data Verification

### PDP

1. Create a dummy folder here with a valid date value

https://s3.console.aws.amazon.com/s3/buckets/rentpath-results-prod/rentpath-pdp-collector-results/?region=us-east-1&tab=overview

Example
```sh
date=2030_12_12
```

2. Upload one file of each website. (Since this is just a test)

3. Go to Athena and run the following query (https://console.aws.amazon.com/athena/home?region=us-east-1#query/history/685eed0d-63e5-4b10-ac6a-1c3c869c58a4)
```sql
MSCK REPAIR TABLE rentpath_pdp;
```
> This is load the newly added partition

4. Run the query to list all Distinct source
```sql
SELECT DISTINCT source FROM rentpath_pdp Where rentpath_pdp.date = '2030_12_12';
```
> Make sure to update the date as per your folder creation in step 1

If you see all the sources then you are now sure that all Athena linking happened properly.

5. Run the following query for each source to validate all columns mapped properly.
```sql
SELECT * FROM rentpath_pdp Where rentpath_pdp.date = '2030_12_12' and source = 'apartments.com';
```

> You don't have to concat the files before uploading. Simply dump all the files.


**Now you are sure that data mapping happended properly.**

### Market Sharing

1. Go to the following directory

https://s3.console.aws.amazon.com/s3/buckets/rentpath-results-prod/rentpath-marketshare-collector-results/?region=us-east-1&tab=overview

2. Go to a specific source

https://s3.console.aws.amazon.com/s3/buckets/rentpath-results-prod/rentpath-marketshare-collector-results/apartmentfinder.com/?region=us-east-1&tab=overview

I picked apartmentfinder.com

3. Upload apartmentfinder marketsharing file here. Delete any previous file if exists.

4. In Athena we have table for each website (https://console.aws.amazon.com/athena/home?region=us-east-1#query/history/05965865-55ab-4e89-8004-29b66f71e5b1)

```sql
SELECT * FROM "rentpath_collector"."rentpath_marketshare_apartmentfinder" limit 10;
```

5. Repeat the above steps for each website.

6. Once you confirm that mapping is done properly then simply upload files into respective folder. (Please delete old files else we will see duplicate records)

## TODO

- Need to update looker to convert few columns to number format. (Check with Vishnu)















  


