"use strict";

const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const readline = require('readline');
const mapping = require('./pdp-map');

// Paths
const sourceFolder = './source/';
const destinationFolder = './destination/';

async function start() {

  // Get list of all folders
  let webstiefolders = fs.readdirSync(sourceFolder);
  if (webstiefolders && webstiefolders.length === 0) {
    console.log('There is no source');
    return;
  }
  console.log(`Source folders: \n${webstiefolders.join('\n')}`);

  // Delete everything from destination folder
  rimraf.sync(`${destinationFolder}*`);
  console.log('\nCleared destination folder');

  // Loop over each folder
  for (let i = 0; i < webstiefolders.length; i++) {
    let currDestinationDirectoryPath = path.join(__dirname, destinationFolder, webstiefolders[i]);
    let currSourceDirectoryPath = path.join(__dirname, sourceFolder, webstiefolders[i]);
    if (!fs.existsSync(currDestinationDirectoryPath)) {
      fs.mkdirSync(currDestinationDirectoryPath);
    }
    // Get all file names
    const files = fs.readdirSync(currSourceDirectoryPath);

    if (files && files.length === 0) {
      console.log(`\nThere is no files inside ${webstiefolders[i]}`);
      continue;
    }
    console.log(`\n${webstiefolders[i]} files: \n${files.join('\n')}`);
    for (let j = 0; j < files.length; j++) {
      const currReadFile = path.join(currSourceDirectoryPath, files[j]);
      const currWriteFile = path.join(currDestinationDirectoryPath, files[j]);
      const currMap = mapping[webstiefolders[i]];
      console.log('\nStart');
      console.log(`Normalizing ${files[j]}`);
      await normalization(currWriteFile, currReadFile, currMap);
      console.log('END');
    }
  }
}

async function normalization(currWriteFile, currReadFile, currMap) {
  return new Promise((resolve, reject) => {
    let writeStream = fs.createWriteStream(currWriteFile);
    const rl = readline.createInterface({
      input: fs.createReadStream(currReadFile),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      const extractionData = JSON.parse(line).result.extractorData;
      if (extractionData.hasOwnProperty('data')) {
        const jsonData = extractionData.data[0].group[0];
        let normalizedData = {};
        normalizedData.source = currMap.source;
        for (let prop in jsonData) {
          if (!currMap.hasOwnProperty(prop)) {
            continue;
          }
          normalizedData[currMap[prop]] = jsonData[prop][0].text;
        }
        writeStream.write(`${JSON.stringify(normalizedData)}\n`);
      }
    });

    rl.on('close', () => {
      writeStream.end();
      resolve(true);
    });
  });
}


start();