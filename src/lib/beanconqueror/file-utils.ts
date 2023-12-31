import {BlobReader, type Entry, TextWriter, ZipReader} from "@zip.js/zip.js";

import {type BCData, type Bean, type Brew} from "beanconqueror";

const BEANCONQUEROR_BASE = "Beanconqueror.json";
const BEANCONQUEROR_BEANS_RE = /^Beanconqueror_Beans_\d+.json$/;
const BEANCONQUEROR_BREWS_RE = /^Beanconqueror_Brews_\d+.json$/;

/**
 * Read a zip entry into json
 * @param entry
 */
async function readEntryToJSON(entry: Entry): Promise<BCData> {
  const writer: TextWriter = new TextWriter();

  if (typeof entry.getData === "undefined") {
    return {MILL: [], PREPARATION: [], SETTINGS: [], VERSION: [], BEANS: [], BREWS: []};
  }

  const data = await entry.getData(writer);
  return JSON.parse(data) as unknown as BCData;
}

/**
 * Read a zip file into BCData
 * @param file {File} the Beanconqueror zip file
 */
export async function readZipFile(file: File) {
  const blobReader = new BlobReader(file);
  const reader = new ZipReader(blobReader);
  const entries: Entry[] = await reader.getEntries();

  if (!entries.length) {
    throw new Error("Empty zip file uploaded");
  }

  const baseEntry = entries.find(entry => entry.filename === BEANCONQUEROR_BASE);

  if (!baseEntry) {
    throw new Error("Invalid zip file uploaded");
  }

  const baseData = await readEntryToJSON(baseEntry);
  const additionalBeans = [];
  const additionalBrews = [];

  for (const entry of entries) {
    if (entry.filename.includes("MACOS")) continue;
    const data = await readEntryToJSON(entry);

    if (!!entry.filename.match(BEANCONQUEROR_BEANS_RE)) {
      additionalBeans.push(...(data as unknown) as Bean[]);
      continue;
    }

    if (!!entry.filename.match(BEANCONQUEROR_BREWS_RE)) {
      additionalBrews.push(...(data as unknown) as Brew[]);
    }
  }

  baseData.BEANS = baseData.BEANS.concat(additionalBeans);
  baseData.BREWS = baseData.BREWS.concat(additionalBrews);

  await reader.close();

  return baseData;
}
