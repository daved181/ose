/**
 * @file A class representing a creature's spellcasting abilities
 */

type Slot = {
  used: number;
  max: number;
};

type Slots = {
  [n: number]: Slot;
};

type Spells = {
  [n: number]: Item[];
};

type Point = {
  used: number;
  max: number;
};

type Points = {
  [n: number]: Point;
};

const reducedSpells = (list: Spells, item: Item) => {
  const { lvl } = item.system;
  const othersAtLvl = list[lvl] || [];
  return {
    ...list,
    [lvl]: [...othersAtLvl, item].sort((a, b) => a.name.localeCompare(b.name)),
  };
};

export interface CharacterSpells {
  enabled: boolean;
  spellList: Spells;
  slots: Slots;
  points: Points;
}

export default class OseDataModelCharacterSpells implements CharacterSpells  {
  #slots = {};

  #spellList: Item[] = [];

  #enabled: boolean;

  #points = {};

  constructor(
    {
      enabled,
      ...maxPoints
    }: { enabled?: boolean; [n: number]: { max: number } },
    spellList: Item[] = [],
  ) {
    this.#spellList = spellList;
    this.#enabled = enabled || false;

    //const usedSlots = this.#spellList?.reduce(this.#reducedUsedSlots, {}) || {};

    const usedPoints = this.#spellList?.reduce(this.#reducedUsedPoints, {}) || {};
    /*this.#slots = Object.keys(maxSlots || {}).reduce(
      (list, item, idx) =>
        this.#usedAndMaxSlots(list, item, idx, usedSlots, maxSlots),
      {}
    );*/
    
    this.#points = Object.keys(maxPoints || {}).reduce(
      (list, item, idx) =>
        this.#usedAndMaxPoints(list, item, idx, usedPoints, maxPoints),
      {}
    );
  }

  get enabled() {
    return this.#enabled;
  }

  set enabled(state) {
    this.#enabled = state;
  }

  get spellList() {
    return this.#spellList.reduce(
      (list, item) => reducedSpells(list, item),
      {}
    );
  }

  // eslint-disable-next-line class-methods-use-this
  #reducedUsedSlots(list: { [n: number]: number }, item: Item) {
    const { lvl } = item.system;
    let { cast } = item.system;
    if (Number.isNaN(cast)) cast = 0;
    const usedAtLvl = list[lvl] || 0;
    return {
      ...list,
      [lvl]: usedAtLvl + cast,
    };
  }

    // eslint-disable-next-line class-methods-use-this
  #reducedUsedPoints(list: { [n: number]: number }, item: Item) {
    const { lvl } = item.system;
    let { cast } = item.system;
    let level = item.actor["system"]["details"]["level"] || 0
    if (Number.isNaN(cast)) cast = 0;
    const usedAtLvl = list[lvl] || 0;

    if (Object.keys(list).length == 0) { // starts with level amount of points
      return {
        ...list,
        [lvl]: level - cast,
      };
    }

    return {
      ...list,
      [lvl]: usedAtLvl - cast,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  #usedAndMaxSlots(
    list: Slots,
    item: Item | string,
    idx: number,
    usedSlots: { [n: number]: number },
    maxSlots: { [n: number]: { max: number } }
  ) {
    if (item === "enabled") return list;
    const lv = idx + 1;
    const max = maxSlots[lv]?.max || 0;
    const used = usedSlots[lv];
    
    return {
      ...list,
      [lv]: { used, max },
    };
  }

  get slots(): Slots {
    return this.#slots;
  }

  // eslint-disable-next-line class-methods-use-this
  #usedAndMaxPoints(
    list: Points,
    item: Item | string,
    idx: number,
    usedPoints: { [n: number]: number },
    maxPoints: { [n: number]: { max: number } }
  ) {
    if (item === "enabled") return list;
    const lv = idx + 1;
    const max = maxPoints[lv]?.max || 0;
    const used = usedPoints[lv];

    return {
      ...list,
      [lv]: { used, max },
    };
  }

  get points(): Points {
    return this.#points;
  }
}
