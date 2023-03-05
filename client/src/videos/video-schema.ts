import * as yup from 'yup';

const legalCharacterRegex = /^[^\\^{}%`"<>|]{1,}/;
const legalCharacterRegexMessage = 'Cannot contain: ^{}%\'"<>|';

const genGeneralInputSchema = () => yup.string()
  .required('Required.')
  .min(2, 'Too short.')
  .matches(
    legalCharacterRegex,
    legalCharacterRegexMessage
  );

const genIsoDateSchema = () => yup.string()
  .optional()
  .matches(
    /[0-9]{4}(-[0-9]{2}){2}T[0-8]{2}(:[0-9]{2}){2}\.[0-9]{3}Z/,
    'Invalid datetime.'
  );

const videoSchema = yup.object().shape({
  name: genGeneralInputSchema(),
  stream_key: genGeneralInputSchema(),
  download_key: genGeneralInputSchema(),
  download_available: yup.boolean().optional(),
  member: yup.boolean().optional(),
  tags: yup.array()
    .of(genGeneralInputSchema())
    .optional(),
  date_aired: genIsoDateSchema(),
  date_added: genIsoDateSchema(),
});

export default videoSchema;