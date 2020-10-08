export interface DTWindow extends Window {
  dofus: EventReadyObject & {
    connectionManager: EventReadyObject & {
      eventHandlers: { [key: string]: ((...args) => any)[] };
      sendMessage(verb: string, payload: any): any;
      on(verb: string, callback: (...args) => any): any;
    };
    sendMessage(verb: string, payload: any): any;
    on(verb: string, callback: (...args) => any): any;
  };
  gui: {
    pingSystem: {
      _pingBtn: {
        _pingBtn: GameGuiElement;
      };
    };
    wBody: GameGuiElement;
    numberInputPad: GameGuiElement & {
      _doDigit(digit: number): void;
      _doEnter(): void;
      _doBackspace(): void;
    };
    mainControls: {
      buttonBox: GameGuiElement;
    };
    windowsContainer: GameGuiElement;
    chat: {
      active: boolean;
      activate(): void;
      deactivate(): void;
    };
    timeline: {
      fightControlButtons: {
        _turnReadyBtn: GameGuiElement;
        _fightReadyBtn: GameGuiElement;
      };
    };
    menuBar: {
      _icons: GameGuiElement & {
        _childrenMap: {
          [key in GameMenuBarIconsNames]: GameGuiElement;
        };
      };
    };
    notificationBar: { removeNotification(id: string): void };
    fightManager: {
      fightState: -1 | 0 | 1; // Unknown | In preparation | Fighting
      _fighters: { [key: number]: FightManagerFighter };
    };
    shortcutBar: {
      _currentPanelType: 'spell' | 'item';
      _panels: {
        [key in 'spell' | 'item']: EventReadyObject & {
          slotList: (EventReadyObject &
            GameGuiElement & { data: { id: number } })[];
          index: number;
        };
      };
    };
    shopFloatingToolbar: {
      hide(): void;
      show(): void;
    };
    loginScreen: {
      _loginForm: {
        _inputLogin: GameGuiElement<HTMLInputElement>;
        _inputPassword: GameGuiElement<HTMLInputElement>;
        _rememberName: {
          rootElement: HTMLElement;
          activate(): void;
          deactivate(): void;
        };
        _btnPlay: {
          tap(): void;
        };
        _play(): void;
      };
      showLoginForm(): void;
    };
    playerData: {
      id: number;
      isFighting: boolean;
      loginName: string;
      characterBaseInformations: {
        name: string;
        level: string;
        entityLook: any;
      };
      characters: {
        mainCharacter: {
          spellData: {
            spells: {
              [key: number]: {
                spellLevel: {
                  effects: SpellEffect[];
                  criticalEffect: SpellEffect[];
                  minRange: number;
                  spellId: number;
                };
                _item: {
                  effects: {
                    actionId: number;
                    min: number;
                    max: number;
                  }[];
                  item: {
                    criticalHitBonus: number;
                  };
                };
              };
            };
          };
          characteristics: {
            [key in CharacterCaracteristics]: {
              getTotalStat: () => number;
            };
          };
        };
      };
    };
    party: {
      currentParty: {
        _childrenList: { memberData: PartyMemberData }[];
      };
      classicParty: GameGuiElement;
      collapse(): void;
    };
    on(
      verb: 'ExchangeObjectAddedMessage',
      callback: (event: ObjectAddedEvent) => any,
    ): any;
    on(verb: WindowGuiEventVerb, callback: (...args: any) => any): any;
    emit(verb: WindowGuiEventVerb, payload: any): void;
    _resizeUi(): void;
    closeContextualMenu(): void;
    openConfirmPopup(payload: {
      title: string;
      message: string;
      cb: (...args) => void;
    }): void;
  };

  foreground: EventReadyObject & {
    selectSpell(id: number): void;
  };

  isoEngine: {
    mapRenderer: {
      getCellSceneCoordinate(cellId: number): { x: number; y: number };
    };
    mapScene: {
      canvas: HTMLCanvasElement;
      camera: {
        maxZoom: number;
      };
      convertSceneToCanvasCoordinate(
        posX: number,
        posY: number,
      ): { x: number; y: number };
    };
    _castSpellImmediately(id: number): void;
  };

  singletons: ((index: number) => any) & {
    // tslint:disable-next-line: ban-types
    c: { [key: number]: { id: number; exports: Function & object } };
  };
}

export type UserTouchInteractions =
  | 'tap'
  | 'doubletap'
  | 'longtap'
  | 'open'
  | 'close';

export interface EventReadyObject<T = any> {
  _events: {
    [key in UserTouchInteractions]: ((...args) => any) & ((...args) => any)[];
  };
  addListener(verb: T, callback: (...args) => any): any;
  removeListener(verb: string, event: any): void;
  emit(verb: string, ...args: any): any;
  on(verb: T, callback: (...args) => any): any;
  once(verb: T, callback: (...args) => any): any;
}

export interface FightManagerFighter {
  buffs: FighterBuff[];
  data: {
    alive: boolean;
    stats: {
      [key in FighterStats]: number;
    };
    disposition: {
      cellId: number;
    };
  };
}

export interface FighterBuff {
  effect: {
    duration: number;
    value: number;
    diceNum: number;
    effectId: number;
    effect: {
      active: boolean;
    };
  };
}

export type GameMenuBarIconsNames =
  | 'Carac'
  | 'Spell'
  | 'Bag'
  | 'BidHouse'
  | 'Map'
  | 'Friend'
  | 'Book'
  | 'Guild'
  | 'Conquest'
  | 'Goultine'
  | 'Job'
  | 'Alliance'
  | 'Mount'
  | 'Directory'
  | 'Alignment'
  | 'Bestiary'
  | 'Title'
  | 'Achievement'
  | 'Almanax'
  | 'Spouse'
  | 'Shop'
  | 'TOA'
  | 'Help';

export interface PartyMemberData {
  id: number;
  level: number;
  name: string;
  entityLook: unknown;
  breed: number;
  sex: boolean;
  lifePoints: number;
  maxLifePoints: number;
  prospecting: number;
  regenRate: number;
  initiative: number;
  alignmentSide: number;
  worldX: number;
  worldY: number;
  mapId: number;
  subAreaId: number;
  status: unknown;
}

export interface GameGuiElement<T = HTMLElement> {
  rootElement: T;
  _childrenList: GameGuiElement[];
  _childrenMap: { [key: string]: GameGuiElement };
  tap(): void;
  show(): void;
  isVisible(): boolean;
  hide(): void;
  close(): void;
  enable(): void;
  disable(): void;
}

export type WindowGuiEventVerb =
  | 'appGoBackground'
  | 'initialized'
  | 'connected'
  | 'disconnect'
  | 'connectedAfterAppLeaveBackground'
  | 'AllianceMembershipMessage'
  | 'AllianceJoinedMessage'
  | 'AllianceGuildLeavingMessage'
  | 'AllianceLeftMessage'
  | 'AllianceInsiderInfoMessage'
  | 'AllianceInvitationStateRecruterMessage'
  | 'AllianceInvitationStateRecrutedMessage'
  | 'AllianceInvitedMessage'
  | 'PrismsListUpdateMessage'
  | 'LifePointsRegenBeginMessage'
  | 'LifePointsRegenEndMessage'
  | 'SpellListMessage'
  | 'SpellUpgradeSuccessMessage'
  | 'UpdateSelfAgressableStatusMessage'
  | 'UpdateMapPlayersAgressableStatusMessage'
  | 'EmoteListMessage'
  | 'EmoteAddMessage'
  | 'EmoteRemoveMessage'
  | 'GameRolePlayPlayerFightFriendlyRequestedMessage'
  | 'GameRolePlayPlayerFightFriendlyAnsweredMessage'
  | 'ChallengeFightJoinRefusedMessage'
  | 'GameRolePlayAggressionMessage'
  | 'GuildMembershipMessage'
  | 'GuildJoinedMessage'
  | 'GuildInformationsMembersMessage'
  | 'GuildMemberLeavingMessage'
  | 'GuildMemberOnlineStatusMessage'
  | 'GuildMemberWarnOnConnectionStateMessage'
  | 'GuildLeftMessage'
  | 'GuildInvitationStateRecruterMessage'
  | 'GuildInvitationStateRecrutedMessage'
  | 'GuildInvitedMessage'
  | 'GuildInformationsPaddocksMessage'
  | 'GuildPaddockBoughtMessage'
  | 'GuildPaddockRemovedMessage'
  | 'GuildHousesInformationMessage'
  | 'GuildHouseUpdateInformationMessage'
  | 'GuildHouseRemoveMessage'
  | 'MoodSmileyUpdateMessage'
  | 'MoodSmileyResultMessage'
  | 'ObjectAddedMessage'
  | 'ObjectsAddedMessage'
  | 'ObjectModifiedMessage'
  | 'ObjectMovementMessage'
  | 'InventoryContentMessage'
  | 'InventoryContentAndPresetMessage'
  | 'InventoryPresetDeleteResultMessage'
  | 'InventoryPresetSaveResultMessage'
  | 'InventoryPresetUseResultMessage'
  | 'InventoryPresetUpdateMessage'
  | 'InventoryPresetItemUpdateMessage'
  | 'InventoryPresetItemUpdateErrorMessage'
  | 'SetUpdateMessage'
  | 'KamasUpdateMessage'
  | 'JobDescriptionMessage'
  | 'JobCrafterDirectorySettingsMessage'
  | 'JobListedUpdateMessage'
  | 'JobExperienceUpdateMessage'
  | 'JobExperienceMultiUpdateMessage'
  | 'JobLevelUpMessage'
  | 'JobUnlearntMessage'
  | 'JobAllowMultiCraftRequestMessage'
  | 'JobMultiCraftAvailableSkillsMessage'
  | 'CurrentMapMessage'
  | 'AchievementListMessage'
  | 'AchievementFinishedMessage'
  | 'AchievementRewardSuccessMessage'
  | 'mapComplementaryInformationsData'
  | 'HousePropertiesMessage'
  | 'PartyInvitationDetailsMessage'
  | 'PartyNewGuestMessage'
  | 'PartyNewMemberMessage'
  | 'PartyUpdateMessage'
  | 'PartyJoinMessage'
  | 'PartyFollowStatusUpdateMessage'
  | 'GameRolePlayArenaRegistrationStatusMessage'
  | 'GameFightJoinMessage'
  | 'GameFightEndMessage'
  | 'GameRolePlayArenaUpdatePlayerInfosMessage'
  | 'GameRolePlayArenaFighterStatusMessage'
  | 'PartyCannotJoinErrorMessage'
  | 'PartyMemberInFightMessage'
  | 'GameRolePlayRemoveChallengeMessage'
  | 'QuestListMessage'
  | 'QuestStartedMessage'
  | 'QuestObjectiveValidatedMessage'
  | 'QuestStepInfoMessage'
  | 'QuestStepStartedMessage'
  | 'QuestStepValidatedMessage'
  | 'QuestValidatedMessage'
  | 'FriendUpdateMessage'
  | 'FriendsListMessage'
  | 'IgnoredListMessage'
  | 'FriendAddedMessage'
  | 'IgnoredAddedMessage'
  | 'IgnoredDeleteResultMessage'
  | 'FriendWarnOnConnectionStateMessage'
  | 'SpouseInformationsMessage'
  | 'SpouseStatusMessage'
  | 'AlignmentRankUpdateMessage'
  | 'ServerExperienceModificatorMessage'
  | 'GameContextRefreshEntityLookMessage'
  | 'CharacterLevelUpMessage'
  | 'GameRolePlayPlayerLifeStatusMessage'
  | 'GameRolePlayGameOverMessage'
  | 'ServerStatusUpdateMessage'
  | 'SelectedServerRefusedMessage'
  | 'ServerOptionalFeaturesMessage'
  | 'ServerSessionConstantsMessage'
  | 'ServerSettingsMessage'
  | 'GameFightStartMessage'
  | 'GameFightStartingMessage'
  | 'GameFightTurnResumeMessage'
  | 'GameFightTurnStartMessage'
  | 'GameFightTurnStartSlaveMessage'
  | 'GameFightHumanReadyStateMessage'
  | 'confirmTurnEnd'
  | 'GameFightTurnEndMessage'
  | 'GameFightShowFighterMessage'
  | 'GameFightShowFighterRandomStaticPoseMessage'
  | 'GameActionFightSummonMessage'
  | 'GameFightTurnListMessage'
  | 'GameFightSynchronizeMessage'
  | 'GameFightLeaveMessage'
  | '_GameActionFightLeaveMessage'
  | 'GameActionFightDeathMessage'
  | 'GameFightRefreshFighterMessage'
  | 'GameFightRemoveTeamMemberMessage'
  | 'GameFightNewRoundMessage'
  | 'GameFightResumeMessage'
  | 'GameFightResumeWithSlavesMessage'
  | 'GameFightSpectateMessage'
  | 'GameActionFightChangeLookMessage'
  | 'GameActionFightDispellEffectMessage'
  | 'GameActionFightDispellSpellMessage'
  | 'GameActionFightDispellMessage'
  | 'GameActionFightNoSpellCastMessage'
  | 'GameActionFightLifePointsGainMessage'
  | 'GameActionFightLifePointsLostMessage'
  | 'GameActionFightLifeAndShieldPointsLostMessage'
  | 'GameActionFightPointsVariationMessage'
  | 'GameActionFightVanishMessage'
  | 'GameActionFightSpellCooldownVariationMessage'
  | 'GameActionFightModifyEffectsDurationMessage'
  | 'GameActionFightExchangePositionsMessage'
  | 'GameActionFightSlideMessage'
  | 'GameActionFightTeleportOnSameMapMessage'
  | 'GameMapMovementMessage'
  | 'GameActionFightCarryCharacterMessage'
  | 'GameActionFightThrowCharacterMessage'
  | 'GameActionFightDropCharacterMessage'
  | 'sendAllFightEvent'
  | 'GameActionFightReduceDamagesMessage'
  | 'GameActionFightDodgePointLossMessage'
  | 'GameActionFightSpellImmunityMessage'
  | 'GameActionFightReflectSpellMessage'
  | 'GameActionFightReflectDamagesMessage'
  | 'GameActionFightTackledMessage'
  | 'GameActionFightKillMessage'
  | 'GameActionFightInvisibilityMessage'
  | 'GameActionFightTriggerGlyphTrapMessage'
  | 'GameFightUpdateTeamMessage'
  | 'GameFightOptionStateUpdateMessage'
  | 'GameContextDestroyMessage'
  | 'resize'
  | 'AccountHouseMessage'
  | 'CompassUpdateMessage'
  | 'CompassUpdatePartyMemberMessage'
  | 'CompassResetMessage'
  | 'GuildCreationResultMessage'
  | 'GuildInAllianceFactsMessage'
  | 'GuildFactsMessage'
  | 'PrismSettingsErrorMessage'
  | 'AllianceCreationResultMessage'
  | 'AllianceFactsMessage'
  | 'AllianceFactsErrorMessage'
  | 'BasicTimeMessage'
  | 'TaxCollectorMovementMessage'
  | 'TaxCollectorAttackedMessage'
  | 'TaxCollectorErrorMessage'
  | 'TaxCollectorAttackedResultMessage'
  | 'ExchangeGuildTaxCollectorGetMessage'
  | 'TaxCollectorListMessage'
  | 'TaxCollectorMovementAddMessage'
  | 'TaxCollectorMovementRemoveMessage'
  | 'PrismsListMessage'
  | 'PrismsInfoValidMessage'
  | 'PrismFightAddedMessage'
  | 'PrismFightRemovedMessage'
  | 'GuildFightPlayersHelpersJoinMessage'
  | 'PrismFightDefenderAddMessage'
  | 'PrismFightAttackerAddMessage'
  | 'GuildFightPlayersEnemiesListMessage'
  | 'GuildFightPlayersEnemyRemoveMessage'
  | 'GuildFightPlayersHelpersLeaveMessage'
  | 'PrismFightDefenderLeaveMessage'
  | 'PrismFightAttackerRemoveMessage'
  | 'NotificationListMessage'
  | 'ExchangeOkMultiCraftMessage'
  | 'ExchangeStartOkCraftWithInformationMessage'
  | 'ExchangeStartOkMulticraftCrafterMessage'
  | 'ExchangeStartOkMulticraftCustomerMessage'
  | 'ObjectAveragePricesMessage'
  | 'ExchangeMountStableBornAddMessage'
  | 'ExchangeMountStableAddMessage'
  | 'ExchangeMountStableRemoveMessage'
  | 'ExchangeMountPaddockAddMessage'
  | 'ExchangeMountPaddockRemoveMessage'
  | 'PaddockPropertiesMessage'
  | 'ExchangeMountStableErrorMessage'
  | 'AcquaintanceSearchErrorMessage'
  | 'AcquaintanceServerListMessage'
  | 'TrustStatusMessage'
  | 'MapFightCountMessage'
  | 'MapRunningFightListMessage'
  | 'MapRunningFightDetailsMessage'
  | 'CharacterDeletionErrorMessage'
  | 'ConsoleCommandsListMessage'
  | 'ConsoleMessage'
  | 'DebugInClientMessage'
  | 'DocumentReadingBeginMessage'
  | 'PurchasableDialogMessage'
  | 'HouseBuyResultMessage'
  | 'HouseSoldMessage'
  | 'ZaapListMessage'
  | 'TeleportDestinationsListMessage'
  | 'ExchangeReplyTaxVendorMessage'
  | 'LockableShowCodeDialogMessage'
  | 'LockableCodeResultMessage'
  | 'GuildCreationStartedMessage'
  | 'GuildModificationStartedMessage'
  | 'AllianceCreationStartedMessage'
  | 'AllianceModificationStartedMessage'
  | 'HouseToSellListMessage'
  | 'PaddockToSellListMessage'
  | 'PaddockSellBuyDialogMessage'
  | 'SpellForgetUIMessage'
  | 'ExchangeCraftResultMessage'
  | 'ExchangeCraftResultWithObjectIdMessage'
  | 'ExchangeCraftResultWithObjectDescMessage'
  | 'ExchangeReplayCountModifiedMessage'
  | 'ExchangeItemAutoCraftRemainingMessage'
  | 'ExchangeItemAutoCraftStopedMessage'
  | 'ExchangeCraftSlotCountIncreasedMessage'
  | 'ExchangeObjectAddedMessage'
  | 'ExchangeObjectModifiedMessage'
  | 'ExchangeObjectRemovedMessage'
  | 'ExchangeGoldPaymentForCraftMessage'
  | 'ExchangeItemPaymentForCraftMessage'
  | 'ExchangeModifiedPaymentForCraftMessage'
  | 'ExchangeRemovedPaymentForCraftMessage'
  | 'ExchangeClearPaymentForCraftMessage'
  | 'ExchangeIsReadyMessage'
  | 'ExchangeStartOkJobIndexMessage'
  | 'JobCrafterDirectoryListMessage'
  | 'JobCrafterDirectoryAddMessage'
  | 'JobCrafterDirectoryRemoveMessage'
  | 'ExchangeCraftResultMagicWithObjectDescMessage'
  | 'ExchangeMultiCraftCrafterCanUseHisRessourcesMessage'
  | 'ExchangeObjectPutInBagMessage'
  | 'ExchangeObjectRemovedFromBagMessage'
  | 'ExchangeObjectModifiedInBagMessage'
  | 'ExchangeStartOkNpcTradeMessage'
  | 'ExchangeKamaModifiedMessage'
  | 'ExchangeRequestedTradeMessage'
  | 'ExchangeStartedWithPodsMessage'
  | 'gameOptionChanged'
  | 'checkServerLag'
  | 'GameFightTurnStartPlayingMessage'
  | 'KohUpdateMessage'
  | 'GameRolePlayArenaFightPropositionMessage'
  | 'PartyUpdateLightMessage'
  | 'ChallengeInfoMessage'
  | 'ChallengeResultMessage'
  | 'LockableStateUpdateHouseDoorMessage'
  | 'AuthenticationTicketAcceptedMessage'
  | 'GameFightPlacementPossiblePositionsMessage'
  | 'spellSlotSelected'
  | 'spellSlotDeselected'
  | 'NpcDialogCreationMessage';

export interface ObjectAddedEvent {
  object: {
    objectUID: number;
  };
}

export type CharacterCaracteristics =
  | '_type'
  | 'alignmentInfos'
  | 'agility'
  | 'chance'
  | 'intelligence'
  | 'strength'
  | 'wisdom'
  | 'actionPoints'
  | 'airDamageBonus'
  | 'airElementReduction'
  | 'airElementResistPercent'
  | 'allDamagesBonus'
  | 'criticalDamageBonus'
  | 'criticalDamageReduction'
  | 'criticalHit'
  | 'criticalHitWeapon'
  | 'criticalMiss'
  | 'damagesBonusPercent'
  | 'dodgePALostProbability'
  | 'dodgePMLostProbability'
  | 'earthDamageBonus'
  | 'earthElementReduction'
  | 'earthElementResistPercent'
  | 'fireDamageBonus'
  | 'fireElementReduction'
  | 'fireElementResistPercent'
  | 'healBonus'
  | 'initiative'
  | 'movementPoints'
  | 'neutralDamageBonus'
  | 'neutralElementReduction'
  | 'neutralElementResistPercent'
  | 'PAAttack'
  | 'permanentDamagePercent'
  | 'PMAttack'
  | 'probationTime'
  | 'prospecting'
  | 'pushDamageBonus'
  | 'pushDamageReduction'
  | 'pvpAirElementReduction'
  | 'pvpAirElementResistPercent'
  | 'pvpEarthElementReduction'
  | 'pvpEarthElementResistPercent'
  | 'pvpFireElementReduction'
  | 'pvpFireElementResistPercent'
  | 'pvpNeutralElementReduction'
  | 'pvpNeutralElementResistPercent'
  | 'pvpWaterElementReduction'
  | 'pvpWaterElementResistPercent'
  | 'range'
  | 'reflect'
  | 'summonableCreaturesBoost'
  | 'summonableMaximumBombs'
  | 'tackleBlock'
  | 'tackleEvade'
  | 'trapBonus'
  | 'trapBonusPercent'
  | 'vitality'
  | 'waterDamageBonus'
  | 'waterElementReduction'
  | 'waterElementResistPercent'
  | 'weaponDamagesBonusPercent'
  | 'dealtDamageMultiplierMelee'
  | 'receivedDamageMultiplierMelee'
  | 'dealtDamageMultiplierDistance'
  | 'receivedDamageMultiplierDistance'
  | 'dealtDamageMultiplierWeapon'
  | 'receivedDamageMultiplierWeapon'
  | 'dealtDamageMultiplierSpells'
  | 'receivedDamageMultiplierSpells'
  | 'spellModifications'
  | 'actionPointsCurrent'
  | 'additionnalPoints'
  | 'energyPoints'
  | 'experience'
  | 'experienceLevelFloor'
  | 'experienceNextLevelFloor'
  | 'kamas'
  | 'lifePoints'
  | 'maxEnergyPoints'
  | 'maxLifePoints'
  | 'movementPointsCurrent'
  | 'spellsPoints'
  | 'statsPoints';

export interface SpellEffect {
  targetMask: string;
  /** minimum spell damage */
  diceNum: number;
  /** maximum spell damage */
  diceSide: number;
  effectId: number;
  rawZone: string;
}

export type FighterStats =
  | 'actionPoints'
  | 'airElementReduction'
  | 'airElementResistPercent'
  | 'baseMaxLifePoints'
  | 'criticalDamageFixedResist'
  | 'dodgePALostProbability'
  | 'dodgePMLostProbability'
  | 'earthElementReduction'
  | 'earthElementResistPercent'
  | 'fireElementReduction'
  | 'fireElementResistPercent'
  | 'invisibilityState'
  | 'initiative'
  | 'lifePoints'
  | 'maxActionPoints'
  | 'maxLifePoints'
  | 'maxMovementPoints'
  | 'movementPoints'
  | 'neutralElementReduction'
  | 'neutralElementResistPercent'
  | 'permanentDamagePercent'
  | 'pushDamageFixedResist'
  | 'shieldPoints'
  | 'summoned'
  | 'summoner'
  | 'tackleBlock'
  | 'tackleEvade'
  | 'waterElementReduction'
  | 'waterElementResistPercent';
