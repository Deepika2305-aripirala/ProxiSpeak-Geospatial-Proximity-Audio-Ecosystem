
export interface AvatarPosition {
  userId: string;
  officeId: string;
  x: number;
  y: number;
  isOnline: boolean;
  updatedAt: number;
}

export interface NearbyPeer {
  userId: string;
  distance: number;
}
