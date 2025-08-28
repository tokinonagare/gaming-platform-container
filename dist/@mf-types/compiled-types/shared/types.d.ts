export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    level: number;
    xp: number;
    createdAt: string;
    lastLoginAt: string;
}
export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
        game: boolean;
        achievement: boolean;
        social: boolean;
    };
    privacy: {
        showProfile: boolean;
        showStats: boolean;
        allowFriendRequests: boolean;
    };
}
export interface Game {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    category: string;
    rating: number;
    downloads: number;
    size: string;
    version: string;
    developer: string;
    tags: string[];
    screenshots: string[];
    isNew: boolean;
    isFeatured: boolean;
    price: number;
    currency: string;
    releaseDate: string;
}
export interface GameStats {
    totalGames: number;
    totalPlayers: number;
    activeGames: number;
    topGame: {
        id: string;
        title: string;
        players: number;
    };
    dailyStats: {
        date: string;
        players: number;
        gameTime: number;
    }[];
}
export interface UserGameProgress {
    gameId: string;
    progress: number;
    level: number;
    score: number;
    achievements: string[];
    playTime: number;
    lastPlayed: string;
}
export interface Friend {
    id: string;
    username: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
    currentGame?: string;
    level: number;
}
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
    unlockedAt?: string;
}
export interface Leaderboard {
    gameId: string;
    entries: LeaderboardEntry[];
    period: 'daily' | 'weekly' | 'monthly' | 'allTime';
    updatedAt: string;
}
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    avatar?: string;
    score: number;
    level: number;
}
export interface Notification {
    id: string;
    type: 'achievement' | 'friend_request' | 'game_update' | 'system';
    title: string;
    message: string;
    data?: any;
    isRead: boolean;
    createdAt: string;
}
export interface StoreItem {
    id: string;
    name: string;
    description: string;
    type: 'game' | 'dlc' | 'cosmetic' | 'currency';
    price: number;
    currency: string;
    image: string;
    discount?: {
        percentage: number;
        endDate: string;
    };
    tags: string[];
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}
export interface FilterParams {
    category?: string;
    tags?: string[];
    minRating?: number;
    maxPrice?: number;
    isNew?: boolean;
    isFeatured?: boolean;
}
export interface SortParams {
    sortBy: 'rating' | 'downloads' | 'price' | 'releaseDate' | 'title';
    sortOrder: 'asc' | 'desc';
}
export interface PaginationParams {
    page?: number;
    limit?: number;
}
export interface SearchParams extends FilterParams, SortParams, PaginationParams {
    query?: string;
}
export interface SearchResult<T> extends PaginatedResponse<T> {
    query: string;
    suggestions: string[];
    filters: {
        categories: Array<{
            name: string;
            count: number;
        }>;
        tags: Array<{
            name: string;
            count: number;
        }>;
        priceRanges: Array<{
            min: number;
            max: number;
            count: number;
        }>;
    };
}
export interface ServerStatus {
    status: 'online' | 'maintenance' | 'offline';
    playerCount: number;
    serverLoad: number;
    latency: number;
    message?: string;
}
export interface GameSession {
    id: string;
    gameId: string;
    userId: string;
    startedAt: string;
    endedAt?: string;
    duration?: number;
    score?: number;
    achievements?: string[];
}
export interface ValidationError {
    field: string;
    message: string;
    code: string;
}
export interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
        details?: ValidationError[];
        timestamp: string;
    };
}
export interface WebSocketMessage {
    type: 'user_status' | 'game_invite' | 'achievement' | 'chat' | 'system';
    data: any;
    timestamp: string;
}
export interface AnalyticsEvent {
    event: string;
    properties: Record<string, any>;
    userId?: string;
    sessionId: string;
    timestamp: string;
}
export interface UserAnalytics {
    userId: string;
    sessionDuration: number;
    pagesViewed: string[];
    gamesPlayed: string[];
    actions: AnalyticsEvent[];
}
export interface AppConfig {
    apiBaseUrl: string;
    wsUrl: string;
    features: {
        chat: boolean;
        voice: boolean;
        streaming: boolean;
        socialFeatures: boolean;
    };
    limits: {
        maxFriends: number;
        maxChatHistory: number;
        maxFileSize: number;
    };
}
export type GameCategory = 'action' | 'adventure' | 'puzzle' | 'strategy' | 'simulation' | 'sports' | 'racing';
export type UserRole = 'player' | 'moderator' | 'admin' | 'developer';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export declare const isUser: (obj: any) => obj is User;
export declare const isGame: (obj: any) => obj is Game;
export interface ApiEndpoints {
    'GET /user/profile': {
        response: User;
    };
    'PUT /user/profile': {
        body: Partial<User>;
        response: User;
    };
    'GET /user/preferences': {
        response: UserPreferences;
    };
    'PUT /user/preferences': {
        body: UserPreferences;
        response: UserPreferences;
    };
    'GET /games': {
        query?: SearchParams;
        response: SearchResult<Game>;
    };
    'GET /games/:id': {
        response: Game;
    };
    'GET /games/featured': {
        response: Game[];
    };
    'GET /games/stats': {
        response: GameStats;
    };
    'GET /user/games': {
        response: UserGameProgress[];
    };
    'GET /user/games/:gameId': {
        response: UserGameProgress;
    };
    'PUT /user/games/:gameId': {
        body: Partial<UserGameProgress>;
        response: UserGameProgress;
    };
    'GET /user/friends': {
        response: Friend[];
    };
    'POST /user/friends': {
        body: {
            userId: string;
        };
        response: {
            success: boolean;
        };
    };
    'DELETE /user/friends/:userId': {
        response: {
            success: boolean;
        };
    };
    'GET /user/achievements': {
        response: Achievement[];
    };
    'GET /achievements/:gameId': {
        response: Achievement[];
    };
    'GET /leaderboard/:gameId': {
        query?: {
            period: string;
        };
        response: Leaderboard;
    };
    'GET /notifications': {
        response: Notification[];
    };
    'PUT /notifications/:id/read': {
        response: {
            success: boolean;
        };
    };
    'GET /status': {
        response: ServerStatus;
    };
    'GET /health': {
        response: {
            status: 'ok' | 'error';
            timestamp: number;
        };
    };
}
//# sourceMappingURL=types.d.ts.map