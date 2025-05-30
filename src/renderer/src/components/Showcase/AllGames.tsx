import { cn } from '~/utils'
import { Button } from '@ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@ui/select'
import { useConfigState } from '~/hooks'
import { sortGames } from '~/stores/game'
import { GamePoster } from './posters/GamePoster'
import { LazyLoadComponent, trackWindowScroll } from 'react-lazy-load-image-component'
import { useTranslation } from 'react-i18next'

function PlaceHolder(): JSX.Element {
  return (
    <div className={cn('w-[148px] h-[222px] cursor-pointer object-cover', 'bg-transparent')}></div>
  )
}

export function AllGamesComponent({
  scrollPosition
}: {
  scrollPosition: { x: number; y: number }
}): JSX.Element {
  const [by, setBy] = useConfigState('game.showcase.sort.by')
  const [order, setOrder] = useConfigState('game.showcase.sort.order')
  const games = sortGames(by, order)
  const toggleOrder = (): void => {
    setOrder(order === 'asc' ? 'desc' : 'asc')
  }
  const { t } = useTranslation('game')
  return (
    <div className={cn('w-full flex flex-col gap-1 pt-3')}>
      <div className={cn('flex flex-row items-center gap-5 justify-center px-5')}>
        <div className={cn('flex flex-row gap-5 items-center justify-center')}>
          <div className={cn('text-accent-foreground flex-shrink-0')}>
            {t('showcase.sections.allGames')}
          </div>
          <div className={cn('flex flex-row gap-1 items-center justify-center')}>
            <div className={cn('text-sm')}>{t('showcase.sorting.title')}</div>
            <Select value={by} onValueChange={setBy} defaultValue="name">
              <SelectTrigger className={cn('w-[120px] h-[26px] text-xs')}>
                <SelectValue placeholder="Select a fruit" className={cn('text-xs')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('showcase.sorting.label')}</SelectLabel>
                  <SelectItem value="metadata.name">
                    {t('showcase.sorting.options.name')}
                  </SelectItem>
                  <SelectItem value="metadata.releaseDate">
                    {t('showcase.sorting.options.releaseDate')}
                  </SelectItem>
                  <SelectItem value="record.lastRunDate">
                    {t('showcase.sorting.options.lastRunDate')}
                  </SelectItem>
                  <SelectItem value="record.addDate">
                    {t('showcase.sorting.options.addDate')}
                  </SelectItem>
                  <SelectItem value="record.playTime">
                    {t('showcase.sorting.options.playTime')}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={'outline'}
            size={'icon'}
            className={cn('h-[26px] w-[26px] -ml-3')}
            onClick={toggleOrder}
          >
            {order === 'asc' ? (
              <span className={cn('icon-[mdi--arrow-up] w-4 h-4')}></span>
            ) : (
              <span className={cn('icon-[mdi--arrow-down] w-4 h-4')}></span>
            )}
          </Button>
        </div>

        {/* Split Line Container */}
        <div className={cn('flex items-center justify-center flex-grow')}>
          <div className="w-full h-px border-t border-dashed border-border" />
        </div>
      </div>

      {/* Game List Container */}
      <div
        className={cn(
          'grid grid-cols-[repeat(auto-fill,148px)]',
          // '3xl:grid-cols-[repeat(auto-fill,176px)]',
          'justify-between gap-6 w-full',
          'pt-2 pl-5 pr-5 pb-6' // Add inner margins to show shadows
        )}
      >
        {games.map((gameId) => (
          <div key={gameId} className={cn('flex-shrink-0')}>
            <LazyLoadComponent
              threshold={300}
              scrollPosition={scrollPosition}
              placeholder={<PlaceHolder />}
            >
              <GamePoster gameId={gameId} />
            </LazyLoadComponent>
          </div>
        ))}
      </div>
    </div>
  )
}

export const AllGames = trackWindowScroll(AllGamesComponent)
