import { from } from 'env-var';

const env = from(process.env);

export const API_URL = env.get('REACT_APP_API_URL').required().asString();
