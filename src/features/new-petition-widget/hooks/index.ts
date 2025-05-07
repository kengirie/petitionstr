import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useRealtimeProfile, useNip98 } from 'nostr-hooks';
import { useCallback, useState, useRef } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useNewPetitionWidget = () => {
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { activeUser } = useActiveUser();
  const { profile } = useRealtimeProfile(activeUser?.pubkey);

  const { ndk } = useNdk();
  const { getToken } = useNip98();

  const { toast } = useToast();

  // ファイル選択を開始する関数
  const openUploadMediaDialog = useCallback(() => {
    // fileInputRefが存在すれば、クリックイベントをトリガー
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // ファイル選択時のハンドラー
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ファイルがなければ処理を終了
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    // 選択されたファイルを取得
    const file = e.target.files[0];
    console.log('Selected file:', file);

    try {
      // アップロード中フラグを設定
      setIsUploadingMedia(true);

      // browser-image-compressionを使用して画像を処理
      const imageCompression = await import('browser-image-compression');

      // 圧縮オプション
      const options = {
        maxSizeMB: 1,              // 最大ファイルサイズ
        maxWidthOrHeight: 1920,    // 最大幅/高さ
        useWebWorker: true,        // WebWorkerを使用
        initialQuality: 0.8,       // 初期品質
        alwaysKeepResolution: true // 解像度を維持
      };

      // 画像を圧縮・処理
      const compressedFile = await imageCompression.default(file, options);
      console.log('Compressed file:', compressedFile);

      // フォームデータを作成
      const formData = new FormData();
      formData.append('fileToUpload', compressedFile);

      // NIP-98トークンを取得
      const token = await getToken({
        url: import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT,
        method: 'POST',
      });

      if (!token) {
        throw new Error('Failed to get authorization token');
      }

      // ファイルをアップロード
      const response = await fetch(import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      console.log('Upload response:', data);

      // レスポンスから画像URLを取得
      let imageUrl = '';

      if (data.status === 'success') {
        if (data.nip94_event && Array.isArray(data.nip94_event.tags)) {
          // URLタグを探す (通常は最初のタグ)
          const urlTag = data.nip94_event.tags.find((tag: [string, string]) => tag[0] === 'url');
          if (urlTag && urlTag[1]) {
            imageUrl = urlTag[1];
          }
        }

        if (imageUrl) {
          // 成功時: 画像URLを設定
          setImage(imageUrl);
          toast({
            title: 'Success',
            description: 'Image uploaded successfully',
          });
        } else {
          console.error('Could not find URL in response', data);
          throw new Error('Could not find image URL in response');
        }
      } else {
        console.error('Upload failed', data);
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload media',
        variant: 'destructive',
      });
    } finally {
      // 状態をリセット
      setIsUploadingMedia(false);
      // 同じファイルを再選択できるように値をクリア
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [getToken, setImage, toast]);


  const post = useCallback(() => {
    if (!ndk || !ndk.signer) {
      return;
    }

    const e = new NDKEvent(ndk);
    e.kind = 30023;
    e.content = content;

    // タグを設定
    e.tags = [
      ["title", title],
      ["published_at", Math.floor(Date.now() / 1000).toString()],
      ["summary", summary],
      ["image", image],
      ["t", 'petition']
    ];

    console.log(activeUser?.pubkey);

    e.publish()
      .then((relaySet) => {
        if (relaySet.size === 0) {
          toast({
            title: 'Error',
            description: 'Failed to post petition',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Petition posted successfully',
          });
          // 投稿成功後にフィールドをクリア
          setTitle('');
          setSummary('');
          setImage('');
          setContent('');
        }
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to post petition',
          variant: 'destructive',
        });
      });
  }, [ndk, title, summary, image, content, toast, setTitle, setSummary, setImage, setContent]);

  return {
    title,
    summary,
    image,
    content,
    setTitle,
    setSummary,
    setImage,
    setContent,
    post,
    profile,
    isUploadingMedia,
    fileInputRef,
    openUploadMediaDialog,
    handleFileChange
  };
};
