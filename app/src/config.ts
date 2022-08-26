class Config {
  public static get(name: string, defaultValue: string | null = null): string {
    if (process.env[name] && process.env[name] !== '""') {
      return process.env[name] as string;
    } else if (defaultValue) {
      return defaultValue;
    } else {
      throw new Error(`Missing config ${name}`);
    }
  }
}

export default Config;
