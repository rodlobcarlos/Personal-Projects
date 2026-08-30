import { getMessaging } from 'firebase-admin/messaging';
import firebaseApp from '../config/firebase.js';
import { pool } from '../config/db.js';

export async function subscribeToken(uid: string, token: string): Promise<void> {
  await pool.query(
    `INSERT IGNORE INTO push_subscriptions (user_id, token) VALUES (:uid, :token)`,
    { uid, token },
  );
}

export async function unsubscribeToken(uid: string, token: string): Promise<void> {
  await pool.query(
    `DELETE FROM push_subscriptions WHERE user_id = :uid AND token = :token`,
    { uid, token },
  );
}

async function getTokensForUser(uid: string): Promise<string[]> {
  const [rows] = await pool.query(
    `SELECT token FROM push_subscriptions WHERE user_id = :uid`,
    { uid },
  );
  return (rows as { token: string }[]).map((r) => r.token);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendToUser(uid: string, payload: PushPayload): Promise<void> {
  const tokens = await getTokensForUser(uid);
  if (tokens.length === 0) return;

  const invalid: string[] = [];

  for (const token of tokens) {
    try {
      await getMessaging(firebaseApp).send({
        token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        webpush: payload.url
          ? {
              fcmOptions: { link: payload.url },
            }
          : undefined,
      });
    } catch (error) {
      const code = (error as { code?: string } | null)?.code ?? '';
      if (
        code === 'messaging/registration-token-not-registered' ||
        code === 'messaging/invalid-registration-token'
      ) {
        invalid.push(token);
      }
    }
  }

  if (invalid.length > 0) {
    await pool.query(
      `DELETE FROM push_subscriptions WHERE user_id = :uid AND token IN (:invalid)`,
      { uid, invalid },
    );
  }
}
