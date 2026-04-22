export function normalizeMeshName(name) {
  return name
    ?.trim()
    .replace(/[^a-z0-9]/giu, '')
    .toLowerCase();
}

export function normalizeMeshFamilyName(name) {
  return name
    ?.trim()
    .replace(/[_-]\d+$/u, '')
    .replace(/[^a-z0-9]/giu, '')
    .toLowerCase();
}

export function getMeshNames(object) {
  return [object.name, object.geometry?.name].filter(Boolean);
}

export function getMeshLabel(object, index) {
  const [objectName, geometryName] = getMeshNames(object);

  if (objectName && geometryName && objectName !== geometryName) {
    return `${objectName} (${geometryName})`;
  }

  return objectName?.trim() || geometryName?.trim() || `Mesh ${index + 1}`;
}

export function matchesMeshName(object, targetName) {
  const target = targetName.trim();
  const normalizedTarget = normalizeMeshName(targetName);
  const familyTarget = normalizeMeshFamilyName(targetName);
  const names = getMeshNames(object);

  if (names.some((name) => name === target || normalizeMeshName(name) === normalizedTarget)) {
    return true;
  }

  return names.some((name) => normalizeMeshFamilyName(name) === familyTarget);
}
