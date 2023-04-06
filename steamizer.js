import { stemmer } from 'stemmer';
import { extract, numbers, words } from 'words-n-numbers';
import { eng, removeStopwords, spa } from 'stopword';

export async function steamizer(
    keywords,
    langStopWords = 'eng',
    includeNumbers = false,
) {
    const stopwords = langStopWords === 'eng' ? eng : spa;
    const keywordsWithoutStopWords = removeStopwords(
        keywords,
        stopwords
    );

    const result = keywordsWithoutStopWords.map((query) => {
        const tokens = extract(query, {
            regex: includeNumbers
                ? [words, numbers]
                : [words],
            toLowercase: true,
        });
        return {
            query,
            tokens,
            stem:
                tokens
                    ?.map((tokenizedWord) => stemmer(tokenizedWord))
                    .sort()
                    .join(' ') || '',
        };
    });

    return result;
}
