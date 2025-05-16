import { generateUUID } from '@appUtils'
import { ContextMenu, ContextMenuTrigger } from '@ui/context-menu'
import { GameImage } from '@ui/game-image'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui/hover-card'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { HoverCardAnimation } from '~/components/animations/HoverCard'
import { GameNavCM } from '~/components/contextMenu/GameNavCM'
import { AddCollectionDialog } from '~/components/dialog/AddCollectionDialog'
import { NameEditorDialog } from '~/components/Game/Config/ManageMenu/NameEditorDialog'
import { PlayTimeEditorDialog } from '~/components/Game/Config/ManageMenu/PlayTimeEditorDialog'
import { usePositionButtonStore } from '~/components/Librarybar/PositionButton'
import { useDragContext } from '~/components/Showcase/CollectionGames'
import { useGameState } from '~/hooks'
import { useGameCollectionStore, useGameRegistry } from '~/stores/game'
import { cn, scrollToElement } from '~/utils'
import {
  attachClosestEdge,
  calPreviewOffset,
  combine,
  createPortal,
  draggable,
  DropIndicator,
  dropTargetForElements,
  extractClosestEdge,
  invariant,
  setCustomNativeDragPreview,
  type Edge,
  type PreviewState
} from '~/utils/dnd-utills'

function Preview({
  title,
  transparentBackground = false
}: {
  title: string
  transparentBackground?: boolean
}): JSX.Element {
  return (
    <div
      className={cn(
        'relative w-[148px] aspect-[2/3] rounded-lg',
        'border-4 border-dashed border-primary',
        !transparentBackground && ' bg-background'
      )}
    >
      <div
        className={cn(
          'absolute top-[25%] z-20',
          'flex justify-center',
          'pointer-events-none w-full h-[50%]'
        )}
      >
        <div
          className={cn(
            'text-accent-foreground text-lg font-semibold',
            'w-[90%] text-center break-words whitespace-normal overflow-hidden'
          )}
        >
          {title}
        </div>
      </div>
    </div>
  )
}

export function GamePoster({
  gameId,
  groupId,
  className,
  dragScenario,
  parentGap = 0,
  position = 'center'
}: {
  gameId: string
  groupId?: string
  className?: string
  dragScenario?: string
  parentGap?: number
  position?: 'right' | 'left' | 'center'
}): JSX.Element {
  const navigate = useNavigate()
  const gameData = useGameRegistry((state) => state.gameMetaIndex[gameId])
  const reorderGamesInCollection = useGameCollectionStore((state) => state.reorderGamesInCollection)
  const setLazyloadMark = usePositionButtonStore((state) => state.setLazyloadMark)
  const collectionId = groupId?.split(':')[1]
  const [playTime] = useGameState(gameId, 'record.playTime')
  const [gameName] = useGameState(gameId, 'metadata.name')
  const [isAddCollectionDialogOpen, setIsAddCollectionDialogOpen] = useState(false)
  const [isPlayTimeEditorDialogOpen, setIsPlayTimeEditorDialogOpen] = useState(false)
  const [isNameEditorDialogOpen, setIsNameEditorDialogOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const openTimeoutRef: MutableRefObject<NodeJS.Timeout | undefined> = useRef(undefined)
  const closeTimeoutRef: MutableRefObject<NodeJS.Timeout | undefined> = useRef(undefined)
  const openDelay = 200
  const closeDelay = 0

  const { t } = useTranslation('game')

  const { isDraggingGlobal, setIsDraggingGlobal } = useDragContext()

  useEffect(() => {
    setIsOpen(false)
  }, [isDraggingGlobal])

  const handleMouseEnter = (): void => {
    if (isDraggingGlobal) return
    clearTimeout(closeTimeoutRef.current ?? undefined)
    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true)
    }, openDelay)
  }

  const handleMouseLeave = (): void => {
    clearTimeout(openTimeoutRef.current ?? undefined)
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, closeDelay)
  }

  const ref_ = useRef<HTMLDivElement>(null)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)
  const [dragging, setDragging] = useState<boolean>(false)
  const [previewState, setPreviewState] = useState<PreviewState>({ type: 'idle' })

  useEffect(() => {
    if (!dragScenario || !collectionId) return
    const el = ref_.current
    invariant(el)

    return combine(
      draggable({
        element: el,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            getOffset: calPreviewOffset(0.66, 0.66),
            render({ container }) {
              setPreviewState({ type: 'preview', container })
              return (): void => setPreviewState({ type: 'idle' })
            },
            nativeSetDragImage
          })
        },
        getInitialData: () => ({ dragScenario: dragScenario, uuid: gameId }),
        onDragStart: () => {
          setIsDraggingGlobal(true)
          setDragging(true)
        },
        onDrop: () => {
          setTimeout(() => {
            setIsDraggingGlobal(false)
          }, 500)
          setTimeout(() => {
            setIsDraggingGlobal(true)
          }, 750)
          setTimeout(() => {
            setIsDraggingGlobal(false)
          }, 1000)
          setDragging(false)
        }
      }),

      dropTargetForElements({
        element: el,
        canDrop: ({ source }) => source.data.dragScenario === dragScenario,
        getData: ({ input, element }) => {
          // your base data you want to attach to the drop target
          const data = { uuid: gameId }
          // this will 'attach' the closest edge to your `data` object
          return attachClosestEdge(data, { input, element, allowedEdges: ['right', 'left'] })
        },
        onDrag({ self, source }) {
          if (source.element === el) {
            setClosestEdge(null)
            return
          }
          const closestEdge = extractClosestEdge(self.data)
          setClosestEdge(closestEdge)
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: ({ self, source }): void => {
          reorderGamesInCollection(
            collectionId,
            source.data.uuid as string,
            self.data.uuid as string,
            extractClosestEdge(self.data) === 'left' ? 'front' : 'back'
          )
          setClosestEdge(null)
        }
      })
    )
  }, [])

  return (
    <div ref={ref_} className="relative overflow-visible">
      {dragging ? (
        <Preview title={gameData?.name ?? ''} transparentBackground={true} />
      ) : (
        <HoverCard open={isOpen && !isDraggingGlobal}>
          <ContextMenu>
            <HoverCardTrigger
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={cn('rounded-none')}
            >
              <ContextMenuTrigger>
                <HoverCardAnimation className={cn('rounded-lg')}>
                  <GameImage
                    onClick={() => {
                      navigate(`/library/games/${gameId}/${encodeURIComponent(groupId || 'all')}`)
                      scrollToElement({
                        selector: `[data-game-id="${gameId}"][data-group-id="${groupId || 'all'}"]`
                      })
                      setTimeout(() => {
                        setLazyloadMark(generateUUID())
                      }, 100)
                    }}
                    draggable="false"
                    gameId={gameId}
                    type="cover"
                    alt={gameId}
                    className={cn(
                      'w-[148px] aspect-[2/3] cursor-pointer object-cover rounded-lg',
                      // '3xl:w-[176px]',
                      className
                    )}
                    fallback={
                      <div
                        className={cn(
                          'w-[148px] aspect-[2/3] cursor-pointer object-cover flex items-center justify-center',
                          // '3xl:w-[176px]',
                          className
                        )}
                        onClick={() =>
                          navigate(
                            `/library/games/${gameId}/${encodeURIComponent(groupId || 'all')}`
                          )
                        }
                      >
                        <div className={cn('font-bold truncate p-1')}>{gameName}</div>
                      </div>
                    }
                  />
                </HoverCardAnimation>
              </ContextMenuTrigger>
            </HoverCardTrigger>

            <GameNavCM
              gameId={gameId}
              groupId={groupId || 'all'}
              openAddCollectionDialog={() => setIsAddCollectionDialogOpen(true)}
              openNameEditorDialog={() => setIsNameEditorDialogOpen(true)}
              openPlayTimeEditorDialog={() => setIsPlayTimeEditorDialogOpen(true)}
            />
          </ContextMenu>

          {isAddCollectionDialogOpen && (
            <AddCollectionDialog gameIds={[gameId]} setIsOpen={setIsAddCollectionDialogOpen} />
          )}
          {isNameEditorDialogOpen && (
            <NameEditorDialog gameId={gameId} setIsOpen={setIsNameEditorDialogOpen} />
          )}
          {isPlayTimeEditorDialogOpen && (
            <PlayTimeEditorDialog gameId={gameId} setIsOpen={setIsPlayTimeEditorDialogOpen} />
          )}

          <HoverCardContent
            side="right"
            className={cn(
              'p-0 w-[250px] h-[230px] border-0 rounded-lg overflow-hidden shadow-xl relative mx-2',
              'cursor-pointer'
            )}
          >
            {/* background layer */}
            <div className="absolute inset-0">
              <GameImage
                gameId={gameId}
                type="background"
                alt={gameId}
                className="object-cover w-full h-full rounded-lg"
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-accent/40 to-accent/80 backdrop-blur-xl" />
            </div>

            {/* content area */}
            <div className="relative flex flex-col w-full h-full gap-2">
              {/* Game Title */}
              <div className={cn('font-bold text-accent-foreground truncate text-sm px-3 pt-2')}>
                {gameData?.name}
              </div>

              {/* Game Preview Image */}
              <div className={cn('relative w-full h-[128px]')}>
                <GameImage
                  gameId={gameId}
                  type="background"
                  className={cn('object-cover w-full h-full rounded-lg')}
                  style={{
                    maskImage: 'linear-gradient(to top, transparent 0%, black 30%)'
                  }}
                  alt={`${gameData?.name} preview`}
                  fallback={
                    <div className={cn('w-full h-full absolute')}>
                      <div
                        className={cn('flex items-center justify-center w-full h-full font-bold')}
                      >
                        {gameData?.name}
                      </div>
                    </div>
                  }
                />
              </div>

              {/* Game Information */}

              <div className={cn('flex flex-col gap-2 text-xs justify-center grow px-3 pb-2')}>
                {/* Playing time */}
                <div className="flex flex-row items-center justify-start gap-2">
                  <span className={cn('icon-[mdi--access-time] w-4 h-4')}></span>
                  <div>
                    {playTime
                      ? t('showcase.gameCard.playTime', { time: playTime })
                      : t('showcase.gameCard.noPlayRecord')}
                  </div>
                </div>

                {/* Last running time */}
                <div className="flex flex-row items-center justify-start gap-2">
                  <span className={cn('icon-[mdi--calendar-blank-outline] w-4 h-4')}></span>
                  <div>
                    {gameData?.lastRunDate
                      ? t('showcase.gameCard.lastRunAt', { date: new Date(gameData.lastRunDate) })
                      : t('showcase.gameCard.neverRun')}
                  </div>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
      {closestEdge && (
        <DropIndicator
          edge={closestEdge}
          gap={closestEdge === position ? '16px' : `${parentGap}px`}
        />
      )}
      {previewState.type === 'preview'
        ? createPortal(<Preview title={gameData?.name ?? ''} />, previewState.container)
        : null}
    </div>
  )
}
