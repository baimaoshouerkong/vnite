import { Button } from '@ui/button'
import { Dialog, DialogContent } from '@ui/dialog'
import { Input } from '@ui/input'
import { useGameState } from '~/hooks'
import { cn } from '~/utils'
import { useTranslation } from 'react-i18next'

export function NameEditorDialog({
  gameId,
  setIsOpen
}: {
  gameId: string
  setIsOpen: (value: boolean) => void
}): JSX.Element {
  const { t } = useTranslation('game')
  const [gameName, setGameName] = useGameState(gameId, 'metadata.name')

  return (
    <Dialog open={true} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className={cn('w-[500px] flex flex-row gap-3')}>
        <Input
          className={cn('w-full')}
          value={gameName}
          onChange={(e) => {
            setGameName(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setIsOpen(false)
          }}
        />
        <Button onClick={() => setIsOpen(false)}>{t('utils:common.confirm')}</Button>
      </DialogContent>
    </Dialog>
  )
}
