import OpenAI, {type ClientOptions} from "openai";
import {env} from "~/env";

/**
 * Helper function for creating an OpenAI client
 */
function createClient(): OpenAI {
  const options: ClientOptions = {apiKey: env.OPENAI_KEY}
  return new OpenAI(options);
}

const client = createClient();

export default client;