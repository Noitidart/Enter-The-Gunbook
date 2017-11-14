// @flow

export function sortDescHelpful({ helpfulIds:helpfulIdsA }, { helpfulIds:helpfulIdsB }) {
    return helpfulIdsB.length - helpfulIdsA.length;
}
