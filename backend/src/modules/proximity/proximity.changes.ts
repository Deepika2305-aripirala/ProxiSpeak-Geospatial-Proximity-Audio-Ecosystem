
export interface ProximityChanges {
  entered: string[];
  exited: string[];
  unchanged: string[];
}

export function detectProximityChanges(
  previousUsers: string[],
  currentUsers: string[]
): ProximityChanges {

  const previousSet = new Set(previousUsers);
  const currentSet = new Set(currentUsers);

  const entered = currentUsers.filter(
    userId => !previousSet.has(userId)
  );

  const exited = previousUsers.filter(
    userId => !currentSet.has(userId)
  );

  const unchanged = currentUsers.filter(
    userId => previousSet.has(userId)
  );

  return {
    entered,
    exited,
    unchanged
  };
}
