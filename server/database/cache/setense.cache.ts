// sentense caching...
import crypto from 'crypto';

// avoid long redis keys by hashing sentence
export const hashSentence = (text: string) => 
  crypto.createHash('sha1').update(text).digest('hex');

export const SENTENCE_CACHE_KEY = (shopId: string, sentence: string) => `sentence:${shopId}:${hashSentence(sentence)}`;

