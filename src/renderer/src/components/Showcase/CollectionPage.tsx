import { ScrollArea } from '@ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { useGameCollectionStore } from '~/stores'
import { cn } from '~/utils'
import { CollectionPoster } from './posters/CollectionPoster'
import { useTranslation } from 'react-i18next'

export function CollectionPage(): JSX.Element {
  const collections = useGameCollectionStore((state) => state.documents)

  const [gap, setGap] = useState<number>(0)
  const [columns, setColumns] = useState<number>(0)
  const gridContainerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const calculateGap = (): void => {
      const gridContainer = gridContainerRef.current
      if (gridContainer && gridContainer.children.length > 0) {
        const containerWidth = gridContainer.offsetWidth
        const gridItems = gridContainer.children
        const itemWidth = (gridItems[0] as HTMLDivElement).offsetWidth
        const containerStyle = window.getComputedStyle(gridContainer)
        const minGap = parseFloat(containerStyle.getPropertyValue('gap'))
        const pL = parseFloat(containerStyle.paddingLeft)
        const pR = parseFloat(containerStyle.paddingRight)

        const columns = Math.floor((containerWidth - pL - pR + minGap) / (itemWidth + minGap))
        setColumns(columns)
        if (columns > 1) {
          const gapTrue = (containerWidth - pL - pR - columns * itemWidth) / (columns - 1)
          setGap(gapTrue)
        }
      }
    }

    calculateGap()
    const observer = new ResizeObserver(calculateGap)
    const gridContainer = gridContainerRef.current
    if (gridContainer) {
      observer.observe(gridContainer)
    }

    return (): void => observer.disconnect()
  }, [])

  const { t } = useTranslation('game')

  return (
    <div className={cn('flex flex-col gap-3 h-[100vh] pt-[14px] bg-background/50')}>
      <ScrollArea className={cn('w-full')}>
        <div className={cn('w-full flex flex-col gap-1 pt-3')}>
          <div className={cn('flex flex-row items-center gap-5 justify-center pl-5')}>
            <div className={cn('text-accent-foreground flex-shrink-0')}>
              {' '}
              {t('showcase.sections.collections')}
            </div>

            {/* Split Line Container */}
            <div className={cn('flex items-center justify-center flex-grow')}>
              <div className="w-full h-px border-t border-dashed border-border" />
            </div>
          </div>

          {/* Game List Container */}
          <div
            ref={gridContainerRef}
            className={cn(
              'grid grid-cols-[repeat(auto-fill,150px)]',
              '3xl:grid-cols-[repeat(auto-fill,180px)]',
              'justify-between gap-6 w-full',
              'pt-2 pb-6 pl-5 pr-5' // Add inner margins to show shadows
            )}
          >
            {Object.keys(collections).map((collectionId, index) => (
              <div
                key={collectionId}
                className={cn(
                  'flex-shrink-0' // Preventing compression
                )}
              >
                <CollectionPoster
                  collectionId={collectionId}
                  parentGap={gap}
                  position={
                    (index % columns === 0 && 'left') ||
                    (index % columns === columns - 1 && 'right') ||
                    'center'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
