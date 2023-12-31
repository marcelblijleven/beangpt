import {type BCData, type Bean} from "beanconqueror";
import {type Message} from "ai";

/**
 * Uses the data inside the provided BCData to generate an initial set of messages to
 * instruct OpenAI with.
 *
 * @param data {BCData} contents of a Beanconqueror zip file
 */
export function buildPrompt(data: BCData): Message[] {
  const messages: Message[] = [];
  const initial = `
    You're an assistant keeping track of my coffee bean purchases.
    The purchases are provided in rows. Each row of data will start with "Coffee:", followed by "Bean information:". 
    Coffee values are semi colon separated and in this order: name, rating, weight, cost
    Bean information values are in this order: country, variety, processing, region, farm, farmer, elevation.
    A blend will have multiple bean information separated by |.
    Missing data is marked as null and should be ignored when calculating averages.
  `;

  messages.push({role: "system", content: initial, id: "instruct"});
  messages.push({role: "system", content: data.BEANS.map(bean => beanToDelimitedString(bean)).join("\n"), id: "coffees"})

  return messages;
}

/**
 * Helper function to get either the value that belongs to the provided key,
 * or the default text "null".
 * @param data
 * @param key
 */
function getPropertyOrUnknown<T extends Record<string, string | null>>(data: T, key: keyof T): string {
  return data[key] ?? "null";
}

/**
 * Converts bean information to an array of string
 * @param data
 */
function beanInformationToValues(data: Bean["bean_information"]): string {
  const mapped = data.map(info => {
    if (!info) return "";
    const values: string[] = [];
    const getter = (key: string) => getPropertyOrUnknown<typeof info>(info, key);

    values.push(getter( "country"));
    values.push(getter( "variety"));
    values.push(getter( "processing"));
    values.push(getter( "region"));
    values.push(getter( "farm"));
    values.push(getter( "farmer"));
    values.push(getter( "elevation"));
    return values.join(";")
  });

  return mapped.join("|");
}

function beanToDelimitedString(bean: Bean): string {
  const notSet = "null";
  const values: string[] = [];
  values.push(bean.name ?? notSet);
  // values.push(bean.buyDate?.split("T")[0] ?? notSet);
  // values.push(bean.roastingDate?.split("T")[0] ?? notSet);
  values.push(bean.rating.toString() ?? notSet);
  values.push(bean.weight.toString() ?? notSet);
  values.push(bean.cost.toString() ?? notSet);

  values.push(beanInformationToValues(bean.bean_information))
  let value = `Coffee: ${values.join(";")} Bean information: ${beanInformationToValues(bean.bean_information)}`
  // Remove emoji
  value = value.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  return value;
}