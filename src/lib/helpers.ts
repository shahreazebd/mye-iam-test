export function generateAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
}
