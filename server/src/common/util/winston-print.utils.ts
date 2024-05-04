import { WinstonLoggerTemplate } from '../constant/logger.constant';

const TAG_LOGGER = 'tag';
const TIMESTAMP_LOGGER = 'timestamp';
const LEVEL_LOGGER = 'level';
const NAME_LOGGER = 'name';
const MESSAGE_LOGGER = 'message';

export const WinstonPrintfFormat = ({
  tag,
  timestamp,
  level,
  message,
  name,
  template = WinstonLoggerTemplate.simple,
}: {
  tag: string;
  timestamp: string;
  level: string;
  message: string;
  name: string;
  template?: string;
}) => {
  return template
    .replace(TAG_LOGGER, tag)
    .replace(TIMESTAMP_LOGGER, timestamp)
    .replace(LEVEL_LOGGER, level)
    .replace(NAME_LOGGER, name)
    .replace(MESSAGE_LOGGER, message);
};
