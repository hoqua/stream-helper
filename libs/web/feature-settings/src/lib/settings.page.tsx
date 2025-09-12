import { AddKeyForm } from './components/api-key-form';
import { ApiKeyTable } from './components/api-key-table';
import { getUserKeys } from './loader';

export async function SettingsPage() {
  const data = await getUserKeys();
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your API keys and application settings</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Create New API Key</h3>
              <AddKeyForm />
            </div>
          </div>

          <div>
            <ApiKeyTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
