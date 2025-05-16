import {
  searchBangumiGames,
  getBangumiMetadata,
  getBangumiMetadataByName,
  getGameCover,
  getGameBackgrounds,
  getGameBackgroundsByName,
  checkGameExists,
  getGameCoverByName
} from './common'
import { GameList, GameMetadata, ScraperIdentifier } from '@appTypes/utils'
import log from 'electron-log/main.js'

/**
 * Search for games on Bangumi
 * @param gameName The name of the game to search for
 * @returns A list of games
 * @throws An error if the operation fails
 */
export async function searchGamesFromBangumi(gameName: string): Promise<GameList> {
  try {
    const games = await searchBangumiGames(gameName)
    return games
  } catch (error) {
    log.error('Error searching for games:', error)
    throw error
  }
}

/**
 * Get game metadata from Bangumi
 * @param identifier The identifier of the game
 * @returns The metadata for the game
 * @throws An error if the operation fails
 */
export async function getGameMetadataFromBangumi(
  identifier: ScraperIdentifier
): Promise<GameMetadata> {
  try {
    const metadata =
      identifier.type === 'id'
        ? await getBangumiMetadata(identifier.value)
        : await getBangumiMetadataByName(identifier.value)
    return metadata
  } catch (error) {
    log.error('Error fetching game metadata:', error)
    throw error
  }
}

/**
 * Check if a game exists on Bangumi
 * @param bangumiId The id of the game on Bangumi
 * @returns A boolean indicating if the game exists
 * @throws An error if the operation fails
 */
export async function checkGameExistsOnBangumi(bangumiId: string): Promise<boolean> {
  try {
    const exists = await checkGameExists(bangumiId)
    return exists
  } catch (error) {
    log.error('Error checking if game exists:', error)
    throw error
  }
}

/**
 * Get game backgrounds from Bangumi
 * @param identifier The identifier of the game
 * @returns A list of backgrounds
 * @throws An error if the operation fails
 */
export async function getGameBackgroundsFromBangumi(
  identifier: ScraperIdentifier
): Promise<string[]> {
  try {
    const images =
      identifier.type === 'id'
        ? await getGameBackgrounds(identifier.value)
        : await getGameBackgroundsByName(identifier.value)
    return images
  } catch (error) {
    log.error('Error fetching game images:', error)
    throw error
  }
}

/**
 * Get game cover from Bangumi
 * @param identifier The identifier of the game
 * @returns The cover image for the game
 * @throws An error if the operation fails
 */
export async function getGameCoverFromBangumi(identifier: ScraperIdentifier): Promise<string> {
  try {
    const cover =
      identifier.type === 'id'
        ? await getGameCover(identifier.value)
        : await getGameCoverByName(identifier.value)
    return cover
  } catch (error) {
    log.error('Error fetching game cover:', error)
    throw error
  }
}
