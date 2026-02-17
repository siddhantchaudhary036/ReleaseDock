import { h, Fragment } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { Launcher } from './Launcher';
import { Feed } from './Feed';
import { fetchChangelogs, type ChangelogsResponse } from './api';
import { getLastVisit, setLastVisit } from './storage';

interface AppProps {
  apiKey: string;
  container: HTMLElement;
}

export function App({ apiKey, container }: AppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ChangelogsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchChangelogs(apiKey);
        if (!cancelled) setData(response);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load changelogs');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [apiKey]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    // Auto-mark as read when the feed is opened (industry standard: Beamer, FeatureBase)
    setLastVisit(Date.now());
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMarkAsRead = useCallback(() => {
    setLastVisit(Date.now());
  }, []);

  // Listen for external API events dispatched on the container element
  useEffect(() => {
    const onOpen = () => handleOpen();
    const onClose = () => handleClose();
    const onMarkAsRead = () => handleMarkAsRead();

    container.addEventListener('releasedock:open', onOpen);
    container.addEventListener('releasedock:close', onClose);
    container.addEventListener('releasedock:markAsRead', onMarkAsRead);

    return () => {
      container.removeEventListener('releasedock:open', onOpen);
      container.removeEventListener('releasedock:close', onClose);
      container.removeEventListener('releasedock:markAsRead', onMarkAsRead);
    };
  }, [container, handleOpen, handleClose, handleMarkAsRead]);

  if (loading || error || !data) return null;

  const unreadCount = calculateUnreadCount(data);

  return (
    <>
      <Launcher
        position={data.widgetSettings.position}
        primaryColor={data.widgetSettings.primaryColor}
        unreadCount={unreadCount}
        onClick={isOpen ? handleClose : handleOpen}
      />
      <Feed
        entries={data.entries}
        settings={data.widgetSettings}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
}

function calculateUnreadCount(data: ChangelogsResponse): number {
  if (!data.entries.length) return 0;
  const lastVisit = getLastVisit();
  if (!lastVisit) return data.entries.length;
  return data.entries.filter(entry => entry.publishDate > lastVisit).length;
}
