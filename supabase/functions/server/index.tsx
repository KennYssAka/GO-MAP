import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper to get user from access token
async function getUserFromToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  if (token === supabaseAnonKey) return null; // Public key, not a user token
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Health check endpoint
app.get("/make-server-47c9cc4e/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= AUTH ENDPOINTS =============

// Sign up with email
app.post("/make-server-47c9cc4e/auth/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    
    if (!name || !email || !password) {
      return c.json({ error: "Все поля обязательны" }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since we don't have email server configured
      user_metadata: { name }
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    const defaultAvatarGradients = [
      'from-yellow-400 to-orange-500',
      'from-purple-400 to-pink-500',
      'from-blue-400 to-cyan-500',
      'from-green-400 to-emerald-500',
      'from-red-400 to-rose-500',
    ];
    
    const gradient = defaultAvatarGradients[Math.floor(Math.random() * defaultAvatarGradients.length)];
    const userProfile = {
      id: data.user!.id,
      name,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      email,
      phone: '',
      bio: '',
      city: 'Алматы',
      avatarInitial: name.charAt(0).toUpperCase(),
      avatarGradient: gradient,
      interests: [],
      goals: [],
      socialLinks: { instagram: '', telegram: '', twitter: '' },
      level: 1,
      points: 0,
      nextLevelPoints: 500,
      karma: 0,
      karmaRank: 'Новичок',
      karmaEmoji: '🌱',
      checkins: 0,
      placesVisited: 0,
      friends: 0,
      joinedAt: new Date().toISOString(),
      authProvider: 'email',
    };

    await kv.set(`users:${data.user!.id}`, userProfile);

    // Sign in to get session
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: sessionData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return c.json({ error: signInError.message }, 400);
    }

    return c.json({ 
      user: userProfile, 
      session: sessionData.session,
      accessToken: sessionData.session?.access_token 
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Ошибка регистрации' }, 500);
  }
});

// Sign in with email
app.post("/make-server-47c9cc4e/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // Get user profile
    const userProfile = await kv.get(`users:${data.user!.id}`);
    
    return c.json({ 
      user: userProfile, 
      session: data.session,
      accessToken: data.session?.access_token 
    });
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: 'Ошибка входа' }, 500);
  }
});

// Get current user profile
app.get("/make-server-47c9cc4e/auth/me", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const userProfile = await kv.get(`users:${user.id}`);
  return c.json({ user: userProfile });
});

// ============= USER PROFILE ENDPOINTS =============

// Update user profile
app.put("/make-server-47c9cc4e/users/profile", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const updates = await c.req.json();
    const currentProfile = await kv.get(`users:${user.id}`);
    
    const updatedProfile = { ...currentProfile, ...updates };
    if (updates.name) {
      updatedProfile.avatarInitial = updates.name.charAt(0).toUpperCase();
    }
    
    await kv.set(`users:${user.id}`, updatedProfile);
    return c.json({ user: updatedProfile });
  } catch (error) {
    console.log('Profile update error:', error);
    return c.json({ error: 'Ошибка обновления профиля' }, 500);
  }
});

// ============= VIBE MATCH ENDPOINTS =============

// Save swipe
app.post("/make-server-47c9cc4e/matches/swipe", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { targetUserId, direction } = await c.req.json();
    
    // Save swipe
    await kv.set(`swipes:${user.id}:${targetUserId}`, {
      direction,
      timestamp: new Date().toISOString(),
    });

    // Check for mutual match (if both swiped right or up)
    const theirSwipe = await kv.get(`swipes:${targetUserId}:${user.id}`);
    let isMatch = false;
    
    if (theirSwipe && (direction === 'right' || direction === 'up') && 
        (theirSwipe.direction === 'right' || theirSwipe.direction === 'up')) {
      isMatch = true;
      
      // Add to matches
      const myMatches = (await kv.get(`matches:${user.id}`)) || [];
      const theirMatches = (await kv.get(`matches:${targetUserId}`)) || [];
      
      if (!myMatches.includes(targetUserId)) {
        myMatches.push(targetUserId);
        await kv.set(`matches:${user.id}`, myMatches);
      }
      
      if (!theirMatches.includes(user.id)) {
        theirMatches.push(user.id);
        await kv.set(`matches:${targetUserId}`, theirMatches);
      }
    }

    return c.json({ isMatch });
  } catch (error) {
    console.log('Swipe error:', error);
    return c.json({ error: 'Ошибка при свайпе' }, 500);
  }
});

// Get user's matches
app.get("/make-server-47c9cc4e/matches/list", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const matchIds = (await kv.get(`matches:${user.id}`)) || [];
    const matches = await Promise.all(
      matchIds.map((id: string) => kv.get(`users:${id}`))
    );
    
    return c.json({ matches: matches.filter(Boolean) });
  } catch (error) {
    console.log('Get matches error:', error);
    return c.json({ error: 'Ошибка получения мэтчей' }, 500);
  }
});

// Connect with match (add to friends)
app.post("/make-server-47c9cc4e/matches/connect", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { matchUserId } = await c.req.json();
    
    // Add to connections
    const myConnections = (await kv.get(`connections:${user.id}`)) || [];
    if (!myConnections.includes(matchUserId)) {
      myConnections.push(matchUserId);
      await kv.set(`connections:${user.id}`, myConnections);
    }

    // Create or get conversation
    const conversationId = [user.id, matchUserId].sort().join('_');
    let conversation = await kv.get(`conversations:${conversationId}`);
    
    if (!conversation) {
      conversation = {
        id: conversationId,
        participants: [user.id, matchUserId],
        messages: [],
        lastMessage: null,
        lastMessageTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      await kv.set(`conversations:${conversationId}`, conversation);
    }

    return c.json({ conversationId, conversation });
  } catch (error) {
    console.log('Connect error:', error);
    return c.json({ error: 'Ошибка подключения' }, 500);
  }
});

// ============= MESSAGES ENDPOINTS =============

// Get user's conversations
app.get("/make-server-47c9cc4e/messages/conversations", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Get all conversations where user is a participant
    const connections = (await kv.get(`connections:${user.id}`)) || [];
    
    const conversations = await Promise.all(
      connections.map(async (connectionId: string) => {
        const conversationId = [user.id, connectionId].sort().join('_');
        const conversation = await kv.get(`conversations:${conversationId}`);
        if (!conversation) return null;
        
        // Get other user's profile
        const otherUserId = conversation.participants.find((id: string) => id !== user.id);
        const otherUser = await kv.get(`users:${otherUserId}`);
        
        return {
          ...conversation,
          otherUser,
        };
      })
    );

    return c.json({ conversations: conversations.filter(Boolean) });
  } catch (error) {
    console.log('Get conversations error:', error);
    return c.json({ error: 'Ошибка получения чатов' }, 500);
  }
});

// Get messages in conversation
app.get("/make-server-47c9cc4e/messages/:conversationId", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const conversationId = c.req.param('conversationId');
    const conversation = await kv.get(`conversations:${conversationId}`);
    
    if (!conversation || !conversation.participants.includes(user.id)) {
      return c.json({ error: 'Conversation not found' }, 404);
    }

    return c.json({ messages: conversation.messages || [] });
  } catch (error) {
    console.log('Get messages error:', error);
    return c.json({ error: 'Ошибка получения сообщений' }, 500);
  }
});

// Send message
app.post("/make-server-47c9cc4e/messages/send", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { conversationId, text } = await c.req.json();
    
    const conversation = await kv.get(`conversations:${conversationId}`);
    if (!conversation || !conversation.participants.includes(user.id)) {
      return c.json({ error: 'Conversation not found' }, 404);
    }

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: user.id,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    conversation.messages = conversation.messages || [];
    conversation.messages.push(message);
    conversation.lastMessage = text;
    conversation.lastMessageTime = message.timestamp;

    await kv.set(`conversations:${conversationId}`, conversation);

    return c.json({ message });
  } catch (error) {
    console.log('Send message error:', error);
    return c.json({ error: 'Ошибка отправки сообщения' }, 500);
  }
});

Deno.serve(app.fetch);