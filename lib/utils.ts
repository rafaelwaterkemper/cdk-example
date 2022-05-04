export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getNamespace(): string {
  return "development";
}

export function getResourceName(baseName: string) {
  return `${baseName}-${getNamespace()}`;
}
