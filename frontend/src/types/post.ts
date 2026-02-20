export interface PostType {
  likes: number;
  dislikes: number;
  _id: string;
  text: string;
  image?: {
    url: string;
    public_id: string;
  };
  video?: {
    url: string;
    public_id: string;
  };
  user: { username: string; fullname: string; _id: string };
  votes: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
