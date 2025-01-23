export interface CorsOptions {
  methods: string[];
  credentials: boolean;
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;
}
