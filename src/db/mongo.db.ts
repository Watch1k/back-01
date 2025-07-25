import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../core/settings/settings';
import { Video } from '../videos/types/video';
import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';

const VIDEOS_COLLECTION_NAME = 'videos';
const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let videoCollection: Collection<Video>;
export let blogsCollection: Collection<Blog>;
export let postsCollection: Collection<Post>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  //Инициализация коллекций
  videoCollection = db.collection<Video>(VIDEOS_COLLECTION_NAME);
  blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
