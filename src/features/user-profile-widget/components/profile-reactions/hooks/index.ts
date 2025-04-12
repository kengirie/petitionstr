import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { useNdk, useSubscription } from 'nostr-hooks';
import { useEffect, useState } from 'react';

export const useProfileReactions = ({
  user,
}: {
  user: NDKUser;
}) => {
  const subId = `user-reactions-${user.pubkey}`;
  const { ndk } = useNdk();
  const [noteEvents, setNoteEvents] = useState<NDKEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

  const { events, createSubscription, loadMore, hasMore, isLoading } = useSubscription(subId);

  // Reactionイベントからnoteイベントを取得する
  useEffect(() => {
    if (!ndk || !events || events.length === 0) {
      return;
    }

    const fetchEvents = async () => {
      setIsLoadingEvents(true);

      // Reactionイベントから"e"タグを抽出
      const eventIds = events
        .flatMap(event =>
          event.getMatchingTags('e')
            .map(tag => tag[1])
        )
        .filter(Boolean);

      // 重複を排除
      const uniqueEventIds = [...new Set(eventIds)];

      // 各イベントIDに対応するイベントを取得
      const eventPromises = uniqueEventIds.map(eventId =>
        ndk.fetchEvent(eventId)
      );

      const fetchedEvents = await Promise.all(eventPromises);

      // nullでないイベントのみをフィルタリングし、kind 1のイベント（note）のみを抽出
      const notes = fetchedEvents
        .filter(Boolean)
        .filter(event => event && event.kind === 1) as NDKEvent[];

      // Reactionした順（eventsの順）に並べる
      const orderedNotes: NDKEvent[] = [];

      // eventsは古い順なので、逆順に処理して新しい順にする
      const reversedEvents = [...events].reverse();

      for (const reaction of reversedEvents) {
        const eTags = reaction.getMatchingTags('e');
        if (eTags.length > 0) {
          const eventId = eTags[eTags.length - 1][1];
          const noteEvent = notes.find(event => event.id === eventId);
          if (noteEvent && !orderedNotes.includes(noteEvent)) {
            orderedNotes.push(noteEvent);
          }
        }
      }

      setNoteEvents(orderedNotes);
      setIsLoadingEvents(false);
    };

    fetchEvents();
  }, [ndk, events]);

  useEffect(() => {
    if (!user.pubkey) {
      return;
    }

    createSubscription({
      filters: [{ authors: [user.pubkey], kinds: [7], limit: 50 }],
      opts: { groupableDelay: 500 },
    });
  }, [createSubscription, user.pubkey]);

  return {
    noteEvents,
    loadMore,
    hasMore,
    isLoading: isLoading || isLoadingEvents
  };
};
