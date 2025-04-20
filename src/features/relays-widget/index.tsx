import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { RelayPermission, useRelaysWidget } from './hooks';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/spinner';

export const RelaysWidget = () => {
  const { t } = useTranslation();
  const {
    relays,
    loading,
    newRelayUrl,
    setNewRelayUrl,
    newRelayPermission,
    setNewRelayPermission,
    addRelay,
    deleteRelay,
    updateRelayPermission,
    saveRelays,
  } = useRelaysWidget();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addRelay();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('relays.title')}</CardTitle>
        <CardDescription>{t('relays.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="relay-url">{t('relays.relayUrl')}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="relay-url"
                      placeholder={t('relays.relayUrlPlaceholder')}
                      value={newRelayUrl}
                      onChange={(e) => setNewRelayUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Select
                      value={newRelayPermission}
                      onValueChange={(value) => setNewRelayPermission(value as RelayPermission)}
                    >
                      <SelectTrigger id="relay-permission" className="w-full sm:w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">{t('relays.read')}</SelectItem>
                        <SelectItem value="write">{t('relays.write')}</SelectItem>
                        <SelectItem value="both">{t('relays.readWrite')}</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button onClick={addRelay} className="w-full sm:w-auto">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {t('relays.addRelay')}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">{t('relays.currentRelays')}</h3>
                {relays.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>{t('relays.noRelays')}</p>
                    <p className="text-sm">{t('relays.addYourFirstRelay')}</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {relays.map((relay, index) => (
                      <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md border gap-2"
                      >
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium truncate">{relay.url}</span>
                          <span className="text-sm text-muted-foreground">
                            {relay.permission === 'both' && t('relays.readWrite')}
                            {relay.permission === 'read' && t('relays.read')}
                            {relay.permission === 'write' && t('relays.write')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <Select
                            value={relay.permission}
                            onValueChange={(value) => updateRelayPermission(index, value as RelayPermission)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="read">{t('relays.read')}</SelectItem>
                              <SelectItem value="write">{t('relays.write')}</SelectItem>
                              <SelectItem value="both">{t('relays.readWrite')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRelay(index)}
                          >
                            <Trash2Icon className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={saveRelays} disabled={loading}>
                  {t('relays.saveChanges')}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
