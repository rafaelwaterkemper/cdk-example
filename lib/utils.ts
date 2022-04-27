export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getNamespace(): string {
  return <string>process.env.NAMESPACE || "local";
}

export function getResourceName(baseName: string) {
  return `${baseName}-${getNamespace()}`;
}
