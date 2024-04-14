/**
 * The function WinstonPrintfForma formats log messages with specific fields into a string.
 * @param  - The function `WinstonPrintfForma` takes in an object with the following properties as
 * parameters:
 * @returns `[tag] - timestamp - [level] - [name]: message`
 */
export const WinstonPrintfForma = ({
  tag,
  timestamp,
  level,
  message,
  name,
}: {
  tag: string;
  timestamp: string;
  level: string;
  message: string;
  name: string;
}) => `[${tag}] - ${timestamp} - [${level}] - [${name}]: ${message}`;
