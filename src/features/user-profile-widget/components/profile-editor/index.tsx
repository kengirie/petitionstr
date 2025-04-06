import { zodResolver } from '@hookform/resolvers/zod';
import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { UploadIcon } from '@radix-ui/react-icons';
import { useNip98, useUpdateUserProfile } from 'nostr-hooks';
import { useRef, useState } from 'react'; // useRefをインポート
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';

import { Spinner } from '@/shared/components/spinner';

import { ProfileAvatar } from '../profile-avatar';
import { ProfileBanner } from '../profile-banner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),
  about: z.string().optional(),
  image: z.string().optional(),
  nip05: z.string().optional(),
  banner: z.string().optional(),
});

export const ProfileEditor = ({
  setEditMode,
  initialProfile,
}: {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  initialProfile?: NDKUserProfile | null | undefined;
}) => {
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<'image' | 'banner' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // ファイル入力用のref

  const { toast } = useToast();
  const { getToken } = useNip98();
  const { updateUserProfile } = useUpdateUserProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialProfile?.name || '',
      about: initialProfile?.about || '',
      image: initialProfile?.image || '',
      nip05: initialProfile?.nip05 || '',
      banner: initialProfile?.banner || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUserProfile(values);
    setEditMode(false);
  };

  // ファイル選択を開始する関数
  const openUploadMediaDialog = (type: 'image' | 'banner') => {
    setCurrentUploadType(type);
    // fileInputRefが存在すれば、クリックイベントをトリガー
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ファイル選択時のハンドラー
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        if (imageUrl && currentUploadType) {
          // 成功時: フォームの値を更新
          form.setValue(currentUploadType, imageUrl);
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
  };

  return (
    <>
      {/* 非表示のファイル入力要素 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />

      <ProfileBanner banner={form.watch().banner} />
      <ProfileAvatar image={form.watch().image} />

      <div className="p-4 pt-16 flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar Image Url</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <Button
                      type="button"
                      variant="secondary"
                      className="flex items-center"
                      onClick={() => openUploadMediaDialog('image')}
                      disabled={isUploadingMedia}
                    >
                      {isUploadingMedia ? (
                        <Spinner />
                      ) : (
                        <>
                          <UploadIcon className="mr-2" />
                          <span>Upload Avatar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image Url</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <Button
                      type="button"
                      variant="secondary"
                      className="flex items-center"
                      onClick={() => openUploadMediaDialog('banner')}
                      disabled={isUploadingMedia}
                    >
                      {isUploadingMedia ? (
                        <Spinner />
                      ) : (
                        <>
                          <UploadIcon className="mr-2" />
                          <span>Upload Banner</span>
                        </>
                      )}
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="nip05"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP-05</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="w-1/3"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>

              <Button type="submit" className="w-2/3">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
