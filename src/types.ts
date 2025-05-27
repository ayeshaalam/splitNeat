import type { ReactNode } from "react";

export interface Friend {
  id: number;
  name: string;
  image: string;
  balance: number; // Positive means you owe them, negative means they owe you
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export interface AddFriendFormProps {
  onAddFriend: (friend: Friend) => void;
}
