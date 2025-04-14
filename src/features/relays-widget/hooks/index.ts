import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

// リレーの型定義
export type RelayPermission = 'read' | 'write' | 'both';

export interface Relay {
  url: string;
  permission: RelayPermission;
}

export const useRelaysWidget = () => {
  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();
  const { toast } = useToast();

  const [relays, setRelays] = useState<Relay[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRelayUrl, setNewRelayUrl] = useState('');
  const [newRelayPermission, setNewRelayPermission] = useState<RelayPermission>('both');

  // リレーリストを取得する
  const fetchRelays = useCallback(async () => {
    if (!ndk || !activeUser) return;

    setLoading(true);
    try {
      // kind10002のイベントを取得
      const relayListEvents = await ndk.fetchEvents({
        kinds: [10002 as NDKKind],
        authors: [activeUser.pubkey],
        limit: 1,
      });

      // 最新のイベントを取得
      let latestEvent: NDKEvent | undefined;
      for (const event of relayListEvents) {
        if (!latestEvent || (event.created_at && latestEvent.created_at && event.created_at > latestEvent.created_at)) {
          latestEvent = event;
        }
      }

      if (latestEvent) {
        // タグからリレーURLと権限を抽出
        const relayList = latestEvent.tags
          .filter(tag => tag[0] === 'r')
          .map(tag => {
            const url = tag[1];
            let permission: RelayPermission = 'both';

            // タグの3番目と4番目の要素から権限を判断
            const hasRead = tag[2] === 'read' || !tag[2];
            const hasWrite = tag[2] === 'write' || tag[3] === 'write' || (!tag[2] && !tag[3]);

            if (hasRead && hasWrite) {
              permission = 'both';
            } else if (hasRead) {
              permission = 'read';
            } else if (hasWrite) {
              permission = 'write';
            }

            return { url, permission };
          });

        setRelays(relayList);
      } else {
        // デフォルトのリレーを設定
        const defaultRelays = [
          { url: 'wss://nos.lol', permission: 'both' as RelayPermission },
          { url: 'wss://relay.primal.net', permission: 'both' as RelayPermission },
          { url: 'wss://relay.nostr.band', permission: 'both' as RelayPermission }
        ];
        setRelays(defaultRelays);
      }
    } catch (error) {
      console.error('Failed to fetch relays:', error);
      toast({
        title: 'エラー',
        description: 'リレーリストの取得に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [ndk, activeUser, toast]);

  // リレーリストを保存する
  const saveRelays = useCallback(async () => {
    if (!ndk || !activeUser) return;

    setLoading(true);
    try {
      // kind10002のイベントを作成
      const event = new NDKEvent(ndk);
      event.kind = 10002 as NDKKind;

      // リレーをタグとして追加（権限情報を含む）
      relays.forEach(relay => {
        if (relay.permission === 'both') {
          // 両方の権限がある場合は追加情報なし
          event.tags.push(['r', relay.url]);
        } else if (relay.permission === 'read') {
          // 読み取り権限のみ
          event.tags.push(['r', relay.url, 'read']);
        } else if (relay.permission === 'write') {
          // 書き込み権限のみ
          event.tags.push(['r', relay.url, 'write']);
        }
      });

      // イベントを公開
      const relaySet = await event.publish();

      if (relaySet.size === 0) {
        toast({
          title: 'エラー',
          description: 'リレーリストの保存に失敗しました',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '成功',
          description: 'リレーリストを保存しました',
        });
      }
    } catch (error) {
      console.error('Failed to save relays:', error);
      toast({
        title: 'エラー',
        description: 'リレーリストの保存に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [ndk, activeUser, relays, toast]);

  // リレーを追加する
  const addRelay = useCallback(() => {
    if (!newRelayUrl.trim()) return;

    // URLの形式をチェック
    if (!newRelayUrl.startsWith('wss://')) {
      toast({
        title: 'エラー',
        description: '無効なURLです。wss://から始まるURLを入力してください',
        variant: 'destructive',
      });
      return;
    }

    // 重複チェック
    const isDuplicate = relays.some(relay => relay.url === newRelayUrl);
    if (isDuplicate) {
      toast({
        title: 'エラー',
        description: '既に追加されているリレーです',
        variant: 'destructive',
      });
      return;
    }

    // リレーを追加
    setRelays(prev => [...prev, { url: newRelayUrl, permission: newRelayPermission }]);
    setNewRelayUrl('');
  }, [newRelayUrl, newRelayPermission, relays, toast]);

  // リレーを削除する
  const deleteRelay = useCallback((index: number) => {
    setRelays(prev => prev.filter((_, i) => i !== index));
  }, []);

  // リレーの権限を変更する
  const updateRelayPermission = useCallback((index: number, permission: RelayPermission) => {
    setRelays(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], permission };
      return updated;
    });
  }, []);

  // 初期化時にリレーリストを取得
  useEffect(() => {
    if (activeUser) {
      fetchRelays();
    }
  }, [activeUser, fetchRelays]);

  return {
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
  };
};
