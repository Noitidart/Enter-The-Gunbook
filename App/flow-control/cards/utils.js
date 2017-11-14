// @flow

import { CARDS } from './'

import type { Shape as EntitysShape } from '../entitys'
import type { Shape as CardsShape, Card } from './'
import type { EntityKey, Entity } from '../entitys/types'

export function getCardEntitys(cards: Card[], entities: EntitysShape): Entity[] {
    // if card has entityId and it is not found in entities, then it is not taken into final array (as it is undefined) - i dont know if this can ever happen though
    const cardEntitys = cards.reduce((acc, card) => {
        const { entityId } = card;
        if (entityId !== undefined) {
            for (const entitys of Object.values(entities)) {
                const entity = entitys[entityId];
                if (entity) {
                    acc.push(entity);
                    break;
                }
            }
        }
        return acc;
    }, []);

    // console.log('getCardEntitys :: cardEntitys:', cardEntitys);

    return cardEntitys;
}

export function groupSortables(cards: Card[], cardEntitys: Entity[], byKey: EntityKey): { sortableCards:{ card:Card, byValue:* }[], nonSortableCards:Card[], nonSortableEntityCards:Card[]} {
    const nonSortableCards = [];
    const nonSortableEntityCards = [];

    const sortableCards = cards.reduce((acc, card) => {
        if (card.kind !== CARDS.ENTITY) {
            nonSortableCards.push(card);
            return acc;
        } else {
            const { entityId } = card;
            if (entityId === undefined) {
                nonSortableEntityCards.push(card);
                return acc;
            } else {
                const entity = cardEntitys.find(entity => entity.id === entityId);
                // console.log('entity:', entity, 'cardEntitys:', cardEntitys);
                if (byKey in entity) acc.push({ card, byValue:entity[byKey] });
                else nonSortableEntityCards.push(card);
                return acc;
            }
        }
    }, []);

    return { sortableCards, nonSortableCards, nonSortableEntityCards };
}

export function sortDescByValue({ byValue:byValueA }, { byValue:byValueB }) {
    const isNotNumberA = byValueA === null || isNaN(byValueA); // can be isNaN because if a numeric group has some non-numeric values (for sure there are nulls)
    const isNotNumberB = byValueB === null || isNaN(byValueB);

    if (isNotNumberA && isNotNumberB) return 0;
    else if (isNotNumberB) return 1;
    else if (isNotNumberA) return 1;
    else return byValueB - byValueA;
}
