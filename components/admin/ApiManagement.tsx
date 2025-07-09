import React, { useState } from 'react';
import type { ApiProvider } from '../../types.ts';
import { KeyRoundIcon, PencilIcon, SaveIcon } from '../icons.tsx';

const MOCK_APIS: ApiProvider[] = [
    { 
        id: 'groq', 
        name: 'Groq', 
        apiKey: 'gsk_...', 
        isActive: true,
        models: [{id: 'llama3-8b', name: 'Llama 3 8b'}, {id: 'llama3-70b', name: 'Llama 3 70b'}, {id: 'mixtral-8x7b', name: 'Mixtral 8x7b'}],
        selectedModelId: 'llama3-70b'
    },
    { 
        id: 'gemini', 
        name: 'Gemini', 
        apiKey: 'aisk_...', 
        isActive: true,
        models: [{id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash'}, {id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro'}],
        selectedModelId: 'gemini-1.5-flash'
    },
    { 
        id: 'openai', 
        name: 'OpenAI', 
        apiKey: 'sk_...', 
        isActive: false,
        models: [{id: 'gpt-4o', name: 'GPT-4o'}, {id: 'gpt-4-turbo', name: 'GPT-4 Turbo'}, {id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo'}],
        selectedModelId: 'gpt-4o'
    },
    { 
        id: 'openrouter', 
        name: 'OpenRouter', 
        apiKey: 'sk_or_...', 
        isActive: false,
        models: [{id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus'}, {id: 'google/gemini-flash-1.5', name: 'Gemini 1.5 Flash'}],
        selectedModelId: 'anthropic/claude-3-opus'
    },
];

const ApiManagement: React.FC = () => {
    const [apis, setApis] = useState(MOCK_APIS);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleFieldChange = (id: string, field: keyof ApiProvider, value: any) => {
        setApis(apis.map(api => api.id === id ? { ...api, [field]: value } : api));
    };

    const handleSave = (id: string) => {
        // Here you would typically make an API call to save the changes
        console.log("Saving API:", apis.find(api => api.id === id));
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
                <KeyRoundIcon className="w-6 h-6" />
                <span>Gestão de APIs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {apis.map(api => (
                    <div key={api.id} className="bg-white dark:bg-stone-800/50 p-6 rounded-lg shadow-md border border-stone-200 dark:border-stone-700">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${api.isActive ? 'bg-green-500' : 'bg-stone-400'}`}></div>
                                <h3 className="font-bold text-lg text-stone-800 dark:text-stone-200">{api.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={api.isActive} className="sr-only peer" onChange={(e) => handleFieldChange(api.id, 'isActive', e.target.checked)} />
                                    <div className="w-11 h-6 bg-stone-200 dark:bg-stone-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                                <button
                                    onClick={() => editingId === api.id ? handleSave(api.id) : setEditingId(api.id)}
                                    className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700"
                                >
                                    {editingId === api.id ? <SaveIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-400 block mb-1">API Key</label>
                                <input
                                    type={editingId === api.id ? 'text' : 'password'}
                                    value={api.apiKey}
                                    onChange={(e) => handleFieldChange(api.id, 'apiKey', e.target.value)}
                                    readOnly={editingId !== api.id}
                                    className="w-full bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md px-3 py-2 text-sm text-stone-600 dark:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-400 block mb-1">Modelo</label>
                                 <select
                                    value={api.selectedModelId || ''}
                                    onChange={(e) => handleFieldChange(api.id, 'selectedModelId', e.target.value)}
                                    disabled={editingId !== api.id}
                                    className="w-full bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md px-3 py-2 text-sm text-stone-800 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:text-stone-500"
                                >
                                    {api.models.map(model => (
                                        <option key={model.id} value={model.id}>{model.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApiManagement;