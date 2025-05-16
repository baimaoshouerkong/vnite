import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@ui/dropdown-menu'
import { useGameCollectionStore } from '~/stores'
import { cn } from '~/utils'
import { useTranslation } from 'react-i18next'

export function CollectionMenu({
  gameId,
  openAddCollectionDialog
}: {
  gameId: string
  openAddCollectionDialog: () => void
}): JSX.Element {
  const { t } = useTranslation('game')
  const {
    documents: collections,
    addGameToCollection,
    removeGameFromCollection
  } = useGameCollectionStore()

  const gameInCollectionsId = Object.entries(collections)
    .filter(([, value]) => value.games.includes(gameId))
    .map(([key]) => key)

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>{t('detail.collection.addTo')}</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="max-w-[300px]">
            <div className={cn('max-h-[224px] overflow-auto scrollbar-base-thin')}>
              {Object.entries(collections)
                .filter(([key]) => !gameInCollectionsId.includes(key))
                .map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => addGameToCollection(key, gameId)}
                    inset
                  >
                    <span className="truncate">{value.name}</span>
                  </DropdownMenuItem>
                ))}
            </div>
            {Object.entries(collections).filter(([key]) => !gameInCollectionsId.includes(key))
              .length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem onSelect={openAddCollectionDialog}>
              <div className={cn('flex flex-row gap-2 items-center w-full')}>
                <span className={cn('icon-[mdi--add] w-4 h-4')}></span>
                <div>{t('detail.collection.newCollection')}</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      {gameInCollectionsId.length > 0 && (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{t('detail.collection.removeFrom')}</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="max-w-[300px]">
              {Object.entries(collections)
                .filter(([key]) => gameInCollectionsId.includes(key))
                .map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => removeGameFromCollection(key, gameId)}
                    className={cn('pl-3')}
                  >
                    <span className="truncate">{value.name}</span>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      )}
    </DropdownMenuGroup>
  )
}
