import { useState } from 'react';
import { generateAllRecipe } from '../api/open_ai_chef';
import { Entry } from '../api/types';

export const useGPTGeneration = (selectedMainItems: Entry[], selectedAdditionalEntries: Entry[]) => {
    // GPTの結果用
    const [gptSuggest, setGptSuggest] = useState<string>('');
    // ローディング用
    const [loading, setLoading] = useState<boolean>(true);

    // Ollamaへお伺い
    const processGPT = async () => {
        if (selectedMainItems.length === 0 || selectedAdditionalEntries.length === 0) {
            return;
        }
        setLoading(true);
        setGptSuggest(''); // 初期化
        
        const ingiriList:string[] = [...selectedMainItems, ...selectedAdditionalEntries].map(entry => entry.name);
        await generateAllRecipe(ingiriList, (partial) => {
        setGptSuggest(prev => prev + partial);
        });

        setLoading(false);
    };
    return { gptSuggest, loading, processGPT};
};