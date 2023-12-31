import {type BCData} from "beanconqueror";

/**
 * Reads all unique roasters from the provided data
 * @param data {BCData} contents of the Beanconqueror zip file
 */
export function getRoastersFromData(data: BCData) {
  const roasters = new Set<string>();

  for (const record of data.BEANS) {
    roasters.add(record.roaster);
  }

  return roasters.values();
}