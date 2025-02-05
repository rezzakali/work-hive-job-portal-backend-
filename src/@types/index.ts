export interface CorsOptions {
  methods: string[];
  credentials: boolean;
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;
}

export interface NotificationMessage {
  notification: {
    title: string;
    body: string;
  };
  tokens: string[];
}
