import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Small } from '@/shared/components/ui/typography/small';

import { ZAP_AMOUNTS } from './config';
import { useZapWidget } from './hooks';

// Check out the `example-components` folder to see how to use this component

export const ZapWidget = ({
  target,
  children,
}: {
  target: NDKEvent | NDKUser | undefined;
  children?: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const {
    comment,
    image,
    displayName,
    selectedAmount,
    setComment,
    setSelectedAmount,
    processing,
    process,
    isModalOpen,
    setIsModalOpen,
  } = useZapWidget(target);

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
      <DialogTrigger asChild>{children || <Button>{t('zap.button')} ⚡️</Button>}</DialogTrigger>

      <DialogContent aria-describedby="zap-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>{displayName?.[0]}</AvatarFallback>
            </Avatar>

            <span>{t('zap.sendSatsTo')} {displayName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <Small>{t('zap.amountInSats')}</Small>

          <div className="grid grid-cols-4 gap-4">
            {ZAP_AMOUNTS.map((zapAmount) => (
              <Button
                key={zapAmount.id}
                onClick={() => setSelectedAmount(zapAmount)}
                variant={selectedAmount.id == zapAmount.id ? 'default' : 'outline'}
              >
                {t(zapAmount.labelKey)}
              </Button>
            ))}

            <Button
              onClick={() => setSelectedAmount({ amount: 21, id: 0, labelKey: 'zap.amounts.custom' })}
              variant={ZAP_AMOUNTS.includes(selectedAmount) ? 'outline' : 'default'}
            >
              {t('zap.amounts.custom')}
            </Button>

            {!ZAP_AMOUNTS.includes(selectedAmount) && (
              <Input
                placeholder={t('zap.amounts.customPlaceholder')}
                type="number"
                min={1}
                autoFocus
                className="col-span-3"
                value={selectedAmount.amount}
                onChange={(e) =>
                  setSelectedAmount({ id: 0, amount: parseInt(e.target.value), labelKey: 'zap.amounts.custom' })
                }
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Small>{t('zap.comment')}</Small>

          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('zap.commentPlaceholder')}
          />
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            disabled={!selectedAmount.amount || processing}
            onClick={() => {
              process();
            }}
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `⚡️ ${t('zap.zapButton')} ${selectedAmount.amount || '_'} sats`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
