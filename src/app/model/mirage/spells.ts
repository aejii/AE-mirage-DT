import { GameInstance } from '../classes/game-instance';
import { SpellEffect } from '../DT/window';

const SPELLS_EFFECTS = {
  DOES_DAMAGES: 2,
  IS_CHARGEABLE: 293,
  FROM_OWN_LIFEPOINTS: 672,
  LIFESTEALS: [91, 92, 93, 94, 95],
  DAMAGES: [96, 97, 98, 99, 100],
  WEAPON_SKILL: 1144,
  HEALS: 108,
};

const DAMAGE_ELEMENTS: { [key: number]: SpellElement } = {
  91: 'water',
  92: 'earth',
  93: 'air',
  94: 'fire',
  95: 'neutral',
  96: 'water',
  97: 'earth',
  98: 'air',
  99: 'fire',
  100: 'neutral',
  108: 'heal',
};

const ELEMENT_CARAC_NAME: { [key in SpellElement]?: CharacterMainCarac } = {
  air: 'agility',
  earth: 'strength',
  fire: 'intelligence',
  water: 'chance',
};

export class MgSpellsManager {
  constructor(private instance: GameInstance) {}

  public previewDamages(spellId: number): SpellPreview[] {
    const notReduced = this.getNotReducedDamages(spellId);

    const reduced = this.reduceDamagesWithFighterStats(notReduced);

    // const spell = this.getSpell(spellId);
    // if (
    //   spellId === 0 ||
    //   (spell?.spellLevel?.minRange > 0 &&
    //     spell?.spellLevel?.effects?.every?.(
    //       (effect) => effect?.rawZone === 'P',
    //     ))
    // )
    delete reduced[this.instance.character.id];

    const withPositions = this.associatePositionsToPreviews(reduced);
    const final = this.prettifyPreview(withPositions);

    return final;
  }

  /**
   * - Groups same attacks
   * - Adds crit damages to normal damages
   * - Adds lifesteal
   * - Resolves fixed damages (max <= min)
   * - Resolves weird damages (< 0 etc)
   */
  private prettifyPreview(previews: SpellPreview[]): SpellPreview[] {
    const newPreviews = previews.map((preview) => {
      const newLines: DamagePreviewLine[] = [];

      for (const line of preview?.previews) {
        // No max damage below min damage, no damage below zero
        if (line?.max <= line?.min) line.max = line?.min;
        if (line?.min < 0) line.min = 0;
        if (line?.max < 0) line.max = 0;

        const existingNewLine = newLines.find(
          (newLine) =>
            line?.id === newLine?.id && line?.element === newLine?.element,
        );
        if (existingNewLine) {
          if (line?.crit) {
            existingNewLine.critMin =
              (existingNewLine.critMin ?? 0) + line?.min;
            existingNewLine.critMax =
              (existingNewLine.critMax ?? 0) + line?.max;
          } else {
            existingNewLine.min = (existingNewLine.critMin ?? 0) + line?.min;
            existingNewLine.max = (existingNewLine.critMax ?? 0) + line?.max;
          }
        } else {
          newLines.push({
            ...line,
            critMin: (line?.crit && (line?.min ?? 0)) || 0,
            critMax: (line?.crit && (line?.max ?? 0)) || 0,
          });
        }
      }

      const lifesteals = preview?.previews?.filter?.((line) =>
        SPELLS_EFFECTS.LIFESTEALS.includes(line.id),
      );

      if (lifesteals.length) {
        const base = lifesteals.find((line) => !line.crit);
        const crit = lifesteals.find((line) => line.crit);
        newLines.push({
          element: 'heal',
          min: Math.floor(base?.min / 2),
          max: Math.floor(base?.max / 2),
          critMin: Math.floor(crit?.min / 2),
          critMax: Math.floor(crit?.max / 2),
          id: base?.id,
        });
      }

      newLines.forEach((line) => {
        if (isNaN(line.min)) line.min = '??' as any;
        if (isNaN(line.max)) line.max = '??' as any;
        if (isNaN(line.critMin)) line.critMin = '??' as any;
        if (isNaN(line.critMax)) line.critMax = '??' as any;
      });

      return { ...preview, previews: newLines };
    });

    return newPreviews;
  }

  private calculateDamagesFromOwnLifPoints(baseDamages: number): number {
    // Dommages occasionnés = ( %max * ( cos ( 2 * Pi * ( %vie - 0,5 ) ) +1 ) ² ) / 4 * VieMax
    const self = this.instance.fightManager.selfTarget;
    const lifePoints = self?.data?.stats?.lifePoints ?? 0;
    const maxLifePoints = self?.data?.stats?.baseMaxLifePoints ?? 0;
    const currentLifeRatio = lifePoints / maxLifePoints ?? 1;

    let res = currentLifeRatio - 0.5;
    res *= Math.PI * 2;
    res = Math.cos(res);
    res += 1;
    res = Math.pow(res, 2);
    res *= baseDamages / 100;
    res *= maxLifePoints;
    res /= 4;

    return Math.floor(res);
  }

  private associatePositionsToPreviews(damagePreviewsByFighter: {
    [key: number]: DamagePreviewLine[];
  }) {
    const fighters = this.instance.fightManager.fightersList;

    return Object.entries(damagePreviewsByFighter).map(
      ([fighterId, previews]) => {
        const cellId = fighters?.[fighterId]?.data?.disposition?.cellId;
        const cell = this.instance.window?.isoEngine?.mapRenderer?.getCellSceneCoordinate?.(
          cellId,
        );
        const coord = this.instance.window?.isoEngine?.mapScene?.convertSceneToCanvasCoordinate?.(
          cell?.x,
          cell?.y,
        );

        return {
          previews,
          cell,
          coord,
        };
      },
    );
  }

  private reduceDamagesWithFighterStats(
    damages: DamagePreviewLine[],
  ): {
    [key: number]: DamagePreviewLine[];
  } {
    const fighters = this.instance.fightManager.fightersList;

    const reducedDamages = Object.entries(fighters)
      .filter(([id, fighter]) => !!fighter.data.alive)
      .map(([fighterId, fighter]) => {
        const reducedDamageList = damages.map((damage) => {
          const res =
            fighter?.data?.stats?.[damage?.element + 'ElementReduction'] ?? 0;
          const resPercent =
            fighter?.data?.stats?.[damage?.element + 'ElementResistPercent'] ??
            0;
          const resCrit = damage.crit
            ? fighter?.data?.stats?.criticalDamageFixedResist ?? 0
            : 0;

          return {
            ...damage,
            crit: damage?.crit,
            element: damage?.element,
            min: Math.floor(
              (damage?.min - res - resCrit) * ((100 - resPercent) / 100),
            ),
            max: Math.floor(
              (damage?.max - res - resCrit) * ((100 - resPercent) / 100),
            ),
          };
        });

        return [fighterId, reducedDamageList];
      })
      .reduce(
        (p, n) => ({
          ...p,
          [n[0] as string]: n[1],
        }),
        {},
      );

    return reducedDamages;
  }

  private getNotReducedDamages(spellId: number) {
    const dmgEffects = this.getDamagingEffects(spellId);

    const damages = dmgEffects.map((effect) =>
      this.calculateDamagesWithoutReduction(effect, spellId === 0),
    );
    return damages;
  }

  private calculateDamagesWithoutReduction(
    effect: MgSpellEffect,
    addWeaponSkill = false,
  ): DamagePreviewLine {
    if (effect?.id === SPELLS_EFFECTS.FROM_OWN_LIFEPOINTS) {
      const minDmg = effect?.minDmg;
      const dmg = this.calculateDamagesFromOwnLifPoints(minDmg);

      return {
        id: effect?.id,
        crit: effect?.isCritical,
        min: dmg,
        max: dmg,
        element: effect?.element,
      };
    }

    const caracsRef = this.instance?.window?.gui?.playerData?.characters
      ?.mainCharacter?.characteristics;

    const elementSwitch: SpellElement =
      effect.element === 'neutral'
        ? 'earth'
        : effect.element === 'heal'
        ? 'fire'
        : effect.element;
    const caracName = ELEMENT_CARAC_NAME[elementSwitch];
    const caracValue = caracsRef?.[caracName]?.getTotalStat?.() ?? 0;

    const baseDmgBonus =
      effect.element === 'heal'
        ? 0
        : caracsRef?.allDamagesBonus?.getTotalStat() ?? 0;
    const elementDmgBonus =
      effect.element === 'heal'
        ? caracsRef.healBonus?.getTotalStat?.() ?? 0
        : caracsRef?.[effect.element + 'DamageBonus']?.getTotalStat?.() ?? 0;

    const weaponSkillBonus = addWeaponSkill
      ? this.instance.fightManager.selfTarget.buffs.find(
          (buff) =>
            buff?.effect?.effectId === SPELLS_EFFECTS.WEAPON_SKILL &&
            buff?.effect?.effect?.active,
        )?.effect?.diceNum ?? 0
      : 0;

    const basePercentDmgBonus =
      effect.element === 'heal'
        ? 0
        : (caracsRef?.damagesBonusPercent?.getTotalStat() ?? 0) +
          weaponSkillBonus;

    const critDmg = effect.isCritical
      ? caracsRef?.criticalDamageBonus?.getTotalStat?.() ?? 0
      : 0;

    const distanceReduction =
      effect.zone === 'P'
        ? 1
        : 1 - (+effect.zone.match(/^\D(\d)$/)?.[1] ?? 0) / 10;

    const finalMinDmg =
      ((effect.minDmg * (100 + caracValue + basePercentDmgBonus * 0.8)) / 100 +
        baseDmgBonus +
        elementDmgBonus +
        critDmg) *
      distanceReduction;
    const finalMaxDmg =
      (effect.maxDmg * (100 + caracValue + basePercentDmgBonus * 0.8)) / 100 +
      baseDmgBonus +
      elementDmgBonus +
      critDmg;
    return {
      id: effect.id,
      crit: effect.isCritical,
      min: finalMinDmg,
      max: finalMaxDmg,
      element: effect.element,
    };
  }

  private getSpell(spellId: number) {
    return this.instance.window?.gui?.playerData?.characters?.mainCharacter
      ?.spellData?.spells?.[spellId];
  }

  private getEffects(spellId: number, isCritical = false) {
    if (spellId === 0) {
      const spell = this.getSpell(0);
      return spell._item.effects.map((effect) => ({
        effectId: effect.actionId,
        diceNum:
          effect.min + (isCritical ? spell._item.item.criticalHitBonus : 0),
        diceSide:
          effect.max + (isCritical ? spell._item.item.criticalHitBonus : 0),
        rawZone: 'P',
      })) as SpellEffect[];
    }

    if (!isCritical) return this.getSpell(spellId)?.spellLevel?.effects;
    else return this.getSpell(spellId)?.spellLevel?.criticalEffect;
  }

  private getDamagingEffects(spellId: number): MgSpellEffect[] {
    const effects = this.getEffects(spellId, false).filter(
      (effect) => !effect.targetMask.includes('i'),
    );
    const critEffects = this.getEffects(spellId, true).filter(
      (effect) => !effect.targetMask.includes('i'),
    );

    const ownFighter = this.instance.fightManager.selfTarget;

    const buffs = ownFighter.buffs ?? [];

    const chargedSpellBuffValue =
      buffs.filter(
        (buff) =>
          buff.effect.effectId === SPELLS_EFFECTS.IS_CHARGEABLE &&
          buff.effect.duration === 1 &&
          buff.effect.diceNum === spellId,
      )?.[0]?.effect?.value ?? 0;

    const mgEffects: MgSpellEffect[] = effects
      ?.map?.((effect) => ({
        id: effect.effectId,
        minDmg: effect.diceNum + chargedSpellBuffValue,
        maxDmg: effect.diceSide + chargedSpellBuffValue,
        element: DAMAGE_ELEMENTS[effect.effectId],
        isCritical: false,
        zone: effect.rawZone,
      }))
      ?.concat?.(
        critEffects.map((effect) => ({
          id: effect.effectId,
          minDmg: effect.diceNum + chargedSpellBuffValue,
          maxDmg: effect.diceSide + chargedSpellBuffValue,
          element: DAMAGE_ELEMENTS[effect.effectId],
          isCritical: true,
          zone: effect.rawZone,
        })),
      );

    const damagingEffects = mgEffects.filter(
      ({ id }) =>
        SPELLS_EFFECTS.DAMAGES.includes(id) ||
        SPELLS_EFFECTS.LIFESTEALS.includes(id) ||
        SPELLS_EFFECTS.HEALS == id ||
        SPELLS_EFFECTS.FROM_OWN_LIFEPOINTS === id,
    );

    return damagingEffects;
  }
}

type SpellElement = 'neutral' | 'earth' | 'fire' | 'water' | 'air' | 'heal';
type CharacterMainCarac = 'strength' | 'intelligence' | 'chance' | 'agility';

interface MgSpellEffect {
  id: number;
  minDmg: number;
  maxDmg: number;
  element: SpellElement;
  isCritical: boolean;
  zone?: string;
  canCastOnSelf?: boolean;
}

interface DamagePreviewLine {
  id: number;
  crit?: boolean;
  min: number;
  max: number;
  element: SpellElement;
  critMin?: number;
  critMax?: number;
}

export interface SpellPreview {
  previews: DamagePreviewLine[];
  cell: {
    x: number;
    y: number;
  };
  coord: {
    x: number;
    y: number;
  };
}
